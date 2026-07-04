output "alb_dns_name" {
  value = module.alb_api.alb_dns_name
}

output "rds_address" {
  value = module.rds.address
}

output "rds_password_secret_arn" {
  value = module.rds.db_password_secret_arn
}

output "rds_db_name" {
  value = module.rds.db_name
}

output "rds_master_username" {
  value = module.rds.master_username
}

output "secret_key_base_arn" {
  value = module.app_secrets.secret_key_base_arn
}

output "email_password_arn" {
  value = module.app_secrets.email_password_arn
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "ecs_service_name" {
  value = module.ecs.service_name
}

output "api_task_family" {
  value = module.ecs.api_task_family
}

output "migrate_task_family" {
  value = module.ecs.migrate_task_family
}

output "ecs_subnet_ids" {
  value = module.network.public_subnet_ids
}

output "ecs_security_group_id" {
  value = module.network.app_security_group_id
}

output "frontend_bucket_name" {
  value = module.frontend.bucket_name
}

output "cloudfront_distribution_id" {
  value = module.frontend.distribution_id
}

output "cloudfront_domain_name" {
  value = module.frontend.distribution_domain_name
}
