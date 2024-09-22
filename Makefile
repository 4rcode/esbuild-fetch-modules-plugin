DENO := ${HOME}/.deno/bin/deno

.PHONY: all
all: clean lint coverage build

.PHONY: build
build: compile
	mkdir -p dist/node
	cp -r src/node/. dist/node
	cp dist/*.{js,ts} dist/node
	cd dist/node && \
		${DENO} run --no-lock -A npm:npm pack
	cp dist/node/*.tgz dist/esbuild-fetch-modules-plugin.tgz
	rm -r dist/node tmp

.PHONY: clean
clean:
	rm -rf coverage src/test/dist

.PHONY: compile
compile: ${DENO}
	rm -rf dist
	${DENO} run -A src/cmd/build.ts
	${DENO} run -A npm:typescript/tsc

.PHONY: coverage
coverage: test
	${DENO} coverage
	${DENO} coverage --html

.PHONY: format
format: node_modules
	${DENO} run -A npm:prettier --write .

.PHONY: lint
lint: node_modules
	${DENO} run -A npm:prettier --check .
	${DENO} lint

node_modules: ${DENO}
	git config core.hookspath src/git
	${DENO} cache --node-modules-dir npm:prettier

.PHONY: pre-commit
pre-commit: lint coverage

.PHONY: test
test: ${DENO}
	${DENO} test -A --coverage

${DENO}:
	curl -fsSL https://deno.land/install.sh | sh
