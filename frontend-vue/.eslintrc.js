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
        'plugin:@typescript-eslint/recommended',
        // 필요하다면 다른 확장 설정 추가 (예: 'plugin:prettier/recommended')
    ],
    'parserOptions': {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json', // tsconfig.json 파일 경로를 명시적으로 지정
        extraFileExtensions: ['.vue'],
    },
    plugins: [
        'vue',
        '@typescript-eslint'
    ],
    parser: 'vue-eslint-parser',
    rules: {
        // 필요하다면 추가 규칙 설정
        // 예시: 'no-console': 'warn', // console.log() 사용 시 경고
        '@typescript-eslint/ban-types': 'off', // 또는 'off' 로 변경하여 규칙 비활성화 시도 (임시)
        '@typescript-eslint/no-explicit-any': 'warn',
    },
    overrides: [
        {
            files: ['vue.config.js', 'babel.config.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/no-undef': 'off',
            }
        }
    ]
};
