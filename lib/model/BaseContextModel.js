/*
 * @Author: shangyun.si
 * @Date: 2020-06-10 14:34:10
 * @Last Modified by:   shangyun.si
 * @Last Modified time: 2020-06-10 14:34:10
 */

'use strict';
// class service 类
class BaseContextModel {
  constructor (ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.controllers = ctx.controllers;
    this.services = ctx.services;
    this.dao = ctx.dao;
    this.sequelize = ctx.sequelize;
  }
}

module.exports = BaseContextModel;
