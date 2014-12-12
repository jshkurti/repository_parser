export NODE_ENV=development
test:	
	-@./node_modules/.bin/mocha "test/git_scenario.mocha.js"
	-@./node_modules/.bin/mocha "test/hg_scenario.mocha.js"
	-@./node_modules/.bin/mocha "test/svn_scenario.mocha.js"
	-@./node_modules/.bin/mocha "test/all.mocha.js"	
.PHONY: test