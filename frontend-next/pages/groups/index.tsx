import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import { StudyGroup } from '../../types/study-group';
import { studyGroupsService } from '../../services/study-groups.service';
import PageHeader from '../../components/PageHeader';
import StudyGroupCard from '../../components/StudyGroupCard';

interface StudyGroupsPageProps {
  groups: StudyGroup[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await studyGroupsService.getAll();
    return {
      props: {
        groups: response.data.data,
      },
    };
  } catch (error) {
    return {
      props: {
        groups: [],
      },
    };
  }
};

export default function StudyGroupsPage({ groups }: StudyGroupsPageProps) {
  return (
    <>
      <PageHeader 
        title="스터디 그룹 목록" 
        breadcrumbs={[
          { label: '홈', href: '/' },
          { label: '스터디 그룹' },
        ]}
      />
      <Grid container spacing={3}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <StudyGroupCard group={group} />
          </Grid>
        ))}
      </Grid>
    </>
  );
} 