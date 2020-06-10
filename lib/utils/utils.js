/*
 * @Author: shangyun.si
 * @Date: 2020-06-10 14:33:04
 * @Last Modified by: shangyun.si
 * @Last Modified time: 2020-06-10 16:38:25
 */

const fs = require('fs');
const { join, } = require('path');
const assert = require('assert');
const debug = require('debug');
const isPlainObject = require('./isPlainObject');
const { MysqlExt, } = require('@xy/orm');
const Sequelize = require('sequelize');
const root = process.cwd();

/**
 * 扫描文件夹
 * @param {*} path
 */
const scanFolder = (path) => {
  const isExists = fs.existsSync(path);

  if (!isExists) {
    debug.log(isExists, `Path ${path} is not exists `);
    return [];
  }
  try {
    const files = fs.readdirSync(path, 'utf-8');
    return files;
  } catch (err) {
    assert.ok(err, `Reader Dir Error ${JSON.stringify(err)}`);
  }
};

/**
 * 初始化
 */
const initFactory = {
  default: function (dir, app, isCtrl) {
    assert.ok(dir, 'Please pass a folder name');
    const path = join(root, dir);

    const files = scanFolder(path);

    const modules = files.reduce((pre, file) => {
      const filePath = join(path, file);
      let Mds = require(filePath);
      if (Mds.default) Mds = Mds.default;

      if (isPlainObject(Mds)) {
        pre[file.replace(/\.js$/, '')] = Mds;
        return pre;
      }
      if (!isCtrl) {
        pre[file.replace(/\.js$/, '')] = new Mds(app);
        return pre;
      }
      pre[file.replace(/\.js$/, '')] = {
        cls: Mds,
        instance: new Mds(app),
      };
      return pre;
    }, {});
    return modules;
  },
  schema: function (dir, app) {
    const schemas = this.default(dir, app);
    const controllers = app.controllers;
    const keys = Object.keys(controllers);
    keys.forEach(key => {
      const { cls, } = controllers[key];
      if (!Object.keys(schemas).includes(key)) return;
      let paths = cls.$path;
      paths.forEach(ctrl => {
        let { executer, } = ctrl;

        if (!Object.keys(schemas[key]).includes(executer)) return;
        ctrl.schema = schemas[key][executer];
      });
    });
  },
  mysql: function (opts) {
    const keys = Object.keys(opts);
    let mysql = {};
    keys.forEach(key => {
      mysql[key] = new MysqlExt(opts[key]);
    });
    return mysql;
  },
  sequelize: function (opts) {
    const keys = Object.keys(opts);
    let sequelize = {};
    keys.forEach(key => {
      const opt = opts[key];
      sequelize[key] = new Sequelize(opt.database, opt.user, opt.password, opt.config);
    });
    return sequelize;
  },
};

module.exports = initFactory;
