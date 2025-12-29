#!/bin/bash
set -e

# PIDファイルの削除
rm -f /api/tmp/pids/server.pid

# 本番環境でのデータベースマイグレーション（オプション）
# if [ "$RAILS_ENV" = "production" ]; then
#   bundle exec rails db:migrate
# fi

exec "$@"
