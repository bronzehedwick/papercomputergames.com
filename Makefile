SRC := ./src
BUILD := ./public

default: build templates

build:
	@rsync -a --delete ${SRC}/ ${BUILD}/

clean:
	@if [ -d public ]; then rm -rf ${BUILD}; fi && mkdir ${BUILD}

web:
	@git push origin master && git push deploy master

serve:
	@python -m SimpleHTTPServer > /dev/null 2>&1 &

stop:
	@pgrep python -m SimpleHTTPServer | xargs kill

templates:
	@./svg-templates.sh
