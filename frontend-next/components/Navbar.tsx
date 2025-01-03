'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" passHref>
          <Typography variant="h6" component="a" sx={{ textDecoration: 'none', color: 'inherit' }}>
            함공
          </Typography>
        </Link>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {user ? (
          <>
            <Link href="/profile" passHref>
              <Button color="inherit" component="a">{user.username}님</Button>
            </Link>
            <Button color="inherit" onClick={handleLogout}>로그아웃</Button>
          </>
        ) : (
          <>
            <Link href="/login" passHref>
              <Button color="inherit" component="a">로그인</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button color="inherit" component="a">회원가입</Button>
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
