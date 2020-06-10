/*
 * @Author: shangyun.si
 * @Date: 2020-06-10 13:53:10
 * @Last Modified by: shangyun.si
 * @Last Modified time: 2020-06-10 14:04:42
 */
/* koa 引用  */
const Koa = require('koa');
const Router = require('koa-router');
const compose = require('koa-compose');

/* 参数格式化、参数校验 */
const { paramFormat, paramSchema, } = require('./middleware/params');
/* 中间键 */
const MD = require('./middleware');
/* 工具函数 */
const { initFactory, } = require('./utils/utils');
/* 日志 */
const debug = require('./utils/debug');
const logger = debug('APP');

// 初始化路由
const INIT_ROUTERS = Symbol('INIT_ROUTERS');
// 错误捕获
const ERROR = Symbol('ERROR');

/**
 * Application
 */
class Application {
  constructor (opts) {
    // 初始化配置
    this.options = Object.assign(Application.options, opts);

    this.app = new Koa();

    const { dir, middleware, } = this.options;

    // dao、sequelize、biz、service、controllers 初始化
    this.dao = initFactory.default(dir.src + '/' + dir.dao, this);
    this.sequelize = initFactory.default(dir.src + '/' + dir.sequelize, this);
    this.biz = initFactory.default(dir.src + '/' + dir.biz, this);
    this.services = initFactory.default(dir.src + '/' + dir.services, this);
    this.controllers = initFactory.default(dir.src + '/' + dir.controller, this, true);
    // schema 初始化必须在controllers之后
    initFactory.schema(dir.src + '/' + dir.schema, this);

    // koa初始化
    this.app.proxy = true;
    this.app.use(compose(middleware));

    // router初始化
    this[INIT_ROUTERS]();
    // 设置 err
    this.app.on('error', this[ERROR]);
  }

  static get options () {
    return {
      // 日志组件
      logger: logger,
      host: '0.0.0.0',
      env: 'base',
      port: 3000,
      name: 'sparrow',
      dir: {
        src: 'dist',
        controller: 'controller',
        services: 'services',
        biz: 'biz',
        schema: 'schema',
        dao: 'dao',
        sequelize: 'sequelize',
      },
      middleware: MD,
      mysql: {
        sync: {
          database: 'base_sync',
          user: 'root',
          password: '123456',
          // password: 'pwdroot',
          // host: '10.0.34.16',
          host: 'localhost',
          port: 3306,
          debug: true,
        },
      },
      sequelize: {
        sync: {
          database: 'base_sync',
          user: 'root',
          password: '123456',
          config: {
            host: 'localhost',
            port: 3306,
            debug: true,
            dialect: 'mysql',
          },
        },
      },
      hooks: {
        // params 之后  schame 之前的钩子
        beforeRouter: async (ctx, next) => { await next(); },
      },
    };
  }

  /**
   * 初始化路由
   */
  [INIT_ROUTERS] () {
    const router = new Router();
    /** 读取 controllors */
    const keys = Object.keys(this.controllers);
    const { beforeRouter, } = this.options.hooks;
    const app = this.app;
    /** 遍历controller */
    keys.forEach(key => {
      /** 读取controller的实例及路由 */
      const { instance, cls, } = this.controllers[key];
      const paths = cls.$path;
      paths.forEach(params => {
        let { method, executer, path, schema, } = params;
        /** 添加路由 */
        router[method.toLowerCase()](path, paramFormat(), beforeRouter, paramSchema(schema), async ctx => {
          this.app.ctx = ctx;
          await instance[executer].bind(this)(ctx);
        });
      });
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  /**
   * 错误处理
   */
  [ERROR] (err, ctx) {
    if (err.bcode) {
      let { bcode, message, } = err;
      let { method, url, header, } = ctx.request;
      let resHeader = ctx.response.header;
      logger.error(new Date().toLocaleString(),
        `bcode:${bcode} url(${method})[${url}] httpCode(${ctx.status}) requestID: ${resHeader['x-request-id']} referer(${header.referer})`,
        message);
    } else {
      logger.error('\n===未捕获的错误=== ', err);
      if (ctx) {
        ctx.body = {
          code: 40000,
          message: `出错了-未捕获的错误，\n${err.message} \n ${debug ? err.stack : ''}`,
        };
      }
    }
  }

  /**
   * 启动
   */
  start () {
    const { port, host, logger, env, } = this.options;
    this.app.listen(port, host, () => {
      logger.info({ event: 'execute', }, `API server listening on ${host}:${port}, in ${env}`);
    });
  }
}

module.exports = Application;