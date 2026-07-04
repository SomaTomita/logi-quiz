output "secret_key_base_arn" {
  value = aws_secretsmanager_secret.secret_key_base.arn
}

output "email_password_arn" {
  value = aws_secretsmanager_secret.email_password.arn
}
