export enum SupportCategory { // Enum 이름 변경
    NOTICE = 'NOTICE',      // 공지사항
    FAQ = 'FAQ',  // 자주 묻는 질문
    INQUIRY = 'INQUIRY'   // 1:1 문의
}

export const SupportCategoryKorean = { // Enum Korean Map 이름 변경
    [SupportCategory.NOTICE]: '공지사항',
    [SupportCategory.FAQ]: '자주 묻는 질문',
    [SupportCategory.INQUIRY]: '1:1 문의'
}; 