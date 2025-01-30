module.exports = {
  apps: [{
    name: 'study-group',
    script: 'dist/main.js',
    instances: 'max',     // CPU 코어 수만큼 인스턴스 생성
    exec_mode: 'cluster', // 클러스터 모드
    watch: false,         // 파일 변경 감지
    max_memory_restart: '1G',  // 메모리 제한
    env: {
      NODE_ENV: 'production'
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