'use client';

import React from 'react';
import { Pagination, Box } from '@mui/material';

interface InquiryPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const InquiryPagination: React.FC<InquiryPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
      />
    </Box>
  );
}; 