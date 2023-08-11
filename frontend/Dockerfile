# LTSバージョンのNode.jsをベースイメージとして使う
FROM node:lts-slim

WORKDIR /front
# npm のインストール時、対話的な質問を避けるために環境変数を設定する
ENV CI=true

# Node.js の依存関係をインストールし、アプリケーションコードをコピーする
COPY ./app/package.json ./app/yarn.lock /front/

# 残りのフロントエンドのアプリケーションのソースコードをコンテナに取り込み、コンテナ起動時にアプリケーションが実行できる状態に
COPY ./app /front
CMD ["yarn", "start"]
