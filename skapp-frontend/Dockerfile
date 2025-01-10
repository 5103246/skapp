FROM node:20

# 作業ディレクトリを設定
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start", "--", "--port", "3000"]

EXPOSE 3000