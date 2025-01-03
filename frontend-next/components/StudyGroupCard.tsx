'use client';

import { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { StudyGroup } from '../types/study-group';
import { studyGroupsService } from '../services/study-groups.service';
import { useAuth } from '../contexts/AuthContext';

interface StudyGroupCardProps {
  group: StudyGroup;
  onJoin?: () => void;
}

export default function StudyGroupCard({ group, onJoin }: StudyGroupCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      await studyGroupsService.join(group.id);
      onJoin?.();
    } catch (error) {
      console.error('Failed to join group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {group.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {group.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            멤버: {group.memberCount}/{group.maxMembers}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={handleJoin}
            disabled={loading}
          >
            {loading ? '처리 중...' : '참여하기'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 