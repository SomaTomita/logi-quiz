FROM ruby:3.2.2

RUN apt-get update && apt-get install -y default-mysql-client curl && \
    rm -rf /var/lib/apt/lists/*

ARG RUBYGEMS_VERSION=3.4.6

ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true

RUN mkdir /api
WORKDIR /api

COPY Gemfile /api/Gemfile
COPY Gemfile.lock /api/Gemfile.lock

RUN gem update --system ${RUBYGEMS_VERSION} && \
    bundle config set --local without 'development test' && \
    bundle install

COPY . /api

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]