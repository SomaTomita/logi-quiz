variable "name_prefix" {
  type = string
}

variable "region" {
  type = string
}

variable "image" {
  description = "コンテナイメージ（ECR URL + タグ）。初回apply用。以降のデプロイはGHAがrevision更新する"
  type        = string
}

variable "cpu" {
  type    = string
  default = "512"
}

variable "memory" {
  type    = string
  default = "1024"
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "use_fargate_spot" {
  description = "trueでFARGATE_SPOTを使用（staging向け。中断耐性が必要なprodではfalse）"
  type        = bool
  default     = false
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "target_group_arn" {
  type = string
}

variable "container_env" {
  description = "railsコンテナのプレーン環境変数"
  type        = map(string)
}

variable "container_secrets" {
  description = "Secrets Manager参照 [{name, valueFrom}]"
  type = list(object({
    name      = string
    valueFrom = string
  }))
}

variable "secret_arns" {
  description = "実行ロールにGetSecretValueを許可するSecretのARN一覧"
  type        = list(string)
}

variable "log_retention_days" {
  type    = number
  default = 30
}

variable "health_check_grace_period_seconds" {
  type    = number
  default = 60
}
