const apps = [
  {
    name: 'BeventRelay',
    script: './src/index.ts',
    interpreter: 'bun',
    error_file: './logs/error.log',
    out_file: './logs/combined.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
  },
];

module.exports = {
  apps,
};
