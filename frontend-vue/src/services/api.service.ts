import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  async login(credentials: { username: string; password: string }) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
      throw error;
    }
  },

  async signup(signupData: any) {
    const response = await apiClient.post('/auth/signup', signupData);
    return response.data;
  },

  async logout() {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async checkSession() {
    try {
      const response = await apiClient.get('/auth/session');
      return response.data.data;
    } catch (error) {
      return { isAuthenticated: false, user: null };
    }
  }
};

export const studyGroupService = {
  async getStudyGroups(params: any) {
    const response = await apiClient.get('/study-groups', { params });
    return response.data;
  },

  async getStudyGroup(id: number) {
    const response = await apiClient.get(`/study-groups/${id}`);
    return response.data;
  },

  async createStudyGroup(data: any) {
    const response = await apiClient.post('/study-groups', data);
    return response.data;
  },

  async updateStudyGroup(id: number, data: any) {
    const response = await apiClient.put(`/study-groups/${id}`, data);
    return response.data;
  },

  async joinStudyGroup(id: number) {
    const response = await apiClient.post(`/study-groups/${id}/join`);
    return response.data;
  },

  async leaveStudyGroup(id: number) {
    const response = await apiClient.delete(`/study-groups/${id}/leave`);
    return response.data;
  }
};

export const userService = {
  async getProfile(id: number) {
    const response = await apiClient.get(`/users/profile/${id}`);
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  }
}; 