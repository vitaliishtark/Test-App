FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g prisma

RUN npx prisma generate

ENV DATABASE_URL=postgresql://bankadmin:admin@postgres:5432/bankadmin?schema=public

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
