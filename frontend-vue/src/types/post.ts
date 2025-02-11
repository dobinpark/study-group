export enum PostCategory {
  FREE = 'FREE',
  QUESTION = 'QUESTION',
  SUGGESTION = 'SUGGESTION'
}

export const PostCategoryKorean = {
  [PostCategory.FREE]: '자유게시판',
  [PostCategory.QUESTION]: '질문게시판',
  [PostCategory.SUGGESTION]: '건의게시판',
};

export interface Post {
  id: number;
  title: string;
  content: string;
  category: PostCategory;
  createdAt: string;
  updatedAt: string;
  userId: number;
  nickname: string;
  commentCount: number;
}
