import { User } from './user';
import { Attachment, Comment } from '../services/inquiries.service';

export interface Inquiry {
  answer: string;
  isAnswered: any;
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  comments: Comment[];
  status: 'pending' | 'answered';
} 