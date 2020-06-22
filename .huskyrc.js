module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'post-merge': 'yarn',
    'pre-commit': 'lint-staged',
    'pre-push': 'yarn test && yarn build',
  },
};
