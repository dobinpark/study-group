'use client';

import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" passHref>
      <Box 
        component="a" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          textDecoration: 'none',
          color: 'inherit'
        }}
      >
        <Typography variant="h6" component="span">
          함공
        </Typography>
        <Image
          src="/images/book.png"
          alt="Book Icon"
          width={30}
          height={30}
          priority
        />
      </Box>
    </Link>
  );
}
