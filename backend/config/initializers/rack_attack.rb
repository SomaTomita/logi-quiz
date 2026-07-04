# APIレート制限
# 認証系はブルートフォース対策、analyticsは重いクエリの乱用防止
class Rack::Attack
  # コンテナ単位のインメモリストア（タスク1つ運用のため十分。スケールアウト時はRedisへ）
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  # ログイン試行: 同一IPから 5回/20秒
  throttle("auth/sign_in/ip", limit: 5, period: 20.seconds) do |req|
    req.ip if req.path == "/auth/sign_in" && req.post?
  end

  # アカウント登録: 同一IPから 5回/5分
  throttle("auth/sign_up/ip", limit: 5, period: 5.minutes) do |req|
    req.ip if req.path == "/auth" && req.post?
  end

  # パスワードリセット要求: 同一IPから 5回/15分
  throttle("auth/password/ip", limit: 5, period: 15.minutes) do |req|
    req.ip if req.path == "/auth/password" && req.post?
  end

  # BI分析ダッシュボード: 同一IPから 10回/分
  throttle("admin/analytics", limit: 10, period: 60) do |req|
    req.ip if req.path.start_with?("/admin/analytics")
  end
end
