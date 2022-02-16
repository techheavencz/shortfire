module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: [
		"@typescript-eslint"
	],
	extends: [
		"plugin:@typescript-eslint/recommended"
	],
	rules:{
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/explicit-boundary-types": "off"
	}
}
