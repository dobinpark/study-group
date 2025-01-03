'use client';

import React from 'react';
import { Box, TextField } from '@mui/material';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  minHeight = 200,
}) => {
  return (
    <Box>
      <TextField
        fullWidth
        multiline
        minRows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ 
          '& .MuiInputBase-root': {
            minHeight: minHeight,
          }
        }}
      />
    </Box>
  );
}; 