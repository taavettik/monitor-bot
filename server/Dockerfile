FROM node:lts

RUN apt-get update && apt-get install ffmpeg -y

WORKDIR /service

COPY package*.json .

RUN npm i

CMD [ "npm", "run", "start:dev" ]