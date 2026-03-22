class User < ApplicationRecord
  # Devise認証モジュール: パスワード認証、登録、リカバリー、セッション記憶、バリデーション、メール確認
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  # DeviseTokenAuth: トークンベースのAPI認証をサポート
  include DeviseTokenAuth::Concerns::User

  # ユーザー削除時に関連する学習進捗・履歴を全て連動削除
  has_many :user_sections, dependent: :destroy
  has_many :cleared_sections, through: :user_sections, source: :section
  has_many :study_logs, dependent: :destroy
  has_many :question_attempts, dependent: :destroy
  has_many :user_question_states, dependent: :destroy

  # セクションクリア時の一連の処理をトランザクションで実行
  # - 合計プレイ時間・クリア問題数をアトミックに加算（レースコンディション防止）
  # - UserSectionレコードを作成
  # - 当日のStudyLogを更新または作成
  def record_section_cleared!(section:, play_time:, questions_cleared:, correct_answers:, total_clear:)
    transaction do
      # increment!はSQLレベルでの加算のため、並行リクエストでも安全
      increment!(:total_play_time, play_time)
      increment!(:total_questions_cleared, questions_cleared)

      # セクションのクリア記録を作成
      user_sections.create!(
        section: section,
        correct_answers_count: correct_answers,
        cleared_at: Time.current
      )

      # 学習ログの更新または作成（1ユーザー1日1レコード）
      log = study_logs.find_or_initialize_by(date: Date.current)
      log.study_time = (log.study_time || 0) + total_clear
      log.save!
    end
  end

  # ダッシュボード表示用のデータをハッシュで返す
  def dashboard_data
    {
      total_play_time: total_play_time,
      total_questions_cleared: total_questions_cleared,
      cleared_sections: recent_cleared_sections,
      study_logs_past_year: study_logs_past_year
    }
  end

  private

  # 直近10件のクリアセクション情報（N+1防止のためfor_dashboardスコープを使用）
  def recent_cleared_sections
    user_sections.for_dashboard.map do |us|
      {
        section_name: us.section.section_name,
        correct_answers: us.correct_answers_count,
        cleared_at: us.cleared_at
      }
    end
  end

  # 過去1年間の学習ログ（pluckで必要カラムのみ取得し、メモリ効率を向上）
  def study_logs_past_year
    study_logs
      .where(date: 1.year.ago.to_date..Date.current)
      .order(date: :asc)
      .pluck(:date, :study_time)
      .map { |date, time| { date: date, study_time: time } }
  end
end
