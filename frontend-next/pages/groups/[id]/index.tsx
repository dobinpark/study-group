import { GetServerSideProps } from 'next';
import { Box, Typography, Button, Paper } from '@mui/material';
import { StudyGroup } from '../../../types/study-group';
import { studyGroupsService } from '../../../services/study-groups.service';
import { useAuth } from '../../../contexts/AuthContext';

interface GroupDetailProps {
  group: StudyGroup;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { id } = params as { id: string };
    const response = await studyGroupsService.getOne(id);
    
    return {
      props: {
        group: response.data.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default function GroupDetail({ group }: GroupDetailProps) {
  const { user } = useAuth();
  const isOwner = user?.id === group.ownerId;

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {group.name}
        </Typography>
        {/* 그룹 상세 정보 */}
      </Paper>
    </Box>
  );
} 