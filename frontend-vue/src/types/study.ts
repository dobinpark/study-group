export interface User {
  id: number;
  nickname: string;
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

export interface StudyGroupResponse {
  success: boolean;
  message: string;
  data: {
    created: StudyGroup[];
    joined: StudyGroup[];
  };
}

export interface StudyGroupDetailResponse {
  success: boolean;
  message: string;
  data: StudyGroup;
} 