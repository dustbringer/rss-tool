# https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/

FROM node:25

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npx", "tsc" ]

CMD [ "npm", "run", "start" ]
