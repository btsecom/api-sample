FROM node:14-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./

RUN apk --no-cache --virtual build-dependencies add \
        python \
        make \
        g++
RUN yarn install && yarn cache clean

ARG BUILD_DATE
ARG GIT_REV

LABEL org.label-schema.build-date=$BUILD_DATE
LABEL org.label-schema.vcs-ref=$GIT_REV
