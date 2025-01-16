FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app/src
RUN npx prisma generate

WORKDIR /app
RUN npm run build


EXPOSE 5000

CMD ["npm","run" ,"dev"]