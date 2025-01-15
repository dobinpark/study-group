module.exports = {
  extends: [
    'plugin:vue/vue3-essential',
    // 다른 설정...
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false, // 이 줄을 추가하여 설정 파일 요구를 피합니다.
  }
}