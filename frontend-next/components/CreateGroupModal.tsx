'use client';

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { studyGroupsService } from '../services/study-groups.service';

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const regions = [
  '서울', '경기', '인천', '부산', '대구', '광주', '대전',
  '울산', '세종', '강원', '경남', '경북', '전남', '전북',
  '충남', '충북', '제주', '전국',
];

const categories = ['전공', '취미', '종교', '언어'];

const purposes = ['스터디', '프로젝트', '동아리', '멘토링'];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 10,
    region: '전국',
    category: '전공',
    purpose: '스터디'
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await studyGroupsService.create(formData);
      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || '그룹 생성에 실패했습니다.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          스터디 그룹 만들기
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="그룹 이름"
            margin="normal"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          
          <TextField
            fullWidth
            label="그룹 설명"
            margin="normal"
            multiline
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <TextField
            fullWidth
            label="최대 인원"
            type="number"
            margin="normal"
            value={formData.maxMembers}
            onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
          />

          <TextField
            select
            fullWidth
            label="지역"
            margin="normal"
            required
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          >
            {regions.map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="분야"
            margin="normal"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="목적"
            margin="normal"
            required
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          >
            {purposes.map((purpose) => (
              <MenuItem key={purpose} value={purpose}>
                {purpose}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            그룹 생성
          </Button>
        </form>
      </Box>
    </Modal>
  );
}; 