process.env.APP_ENV='test';

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    preset: 'ts-jest',
    testRunner : 'jest-jasmine2',
    silent: true,
    // detectOpenHandles: true
};
