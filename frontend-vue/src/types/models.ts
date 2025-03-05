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
  [PostCategory.FREE]: '자유게시판',
  [PostCategory.QUESTION]: '질문게시판',
  [PostCategory.SUGGESTION]: '건의게시판'
};

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

export interface SupportCategoryInfo {
  id: number;
  name: string;
  description: string;
}

export interface UserProfile {
  id: number;
  bio: string;
  profileImage: string;
}

// Support 카테고리 추가
export enum SupportCategory {
  INQUIRY = 'INQUIRY',
  REPORT = 'REPORT',
  FEEDBACK = 'FEEDBACK'
}

export const SupportCategoryKorean = {
  [SupportCategory.INQUIRY]: '문의하기',
  [SupportCategory.REPORT]: '신고하기',
  [SupportCategory.FEEDBACK]: '피드백'
};
