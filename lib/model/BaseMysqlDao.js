/*
 * @Author: shangyun.si
 * @Date: 2020-06-10 14:34:29
 * @Last Modified by:   shangyun.si
 * @Last Modified time: 2020-06-10 14:34:29
 */

const assert = require('assert');
const { MysqlExt, } = require('@xy/orm');

const MYSQL = Symbol('MYSQL');

/**
 * mysql DAO 初始化公共mysql链接
 * ```js
 * const BaseDao = require('{path}/base');
 * const myDao = new BaseDao();
 * // 默认配置读取 config.mysql {
 * //  host: 'localhost',
 * //  user: 'root',
 * //  database: 'center',
 * //  password: ''
 * // }
 * // let [ res ] = await myDao.query('select ?+? as ??', [1, 2, temp]);
 * // res.temp ~ 3
 *```
 * @class Dao
 */
class Dao {
  /**
   * Creates an instance of Dao.
   * escape 待定义
   * @param {*} mysqlOpts
   * @memberof Dao
   */
  constructor (app) {
    const { mysql: mysqlOpts, } = app.options;
    this.mysqlOpts = mysqlOpts;
    this.insertSQL = 'insert into ?? set ?';
    this.insertAllSQL = 'insert into ?? (??) values ?';
    this.updateSQL = 'update ?? set ?? = ? where ?? = ?';
    this.selectSQL = 'select ?? from ?? where ?? = ?';
    this.deleteSql = 'delete from ?? where ?? = ?';
  }

  async init () {
    assert.ok(this.database, '缺少 databse 的定义');

    const opt = this.mysqlOpts[this.database];

    this.logger = opt.logger || console;
    // 开发环境 输出 SQL 日志
    if (opt.debug) opt['debug'] = true;

    if (this[MYSQL]) return this[MYSQL];

    this[MYSQL] = new MysqlExt(opt);

    return this[MYSQL];
  }

  get mysql () {
    return this[MYSQL];
  }

  async query (sql, values = []) {
    let res = await this.mysql.query(this.mysql.format(sql, values));
    return res;
  }
}

module.exports = Dao;
