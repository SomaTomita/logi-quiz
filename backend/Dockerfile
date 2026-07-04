# syntax=docker/dockerfile:1

# ---- 共通ベース（ランタイム依存のみ）----
FROM ruby:3.2.2-slim AS base

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends default-mysql-client curl tzdata && \
    rm -rf /var/lib/apt/lists/*

ENV RAILS_LOG_TO_STDOUT=true
WORKDIR /api

COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# ---- production 用 gem ビルド ----
FROM base AS build

ARG RUBYGEMS_VERSION=3.4.6

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends build-essential default-libmysqlclient-dev git && \
    rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./
RUN gem update --system ${RUBYGEMS_VERSION} && \
    bundle config set --local without 'development test' && \
    bundle install && \
    rm -rf /usr/local/bundle/cache

# ---- 開発・テスト用（docker-compose が使用）----
FROM base AS dev

ARG RUBYGEMS_VERSION=3.4.6
ENV RAILS_ENV=development

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends build-essential default-libmysqlclient-dev git && \
    rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./
RUN gem update --system ${RUBYGEMS_VERSION} && bundle install

CMD ["rails", "server", "-b", "0.0.0.0"]

# ---- 本番用（ECS デプロイが使用、最終ステージ = docker build のデフォルト）----
FROM base AS prod

ENV RAILS_ENV=production

COPY --from=build /usr/local/bundle /usr/local/bundle
COPY . .

RUN useradd rails --create-home --shell /usr/sbin/nologin && \
    mkdir -p /api/tmp/pids /api/log /api/storage && \
    chown -R rails:rails /api/tmp /api/log /api/storage
USER rails

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["rails", "server", "-b", "0.0.0.0"]
