module.exports = {
  apps: [{
    name: 'study-group',
    script: 'dist/main.js',
    instances: 'max',     // CPU 코어 수만큼 인스턴스 생성
    exec_mode: 'cluster', // 클러스터 모드
    watch: false,         // 파일 변경 감지
    max_memory_restart: '1G',  // 메모리 제한
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      CORS_ORIGIN: 'http://3.34.184.97',
      DB_HOST: 'localhost', // ec2 내부에 mysql 서버가 있으므로 127.0.0.1또는 localhost로 설정
      DB_PORT: 3306,
      DB_USERNAME: 'root',
      DB_PASSWORD: 'Ddgh93081)',
      DB_DATABASE: 'study_group',
      SESSION_SECRET: '7f8e2b1d3e4f567a9b0c123d4e5f67890ab123cd4e5f6789',
      SESSION_MAX_AGE: 86400000,
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
    },
    // 로그 설정
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    merge_logs: true,
    // 시작 실패시 재시도 설정
    autorestart: true,
    max_restarts: 10,
    restart_delay: 4000
  }]
};
