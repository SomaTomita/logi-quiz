variable "name_prefix" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "api_domain_name" {
  description = "例: api.logi-quiz.com"
  type        = string
}

variable "route53_zone_name" {
  description = "例: logi-quiz.com"
  type        = string
}

variable "enable_dns_record" {
  description = "trueでapi_domain_nameのAレコードをこのALBに向ける（カットオーバー用スイッチ）"
  type        = bool
  default     = false
}

variable "health_check_path" {
  type    = string
  default = "/health"
}
