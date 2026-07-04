output "target_group_arn" {
  value = aws_lb_target_group.api.arn
}

output "alb_dns_name" {
  value = aws_lb.this.dns_name
}

output "https_listener_arn" {
  description = "スモークテストやリスナールール追加時の参照用（env側はmodule単位のdepends_onでリスナー作成を待つ）"
  value       = aws_lb_listener.https.arn
}
