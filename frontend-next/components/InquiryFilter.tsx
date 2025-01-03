'use client';

import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Grid,
} from '@mui/material';

interface InquiryFilterProps {
  search: string;
  filter: 'all' | 'answered' | 'pending';
  sort: 'latest' | 'oldest' | 'answered' | 'pending';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: 'all' | 'answered' | 'pending') => void;
  onSortChange: (value: 'latest' | 'oldest' | 'answered' | 'pending') => void;
}

export const InquiryFilter: React.FC<InquiryFilterProps> = ({
  search,
  filter,
  sort,
  onSearchChange,
  onFilterChange,
  onSortChange,
}) => {
  const handleFilterChange = (event: SelectChangeEvent) => {
    onFilterChange(event.target.value as 'all' | 'answered' | 'pending');
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value as 'latest' | 'oldest' | 'answered' | 'pending');
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          placeholder="검색어를 입력하세요"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <FormControl size="small" fullWidth>
          <InputLabel>상태</InputLabel>
          <Select
            value={filter}
            label="상태"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">전체</MenuItem>
            <MenuItem value="pending">답변 대기</MenuItem>
            <MenuItem value="answered">답변 완료</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} sm={3}>
        <FormControl size="small" fullWidth>
          <InputLabel>정렬</InputLabel>
          <Select
            value={sort}
            label="정렬"
            onChange={handleSortChange}
          >
            <MenuItem value="latest">최신순</MenuItem>
            <MenuItem value="oldest">오래된순</MenuItem>
            <MenuItem value="answered">답변완료순</MenuItem>
            <MenuItem value="pending">답변대기순</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}; 