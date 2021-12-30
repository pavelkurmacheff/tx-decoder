require('jest-preset-angular/ngcc-jest-processor');

module.exports = {
    roots: ['<rootDir>/src'],
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    setupFiles: ['intersection-observer', 'core-js'],
    resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
    transformIgnorePatterns: ['/node_modules/(?!@funfair-tech|@datorama\/akita|.*\\.mjs$)'],
    transform: {
        '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular',
    },
    clearMocks: true,
};
