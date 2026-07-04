variable "image_tag" {
  description = "初回apply用イメージタグ。以降のデプロイはGHA管理"
  type        = string
  default     = "latest"
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "enable_dns_records" {
  description = "カットオーバースイッチ。trueでapi/frontのDNSを新スタックへ向ける"
  type        = bool
  default     = false
}

variable "rds_publicly_accessible" {
  description = "DB移行作業時のみtrue"
  type        = bool
  default     = false
}

variable "db_maintenance_ingress_cidrs" {
  type    = list(string)
  default = []
}

variable "db_name" {
  type = string
}

variable "allowed_hosts" {
  type = string
}

variable "cors_origins" {
  type = string
}

variable "mailer_host" {
  type = string
}

variable "email_address" {
  type = string
}

variable "smtp_address" {
  type = string
}

variable "smtp_port" {
  type = string
}

variable "smtp_domain" {
  type = string
}

variable "smtp_username" {
  description = "SES SMTPユーザー名（globalスタックの ses_smtp_username 出力。アクセスキーIDなので非シークレット扱い）"
  type        = string
}
