resource "aws_ecs_cluster" "this" {
  name = var.name_prefix

  setting {
    # Container Insightsは追加コストがかかるためNFR（コスト）判断で無効
    name  = "containerInsights"
    value = "disabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "this" {
  cluster_name       = aws_ecs_cluster.this.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/${var.name_prefix}"
  retention_in_days = var.log_retention_days
}

data "aws_iam_policy_document" "ecs_tasks_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "execution" {
  name               = "${var.name_prefix}-ecs-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role_policy_attachment" "execution_managed" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "read_secrets" {
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = var.secret_arns
  }
}

resource "aws_iam_role_policy" "execution_secrets" {
  name   = "read-app-secrets"
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.read_secrets.json
}

resource "aws_iam_role" "task" {
  name               = "${var.name_prefix}-ecs-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

locals {
  container_environment = [
    for k, v in var.container_env : { name = k, value = v }
  ]

  log_configuration = {
    logDriver = "awslogs"
    options = {
      awslogs-group         = aws_cloudwatch_log_group.this.name
      awslogs-region        = var.region
      awslogs-stream-prefix = "rails"
    }
  }
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${var.name_prefix}-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = jsonencode([
    {
      name      = "rails"
      image     = var.image
      essential = true
      portMappings = [
        { containerPort = 3000, protocol = "tcp" }
      ]
      environment = local.container_environment
      secrets     = var.container_secrets
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
      logConfiguration = local.log_configuration
    }
  ])
}

# デプロイパイプラインがrun-taskで使うマイグレーション専用タスク定義。
# サービスにはぶら下がらない（one-off実行専用）。
resource "aws_ecs_task_definition" "migrate" {
  family                   = "${var.name_prefix}-migrate"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = jsonencode([
    {
      name        = "migrate"
      image       = var.image
      essential   = true
      command     = ["bundle", "exec", "rails", "db:migrate"]
      environment = local.container_environment
      secrets     = var.container_secrets
      logConfiguration = merge(local.log_configuration, {
        options = merge(local.log_configuration.options, { awslogs-stream-prefix = "migrate" })
      })
    }
  ])
}

resource "aws_ecs_service" "api" {
  name            = "${var.name_prefix}-api"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = var.desired_count

  launch_type = var.use_fargate_spot ? null : "FARGATE"

  dynamic "capacity_provider_strategy" {
    for_each = var.use_fargate_spot ? [1] : []
    content {
      capacity_provider = "FARGATE_SPOT"
      weight            = 1
    }
  }

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = var.health_check_grace_period_seconds

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = true # NAT/VPCエンドポイント不使用のため（ECR/Secretsへの経路）
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "rails"
    container_port   = 3000
  }

  lifecycle {
    # アプリデプロイはGHAが新revisionを登録してサービスを更新する。
    # Terraform側でcontainer_env等を変えた場合は、apply後にデプロイワークフローを
    # 手動実行（workflow_dispatch）して新revisionを反映させること。
    ignore_changes = [task_definition]
  }

  # capacity provider関連付け前にserviceが作られるとFARGATE_SPOT指定が失敗するため明示
  depends_on = [aws_ecs_cluster_capacity_providers.this]
}
