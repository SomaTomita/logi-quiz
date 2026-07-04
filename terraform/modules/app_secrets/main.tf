# 値はTerraform外（aws secretsmanager put-secret-value）で投入する。
# tfstateに秘密値を残さないための意図的な設計。

resource "aws_secretsmanager_secret" "secret_key_base" {
  name                    = "${var.name_prefix}/SECRET_KEY_BASE"
  recovery_window_in_days = var.recovery_window_in_days
}

resource "aws_secretsmanager_secret" "email_password" {
  name                    = "${var.name_prefix}/EMAIL_PASSWORD"
  recovery_window_in_days = var.recovery_window_in_days
}
