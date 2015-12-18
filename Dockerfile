# Statusbar
#
# VERSION               1.0.0

FROM node:5
MAINTAINER me@yanbingbing.com

ENV HTTP_PORT 3000

ADD . /app
WORKDIR /app

RUN npm install

EXPOSE 3000
ENTRYPOINT ["npm", "start"]
