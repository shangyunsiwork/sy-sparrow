/*
 * @Author: shangyun.si
 * @Date: 2020-06-10 14:32:54
 * @Last Modified by:   shangyun.si
 * @Last Modified time: 2020-06-10 14:32:54
 */

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
