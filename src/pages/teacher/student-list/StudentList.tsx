import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './StudentList.module.css';
import { Container } from '../../../styles/GlobalStyles';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import profImage from '../../../assets/images/profile/profile_default.png';

interface Student {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  createdAt: string;
  deletedAt: string;
  reviews: [];
}

const StudentList: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const token = localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(endpoints.getStudentList.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const studentData = response.data.data.map((student: any) => ({
          id: student.id,
          email: student.email,
          nickname: student.nickname,
          profileImage: student.profile_image_path
            ? `${student.profile_image_path}`
            : profImage,
          createdAt: new Date(student.created_at).toLocaleDateString('ko-KR'), // 한국식 날짜 형식으로 변환
          deletedAt: student.deleted_at, 
          reviews: student.reviews,
        }));

        setStudents(studentData);
        setLoading(false);
      } catch (err) {
        setError('수강생 정보를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    if (classId) {
      fetchStudents();
    }
  }, [classId, token]);

  if (loading) {
    return <Container><p>수강생 정보를 불러오는 중...</p></Container>;
  }

  if (error) {
    return <Container><p>{error}</p></Container>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        <h2 className={styles.title}>수강생 리스트</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th></th>
                <th>닉네임</th>
                <th>이메일</th>
                <th>신청일자</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={student.profileImage}
                    alt="profile"
                    className={styles.profileImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = profImage;
                    }}
                  />
                </td>
                <td>{student.nickname}</td>
                <td>{student.email}</td>
                <td>{student.createdAt}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;