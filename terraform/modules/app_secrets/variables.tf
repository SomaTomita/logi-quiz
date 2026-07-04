variable "name_prefix" {
  type = string
}

variable "recovery_window_in_days" {
  description = "削除猶予日数。stagingは0（即時削除→再作成可能に）"
  type        = number
  default     = 7
}
