# Node.js v20을 베이스 이미지로 사용
FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 파일 복사 및 설치
COPY package*.json ./
RUN npm install --production

# 애플리케이션 코드 복사
COPY . .

# 애플리케이션 포트 설정
EXPOSE 3000

# 애플리케이션 시작 명령어
CMD ["npm", "start"]
