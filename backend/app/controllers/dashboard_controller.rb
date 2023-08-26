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

        # 既存のユーザーセクションのレコードを探すか、新しいレコードを初期化
        user_section = UserSection.find_or_initialize_by(user_id: current_user.id, section_id: current_section.id)
        user_section.correct_answers_count = correct_answers
        user_section.cleared_at = Time.current
        user_section.save

        # 学習ログの更新または作成
        total_clear = params[:total_clear].to_i 
        study_log = StudyLog.find_or_initialize_by(user_id: current_user.id, date: Date.today)
        study_log.study_time = (study_log.study_time || 0) + total_clear # セクションのクリア回数を加算
        study_log.save

        # 現在のユーザーの合計プレイ時間、合計クリア問題数、最後にクリアしたセクションIDを更新
        current_user.update(
          total_play_time: (current_user.total_play_time || 0) + play_time,
          total_questions_cleared: (current_user.total_questions_cleared || 0) + questions_cleared,
        )
    end

    private

    # ダッシュボードに表示するためのデータを生成するメソッド
    def data_for_dashboard(user)
        start_date = 1.month.ago.to_date # 過去1ヶ月前の日付を取得
        end_date = Date.today # 今日の日付を取得
    
        # 現在のユーザーに関連するUserSectionのレコードを取得します。
        cleared_user_sections = UserSection.where(user_id: user.id)
        .order(cleared_at: :desc)
        .limit(10) # 最新の10件だけ取得
        .includes(:section) # それに関連するsectionも一緒に取得（N+1問題の解消のための includes メソッドの使用）
    
        # 上で取得したcleared_user_sectionsに関連するsectionの名前、正解数、クリア日時の情報をハッシュの形で抽出
        cleared_sections = cleared_user_sections.map do |us| # cleared_sections配列に格納
          { 
            section_name: us.section.section_name,
            correct_answers: us.correct_answers_count,
            cleared_at: us.cleared_at
          }
        end
    
        # 最終的なダッシュボードデータをハッシュの形で返す
        {
          total_play_time: user.total_play_time, # 合計プレイ時間
          total_questions_cleared: user.total_questions_cleared, # 合計クリア問題数
          cleared_sections: cleared_sections, # クリアしたセクションの過去10回の情報の配列
          study_logs_past_month: StudyLog.where(user_id: user.id, date: start_date..end_date)
                                .order(date: :asc)
                                .map { |log| { date: log.date, study_time: log.study_time } } # 過去1ヶ月間の学習ログ
        }
    end

    # これを利用して現在のセクションを取得
    def current_section
        @current_section ||= Section.find_by(params[:section_id])
    end
end