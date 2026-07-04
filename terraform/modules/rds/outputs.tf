output "address" {
  value = aws_db_instance.this.address
}

output "db_name" {
  value = aws_db_instance.this.db_name
}

output "master_username" {
  value = aws_db_instance.this.username
}

output "db_password_secret_arn" {
  description = "マスターパスワードのSecret。SecretStringはパスワード文字列そのもの（JSONではない）"
  value       = aws_secretsmanager_secret.db_password.arn
}
