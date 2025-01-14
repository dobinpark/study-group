export interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  joinedAt: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  recentPosts: {
    id: string;
    title: string;
    createdAt: string;
    likes: number;
    comments: number;
  }[];
}

export interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  recentActivities: {
    id: string;
    type: 'post' | 'comment' | 'like';
    content: string;
    createdAt: string;
  }[];
}
