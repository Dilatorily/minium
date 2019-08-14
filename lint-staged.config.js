module.exports = {
  '*.@(j|t)s?(x)': ['eslint --fix', 'git add'],
  '*.ts?(x)': () => 'tsc',
};
