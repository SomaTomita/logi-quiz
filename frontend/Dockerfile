FROM node:20.19.0-slim

WORKDIR /front
ENV CI=true

# 依存関係のマニフェストを先にコピー（Dockerレイヤーキャッシュ活用）
COPY ./app/package.json ./app/yarn.lock ./

# 依存関係をインストール（lockfileに厳密に従う）
RUN yarn install --frozen-lockfile

# アプリケーションコードをコピー
COPY ./app .

CMD ["yarn", "dev"]
