// process.env.NODE_ENV = 'UNITTEST';

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    preset: 'ts-jest',
    testRunner : 'jest-jasmine2',
    silent: true,
    // detectOpenHandles: true
};
