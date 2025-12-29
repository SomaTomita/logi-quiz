FROM nginx:alpine

# Nginx設定ファイルをコピー
COPY nginx.conf /etc/nginx/nginx.conf

# curlをインストール（ヘルスチェック用）
RUN apk add --no-cache curl

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
