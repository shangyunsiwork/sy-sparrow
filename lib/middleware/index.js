/*
 * @Author: shangyun.si
 * @Date: 2020-07-05 00:07:43
 * @Last Modified by: shangyun.si
 * @Last Modified time: 2020-07-05 00:36:51
 */

'use strict';

// Load APM on production environment
// const apm = require('./apm');

const koaBody = require('koa-body');
const cors = require('@koa/cors');
const views = require('koa-views');
const errorHandler = require('./errorHandler');
const favicon = require('koa-favicon');
const serve = require('koa-static');
const requestId = require('./requestId');
const responseHandler = require('./responseHandler');
const { join, parse, } = require('path');

const logMiddleware = require('./log');
const bunyan = require('bunyan');
// const loggerConfig = require('../config/logger.js');

/**
 * 日志处理中间件
 */
const mdLogger = logMiddleware({
  logger: bunyan.createLogger(
    Object.assign(
      {
        serializers: bunyan.stdSerializers,
        name: '123',
        streams: [],
      },
    )
  ),
});

/**
 * 生成请求 uuid
 */
const mdRequestId = requestId();

/**
 * 格式化 from， text， json 数据
 */
const mdKoaBody = koaBody({
  enableTypes: [ 'json', 'form', 'text', ],
  textLimit: '2mb',
  formLimit: '1mb',
  jsonLimit: '5mb',
  strict: true,
  multipart: true,
  onerror: function (err, ctx) {
    ctx.throw(422, new Error(`body parse error: ${err}`), { bcode: 20011, });
  },
});

/**
 * 允许跨域
 */
const mdcors = cors({
  origin: '*',
  allowMethods: [ 'GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', ],
  // exposeHeaders: [ 'X-Request-Id', ],
});

/**
 * res 格式化处理
 */
const mdResHandler = responseHandler();
/**
 * res 错误处理
 */
const mdErrorHandler = errorHandler();

/**
 * favicon
 */
const mdFavicon = favicon(join(process.cwd(), './public/favicon.ico'));
/*
 * 静态资源
 */
//                          pwd       path.join('public', 'assets')
const mdAssets = serve(join(process.cwd(), parse('public', 'assets').dir));

/**
 * views
 */
const mdViews = views(join(process.cwd(), 'example/views'), {
  extension: 'ejs',
});

module.exports = [
  mdFavicon,
  mdAssets,
  mdViews,

  mdKoaBody,
  mdcors,
  mdRequestId,
  mdLogger,
  mdResHandler,
  mdErrorHandler,
];
