export interface Notification {
  id: string;
  type: 'message' | 'follow' | 'comment' | 'like';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  email: {
    newMessage: boolean;
    newFollower: boolean;
    postComment: boolean;
    postLike: boolean;
    newsletter: boolean;
  };
  push: {
    newMessage: boolean;
    newFollower: boolean;
    postComment: boolean;
    postLike: boolean;
  };
} 