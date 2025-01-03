'use client';

import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../lib/theme';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <main>{children}</main>
        </Container>
      </Box>
    </ThemeProvider>
  );
}