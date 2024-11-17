// 사용자 상태 관리
import create from 'zustand';
import axios from 'axios';
import endpoints from '../api/endpoints';
import { getProfileImage } from '../utils/profileImage';

interface UserState {
  isLoggedIn: boolean;
  profileImage: string;
  nickname: string;
  logout: () => void;
  getUserInfo: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  profileImage: '',
  nickname: '',
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isLoggedIn: false, profileImage: '', nickname: '' });
  },
  getUserInfo: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isLoggedIn: false });
      return;
    }
    try {
      const response = await axios.get(endpoints.userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { nickname, profile_image_path } = response.data.data;
      set({
        isLoggedIn: true,
        nickname,
        profileImage: profile_image_path || getProfileImage(nickname),
      });
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      set({ isLoggedIn: false });
    }
  },
}));

