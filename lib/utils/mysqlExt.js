/*
 * @Author: shangyun.si
 * @Date: 2020-07-05 00:20:51
 * @Last Modified by: shangyun.si
 * @Last Modified time: 2020-07-05 00:23:08
 */
/* eslint-disable no-param-reassign */

'use strict';
// https://github.com/sidorares/node-mysql2/blob/master/documentation/Promise-Wrapper.md
const mysql = require('mysql2/promise');
const Emitter = require('events');
const myType = require('./myType');
const Connection = require('./mysqlCon');
const CHECK = Symbol('CHECK');
const INIT = Symbol('INIT');
const SLEEP = Symbol('SLEEP');
const WHERE = Symbol('WHERE');
const ORDERS = Symbol('ORDERS');
const LIMIT = Symbol('LIMIT');
const SELECTCOLUMNS = Symbol('SELECTCOLUMNS');
module.exports = class MysqlExt extends Emitter {
  /**
   * 扩展 mysql2
   *
   * @param {Object} opt 配置
   * @property {String} opt.host  * 地址
   * @property {Number} opt.port  * 端口
   * @property {String} opt.user  * 用户名
   * @property {String} opt.password  * 密码
   * @property {String} opt.database  * 库名
   * @property {Number} opt.retry  断连重试，默认 10 次
   * @property {Number} opt.connectionLimit  连接池数，默认：5
   * @property {Number} opt.connectTimeout  超时自动释放，默认：30s
   * @property {Boolean} opt.supportBigNumbers 处理大数字（BIGINT和DECIMAL）默认开启
   * @property {Object} opt.logger   日志，默认：console
   * @property {Boolean} opt.debug   debug
   */
  constructor (opt) {
    let options = Object.assign(MysqlExt.options, opt);
    const { host, port, user, password, database, connectionLimit, supportBigNumbers, dateStrings, } = options;

    if (!(host && user && database)) {
      const error = new Error('Mysql options required parameters: host, user, database.');
      error.code = 'MYSQL_OPTIONS_INVALID';
      throw error;
    }

    super();

    this.options = {
      host,
      port,
      user,
      password,
      database,
      connectionLimit,
      supportBigNumbers,
      dateStrings,
    };

    this.logger = options.logger;
    this.retry = options.retry;
    this.retryInterval = options.retryInterval;
    this.debug = options.debug;
    this.connectTimeout = options.connectTimeout;
    this.countSQL = 'SELECT COUNT(*) as count FROM ??';
    this[INIT]();
  }

  /**
   * 默认参数
   *
   * @static
   */
  static get options () {
    return {
      host: this.host,
      port: 3306,
      user: this.user,
      password: '',
      retry: 10,
      retryInterval: 1000,
      connectionLimit: 5,
      connectTimeout: 1000 * 30,
      supportBigNumbers: true,
      logger: console,
      debug: false,
    };
  }

  /**
   * 初始化 mysql 连接池
   * createPoolCluster 集群待支持
   */
  [INIT] () {
    if (this.debug) {
      this.logger.log(
        `Mysql 初始化中 ... \n option: ${this.options.host}:${this.options.port} - ${this.options.database}`
      );
    }
    if (this.pool) return;
    this.pool = mysql.createPool(this.options);
    this.check()
      .then(flag => {
        if (flag) this.logger.log('Mysql connect sucess. \n\n\n');
      })
      .catch(err => {
        this.logger.error('Mysql (%s) 检查连接错误 : %o', JSON.stringify(this.options), err);
      });
  }

  /**
   * 延迟
   *
   * @param {Number} ms 毫秒
   * @returns Promise
   */
  [SLEEP] (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 连接状态检查
   *
   * @returns Boolean
   */
  async check () {
    this[CHECK]();
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (err) {
      this.logger.error(err);
      if (this.retry <= 0) {
        this.logger.error('Mysql: connect failure.');
        return false;
      }
      if (err.code === 'ECONNREFUSED') {
        await this[SLEEP](this.retryInterval);
        this[INIT]();
        this.retry -= 1;
        this.logger.error('Mysql err: %s;\n connect retry %s', err.message, this.retry);
        return false;
      }
      this.emit('error', err);
    }
  }

  /**
   * 调用 mysql.for mat
   *
   * @param {*} sql
   * @param {*} [val=[]]
   * @returns formatSql
   */
  format (sql, val = []) {
    return mysql.format(sql, val);
  }

  escapeId (value) {
    return mysql.escapeId(value, false);
  }

  [WHERE] (where) {
    if (!where) {
      return '';
    }
    const wheres = [];
    const values = [];
    for (const key in where) {
      const value = where[key];
      if (myType(value) === 'array') {
        wheres.push('?? IN (?)');
      } else {
        if (value === null || value === undefined) {
          wheres.push('?? IS ?');
        } else {
          wheres.push('?? = ?');
        }
      }
      values.push(key);
      values.push(value);
    }
    if (wheres.length > 0) {
      return this.format(' WHERE ' + wheres.join(' AND '), values);
    }
    return '';
  }

  [SELECTCOLUMNS] (table, columns) {
    if (!columns) {
      columns = '*';
    }
    let sql;
    if (columns === '*') {
      sql = this.format('SELECT * FROM ??', [ table, ]);
    } else {
      sql = this.format('SELECT ?? FROM ??', [ columns, table, ]);
    }
    return sql;
  }

  [ORDERS] (orders) {
    if (!orders) {
      return '';
    }
    if (myType(orders) === 'string') {
      orders = [ orders, ];
    }
    const values = [];
    for (let i = 0, l = orders.length; i < l; i++) {
      const value = orders[i];
      if (myType(value) === 'string') {
        values.push(this.escapeId(value));
      } else if (myType(value) === 'array') {
        // value format: ['name', 'desc'], ['name'], ['name', 'asc']
        let sort = String(value[1]).toUpperCase();
        if (sort !== 'ASC' && sort !== 'DESC') {
          sort = null;
        }
        if (sort) {
          values.push(this.escapeId(value[0]) + ' ' + sort);
        } else {
          values.push(this.escapeId(value[0]));
        }
      }
    }
    return ' ORDER BY ' + values.join(', ');
  }

  [LIMIT] (limit, offset) {
    if (!limit || myType(limit) !== 'number') {
      return '';
    }
    if (myType(offset) !== 'number') {
      offset = 0;
    }
    return ' LIMIT ' + offset + ', ' + limit;
  }

  /**
   * 封装查询接口
   *
   * @param {string} formatSql
   * @param {array} values
   * @returns result
   */
  async query (sql, val) {
    this[CHECK]();
    let start = Date.now();
    let _sql = sql;
    if (val) _sql = this.format(sql, val);

    if (this.debug) this.logger.log(`\n [mysql_SQL] :\n${_sql} \n`);
    let [ result, ] = await this.pool.query(_sql);
    if (this.debug) this.logger.info('query result: ', JSON.stringify(result));

    this.emit('runtime', `${Date.now() - start} ms; sql: ${_sql}`);
    return result;
  }

  /**
   * 封装count接口
   * @param {string} table
   * @param {obj} where
   * @returns count
   */
  async count (table, where) {
    const rows = await this.query(this.format(this.countSQL, [ table, ]) + this[WHERE](where));
    return rows[0].count;
  }

  /**
   * 封装select接口
   * @param {string} table
   * @param {obj} options
   * @returns result
   */
  async select (table, options) {
    options = options || {};
    const sql =
      this[SELECTCOLUMNS](table, options.columns) +
      this[WHERE](options.where) +
      this[ORDERS](options.orders) +
      this[LIMIT](options.limit, options.offset);
    const result = await this.query(sql);
    return result;
  }

  /**
   * 封装get接口
   * @param {string} table
   * @param {obj} options
   * @returns result[0] || null
   */
  async get (table, where, options) {
    options = options || {};
    options.where = where;
    options.limit = 1;
    options.offset = 0;
    const result = await this.select(table, options);
    return (result && result[0]) || null;
  }

  /**
   * 封装delete方法
   * @param {string} table
   * @param {obj} where
   *
   */
  async delete (table, where) {
    const sql = this.format('DELETE FROM ??', [ table, ]) + this[WHERE](where);
    const result = await this.query(sql);
    return result;
  }

  /**
   * 封装update方法
   * @param {String} table
   * @param {Object} row
   * @param {Object} options
   */
  async update (table, row, options) {
    options = options || {};
    if (!options.columns) {
      options.columns = Object.keys(row);
    }
    if (!options.where) {
      if (!('id' in row)) {
        throw new Error('Can not auto detect update condition, please set options.where, or make sure obj.id exists');
      }
      options.where = {
        id: row.id,
      };
    }

    const sets = [];
    const values = [];
    for (let i = 0; i < options.columns.length; i++) {
      const column = options.columns[i];
      sets.push('?? = ?');
      values.push(column);
      values.push(row[column]);
    }
    const sql =
      this.format('UPDATE ?? SET ', [ table, ]) + this.format(sets.join(', '), values) + this[WHERE](options.where);
    const result = await this.query(sql);
    return result;
  }

  /**
   * 封装insert方法
   * @param {String} table
   * @param {Object} row
   * @param {Object} options
   */
  async insert (table, rows, options) {
    options = options || {};
    let firstObj;
    if (myType(rows) === 'array') {
      firstObj = rows[0];
    } else {
      firstObj = rows;
      rows = [ rows, ];
    }
    if (!options.columns) {
      options.columns = Object.keys(firstObj);
    }

    const params = [ table, options.columns, ];
    const strs = [];
    for (let i = 0; i < rows.length; i++) {
      const values = [];
      const row = rows[i];
      for (let j = 0; j < options.columns.length; j++) {
        values.push(row[options.columns[j]]);
      }
      strs.push('(?)');
      params.push(values);
    }
    const sql = this.format('INSERT INTO ??(??) VALUES' + strs.join(', '), params);
    const result = await this.query(sql);
    return result;
  }

  /**
   * 获取一个连接
   *
   * @returns
   */
  async getConnection () {
    this[CHECK]();
    const conn = await this.pool.getConnection();
    const { connectTimeout, logger, debug, } = this;
    return new Connection(conn, {
      connectTimeout,
      logger,
      debug,
    });
  }

  /**
   * 事务处理
   *
   * @param {function} callback
   */
  async transaction (callback) {
    const conn = await this.getConnection();
    try {
      await conn.beginTransaction();
      await callback(conn);
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  /**
   * 释放连接
   *
   */
  async destroy () {
    try {
      await this.pool.end();
      this.pool = null;
      this.logger.log('Mysql destroy ok.');
    } catch (err) {
      this.logger.error(err);
      await this[SLEEP](2000);
      await this.destroy();
    }
  }

  [CHECK] () {
    if (!this.pool) {
      const error = new Error('Mysql is not initial');
      error.code = 'MYSQL_NOT_INITIAL';
      throw error;
    }
  }
};
