module.exports = {
  // 개발 서버 설정
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 백엔드 서버 주소
        changeOrigin: true,
      },
    },
  },
  // 웹팩 설정 커스터마이징
  configureWebpack: {
    // 추가적인 웹팩 설정
  },
  // 기타 설정
  lintOnSave: false, // 저장 시 린트 비활성화
};
