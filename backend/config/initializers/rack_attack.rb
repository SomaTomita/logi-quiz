Rack::Attack.throttle('admin/analytics', limit: 10, period: 60) do |req|
  req.ip if req.path.start_with?('/admin/analytics')
end
