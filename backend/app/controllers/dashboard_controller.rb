class DashboardController < ApplicationController
    def dashboard_data
      user = current_user
      render json: { data: data_for_dashboard(user) }
    end

    # リクエストから送られてきたセクションのクリア情報を更新するアクション
    def section_cleared
      play_time = params[:play_time].to_i

      questions_cleared = params[:questions_cleared].to_i

      # 現在のユーザーの合計プレイ時間、合計クリア問題数、最後にクリアしたセクションIDを更新
      current_user.update(
        total_play_time: (current_user.total_play_time || 0) + play_time,
        total_questions_cleared: (current_user.total_questions_cleared || 0) + questions_cleared,
      )


      correct_answers = params[:correct_answers].to_i # 特定のセクションでクリアした正解数を取得

      # 既存のユーザーセクションのレコードを探すか、新しいレコードを初期化
      user_section = UserSection.new(user_id: current_user.id, section_id: current_section.id)
      user_section.correct_answers_count = correct_answers
      user_section.cleared_at = Time.current
      user_section.save


      # 学習ログの更新または作成
      total_clear = params[:total_clear].to_i 
      study_log = StudyLog.find_or_initialize_by(user_id: current_user.id, date: Date.today)
      # study_timeが設定されていない場合は0、またセクションのクリア回数を加算
      study_log.study_time = (study_log.study_time || 0) + total_clear
      study_log.save
    end


    private

    def data_for_dashboard(user)
      start_date = 1.year.ago.to_date
      end_date = Date.today
    
      cleared_user_sections = UserSection.where(user_id: user.id)
      .order(cleared_at: :desc)
      .limit(10)
      .includes(:section) # N+1問題の解消のための includes メソッドの使用
    
      # 上で取得したsectionの名前、正解数、クリア日時の情報をハッシュの形で抽出　(usでデータにアクセス)
      cleared_sections = cleared_user_sections.map do |us|
      { 
        section_name: us.section.section_name,
        correct_answers: us.correct_answers_count,
        cleared_at: us.cleared_at
      }
      end

    
      # 最終的なダッシュボードデータをハッシュの形で返す
      {
        total_play_time: user.total_play_time,
        total_questions_cleared: user.total_questions_cleared,
        cleared_sections: cleared_sections,
        study_logs_past_year: StudyLog.where(user_id: user.id, date: start_date..end_date)
                              .order(date: :asc)
                              # 元のStudyLogの配列から日付と日にちベースのクリア数のみハッシュの配列を生成
                              .map { |log| { date: log.date, study_time: log.study_time } }
      }
    end

    def current_section
        @current_section ||= Section.find_by(params[:section_id])
    end
end