import { GetServerSideProps } from 'next';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Inquiry } from '../../../types/inquiry';
import { inquiriesService } from '../../../services/inquiries.service';

interface InquiryDetailProps {
  inquiry: Inquiry;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.params as { id: string };
    const response = await inquiriesService.getOne(id);
    
    return {
      props: {
        inquiry: response.data.data,
      },
    };
  } catch (error) {
    return {
      notFound: true, // 404 페이지로 리다이렉트
    };
  }
};

export default function InquiryDetail({ inquiry }: InquiryDetailProps) {
  // 클라이언트 사이드 상태 및 핸들러
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {inquiry.title}
        </Typography>
        {/* 나머지 UI 컴포넌트들 */}
      </Paper>
    </Box>
  );
}