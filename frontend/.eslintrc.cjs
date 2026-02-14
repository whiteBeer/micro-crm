/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    'root': true,
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript/recommended'
    ],
    rules: {
        'quotes': ['error', 'single'],
        'indent': ['error', 4, { SwitchCase: 1 }],
        'semi': ['error', 'always'],
        '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
        'vue/valid-v-slot': 'off'
    }
};
