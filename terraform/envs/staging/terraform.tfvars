# stagingはオンデマンド構築のため最初からDNS有効・タスク1で作る
desired_count      = 1
enable_dns_records = true

db_name       = "api_staging"
allowed_hosts = "staging-api.logi-quiz.com"
cors_origins  = "https://staging.logi-quiz.com"
mailer_host   = "staging-api.logi-quiz.com"

# メールはproductionと同じSES（ドメインID・SMTPユーザーはglobalスタック共用、東京リージョン固定）
email_address = "no-reply@logi-quiz.com"
smtp_address  = "email-smtp.ap-northeast-1.amazonaws.com"
smtp_port     = "587"
smtp_domain   = "logi-quiz.com"
smtp_username = "<terraform -chdir=../../global output -raw ses_smtp_username の値（global apply後に取得）>"
