variable "name_prefix" {
  description = "リソース名プレフィックス（例: logi-quiz-production）"
  type        = string
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "availability_zones" {
  type    = list(string)
  default = ["ap-northeast-1a", "ap-northeast-1c"]
}

variable "db_maintenance_ingress_cidrs" {
  description = "DB移行・メンテナンス作業時のみ一時的に3306を許可するCIDR。通常は空にすること"
  type        = list(string)
  default     = []
}
