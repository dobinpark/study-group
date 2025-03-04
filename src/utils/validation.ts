export const PASSWORD_REGEX = /^(?=.[a-zA-Z])(?=.[0-9])(?=.[!@#$%^&()+{}\[\]:;<>,.?~\\/-]).{8,}$/;
export const PASSWORD_REGEX_MESSAGE = '비밀번호는 영문, 숫자, 특수문자를 각 1개 이상 포함하여 8자 이상이어야 합니다.';