import { GetServerSideProps } from 'next';
import { Box, Typography, Button, Grid } from '@mui/material';
import { StudyGroup } from '../types/study-group';
import { studyGroupsService } from '../services/study-groups.service';

interface HomeProps {
  studyGroups: StudyGroup[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await studyGroupsService.getAll();
    return {
      props: {
        studyGroups: response.data.data,
      },
    };
  } catch (error) {
    return {
      props: {
        studyGroups: [],
      },
    };
  }
};

export default function Home({ studyGroups }: HomeProps) {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        스터디 그룹 목록
      </Typography>
      <Grid container spacing={3}>
        {/* 스터디 그룹 목록 렌더링 */}
      </Grid>
    </Box>
  );
} 