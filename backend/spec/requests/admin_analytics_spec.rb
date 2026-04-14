require 'rails_helper'

RSpec.describe Admin::AnalyticsController, type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:regular_user) { create(:user) }

  let(:admin_headers) do
    admin_user.confirm
    post '/auth/sign_in', params: { email: admin_user.email, password: 'password' }
    response.headers.slice('access-token', 'client', 'uid')
  end

  let(:user_headers) do
    regular_user.confirm
    post '/auth/sign_in', params: { email: regular_user.email, password: 'password' }
    response.headers.slice('access-token', 'client', 'uid')
  end

  # --- Authorization ---

  describe 'authorization' do
    it 'returns 403 for non-admin users' do
      get '/admin/analytics/overview', headers: user_headers
      expect(response).to have_http_status(:forbidden)
    end

    it 'returns 401 for unauthenticated requests' do
      get '/admin/analytics/overview'
      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 200 for admin users' do
      get '/admin/analytics/overview', headers: admin_headers
      expect(response).to have_http_status(:ok)
    end
  end

  # --- Overview ---

  describe 'GET /admin/analytics/overview' do
    it 'returns overview KPI data' do
      get '/admin/analytics/overview', headers: admin_headers

      data = JSON.parse(response.body)['data']
      expect(data).to include(
        'total_users',
        'active_users_7d',
        'active_users_30d',
        'total_attempts',
        'overall_accuracy',
        'questions_in_srs',
        'mastery_rate'
      )
    end
  end

  # --- Topic Accuracy ---

  describe 'GET /admin/analytics/topic_accuracy' do
    it 'returns topic accuracy data with default period' do
      get '/admin/analytics/topic_accuracy', headers: admin_headers
      data = JSON.parse(response.body)['data']
      expect(data).to include('current', 'trend')
    end

    it 'accepts valid period parameter' do
      get '/admin/analytics/topic_accuracy', params: { period: 'daily' }, headers: admin_headers
      expect(response).to have_http_status(:ok)
    end

    it 'falls back to default for invalid period' do
      get '/admin/analytics/topic_accuracy', params: { period: 'invalid' }, headers: admin_headers
      expect(response).to have_http_status(:ok)
    end
  end

  # --- Response Times ---

  describe 'GET /admin/analytics/response_times' do
    it 'returns response time data' do
      get '/admin/analytics/response_times', headers: admin_headers
      data = JSON.parse(response.body)['data']
      expect(data).to include('histogram', 'by_section', 'correctness_correlation')
    end

    it 'uses default bin_size when blank' do
      get '/admin/analytics/response_times', params: { bin_size: '' }, headers: admin_headers
      expect(response).to have_http_status(:ok)
    end

    it 'clamps bin_size to valid range' do
      get '/admin/analytics/response_times', params: { bin_size: '50' }, headers: admin_headers
      expect(response).to have_http_status(:ok)
    end
  end

  # --- Engagement ---

  describe 'GET /admin/analytics/engagement' do
    it 'returns engagement data' do
      get '/admin/analytics/engagement', headers: admin_headers
      data = JSON.parse(response.body)['data']
      expect(data).to include('active_users', 'study_time_distribution', 'session_duration_trend')
    end
  end

  # --- Retention Curves ---

  describe 'GET /admin/analytics/retention_curves' do
    it 'returns retention curve data' do
      get '/admin/analytics/retention_curves', headers: admin_headers
      data = JSON.parse(response.body)['data']
      expect(data).to include('box_distribution', 'retention_by_box', 'time_to_mastery', 'retention_decay', 'fixed_interval_critique')
    end
  end

  # --- Learner Segments ---

  describe 'GET /admin/analytics/learner_segments' do
    it 'returns learner segment data' do
      get '/admin/analytics/learner_segments', headers: admin_headers
      data = JSON.parse(response.body)['data']
      expect(data).to include('segments', 'segment_summary', 'srs_impact_by_segment')
    end

    it 'does not expose user_id in segments' do
      section = create(:section)
      question = create(:question, section: section)
      user = create(:user)
      15.times { create(:question_attempt, :correct, user: user, question: question, response_time_ms: 2000) }

      get '/admin/analytics/learner_segments', headers: admin_headers
      data = JSON.parse(response.body)['data']
      data['segments'].each do |segment|
        expect(segment).not_to have_key('user_id')
      end
    end
  end
end
