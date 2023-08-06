#!/bin/bash

# サーバーが再起動できなくなる問題があるようなので、それを回避するためのスクリプト

# エラーした際にスクリプトを停止する
set -e

# pidファイルを削除
rm -f /api/tmp/pids/server.pid

# コンテナが起動した際、スクリプトに渡された引数を実行
exec "$@"
