FROM node:alpine

WORKDIR /app
COPY package.json .
COPY app/ app/

RUN npm install
EXPOSE 58925
CMD [ "npm", "run", "prod"]