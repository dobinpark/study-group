#!/bin/bash

# 상수 정의
BACKEND_DIR="/home/ec2-user/study-group"
FRONTEND_DIR="${BACKEND_DIR}/frontend-vue"
LOG_FILE="/home/ec2-user/deploy.log"
NODE_VERSION="v22.13.1"
NODE_PATH="/home/ec2-user/.nvm/versions/node/${NODE_VERSION}/bin"

# 에러 처리 함수
handle_error() {
    local error_message="$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - 오류: ${error_message}" >> "$LOG_FILE"
    echo "오류: ${error_message}"
    exit 1
}

# 로그 기록 함수
log_message() {
    local message="$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ${message}" >> "$LOG_FILE"
    echo "${message}"
}

# 환경 검증 함수
verify_environment() {
    log_message "환경 검증 시작..."
    
    # Node.js 버전 확인
    if ! command -v node &> /dev/null; then
        handle_error "Node.js가 설치되어 있지 않습니다."
    fi
    
    # PM2 설치 확인
    if ! command -v pm2 &> /dev/null; then
        handle_error "PM2가 설치되어 있지 않습니다."
    fi
    
    # 필요한 디렉토리 존재 확인
    if [ ! -d "$BACKEND_DIR" ]; then
        handle_error "백엔드 디렉토리를 찾을 수 없습니다: $BACKEND_DIR"
    fi
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        handle_error "프론트엔드 디렉토리를 찾을 수 없습니다: $FRONTEND_DIR"
    fi
    
    log_message "환경 검증 완료"
}

# 백엔드 배포 함수
deploy_backend() {
    log_message "백엔드 배포 시작..."
    
    cd "$BACKEND_DIR" || handle_error "백엔드 디렉토리로 이동 실패"
    
    # Git 변경사항 확인
    log_message "Git 변경사항 확인 중..."
    git fetch origin main || handle_error "git fetch 실패"
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        log_message "백엔드 코드가 최신 상태입니다."
        return 0
    fi
    
    # 기존 PM2 프로세스 제거
    log_message "PM2 프로세스 제거 중..."
    pm2 delete all || log_message "PM2 프로세스 제거 중 경고 발생 (무시 가능)"
    
    # 코드 업데이트
    log_message "백엔드 코드 업데이트 중..."
    git pull origin main || handle_error "백엔드 git pull 실패"
    
    # 이전 빌드 제거
    log_message "이전 빌드 제거 중..."
    rm -rf dist
    rm -rf node_modules
    
    # 의존성 설치 및 빌드
    log_message "백엔드 의존성 설치 중..."
    npm ci || handle_error "백엔드 의존성 설치 실패"
    
    log_message "백엔드 빌드 중..."
    npm run build || handle_error "백엔드 빌드 실패"
    
    # TypeORM 설정 확인
    log_message "TypeORM 설정 확인 중..."
    if grep -r "synchronize" dist/; then
        log_message "TypeORM synchronize 설정 발견:"
        grep -r "synchronize" dist/
    fi
    
    # PM2로 서버 시작
    log_message "백엔드 서버 시작 중..."
    NODE_ENV=production pm2 start ecosystem.config.js || handle_error "백엔드 서버 시작 실패"
    
    log_message "백엔드 배포 완료"
}

# 프론트엔드 배포 함수
deploy_frontend() {
    log_message "프론트엔드 배포 시작..."
    
    cd "$FRONTEND_DIR" || handle_error "프론트엔드 디렉토리로 이동 실패"
    
    # Git 변경사항 확인
    log_message "Git 변경사항 확인 중..."
    git fetch origin main || handle_error "git fetch 실패"
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        log_message "프론트엔드 코드가 최신 상태입니다."
        return 0
    fi
    
    # 코드 업데이트
    log_message "프론트엔드 코드 업데이트 중..."
    git pull origin main || handle_error "프론트엔드 git pull 실패"
    
    # 이전 빌드 제거
    log_message "이전 빌드 제거 중..."
    rm -rf dist
    rm -rf node_modules
    
    # 의존성 설치 및 빌드
    log_message "프론트엔드 의존성 설치 중..."
    npm ci || handle_error "프론트엔드 의존성 설치 실패"
    
    log_message "프론트엔드 빌드 중..."
    npm run build || handle_error "프론트엔드 빌드 실패"
    
    log_message "프론트엔드 배포 완료"
}

# 메인 실행 함수
main() {
    # 로그 파일 초기화
    echo "배포 시작: $(date)" > "$LOG_FILE"
    
    # PATH 설정
    export PATH="${NODE_PATH}:$PATH"
    log_message "PATH 환경 변수: $PATH"
    
    # 환경 검증
    verify_environment
    
    # 백엔드 배포
    deploy_backend
    
    # 프론트엔드 배포
    deploy_frontend
    
    # Nginx 재시작
    log_message "Nginx 재시작 중..."
    sudo systemctl restart nginx || handle_error "Nginx 재시작 실패"
    
    # 최종 상태 확인
    log_message "배포 완료 상태 확인"
    log_message "PM2 프로세스 상태:"
    pm2 list >> "$LOG_FILE"
    
    log_message "NODE_ENV 확인:"
    pm2 env 0 | grep NODE_ENV >> "$LOG_FILE"
    
    log_message "배포 완료: $(date)"
}

# 스크립트 실행
main
