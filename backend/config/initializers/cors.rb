
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins_list = ENV.fetch("CORS_ORIGINS", "localhost:3000,https://logi-quiz.com").split(",").map(&:strip)
    origins(*origins_list)

    resource "*",
      headers: :any,
      expose: ["access-token", "expiry", "token-type", "uid", "client"],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end