export default {
	env: {
		// Ensures compatibility with browser APIs and global variables.
		browser: true,
		// For server-side (Node.js) compatibility.
		node: true,
		// Globals common to both Node.js and Browser.
		"shared-node-browser": true,
		es2022: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		sourceType: "module",
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"plugin:prettier/recommended",
	],
	plugins: [
		"@typescript-eslint",
		"prettier",
		"plugin:import/recommended",
		"import",
	],
	rules: {
		eqeqeq: "error",
		"no-var": "error",
		"prefer-const": "warn",
		"@typescript-eslint/no-unused-vars": ["warn"],
		"@typescript-eslint/no-explicit-any": "warn",
		"import/first": "warn",
		"import/order": "warn",
		"import/newline-after-import": "warn",
	},
};
