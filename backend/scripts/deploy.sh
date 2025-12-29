#!/bin/bash
set -e

# スクリプトのディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

# 環境変数ファイルの読み込み
if [ -f "${BACKEND_DIR}/.env.deploy" ]; then
    export $(cat "${BACKEND_DIR}/.env.deploy" | grep -v '^#' | xargs)
else
    echo "警告: .env.deploy が見つかりません。.env.deploy.example をコピーして設定してください。"
    echo "  cp ${BACKEND_DIR}/.env.deploy.example ${BACKEND_DIR}/.env.deploy"
    exit 1
fi

# 設定の検証
: "${AWS_ACCOUNT_ID:?AWS_ACCOUNT_ID が設定されていません}"
: "${AWS_REGION:?AWS_REGION が設定されていません}"
: "${ECR_NGINX_REPO:?ECR_NGINX_REPO が設定されていません}"
: "${ECR_API_REPO:?ECR_API_REPO が設定されていません}"
: "${ECS_CLUSTER:?ECS_CLUSTER が設定されていません}"
: "${ECS_SERVICE:?ECS_SERVICE が設定されていません}"

# ECRレジストリURL
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# 色付きの出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ECRにログイン
login_ecr() {
    echo_info "ECRにログイン中..."
    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
}

# Nginxイメージのビルドとプッシュ
build_push_nginx() {
    echo_info "Nginxイメージをビルド中..."
    docker build -t ${ECR_NGINX_REPO} ${BACKEND_DIR}/nginx

    echo_info "Nginxイメージをタグ付け中..."
    docker tag ${ECR_NGINX_REPO}:latest ${ECR_REGISTRY}/${ECR_NGINX_REPO}:latest

    echo_info "NginxイメージをECRにプッシュ中..."
    docker push ${ECR_REGISTRY}/${ECR_NGINX_REPO}:latest
}

# Railsイメージのビルドとプッシュ
build_push_rails() {
    echo_info "Railsイメージをビルド中..."
    docker build -t ${ECR_API_REPO} ${BACKEND_DIR}

    echo_info "Railsイメージをタグ付け中..."
    docker tag ${ECR_API_REPO}:latest ${ECR_REGISTRY}/${ECR_API_REPO}:latest

    echo_info "RailsイメージをECRにプッシュ中..."
    docker push ${ECR_REGISTRY}/${ECR_API_REPO}:latest
}

# ECSタスク定義の生成
generate_task_definition() {
    echo_info "タスク定義を生成中..."
    envsubst < ${BACKEND_DIR}/ecs/task-definition.template.json > ${BACKEND_DIR}/ecs/task-definition.json
    echo_info "タスク定義を生成しました: ${BACKEND_DIR}/ecs/task-definition.json"
}

# ECSタスク定義の登録
register_task_definition() {
    echo_info "タスク定義を登録中..."
    aws ecs register-task-definition \
        --cli-input-json file://${BACKEND_DIR}/ecs/task-definition.json \
        --region ${AWS_REGION}
}

# ECSサービスの更新
update_ecs_service() {
    echo_info "ECSサービスを更新中..."
    aws ecs update-service \
        --cluster ${ECS_CLUSTER} \
        --service ${ECS_SERVICE} \
        --force-new-deployment \
        --region ${AWS_REGION}

    echo_info "デプロイが開始されました。"
    echo_info "ステータス確認: aws ecs describe-services --cluster ${ECS_CLUSTER} --services ${ECS_SERVICE}"
}

# 使用方法を表示
show_usage() {
    echo "使用方法: $0 [コマンド]"
    echo ""
    echo "コマンド:"
    echo "  nginx     - Nginxイメージのみビルド・プッシュ"
    echo "  rails     - Railsイメージのみビルド・プッシュ"
    echo "  build     - 両方のイメージをビルド・プッシュ"
    echo "  generate  - タスク定義を生成"
    echo "  register  - タスク定義を登録"
    echo "  deploy    - ECSサービスの更新のみ"
    echo "  all       - すべて実行（デフォルト）"
    echo ""
    echo "環境変数:"
    echo "  .env.deploy ファイルで設定してください"
    echo "  例: cp .env.deploy.example .env.deploy"
}

# メイン処理
main() {
    echo_info "=== Logi-Quiz デプロイスクリプト ==="
    echo_info "AWS Account: ${AWS_ACCOUNT_ID}"
    echo_info "Region: ${AWS_REGION}"
    echo ""

    case "${1:-all}" in
        "nginx")
            login_ecr
            build_push_nginx
            ;;
        "rails")
            login_ecr
            build_push_rails
            ;;
        "build")
            login_ecr
            build_push_nginx
            build_push_rails
            ;;
        "generate")
            generate_task_definition
            ;;
        "register")
            generate_task_definition
            register_task_definition
            ;;
        "deploy")
            update_ecs_service
            ;;
        "all")
            login_ecr
            build_push_nginx
            build_push_rails
            generate_task_definition
            register_task_definition
            update_ecs_service
            ;;
        "help"|"-h"|"--help")
            show_usage
            exit 0
            ;;
        *)
            echo_error "不明なコマンド: $1"
            show_usage
            exit 1
            ;;
    esac

    echo_info "=== 完了 ==="
}

main "$@"
