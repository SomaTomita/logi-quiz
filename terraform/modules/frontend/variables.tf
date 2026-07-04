variable "name_prefix" {
  type = string
}

variable "bucket_name" {
  description = "例: logi-quiz-frontend-production-<account_id>"
  type        = string
}

variable "domain_name" {
  description = "例: logi-quiz.com / staging.logi-quiz.com"
  type        = string
}

variable "route53_zone_name" {
  type = string
}

variable "enable_dns_record" {
  description = "trueでdomain_nameのAレコードをCloudFrontに向ける（カットオーバー用スイッチ）"
  type        = bool
  default     = false
}
