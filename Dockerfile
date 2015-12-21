# Statusbar
#
# VERSION               1.0.0

FROM daocloud.io/node:5
MAINTAINER me@yanbingbing.com

ENV HTTP_PORT 8000

COPY . /app
WORKDIR /app

RUN npm --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist install

EXPOSE 8000

CMD ["npm", "start"]
