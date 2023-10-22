#!/bin/bash

nginx &

set -e

rm -f /api/tmp/pids/server.pid

exec "$@"
