export interface PostResponse {
    id: string;
    title: string;
    content: string;
    author: {
        id: string;
        username: string;
        avatarUrl?: string;
    };
    commentsCount: number;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
}
