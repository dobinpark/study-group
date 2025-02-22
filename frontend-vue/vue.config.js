const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
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
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.js', '.vue', '.json', '.ts']
    }
  },
  // 기타 설정
  lintOnSave: false, // 저장 시 린트 비활성화 -> 빌드 시 린트 검사도 비활성화
  transpileDependencies: true,
  parallel: false
})
