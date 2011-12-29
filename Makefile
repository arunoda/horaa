BASE = .
all: test lint doc

test:
	./node_modules/.bin/mocha

lint:
	./node_modules/jshint/bin/hint lib test --config $(BASE)/.jshintrc && echo "Lint Done"

doc:
	./node_modules/jsdoc/app/run.js -t=./node_modules/jsdoc/templates/jsdoc -d=./doc ./lib

.PHONY: test doc
