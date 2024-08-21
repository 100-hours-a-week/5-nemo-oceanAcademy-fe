import React from 'react';
import styles from './StudentList.module.css';
import { Container } from '../../../styles/GlobalStyles';

interface Student {
  id: number;
  nickname: string;
  profileImage: string;
  enrollmentDate: string;
}

const StudentList: React.FC = () => {
  // 더미 데이터
  const students: Student[] = [
    { id: 1, nickname: '학생1', profileImage: 'https://via.placeholder.com/50', enrollmentDate: '2023-08-01' },
    { id: 2, nickname: '학생2', profileImage: 'https://via.placeholder.com/50', enrollmentDate: '2023-08-02' },
    { id: 3, nickname: '학생3', profileImage: 'https://via.placeholder.com/50', enrollmentDate: '2023-08-03' },
    // 추가 수강생 데이터를 여기에 추가
  ];

  return (
    <Container>
      <div className={styles.listContainer}>
        <h2 className={styles.title}>수강생 리스트</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>프로필</th>
              <th>닉네임</th>
              <th>신청일자</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td><img src={student.profileImage} alt="profile" className={styles.profileImage} /></td>
                <td>{student.nickname}</td>
                <td>{student.enrollmentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default StudentList;