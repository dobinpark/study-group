const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  // 개발 서버 설정
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '/api' } // 라우트 경로 유지
      }
    },
    client: {
      // 개발 중 오버레이 경고 최소화
      overlay: {
        warnings: false,
        errors: true
      }
    }
  },
  // 웹팩 설정
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.js', '.vue', '.json', '.ts'],
      fallback: {
        "https": false,
        "http": false,
        "stream": false
      }
    },
    // 소스맵 설정 (개발 환경에서만 자세한 소스맵 사용)
    devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map'
  },
  // TypeScript 설정
  chainWebpack: config => {
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        return {
          ...options,
          transpileOnly: true, // 더 빠른 개발 빌드
          happyPackMode: true  // 더 관대한 타입 체크
        };
      });
  },
  // 빌드 최적화
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  transpileDependencies: true,
  parallel: true
})
