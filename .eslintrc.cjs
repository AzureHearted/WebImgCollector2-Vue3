/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	root: true,
	extends: [
		"plugin:vue/vue3-essential",
		"eslint:recommended",
		"@vue/eslint-config-typescript",
	],
	ignorePatterns: ["dist/**"],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		"no-mixed-spaces-and-tabs": "off",
	},
	// env: {
	// 	browser: true,
	// 	node: true,
	// },
};
