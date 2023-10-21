FROM node:18.16.0-slim

WORKDIR /front
ENV CI=true

COPY ./app/package.json ./app/yarn.lock /front/

COPY ./app /front
CMD ["yarn", "start"]
