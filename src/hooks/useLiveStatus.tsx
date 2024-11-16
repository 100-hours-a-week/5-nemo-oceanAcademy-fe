import { useState, useEffect } from 'react';
import axios from 'axios';
import endpoints from '../api/endpoints';

const useLiveStatus = (classId: string | undefined, token: string | null) => {
  const [isActive, setIsActive] = useState<boolean | null>(null);

  const updateLiveStatus = async () => {
    if (!classId || !token) return;

    try {
      const response = await axios.patch(endpoints.isActive.replace('{classId}', classId), {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('라이브 상태 변경 성공:', response.data.data);
      setIsActive(true);
    } catch (error) {
      console.error('라이브 상태 변경 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    const initializeLiveStatus = async () => {
      if (!classId || !token) return;

      try {
        const response = await axios.get(endpoints.isActive.replace('{classId}', classId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const activeStatus = response.data.data.active;
        if (!activeStatus) {
          await updateLiveStatus();
        } else {
          setIsActive(true);
        }
      } catch (error) {
        console.error('강의 활성화 상태 확인 중 오류 발생:', error);
      }
    };

    initializeLiveStatus();

    return () => {
      if (isActive) {
        updateLiveStatus();
      }
    };
  }, [classId, token, isActive]);

  return { isActive, updateLiveStatus };
};

export default useLiveStatus;
