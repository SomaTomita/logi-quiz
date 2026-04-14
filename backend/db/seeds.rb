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

# ===========================================
# BI分析用データの生成
# 多様な学習者プロファイルで固定間隔SRSの限界を示す
# ===========================================
puts "BI分析データ作成中..."

QuestionAttempt.delete_all
UserQuestionState.delete_all

all_questions = Question.includes(:choices).all.to_a
all_users = User.where(admin: false).to_a

# 学習者セグメントプロファイル定義
# 各プロファイルで正答率と回答速度を変えることで、
# 固定間隔SRSが個人差に対応できないことを示す
learner_profiles = [
  { type: :fast_accurate,   accuracy_range: 0.80..0.95, speed_range: 1500..4000, count: 5 },
  { type: :slow_accurate,   accuracy_range: 0.75..0.90, speed_range: 6000..15000, count: 5 },
  { type: :fast_inaccurate, accuracy_range: 0.30..0.55, speed_range: 1000..3500, count: 5 },
  { type: :struggling,      accuracy_range: 0.25..0.50, speed_range: 8000..20000, count: 5 },
].freeze

# 追加学習者ユーザー作成（合計20人以上）
additional_users = 14.times.map do |i|
  User.create!(
    name: Faker::Name.name,
    email: "learner#{i + 1}@example.com",
    password: SEED_PASSWORD,
    password_confirmation: SEED_PASSWORD,
    admin: false,
    confirmed_at: Time.current,
    total_play_time: 0,
    total_questions_cleared: 0
  )
end

analytics_users = all_users + additional_users
user_index = 0

learner_profiles.each do |profile|
  remaining = analytics_users.length - user_index
  assigned_count = [profile[:count], remaining].min
  next if assigned_count <= 0

  assigned_users = analytics_users[user_index, assigned_count]
  user_index += assigned_count

  assigned_users.each do |user|
    accuracy = rand(profile[:accuracy_range])
    speed_min, speed_max = profile[:speed_range].minmax
    sampled_questions = all_questions.sample([all_questions.length, rand(15..30)].min)

    sampled_questions.each do |question|
      correct_choice = question.choices.find(&:is_correct)
      wrong_choices = question.choices.reject(&:is_correct)
      next if correct_choice.nil?

      # 各問題について複数回の試行を生成（SRSの進行を模擬）
      attempts_count = rand(3..8)
      box_level = 0
      correct_total = 0
      now = Time.current

      attempts_count.times do |attempt_i|
        is_correct = rand < accuracy
        response_time = rand(speed_min..speed_max)

        # 時間を過去に分散（古い順に生成）
        created_at = now - (attempts_count - attempt_i).days * rand(2..5)

        choice = is_correct ? correct_choice : wrong_choices.sample
        QuestionAttempt.create!(
          user: user,
          question: question,
          choice: choice,
          correct: is_correct,
          response_time_ms: response_time,
          created_at: created_at,
          updated_at: created_at
        )

        correct_total += 1 if is_correct

        # ボックスレベルの更新（SRSロジックを模擬）
        box_level = is_correct ? [box_level + 1, 4].min : 0
      end

      # UserQuestionState作成
      intervals = SrsService::REVIEW_INTERVALS
      UserQuestionState.create!(
        user: user,
        question: question,
        box_level: box_level,
        attempt_count: attempts_count,
        correct_count: correct_total,
        last_reviewed_at: now - rand(1..7).days,
        next_review_at: now + intervals[box_level].days
      )
    end

    # StudyLogの追加（過去90日分に拡張）
    rand(20..60).times do
      date = Faker::Date.between(from: 90.days.ago, to: Date.current)
      log = user.study_logs.find_or_initialize_by(date: date)
      log.study_time = (log.study_time || 0) + rand(2..15)
      log.save!
    end

    total_attempts = user.question_attempts.count
    total_correct = user.question_attempts.where(correct: true).count
    total_time = user.question_attempts.sum(:response_time_ms) / 1000
    user.update!(total_play_time: total_time, total_questions_cleared: total_correct)
  end
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
puts "  回答記録: #{QuestionAttempt.count}"
puts "  SRS状態: #{UserQuestionState.count}"
puts ""
puts "管理者アカウント: admin@example.com"
puts "テストアカウント: example@example.com"
puts "一般アカウント: user1@example.com 〜 user5@example.com"
puts "学習者アカウント: learner1@example.com 〜 learner14@example.com"
puts "パスワード: ENV['SEED_USER_PASSWORD'] または 'password123'"
