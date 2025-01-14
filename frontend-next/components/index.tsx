'use client';

import { GetServerSideProps } from 'next';
import { Box, Typography, Button, Grid } from '@mui/material';

interface HomeProps {
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    return {
      props: {
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
