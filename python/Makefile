HELP_DESC="This is to build docker images for btse-api-python"
include Makefile.help

TARGET = btse-api-python
GIT_REV := $(shell git rev-parse --short HEAD)
BUILD_DATE := $(shell date -u +'%Y-%m-%dT%H:%M:%SZ')
BUILD_ARGS = --build-arg GIT_REV="$(GIT_REV)" --build-arg BUILD_DATE="$(BUILD_DATE)"

ifeq (run, $(firstword $(MAKECMDGOALS)))
  RUN_ARGS = $(wordlist 2, $(words $(MAKECMDGOALS)), $(MAKECMDGOALS))
endif

.PHONY: btse-api-python
btse-api-python: ## build docker image for btse-api-python runtime environment
	docker-compose build $(BUILD_ARGS) $(TARGET)

.PHONY: run
run:
	docker-compose run --rm $(TARGET) poetry run $(RUN_ARGS)
