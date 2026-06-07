FROM node:alpine

WORKDIR /app
COPY package.json /app/
COPY src /app/src

RUN npm install
EXPOSE 58925
CMD [ "npm", "run", "prod"]