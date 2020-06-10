/*
 * @Author: shangyun.si
 * @Date: 2020-06-10 14:34:37
 * @Last Modified by:   shangyun.si
 * @Last Modified time: 2020-06-10 14:34:37
 */

const Sequelize = require('sequelize');

class Dao {
  /**
   * Creates an instance of Dao.
   * escape 待定义
   * @param {*} app
   * @memberof Dao
   */
  constructor (app) {
    const { sequelize, } = app.options;
    this.sequelize = sequelize;
  }

  init () {
    const opt = this.sequelize[this.database];
    this.$db = new Sequelize(opt.database, opt.user, opt.password, opt.config);
  }
}

module.exports = Dao;
