const debug = require('debug');

module.exports = (namespace) => {
  const info = debug(`${namespace}/info`);
  info.enabled = true;

  const warn = debug(`${namespace}/warn`);
  warn.enabled = true;

  const log = debug(`${namespace}/log`);
  log.enabled = true;

  const error = debug(`${namespace}/error`);
  error.enabled = true;

  return {
    info,
    warn,
    log,
    error,
  };
};
