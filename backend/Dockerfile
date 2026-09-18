FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p data

EXPOSE 4000

CMD ["npm", "start"]