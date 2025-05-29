module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setup.js'],
  globalSetup: './test/globalSetup.js',
  globalTeardown: './test/globalTeardown.js',
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1'
  },
  testTimeout: 30000,
  verbose: true
};
