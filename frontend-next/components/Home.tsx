import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { StudyGroup } from '../types/study-group';
import { studyGroupsService } from '../services/study-groups.service';
import { useAuth } from '../contexts/AuthContext';
import { CreateGroupModal } from '../components/CreateGroupModal';

const Home = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudyGroups = async () => {
    try {
      const response = await studyGroupsService.getAll();
      setStudyGroups(response.data.data);
    } catch (error) {
      console.error('스터디 그룹 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchStudyGroups();
  }, []);

  const handleCreateSuccess = () => {
    fetchStudyGroups();
  };

  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        <span>함</span>
        <span
          style={{
            fontSize: '0.7em',
            color: '#666',
          }}
        >
          께
        </span>
        <span>공</span>
        <span
          style={{
            fontSize: '0.7em',
            color: '#666',
          }}
        >
          부
        </span>
      </Typography>

      {!!user && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
          sx={{ mt: 3, mb: 2 }}
        >
          스터디 그룹 생성
        </Button>
      )}

      <CreateGroupModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* 스터디 그룹 목록 */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        진행중인 스터디 그룹
      </Typography>
      <Grid container spacing={3}>
        {studyGroups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Paper
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => router.push(`/groups/${group.id}`)}
            >
              <Typography variant="h6" gutterBottom>
                {group.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {group.description}
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="body2">
                  멤버: {group.memberCount}/{group.maxMembers}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
