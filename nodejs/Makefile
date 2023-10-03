HELP_DESC="This is to build docker images for api-sample-nodejs"
include Makefile.help

TARGET = api-sample-nodejs
GIT_REV := $(shell git rev-parse --short HEAD)
BUILD_DATE := $(shell date -u +'%Y-%m-%dT%H:%M:%SZ')
BUILD_ARGS = --build-arg GIT_REV="$(GIT_REV)" --build-arg BUILD_DATE="$(BUILD_DATE)"

ifeq (run, $(firstword $(MAKECMDGOALS)))
  RUN_ARGS = $(wordlist 2, $(words $(MAKECMDGOALS)), $(MAKECMDGOALS))
endif

.PHONY: api-sample-nodejs
api-sample-nodejs: ## build docker image for api-sample-nodejs runtime environment
	docker-compose build $(BUILD_ARGS) $(TARGET)

.PHONY: run
run:
	docker-compose run --rm $(TARGET) node $(RUN_ARGS)
