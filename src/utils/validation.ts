// 공백이나 공백 특수문자만 입력됐는지 검사하는 함수
export const isValidTextInput = (input: string): boolean => {
    return input.trim().length > 0;
};

// 강의 제목의 길이를 검사하는 함수
export const isValidTitleLength = (input: string): boolean => {
return input.length >= 2 && input.length <= 24;
};

// 강의 제목의 유효성을 검사하고, 헬퍼 텍스트를 반환하는 함수
export const getTitleHelperText = (input: string): string => {
if (!isValidTitleLength(input)) {
    return "제목은 2자 이상 24자 이하여야 합니다.";
}
return "";
};