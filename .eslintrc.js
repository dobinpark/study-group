/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true
    },
    'extends': [
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        // 필요하다면 다른 확장 설정 추가 (예: 'plugin:prettier/recommended')
    ],
    'parserOptions': {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: '@typescript-eslint/parser'
    },
    plugins: [
        'vue',
        '@typescript-eslint'
    ],
    // rules: {
    //     // 필요하다면 추가 규칙 설정
    //     // 예시: 'no-console': 'warn', // console.log() 사용 시 경고
    // }
}
