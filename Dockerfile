# Node.js v20을 베이스 이미지로 사용
FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 파일 복사 및 설치
COPY package*.json ./
RUN npm install --production

# 애플리케이션 코드 복사
COPY . .

# 환경 변수로 포트를 설정하고 기본값을 3000으로 지정
ENV PORT=3000

# 애플리케이션 포트 설정
EXPOSE $PORT

# 애플리케이션 시작 명령어
CMD ["npm", "start"]