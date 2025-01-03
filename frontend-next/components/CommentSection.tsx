'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Collapse,
  Alert,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { Comment } from '../services/inquiries.service';
import { CommentItem } from './CommentItem';
import { TransitionGroup } from 'react-transition-group';

interface CommentSectionProps {
  comments: Comment[];
  inquiryId: string;
  onAddComment: (content: string) => Promise<void>;
  onUpdateComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  inquiryId,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await onAddComment(content);
      setContent('');
      setError(null);
    } catch (error) {
      setError('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Divider />
      <Typography variant="h6" sx={{ my: 2 }}>
        댓글 {comments.length}개
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="댓글을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
          </Box>
          <Button
            variant="contained"
            type="submit"
            disabled={!content.trim()}
            endIcon={<SendIcon />}
          >
            댓글 작성
          </Button>
        </Box>
      </form>

      <TransitionGroup>
        {comments.map((comment) => (
          <Collapse key={comment.id}>
            <CommentItem
              comment={comment}
              onUpdate={onUpdateComment}
              onDelete={onDeleteComment}
            />
          </Collapse>
        ))}
      </TransitionGroup>

      {comments.length === 0 && (
        <Typography
          color="text.secondary"
          align="center"
          sx={{ py: 4 }}
        >
          아직 댓글이 없습니다.
        </Typography>
      )}
    </Box>
  );
}; 