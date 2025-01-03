'use client';

import React from 'react';
import { Box } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownPreviewProps {
  content: string | undefined;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <Box
      sx={{
        '& .wmde-markdown': {
          background: 'none',
          fontSize: 'inherit',
        },
      }}
    >
      <MDEditor.Markdown
        source={content}
        rehypePlugins={[[rehypeSanitize]]}
      />
    </Box>
  );
}; 