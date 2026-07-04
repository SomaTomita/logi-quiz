# ---- カットオーバー制御（Task 19〜23で段階的に変更する）----
desired_count      = 0     # Task 22でDB移行完了後に1へ
enable_dns_records = false # Task 23のカットオーバーでtrueへ

# ---- アプリ設定 ----
# NOTE: このAWSアカウントには現行の手動構築インフラ（ECSクラスター等）が存在しないため、
# DATABASE_NAME/MAILER_HOSTはTask 2相当の確認ができていない。Rails慣習に基づく暫定値。
# 実際にレガシー環境がある場合はTask 2の棚卸し結果で上書きすること。
db_name       = "logi_quiz_production"
allowed_hosts = "api.logi-quiz.com"
cors_origins  = "https://logi-quiz.com"
mailer_host   = "api.logi-quiz.com"

# ---- メール（Amazon SES。Gmail SMTPから移行）----
email_address = "no-reply@logi-quiz.com" # SESで検証済みのドメインのアドレス
smtp_address  = "email-smtp.ap-northeast-1.amazonaws.com"
smtp_port     = "587"
smtp_domain   = "logi-quiz.com"
smtp_username = "<terraform -chdir=../../global output -raw ses_smtp_username の値（global apply後に取得）>"
