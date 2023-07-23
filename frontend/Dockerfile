# LTSバージョンのNode.jsをベースイメージとして使う
FROM node:lts-slim
# コンテナ内の作業ディレクトリを設定
WORKDIR /front
# npm の対話的な質問を避けるために環境変数を設定する
ENV CI=true

# Node.js の依存関係をインストールし、アプリケーションコードをコピーする
COPY ./app/package.json ./app/yarn.lock /front/
RUN yarn install

# 残りのフロントエンドアプリケーションコードをコピーする
COPY ./app /front

# Start the development server (you may need to adjust this command depending on your setup)
CMD ["yarn", "start"]
