FROM node:lts-slim

WORKDIR /front
ENV CI=true

COPY ./app/package.json ./app/yarn.lock /front/

COPY ./app /front
CMD ["yarn", "start"]
