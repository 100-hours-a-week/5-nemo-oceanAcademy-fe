const currentUrl = window.location.hostname;

let SERVER_URL;

if (currentUrl.includes("localhost") || currentUrl.includes("dev.nemooceanacademy.com")) {
    SERVER_URL = "https://dev.nemooceanacademy.com:5000"; // 개발 환경
} else {
    SERVER_URL = "https://www.nemooceanacademy.com:5000"; // 배포 환경
}

const endpoints = {
    user: `${SERVER_URL}/api/auth/signup`, // 회원가입 여부 확인 (GET) / 회원가입 신청 (POST) / 회원 탈퇴 (DELETE)
    getKakaoAppKey: `${SERVER_URL}/api/auth/kakao/app-key`, // 카카오 앱 키 발급
    getJwt: `${SERVER_URL}/api/auth/kakao/callback`, // 카카오 인증 코드 처리 후 JWT 발급
    callback: `${SERVER_URL}/api/auth/kakao/callback`, //callback
    userInfo: `${SERVER_URL}/api/users`, // 프로필(사진, 닉네임) 가져오기 (GET) / 프로필 수정 (PATCH)
    checkNickname: `${SERVER_URL}/api/users/checkNickname?nickname={nickname}`, // 닉네임 중복 검사 
    classes: `${SERVER_URL}/api/classes`, // 강의 리스트 가져오기 (GET) / 강의 생성 (POST)
    getLectureInfo: `${SERVER_URL}/api/classes/{classId}`, // 특정 강의 정보 가져오기 (GET) / 대시보드 수정 (PATCH)
    deleteLecture: `${SERVER_URL}/api/classes/{classId}/delete`, // 강의 삭제
    getRole: `${SERVER_URL}/api/classes/{classId}/role`, // 강사/수강생/관계없음 구분
    getDashboard: `${SERVER_URL}/api/classes/{classId}/dashboard`, // 대시보드 정보 가져오기 
    getStudentList: `${SERVER_URL}/api/classes/{classId}/dashboard/students`, // 수강생 리스트 가져오기
    lectureSchedule: `${SERVER_URL}/api/classes/{classId}/schedule`, // 강의 일정 불러오기 (GET) / 강의 일정 생성 (POST) / 강의 일정 삭제 (DELETE)
    enrollment: `${SERVER_URL}/api/classes/{classId}/enroll`, // 수강 신청
    getCategories: `${SERVER_URL}/api/categories`, // 카테고리 정보 가져오기
    connectWebSocket: `${SERVER_URL}/ws`,
    getChatHistory: `${SERVER_URL}/find/chat/list/{classId}`,
    sendMessage: `${SERVER_URL}/app/hello`,
    isActive: `${SERVER_URL}/api/classes/{classId}/isActive`, // 강의 라이브 여부 조회 (GET) / 강의 라이브 여부 변경 (POST)
  };
  
export default endpoints;
