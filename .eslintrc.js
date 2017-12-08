module.exports = {
	extends: ['eslint-config-particle'],
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module'
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
		worker: true,
		serviceworker: true
	},
	rules: {
		'func-names': ['error', 'never']
	}
};
