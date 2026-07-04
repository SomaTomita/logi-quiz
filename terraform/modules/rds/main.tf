resource "aws_db_subnet_group" "this" {
  name       = "${var.name_prefix}-mysql"
  subnet_ids = var.subnet_ids

  tags = { Name = "${var.name_prefix}-mysql" }
}

resource "aws_db_parameter_group" "this" {
  name_prefix = "${var.name_prefix}-mysql80-"
  family      = "mysql8.0"

  parameter {
    name  = "character_set_server"
    value = "utf8mb4"
  }

  parameter {
    name  = "collation_server"
    value = "utf8mb4_unicode_ci"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# パスワードはTerraformが生成・Secrets Managerに保存し、ローテーションしない。
# tfstateに値が含まれるトレードオフは §1.3 参照（stateバケットは暗号化・非公開）。
resource "random_password" "master" {
  length  = 32
  special = false # MySQL接続文字列・CLIでのエスケープ事故を避ける
}

resource "aws_secretsmanager_secret" "db_password" {
  name                    = "${var.name_prefix}/DATABASE_PASSWORD"
  recovery_window_in_days = var.password_recovery_window_in_days
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.master.result
}

resource "aws_db_instance" "this" {
  identifier     = "${var.name_prefix}-mysql"
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = var.instance_class

  db_name  = var.db_name
  username = var.master_username
  password = random_password.master.result
  port     = 3306

  allocated_storage     = 20
  max_allocated_storage = 50
  storage_type          = "gp3"
  storage_encrypted     = true

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [var.security_group_id]
  parameter_group_name   = aws_db_parameter_group.this.name
  publicly_accessible    = var.publicly_accessible
  multi_az               = var.multi_az

  backup_retention_period    = var.backup_retention_period
  auto_minor_version_upgrade = true
  apply_immediately          = true

  skip_final_snapshot       = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : "${var.name_prefix}-mysql-final"
  deletion_protection       = var.deletion_protection

  tags = { Name = "${var.name_prefix}-mysql" }
}
