'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const router = useRouter();
  const { user } = useAuth();

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
    </Box>
  );
};

export default Home;
