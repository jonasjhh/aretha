const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    { ignores: ['dist/**'] },
    js.configs.recommended,
    {
        files: ['build.js', 'eslint.config.js', 'tests/**/*.{js,mjs}'],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        files: ['src/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
                SPECS_CONFIG: 'readonly',
                SwaggerUIBundle: 'readonly',
                SwaggerUIStandalonePreset: 'readonly',
            },
        },
    },
];
