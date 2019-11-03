module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.@(j|t)s?(x)'],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
