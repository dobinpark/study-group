'use client';

import React, { useState } from 'react';
import {
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  MobileStepper,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { Attachment } from '../services/inquiries.service';

interface ImageGalleryProps {
  attachments: Attachment[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ attachments }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const imageAttachments = attachments.filter(
    (attachment) => attachment.mimeType.startsWith('image/')
  );

  if (imageAttachments.length === 0) return null;

  const handleNext = () => {
    setSelectedIndex((prev) => 
      prev !== null ? Math.min(prev + 1, imageAttachments.length - 1) : null
    );
  };

  const handleBack = () => {
    setSelectedIndex((prev) => 
      prev !== null ? Math.max(prev - 1, 0) : null
    );
  };

  const currentImage = selectedIndex !== null ? imageAttachments[selectedIndex] : null;

  return (
    <>
      <ImageList sx={{ mt: 2 }} cols={3} rowHeight={164}>
        {imageAttachments.map((attachment, index) => (
          <ImageListItem
            key={attachment.id}
            sx={{ cursor: 'pointer' }}
            onClick={() => setSelectedIndex(index)}
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
        open={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedIndex(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          {currentImage && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={`/api/inquiries/attachments/${currentImage.fileName}`}
                  alt={currentImage.originalName}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'calc(100vh - 100px)',
                    objectFit: 'contain',
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1 }}>
                  {currentImage.originalName}
                </Typography>
              </Box>

              <MobileStepper
                steps={imageAttachments.length}
                position="static"
                activeStep={selectedIndex ?? 0}
                sx={{
                  bgcolor: 'transparent',
                  '& .MuiMobileStepper-dot': {
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '& .MuiMobileStepper-dotActive': {
                    bgcolor: 'white',
                  },
                }}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={selectedIndex === imageAttachments.length - 1}
                  >
                    다음
                    <KeyboardArrowRight />
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={selectedIndex === 0}
                  >
                    <KeyboardArrowLeft />
                    이전
                  </Button>
                }
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}; 