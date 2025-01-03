'use client';

import React, { useState } from 'react';
import {
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Attachment } from '../services/inquiries.service';

interface ImagePreviewProps {
  attachments: Attachment[];
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ attachments }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const imageAttachments = attachments.filter(
    (attachment) => attachment.mimeType.startsWith('image/')
  );

  if (imageAttachments.length === 0) return null;

  return (
    <>
      <ImageList sx={{ mt: 2 }} cols={3} rowHeight={164}>
        {imageAttachments.map((attachment) => (
          <ImageListItem
            key={attachment.id}
            sx={{ cursor: 'pointer' }}
            onClick={() => setSelectedImage(`/api/inquiries/attachments/${attachment.fileName}`)}
          >
            <img
              src={`/api/inquiries/attachments/${attachment.fileName}`}
              alt={attachment.originalName}
              loading="lazy"
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}; 