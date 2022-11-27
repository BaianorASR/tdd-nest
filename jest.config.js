const { moduleExpression } = require('@babel/types');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@test/mocks/(.*)': '<rootDir>/test/__MOCKS__/$1',
    '^@test/utils/(.*)': '<rootDir>/test/utils/$1',
    '^@entities/(.*)': '<rootDir>/src/database/entities/$1',
  },
};
