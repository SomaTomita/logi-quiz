variable "name_prefix" {
  type = string
}

variable "password_recovery_window_in_days" {
  description = "パスワードSecret削除時の猶予日数。stagingは0（destroy→再applyの名前衝突回避）"
  type        = number
  default     = 7
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "db_name" {
  description = "作成するデータベース名（現行と同一にしてdump/restoreを単純化する）"
  type        = string
}

variable "master_username" {
  type    = string
  default = "admin"
}

variable "instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "multi_az" {
  type    = bool
  default = false
}

variable "publicly_accessible" {
  description = "DB移行作業時のみtrue。通常はfalse"
  type        = bool
  default     = false
}

variable "backup_retention_period" {
  description = "自動バックアップ保持日数。0で無効（stagingのみ）"
  type        = number
  default     = 7
}

variable "skip_final_snapshot" {
  type    = bool
  default = false
}

variable "deletion_protection" {
  type    = bool
  default = true
}
