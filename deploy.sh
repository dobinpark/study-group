#!/bin/bash
echo "PATH 환경 변수: $PATH"  # PATH 환경 변수 출력

# 로그 파일 설정
LOG_FILE="/home/ec2-user/deploy.log"
echo "배포 시작: $(date)" > $LOG_FILE

# 백업 디렉토리 생성
BACKUP_DIR="/home/ec2-user/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# 현재 상태 백업
echo "백업 생성 중..." >> $LOG_FILE
cp -r /home/ec2-user/study-group $BACKUP_DIR/backend
cp -r /home/ec2-user/study-group/frontend-vue/dist $BACKUP_DIR/frontend

# 배포 함수
deploy() {
    # 백엔드 업데이트
    echo "백엔드 업데이트 시작..." >> $LOG_FILE
    cd /home/ec2-user/study-group
    if ! git pull origin main >> $LOG_FILE 2>&1; then
        echo "백엔드 git pull 실패" >> $LOG_FILE
        return 1
    fi

    # 백엔드 빌드
    if ! /home/ec2-user/.nvm/versions/node/v22.13.1/bin/npm install >> $LOG_FILE 2>&1 || ! /home/ec2-user/.nvm/versions/node/v22.13.1/bin/npm run build >> $LOG_FILE 2>&1; then
        echo "백엔드 빌드 실패" >> $LOG_FILE
        return 1
    fi

    # 백엔드 Production 실행
    echo "백엔드 Production 서버 실행..." >> $LOG_FILE
    npm run start:prod >> $LOG_FILE 2>&1 &
    if ! wait $! >> $LOG_FILE 2>&1; then
        echo "백엔드 Production 서버 실행 실패" >> $LOG_FILE
        return 1
    fi

    # 프론트엔드 업데이트
    echo "프론트엔드 업데이트 시작..." >> $LOG_FILE
    cd frontend-vue
    if ! git pull origin main >> $LOG_FILE 2>&1; then
        echo "프론트엔드 git pull 실패" >> $LOG_FILE
        return 1
    fi

    # 프론트엔드 빌드
    if ! /home/ec2-user/.nvm/versions/node/v22.13.1/bin/npm install >> $LOG_FILE 2>&1 || ! /home/ec2-user/.nvm/versions/node/v22.13.1/bin/npm run build >> $LOG_FILE 2>&1; then
        echo "프론트엔드 빌드 실패" >> $LOG_FILE
        return 1
    fi

    return 0
}

# 롤백 함수
rollback() {
    echo "롤백 시작..." >> $LOG_FILE
    cp -r $BACKUP_DIR/backend/* /home/ec2-user/study-group/
    cp -r $BACKUP_DIR/frontend/* /home/ec2-user/study-group/frontend-vue/dist/
}

# 배포 실행
if deploy; then
    echo "배포 성공" >> $LOG_FILE
    echo "백엔드 재시작 중..." >> $LOG_FILE
    /home/ec2-user/.nvm/versions/node/v22.13.1/bin/pm2 restart all >> $LOG_FILE 2>&1
    sudo systemctl restart nginx >> $LOG_FILE 2>&1
else
    echo "배포 실패, 롤백 실행" >> $LOG_FILE
    rollback
    echo "백엔드 재시작 중..." >> $LOG_FILE
    /home/ec2-user/.nvm/versions/node/v22.13.1/bin/pm2 restart all >> $LOG_FILE 2>&1
    sudo systemctl restart nginx >> $LOG_FILE 2>&1
fi

echo "작업 완료: $(date)" >> $LOG_FILE
