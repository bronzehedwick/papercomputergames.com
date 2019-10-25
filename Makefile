SRC := ./src
BUILD := ./public

default: build templates

help: ## Prints help for targets with comments.
	@grep -E '^[a-zA-Z._-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Copy source files to build directory.
	@rsync -a --delete ${SRC}/ ${BUILD}/

clean: ## Remove build directory.
	@if [ -d public ]; then rm -rf ${BUILD}; fi && mkdir ${BUILD}

web: ## Push the site to the server.
	@rsync --recursive --delete --rsh=ssh --exclude=".*" --quiet public/ waitstaff_deploy:/usr/local/www/papercomputergames.com

serve: ## Start simple python webserver in the background.
	@python -m SimpleHTTPServer > /dev/null 2>&1 &

stop: ## Stop running python webserver.
	@pgrep python -m SimpleHTTPServer | xargs kill

templates: ## Compile mustache-style SVG templates.
	@./svg-templates.sh
