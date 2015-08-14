component = ./node_modules/component-hooks/node_modules/.bin/component
lib=$(shell find lib)

default: node_modules components public

node_modules:
	@npm install

components:
	@$(component) install --dev

public: $(lib)
	$(component) build --dev -n $@ -o $@
	@touch $@

test: default
	@open test/support.html

clean:
	@rm -rf public

.PHONY: clean test