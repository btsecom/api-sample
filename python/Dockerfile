FROM python:3.9

RUN pip3 install 'poetry>=1.0.0'

RUN mkdir -p /app
WORKDIR /app

COPY poetry.lock ./
COPY pyproject.toml ./
COPY api ./
COPY .env ./

RUN poetry install

ARG BUILD_DATE
ARG GIT_REV

LABEL org.label-schema.build-date=$BUILD_DATE
LABEL org.label-schema.vcs-ref=$GIT_REV

