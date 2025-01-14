'use client';

import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        페이지를 찾을 수 없습니다
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" sx={{ mt: 2 }} component="a">
          홈으로 돌아가기
        </Button>
      </Link>
    </Box>
  );
}
