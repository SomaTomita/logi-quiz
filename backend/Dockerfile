FROM ruby:3.2.2

RUN apt-get update && apt-get install -y nginx default-mysql-client

ARG RUBYGEMS_VERSION=3.4.6

ENV RAILS_ENV=production

RUN mkdir /api
WORKDIR /api

COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY Gemfile /api/Gemfile
COPY Gemfile.lock /api/Gemfile.lock

RUN gem update --system ${RUBYGEMS_VERSION} && \
    bundle install

COPY . /api

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
CMD ["rails", "server", "-b", "0.0.0.0"]