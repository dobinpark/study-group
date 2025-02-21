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
  async login(username: string, password: string) {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  },

  async signup(signupData: any) {
    const response = await apiClient.post('/auth/signup', signupData);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
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