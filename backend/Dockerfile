# Backend Dockerfile for cereal box board game emulator
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]