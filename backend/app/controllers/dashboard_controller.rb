class DashboardController < ApplicationController
    # ダッシュボードデータを取得するアクション
    def dashboard_data
        user = current_user
        render json: { data: data_for_dashboard(user) }
    end

    # セクションのクリア情報を更新するアクション
    def section_cleared
        # プレイした時間を取得
        play_time = params[:play_time].to_i

        # クリアした問題の数を取得
        questions_cleared = params[:questions_cleared].to_i

        # 特定のセクションでクリアした正解数を取得
        correct_answers = params[:correct_answers].to_i

        # 既存のユーザーセクションのレコードを探すか、新しいレコードを初期化する
        user_section = UserSection.find_or_initialize_by(user_id: current_user.id, section_id: current_section.id)
        user_section.correct_answers_count = correct_answers
        user_section.cleared_at = Time.current
        user_section.save

        # 現在のユーザーの合計プレイ時間、合計クリア問題数、最後にクリアしたセクションIDを更新
        current_user.update(
          total_play_time: current_user.total_play_time + play_time,
          total_questions_cleared: current_user.total_questions_cleared + questions_cleared,
          last_cleared_section_id: current_section.id
        )
    end

    private

    # ダッシュボードに表示するためのデータを生成するメソッド
    def data_for_dashboard(user)
        start_date = 1.month.ago.to_date
        end_date = Date.today

        {
          # ユーザーの合計プレイ時間
          total_play_time: user.total_play_time,

          # ユーザーの合計クリア問題数
          total_questions_cleared: user.total_questions_cleared,

          # 最近クリアしたセクションのリスト
          cleared_sections: UserSection.where(user_id: user.id)
                                       .order(cleared_at: :desc)
                                       .limit(10)
                                       .map { |us| { section_id: us.section_id, correct_answers: us.correct_answers_count } },

          # 最近1ヶ月の学習ログ
          study_logs: StudyLog.where(user_id: user.id, date: start_date..end_date).order(date: :desc)
        }
    end

    # これを利用して現在のセクションを取得
    def current_section
        @current_section ||= Section.find(params[:section_id])
    end
end