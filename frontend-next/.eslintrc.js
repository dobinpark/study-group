module.exports = {
  extends: [
    'next/core-web-vitals', // Next.js 기본 웹 성능 규칙
    'eslint:recommended',   // 기본 ESLint 권장 규칙
    'plugin:react/recommended', // React 권장 규칙
    'plugin:@typescript-eslint/recommended', // TypeScript 권장 규칙
    'prettier', // Prettier와 통합
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // Next.js에서는 필요 없음
    'react/prop-types': 'off', // TypeScript 사용 시 PropTypes 비활성화
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 함수 반환 타입 비활성화
    // 다른 사용자 정의 규칙 추가 가능
  },
  settings: {
    react: {
      version: 'detect', // 설치된 React 버전에 맞게 자동 감지
    },
  },
};
