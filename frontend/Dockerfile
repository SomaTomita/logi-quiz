FROM node:20.19.0-slim

WORKDIR /front
ENV CI=true

# 依存関係のマニフェストを先にコピー（Dockerレイヤーキャッシュ活用）
COPY ./app/package.json ./app/yarn.lock ./

# 依存関係をインストール（lockfileに厳密に従う）
# npmレジストリの一時的な取りこぼし（esbuildのoptionalDependencies解決失敗など）で
# Yarn Classicが即座にハードフェイルすることがあるため、リトライを入れる
RUN yarn install --frozen-lockfile --network-timeout 600000 \
  || yarn install --frozen-lockfile --network-timeout 600000 \
  || yarn install --frozen-lockfile --network-timeout 600000

# アプリケーションコードをコピー
COPY ./app .

CMD ["yarn", "dev"]
