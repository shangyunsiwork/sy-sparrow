'use strict';

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
