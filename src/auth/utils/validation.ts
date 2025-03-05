export const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
export const PASSWORD_REGEX_MESSAGE = '비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.';