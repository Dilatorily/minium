module.exports = {
  '*.@(j|t)s?(x)': 'eslint --fix',
  '*.ts?(x)': () => 'tsc',
};
