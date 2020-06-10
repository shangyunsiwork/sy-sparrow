/*
 * @Author: shangyun.si
 * @Date: 2020-06-10 14:34:29
 * @Last Modified by: shangyun.si
 * @Last Modified time: 2020-06-10 16:41:13
 */

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
  constructor () {
    this.insertSQL = 'insert into ?? set ?';
    this.insertAllSQL = 'insert into ?? (??) values ?';
    this.updateSQL = 'update ?? set ?? = ? where ?? = ?';
    this.selectSQL = 'select ?? from ?? where ?? = ?';
    this.deleteSql = 'delete from ?? where ?? = ?';
  }
}

module.exports = Dao;
