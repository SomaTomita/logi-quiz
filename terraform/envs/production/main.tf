data "aws_caller_identity" "current" {}

locals {
  name_prefix = "logi-quiz-production"
  region      = "ap-northeast-1"
  zone_name   = "logi-quiz.com"

  ecr_repository_url = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.region}.amazonaws.com/logi-quiz-api"
  image              = "${local.ecr_repository_url}:${var.image_tag}"
}

module "network" {
  source = "../../modules/network"

  name_prefix                  = local.name_prefix
  db_maintenance_ingress_cidrs = var.db_maintenance_ingress_cidrs
}

module "rds" {
  source = "../../modules/rds"

  name_prefix         = local.name_prefix
  subnet_ids          = module.network.public_subnet_ids
  security_group_id   = module.network.rds_security_group_id
  db_name             = var.db_name
  publicly_accessible = var.rds_publicly_accessible

  # production: バックアップ7日 / 削除保護 / 最終スナップショットあり（module defaults）
}

module "app_secrets" {
  source = "../../modules/app_secrets"

  name_prefix = local.name_prefix
}

module "alb_api" {
  source = "../../modules/alb_api"

  name_prefix       = local.name_prefix
  vpc_id            = module.network.vpc_id
  subnet_ids        = module.network.public_subnet_ids
  security_group_id = module.network.alb_security_group_id
  api_domain_name   = "api.logi-quiz.com"
  route53_zone_name = local.zone_name
  enable_dns_record = var.enable_dns_records
}

module "ecs" {
  source = "../../modules/ecs_service"

  name_prefix       = local.name_prefix
  region            = local.region
  image             = local.image
  cpu               = "512"
  memory            = "1024"
  desired_count     = var.desired_count
  use_fargate_spot  = false
  subnet_ids        = module.network.public_subnet_ids
  security_group_id = module.network.app_security_group_id
  target_group_arn  = module.alb_api.target_group_arn

  container_env = {
    RAILS_ENV           = "production"
    RAILS_LOG_TO_STDOUT = "true"
    DATABASE_HOST       = module.rds.address
    DATABASE_NAME       = module.rds.db_name
    DATABASE_USERNAME   = module.rds.master_username
    DATABASE_PORT       = "3306"
    ALLOWED_HOSTS       = var.allowed_hosts
    CORS_ORIGINS        = var.cors_origins
    MAILER_HOST         = var.mailer_host
    EMAIL_ADDRESS       = var.email_address
    SMTP_ADDRESS        = var.smtp_address
    SMTP_PORT           = var.smtp_port
    SMTP_DOMAIN         = var.smtp_domain
    SMTP_USERNAME       = var.smtp_username
  }

  container_secrets = [
    { name = "DATABASE_PASSWORD", valueFrom = module.rds.db_password_secret_arn },
    { name = "SECRET_KEY_BASE", valueFrom = module.app_secrets.secret_key_base_arn },
    { name = "EMAIL_PASSWORD", valueFrom = module.app_secrets.email_password_arn },
  ]

  secret_arns = [
    module.rds.db_password_secret_arn,
    module.app_secrets.secret_key_base_arn,
    module.app_secrets.email_password_arn,
  ]

  depends_on = [module.alb_api]
}

module "frontend" {
  source = "../../modules/frontend"

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  name_prefix       = "${local.name_prefix}-frontend"
  bucket_name       = "logi-quiz-frontend-production-${data.aws_caller_identity.current.account_id}"
  domain_name       = "logi-quiz.com"
  route53_zone_name = local.zone_name
  enable_dns_record = var.enable_dns_records
}
