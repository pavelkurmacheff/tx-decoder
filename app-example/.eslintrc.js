module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
            '@typescript-eslint',
            'unused-imports',
            "simple-import-sort"
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:rxjs/recommended',
        'plugin:jest/recommended',
    ],
    parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
    },
    rules: {
        'max-len': ["error", {"code": 120}],
        indent: ["error", 4],
        semi: "off",
        quotes: ['error', 'single', { avoidEscape: true }],
        'comma-dangle': ['error', "always-multiline"],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ["error", "never"],
        'arrow-parens': [2, "as-needed", { "requireForBlockBody": true }],
        'linebreak-style': ["error", "unix"],
        "@typescript-eslint/semi": ["error"],
        'no-trailing-spaces': "error",
        'eol-last': ["error", "always"],
        'array-element-newline': ["error", "consistent"],
        'array-bracket-newline': ["error", { "multiline": true }],
        'max-statements-per-line': ["error", { "max": 1 }],
        'function-call-argument-newline': ["error", "consistent"],
        "func-call-spacing": "off",
        "@typescript-eslint/func-call-spacing": ["error"],
        'object-property-newline': ["error", { "allowAllPropertiesOnSameLine": true }],
        'object-curly-newline': ["error", { "consistent": true }],
        'key-spacing': ["error", { "mode": "strict" }],

        'jest/expect-expect': 0,

        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",

        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/member-ordering': 'error',

        '@typescript-eslint/no-unsafe-return': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/restrict-plus-operands': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-floating-promises': 0,
        '@typescript-eslint/no-unsafe-call': 0,
        '@typescript-eslint/unbound-method': 0,
        '@typescript-eslint/restrict-template-expressions': 0,
        '@typescript-eslint/prefer-regexp-exec': 0,
        "@typescript-eslint/naming-convention": [
            "error",
            {
                "selector": "parameter",
                "format": ["camelCase"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "memberLike",
                "modifiers": ["private"],
                "format": ["camelCase"],
                "leadingUnderscore": "allow"
            },
            {
                "selector": "typeLike",
                "format": ["PascalCase"]
            },
        ],

        'rxjs/no-ignored-subscribe': 'error',

        'rxjs/no-implicit-any-catch': 0,
        'rxjs/no-unsafe-takeuntil': 0,
        'rxjs/no-subject-value': 0,
        'rxjs/no-nested-subscribe': 0,
        'rxjs/no-unsafe-subject-next': 0,

        'rxjs/no-ignored-error': 'error',

        'lines-between-class-members': 'error',
        'padding-line-between-statements': 'error',
        'multiline-ternary': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': 0,
    },
    overrides: [{
        files: '**/*.test.ts',
        rules: {
            'max-len': ["error", {
                "code": 180,
                "ignoreComments": true,
                "ignoreUrls": true,
                ignorePattern: '^import .*',
                "ignoreTrailingComments": true,
                "ignoreStrings": true,
            }],
        }
    },{
        files: '**/test/*.ts',
        rules: {
            'max-len': ["error", {
                "code": 180,
                "ignoreComments": true,
                "ignoreUrls": true,
                ignorePattern: '^import .*',
                "ignoreTrailingComments": true,
                "ignoreStrings": true,
            }],
        }
    },{
        files: '**/*.mock.ts',
        rules: {
            'max-len': ["error", {
                "code": 180,
                "ignoreComments": true,
                "ignoreUrls": true,
                ignorePattern: '^import .*',
                "ignoreTrailingComments": true,
                "ignoreStrings": true,
            }],
        }
    },{
        files: '**/*.data.ts',
        rules: {
            'max-len': ["error", {
                "code": 180,
                "ignoreComments": true,
                "ignoreUrls": true,
                ignorePattern: '^import .*',
                "ignoreTrailingComments": true,
                "ignoreStrings": true,
            }],
        }
    }],
};
