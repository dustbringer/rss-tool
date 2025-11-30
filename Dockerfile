# https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]
