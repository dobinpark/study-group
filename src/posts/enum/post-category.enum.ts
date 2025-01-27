export enum PostCategory {
    FREE = 'FREE',      // 자유게시판
    QUESTION = 'QUESTION',  // 질문게시판
    SUGGESTION = 'SUGGESTION'  // 건의게시판
}

export const PostCategoryKorean = {
    [PostCategory.FREE]: '자유게시판',
    [PostCategory.QUESTION]: '질문게시판',
    [PostCategory.SUGGESTION]: '건의게시판'
}; 