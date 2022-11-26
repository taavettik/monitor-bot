FROM node:lts-alpine

WORKDIR /service

COPY package*.json .

RUN npm i

CMD [ "npm", "run", "start:dev" ]