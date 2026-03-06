# frozen_string_literal: true

# ===========================================
# Seed Data for logi-quiz
# 実行: bundle exec rails db:seed
#
# クイズデータ: db/seeds/quiz_data.json（gitignore対象・ビジネスデータのため非公開）
# パスワード: ENV変数で管理（デフォルト値は開発環境用）
# ===========================================

require "json"

# 本番環境ではseedを実行しない
if Rails.env.production?
  puts "本番環境ではseedを実行しません"
  exit
end

# --- クイズデータの読み込み ---
quiz_data_path = Rails.root.join("db", "seeds", "quiz_data.json")
unless File.exist?(quiz_data_path)
  puts "ERROR: #{quiz_data_path} が見つかりません"
  puts "クイズデータファイルをチームメンバーから取得してください"
  puts "配置先: backend/db/seeds/quiz_data.json"
  exit 1
end
quiz_data = JSON.parse(File.read(quiz_data_path))

# --- データクリア（FK制約の順序を考慮） ---
puts "既存データをクリア中..."
StudyLog.delete_all
UserSection.delete_all
Choice.delete_all
Explanation.delete_all
Question.delete_all
Section.delete_all
User.delete_all

# --- セクション・問題・選択肢・解説の作成 ---
puts "セクション・問題作成中..."
sections = quiz_data.map do |section_data|
  section = Section.create!(section_name: section_data["section_name"])

  section_data["questions"].each do |q|
    question = section.questions.create!(question_text: q["question_text"])

    q["choices"].each do |choice|
      question.choices.create!(
        choice_text: choice["choice_text"],
        is_correct: choice["is_correct"]
      )
    end

    question.create_explanation!(explanation_text: q["explanation"])
  end

  section
end

# --- ユーザー作成 ---
# パスワードはENV変数から取得（gitにハードコードしない）
SEED_PASSWORD = ENV.fetch("SEED_USER_PASSWORD", "password123")

puts "ユーザー作成中..."

# 管理者ユーザー
admin = User.create!(
  name: "管理者",
  email: "admin@example.com",
  password: SEED_PASSWORD,
  password_confirmation: SEED_PASSWORD,
  admin: true,
  confirmed_at: Time.current,
  total_play_time: 0,
  total_questions_cleared: 0
)

# テスト用一般ユーザー（example@example.com は README記載のデモアカウント）
User.create!(
  name: "テストユーザー",
  email: "example@example.com",
  password: SEED_PASSWORD,
  password_confirmation: SEED_PASSWORD,
  admin: false,
  confirmed_at: Time.current,
  total_play_time: 0,
  total_questions_cleared: 0
)

# 一般ユーザー5名
regular_users = 5.times.map do |i|
  User.create!(
    name: Faker::Name.name,
    email: "user#{i + 1}@example.com",
    password: SEED_PASSWORD,
    password_confirmation: SEED_PASSWORD,
    admin: false,
    confirmed_at: Time.current,
    total_play_time: 0,
    total_questions_cleared: 0
  )
end

# --- 学習履歴の作成 ---
# 一般ユーザーにランダムな学習進捗を付与（ダッシュボードの動作確認用）
puts "学習履歴作成中..."
regular_users.each do |user|
  completed_sections = sections.sample(rand(3..7))
  total_time = 0
  total_cleared = 0

  completed_sections.each do |section|
    correct = rand(5..15)
    play_time = rand(60..600)
    total_time += play_time
    total_cleared += correct

    user.user_sections.create!(
      section: section,
      correct_answers_count: correct,
      cleared_at: Faker::Time.between(from: 3.months.ago, to: Time.current)
    )
  end

  # 過去60日間のうちランダムな日にちに学習ログを作成
  rand(10..30).times do
    date = Faker::Date.between(from: 60.days.ago, to: Date.current)
    log = user.study_logs.find_or_initialize_by(date: date)
    log.study_time = (log.study_time || 0) + rand(1..5)
    log.save!
  end

  user.update!(total_play_time: total_time, total_questions_cleared: total_cleared)
end

# --- 完了サマリー ---
puts "Seed完了!"
puts "  セクション: #{Section.count}"
puts "  問題: #{Question.count}"
puts "  選択肢: #{Choice.count}"
puts "  解説: #{Explanation.count}"
puts "  ユーザー: #{User.count} (管理者: 1, 一般: #{User.where(admin: false).count})"
puts "  クリア履歴: #{UserSection.count}"
puts "  学習ログ: #{StudyLog.count}"
puts ""
puts "管理者アカウント: admin@example.com"
puts "テストアカウント: example@example.com"
puts "一般アカウント: user1@example.com 〜 user5@example.com"
puts "パスワード: ENV['SEED_USER_PASSWORD'] または 'password123'"
