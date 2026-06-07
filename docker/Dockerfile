FROM node:alpine

WORKDIR /app
COPY package.json .
COPY app/ app/

RUN npm install
CMD [ "npm", "run", "prod"]