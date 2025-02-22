// 프론트엔드 상태 관리를 위한 타입

import type { User, StudyGroup } from './models';

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

export interface StudyState {
  studyGroups: StudyGroup[];
  currentStudyGroup: StudyGroup | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  user: UserState;
  study: StudyState;
}
