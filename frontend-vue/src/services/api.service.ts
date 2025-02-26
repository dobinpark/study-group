import axios from 'axios';

const API_BASE_URL = '/api/auth'; // 백엔드 API 기본 URL 설정

export const authService = {
  async login(credentials: { username: string; password: string }) {
    return axios.post(`${API_BASE_URL}/login`, credentials);
  },

  async logout() {
    return axios.post(`${API_BASE_URL}/logout`);
  },

  async checkSession() {
    return axios.get(`${API_BASE_URL}/session`);
  },

  async signup(signupData: any) { // signupData 타입 정의 필요
    return axios.post(`${API_BASE_URL}/signup`, signupData);
  },

  async findPassword(findPasswordData: any) { // findPasswordData 타입 정의 필요
    return axios.post(`${API_BASE_URL}/find-password`, findPasswordData);
  },

  async getMe() {
    return axios.get(`${API_BASE_URL}/me`);
  }
}; 