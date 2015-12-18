# Statusbar
#
# VERSION               1.0.0

FROM node:5
MAINTAINER me@yanbingbing.com

ENV HTTP_PORT 80

ADD . /app
WORKDIR /app

RUN npm --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist install

EXPOSE 80

CMD ["npm", "start"]
