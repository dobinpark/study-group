// 핵심 데이터 모델 정의(백엔드 API와 주고받는 데이터의 기본 구조를 정의)
export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  role: string;
}

export interface StudyGroup {
  id: number;
  name: string;
  content: string;
  mainCategory: string;
  subCategory: string;
  detailCategory: string;
  creator: User;
  members: User[];
  maxMembers: number;
  createdAt: string;
  updatedAt?: string;
  status?: string;
}

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

export enum PostCategory {
  FREE = 'FREE',
  QUESTION = 'QUESTION',
  SUGGESTION = 'SUGGESTION'
}

export const PostCategoryKorean = {
  FREE: '자유게시판',
  QUESTION: '질문게시판',
  SUGGESTION: '건의게시판',
} as const;

export type PostCategoryType = keyof typeof PostCategoryKorean;

export interface SubCategory {
  name: string;
  items?: string[];
}

export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

export interface StudyGroupResponse {
  success: boolean;
  message?: string;
  data: {
    created: StudyGroup[];
    joined: StudyGroup[];
  };
}

export interface Support {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  nickname: string;
  commentCount: number;
}

export interface SupportResponse {
  success: boolean;
  message?: string;
  data: {
    created: Support[];
    joined: Support[];
  };
}

export interface SupportCategory {
  id: number;
  name: string;
  description: string;
}
