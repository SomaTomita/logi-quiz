#!/bin/bash
set -e

# PIDファイルの削除
rm -f /api/tmp/pids/server.pid

# NOTE: 本番のDBマイグレーションはここでは実行しない。
# 複数タスクの同時起動でmigrateが競合するため、
# デプロイパイプラインの one-off ECS タスクで実行する（別issueで対応）。

exec "$@"
