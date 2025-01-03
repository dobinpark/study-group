'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Fade,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Comment } from '../services/inquiries.service';
import { useAuth } from '../contexts/AuthContext';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUpdate,
  onDelete,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    try {
      await onUpdate(comment.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      setIsDeleting(false);
    }
  };

  const canModify = user?.id === comment.author.id;

  return (
    <Fade in={!isDeleting} timeout={500}>
      <Box
        sx={{
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Typography
              component="span"
              variant="subtitle2"
              sx={{ mr: 1 }}
            >
              {comment.author.username}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm')}
            </Typography>
          </Box>
          {canModify && !isEditing && (
            <Box>
              <IconButton
                size="small"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={handleDelete}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              size="small"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                size="small"
                onClick={() => setIsEditing(false)}
                startIcon={<CloseIcon />}
              >
                취소
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleUpdate}
              >
                수정
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {comment.content}
          </Typography>
        )}
      </Box>
    </Fade>
  );
}; 