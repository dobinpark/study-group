// API 요청시 사용되는 데이터 전송 객체 정의
export interface LoginDto {
  username: string;
  password: string;
}

export interface SignupDto {
  username: string;
  password: string;
  email: string;
  nickname: string;
}

export interface CreateStudyGroupDto {
  name: string;
  mainCategory: string;
  subCategory: string;
  detailCategory: string;
  description: string;
  maxMembers: number;
  isOnline: boolean;
}

export interface UpdateStudyGroupDto {
  name?: string;
  description?: string;
  maxMembers?: number;
  category?: string;
}

export interface UpdateProfileDto {
  nickname?: string;
  email?: string;
  profileImage?: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  category: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  category?: string;
}

export interface CreateSupportDto {
  title: string;
  content: string;
  category: string;
}

export interface UpdateSupportDto {
  title?: string;
  content?: string;
  category?: string;
}
