export enum PostCategory {
    FREE = 'FREE',
    QUESTION = 'QUESTION',
    SUGGESTION = 'SUGGESTION'
}

export const PostCategoryKorean = {
    FREE: '자유게시판',
    QUESTION: '질문게시판',
    SUGGESTION: '건의게시판'
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
