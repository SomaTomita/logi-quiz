# コンテナを構築するための指示

FROM ruby:latest

# Rubyのライブラリを管理するためのシステムをビルド時にDockerに渡すパラメータを指定
ARG RUBYGEMS_VERSION=3.4.6

RUN mkdir /api

WORKDIR /api

# Dockerfileを実行しているホストからコンテナ内でもGemfileとGemfile.lockと同じ依存関係を持つことができる。
COPY Gemfile /api/Gemfile

COPY Gemfile.lock /api/Gemfile.lock

RUN gem update --system ${RUBYGEMS_VERSION} && \
    bundle install

# Dockerfileが存在するディレクトリ（.）のすべてのファイルとディレクトリをコンテナの/apiディレクトリにコピー
COPY . /api

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
# コンテナが実行される際にデフォルトで実行されるコマンドを指定
ENTRYPOINT ["entrypoint.sh"]
CMD ["rails", "server", "-b", "0.0.0.0"]
