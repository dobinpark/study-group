import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { Profile as ProfileType } from '../services/users.service';
import { usersService } from '../services/users.service';
import { useAuth } from '../contexts/AuthContext';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        email: profile.email,
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const response = await usersService.getProfile();
      setProfile(response.data.data);
    } catch (error) {
      console.error('프로필 조회 실패:', error);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const formData = new FormData();
    formData.append('avatar', e.target.files[0]);

    try {
      const response = await usersService.updateProfile(formData);
      setProfile(response.data.data);
      updateUser({
        ...user!,
        ...response.data.data,
      });
      setSuccess('프로필 사진이 업데이트되었습니다.');
    } catch (error) {
      setError('프로필 사진 업데이트에 실패했습니다.');
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await usersService.deleteAvatar();
      setProfile((prev) => (prev ? { ...prev, avatarUrl: undefined } : null));
      updateUser({ ...user!, avatarUrl: undefined });
      setSuccess('프로필 사진이 삭제되었습니다.');
    } catch (error) {
      setError('프로필 사진 삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== profile?.[key as keyof ProfileType]) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await usersService.updateProfile(formDataToSend);
      setProfile(response.data.data);
      updateUser({
        ...user!,
        ...response.data.data,
      });
      setSuccess('프로필이 업데이트되었습니다.');
    } catch (error) {
      setError('프로필 업데이트에 실패했습니다.');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await usersService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setIsPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccess('비밀번호가 변경되었습니다.');
    } catch (error) {
      setError('비밀번호 변경에 실패했습니다.');
    }
  };

  if (!profile) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          프로필 설정
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={profile.avatarUrl} sx={{ width: 100, height: 100 }} />
          <Box>
            <input
              type="file"
              accept="image/*"
              id="avatar-input"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
              >
                사진 변경
              </Button>
            </label>
            {profile.avatarUrl && (
              <IconButton
                color="error"
                onClick={handleAvatarDelete}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="사용자 이름"
            margin="normal"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="이메일"
            margin="normal"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="자기소개"
            margin="normal"
            multiline
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" type="submit">
              저장하기
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              비밀번호 변경
            </Button>
          </Box>
        </form>

        <Dialog
          open={isPasswordDialogOpen}
          onClose={() => setIsPasswordDialogOpen(false)}
        >
          <DialogTitle>비밀번호 변경</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="현재 비밀번호"
              type="password"
              margin="normal"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="새 비밀번호"
              type="password"
              margin="normal"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="새 비밀번호 확인"
              type="password"
              margin="normal"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsPasswordDialogOpen(false)}>취소</Button>
            <Button
              variant="contained"
              onClick={handlePasswordChange}
              disabled={
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
              }
            >
              변경하기
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default Profile;
