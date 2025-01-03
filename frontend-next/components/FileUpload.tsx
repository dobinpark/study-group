'use client';

import React, { useRef } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

interface FileUploadProps {
  files: File[];
  onFileSelect: (files: FileList) => void;
  onFileRemove: (index: number) => void;
  maxFiles?: number;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFileSelect,
  onFileRemove,
  maxFiles = 5,
  accept = "image/*,.pdf,.doc,.docx,.txt",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const remainingSlots = maxFiles - files.length;
      const selectedFiles = Array.from(event.target.files).slice(0, remainingSlots);
      
      if (selectedFiles.length > 0) {
        onFileSelect(
          Object.assign(new DataTransfer(), { items: selectedFiles }).files
        );
      }
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (file: File) => file.type.startsWith('image/');

  const renderPreview = (file: File) => {
    if (isImage(file)) {
      return (
        <Box
          component="img"
          src={URL.createObjectURL(file)}
          alt={file.name}
          sx={{
            width: 40,
            height: 40,
            objectFit: 'cover',
            borderRadius: 1,
          }}
        />
      );
    }
    return (
      <ListItemIcon>
        <FileIcon />
      </ListItemIcon>
    );
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="file-input"
        accept={accept}
      />
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          component="label"
          htmlFor="file-input"
          startIcon={<AttachFileIcon />}
          disabled={files.length >= maxFiles}
        >
          파일 첨부
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
          최대 {maxFiles}개 파일, 파일당 10MB 이하
        </Typography>
      </Box>

      <List>
        {files.map((file, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" onClick={() => onFileRemove(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            {renderPreview(file)}
            <ListItemText
              primary={file.name}
              secondary={formatFileSize(file.size)}
              sx={{ ml: 2 }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}; 