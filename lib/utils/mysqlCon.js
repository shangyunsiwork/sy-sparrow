/*
 * @Author: highsea.高海
 * @Date: 2019-01-14 11:37:13
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */

'use strict';
// const mysql = require('mysql2/promise');
const ERR = Symbol('ERR');

module.exports = class Connection {
  /**
   * 扩展 mysql.Connection.
   * @param {Function} conn mysql.Connection
   * @param {Object} options 配置
   * @property {Number} timeout options.timeout
   * @property {Function} logger options.logger
   * @property {Function} debug options.debug
   * {multipleStatements: false} 多语句查询（流式查询） 待定
   */
  constructor (conn, options) {
    this.conn = conn;

    // mysql 命令：START MYSQL_ COMMIT ROLLBACK
    this.isBegin = false;
    this.isCommit = false;
    this.isRelease = false;

    this.logger = options.logger || console;
    this.debug = options.debug;
    this.timeout = setTimeout(() => {
      if (this.isRelease) return null;
      this.release();
    }, options.timeout);
  }

  [ERR] (code, message) {
    const err = new Error(message);
    err.code = code;
    throw err;
  }

  // /**
  //  * conn.query
  //  *
  //  * @param {sql} sql
  //  * @param {Array} values=[]
  //  * @returns
  //  */
  // async query (sql, values = []) {
  //   const _sql = mysql.format(sql, values);
  //   // if (this.debug) this.logger.info(`SQL query: ${_sql}`);
  //   return this.conn.query(_sql);
  // }

  /**
   * conn.beginTransaction 开始事务
   *
   * @returns
   */
  async beginTransaction () {
    if (this.isBegin) return this[ERR]('MYSQL_TRANSACTION', '"beginTransaction" method can only be started once.');
    this.isBegin = true;
    return this.conn.beginTransaction();
  }

  /**
   * conn.commit 事务提交
   *
   * @returns
   */
  async commit () {
    if (this.isCommit) return this[ERR]('MYSQL_COMMIT', '"commit" method can only be started once.');
    this.isCommit = true;
    return this.conn.commit();
  }

  /**
   * conn.rollback 事务回滚
   *
   * @returns
   */
  async rollback () {
    return this.conn.rollback();
  }

  /**
   * 将连接返回到连接池中重复使用
   *
   * @returns
   */
  async release () {
    if (this.timeout) clearTimeout(this.timeout);
    if (this.isRelease) return null;
    this.isRelease = true;
    // destroy() 从连接池中移除
    // end() 关闭所有
    this.conn.release();
  }
};
