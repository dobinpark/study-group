/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true
    },
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript'
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
        'vue/multi-word-component-names': 'off',  // 단일 단어 컴포넌트 이름 허용
        '@typescript-eslint/no-explicit-any': 'warn',  // any 타입 경고로 변경
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        '@typescript-eslint/ban-types': 'off', // 또는 'off' 로 변경하여 규칙 비활성화 시도 (임시)
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
