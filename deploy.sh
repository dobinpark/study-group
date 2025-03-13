#!/bin/bash

# 로그 파일 설정
LOG_FILE="/home/ec2-user/deploy.log"
echo "배포 시작: $(date)" > $LOG_FILE

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
    echo "백엔드 빌드 시작..." >> $LOG_FILE
    if ! /home/ec2-user/.nvm/versions/node/v22.13.1/bin/npm install >> $LOG_FILE 2>&1 || ! /home/ec2-user/.nvm/versions/node/v22.13.1/bin/npm run build >> $LOG_FILE 2>&1; then
        echo "백엔드 빌드 실패" >> $LOG_FILE
        return 1
    fi

    # 백엔드 Production 실행
    echo "백엔드 Production 서버 실행..." >> $LOG_FILE
    npm run start:prod >> $LOG_FILE 2>&1

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

# 배포 실행
if deploy; then
    echo "배포 성공" >> $LOG_FILE
    echo "백엔드 재시작 중..." >> $LOG_FILE
    {{ # /home/ec2-user/.nvm/versions/node/v22.13.1/bin/pm2 restart all >> $LOG_FILE 2>&1 }} // 기존 pm2 절대 경로 (주석 처리)
    {{ pm2 restart all >> $LOG_FILE 2>&1 }} // 상대 경로 (pm2) 사용
    {{ # $(which pm2) restart all >> $LOG_FILE 2>&1 }} // which pm2 를 사용하여 절대 경로를 동적으로 찾아서 사용 (더 안전한 방법)
    {{ sudo systemctl restart nginx >> $LOG_FILE 2>&1 }}
else
    echo "배포 실패" >> $LOG_FILE
    echo "백엔드 재시작 중..." >> $LOG_FILE
    {{ # /home/ec2-user/.nvm/versions/node/v22.13.1/bin/pm2 restart all >> $LOG_FILE 2>&1 }} // 기존 pm2 절대 경로 (주석 처리)
    {{ pm2 restart all >> $LOG_FILE 2>&1 }} // 상대 경로 (pm2) 사용
    {{ # $(which pm2) restart all >> $LOG_FILE 2>&1 }} // which pm2 를 사용하여 절대 경로를 동적으로 찾아서 사용 (더 안전한 방법)
    {{ sudo systemctl restart nginx >> $LOG_FILE 2>&1 }}
fi

echo "작업 완료: $(date)" >> $LOG_FILE
