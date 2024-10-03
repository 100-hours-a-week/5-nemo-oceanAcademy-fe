import React from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../breadcrumb/Breadcrumb';

// 경로와 라벨을 맵핑하는 객체
const breadcrumbNameMap: { [key: string]: string } = {
  '/': '홈',
  '/my-created-lectures': '내가 개설한 강의',
  '/enrollment': '강의 등록',
  '/lecture/info': '강의 정보',
  '/classroom': '내가 수강 중인 강의',
  '/dashboard/student': '학생 대시보드',
  '/dashboard/teacher': '강사 대시보드',
  '/dashboard/edit': '강의정보 수정',
  '/lecture/open': '강의 개설',
  '/lecture/students': '수강생 리스트',
  '/mypage': '마이 페이지',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // 현재 경로를 바탕으로 브레드크럼 데이터를 생성하는 함수
  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    return pathnames.map((_, index) => {
      const url = `/${pathnames.slice(0, index + 1).join('/')}`;
      return { label: breadcrumbNameMap[url] || '알 수 없음', link: url };
    });
  };

  return (
    <div>
      <Breadcrumb items={generateBreadcrumbItems()} />
      <div>
        {children}
      </div>
    </div>
  );
};

export default Layout;