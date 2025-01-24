export enum PostCategory {
    FREE = 'FREE',
    QUESTION = 'QUESTION',
    SUGGESTION = 'SUGGESTION'
}

export const PostCategoryKorean = {
    [PostCategory.FREE]: '자유게시판',
    [PostCategory.QUESTION]: '질문게시판',
    [PostCategory.SUGGESTION]: '건의게시판'
};

export interface Post {
    id: number;
    title: string;
    content: string;
    category: PostCategory;
    authorId: number;
    author: {
        id: number;
        nickname: string;
    };
    views: number;
    likes: number;
    createdAt: string;
    updatedAt: string;
}
