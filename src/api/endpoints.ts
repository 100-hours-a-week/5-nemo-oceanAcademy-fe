const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

const endpoints = {
    login: `${SERVER_URL}/kakao/login`, // 수정 예정
    logout: `${SERVER_URL}/kakao/logout`, // 수정 예정
    checkUser: `${SERVER_URL}/api/auth/signup`, // 회원가입 여부 확인 
    register: `${SERVER_URL}/api/auth/signup`, // 회원가입 신청
    deleteUser: `${SERVER_URL}/api/auth/signup`, // 회원 탈퇴
    getKakaoAppKey: `${SERVER_URL}/api/auth/kakao/app-key`, // 카카오 앱 키 발급
    getJwt: `${SERVER_URL}/api/auth/kakao/callback`, // 카카오 인증 코드 처리 후 JWT 발급
    getUserInfo: `${SERVER_URL}/api/users`, // 유저 정보 가져오기 (프로필 사진, 닉네임)
    patchUserInfo: `${SERVER_URL}/api/users`, // 사용자 정보 수정 (프로필 사진, 닉네임)
    checkNickname: `${SERVER_URL}/api/users/checkNickname?nickname={nickname}`, // 닉네임 중복 검사 
    getLectures: `${SERVER_URL}/api/classes`, // 강의 리스트 가져오기 
    getLectureInfo: `${SERVER_URL}/api/classes/{classId}`, // 특정 강의 정보 가져오기
    editDashboard: `${SERVER_URL}/api/classes/{classId}`, // 대시보드 수정
    deleteLecture: `${SERVER_URL}/delete`, // 강의 삭제
    getRole: `${SERVER_URL}/api/classes/{classId}/role`, // 강사/수강생/관계없음 구분
    getDashboard: `${SERVER_URL}/api/classes/{classId}/dashboard`, // 대시보드 정보 가져오기 
    getStudentList: `${SERVER_URL}/api/classes/{classId}/dashboard/students`, // 수강생 리스트 가져오기
    getSchedule: `${SERVER_URL}/api/classes/{classId}/schedule`, // 강의 일정 가져오기 
    makeSchedule: `${SERVER_URL}/api/classes/{classId}/schedule`, // 강의 일정 생성
    deleteSchedule: `${SERVER_URL}/api/classes/{classId}/schedule`, // 강의 일정 삭제
    enrollment: `${SERVER_URL}/api/classes/{classId}/enroll`, // 수강 신청
    getCategories: `${SERVER_URL}/api/categories`, // 카테고리 정보 가져오기 
  };
  
export default endpoints;
