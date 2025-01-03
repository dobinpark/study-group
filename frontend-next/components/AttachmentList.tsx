'use client';

import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { Attachment } from '../services/inquiries.service';

interface AttachmentListProps {
  attachments: Attachment[];
}

export const AttachmentList: React.FC<AttachmentListProps> = ({ attachments }) => {
  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (fileName: string, originalName: string) => {
    try {
      const response = await fetch(`/api/inquiries/attachments/${fileName}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
    }
  };

  if (attachments.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        첨부파일
      </Typography>
      <List>
        {attachments.map((attachment) => (
          <ListItem
            key={attachment.id}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => handleDownload(attachment.fileName, attachment.originalName)}
              >
                <DownloadIcon />
              </IconButton>
            }
          >
            <ListItemIcon>
              {isImage(attachment.mimeType) ? <ImageIcon /> : <FileIcon />}
            </ListItemIcon>
            <ListItemText
              primary={attachment.originalName}
              secondary={formatFileSize(attachment.size)}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}; 