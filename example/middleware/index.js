/*
 * @Author: shangyun.si
 * @Date: 2020-07-05 00:07:43
 * @Last Modified by: shangyun.si
 * @Last Modified time: 2020-07-05 00:46:07
 */

'use strict';

// Load APM on production environment
// const apm = require('./apm');

import koaBody from 'koa-body';
import cors from '@koa/cors';
import views from 'koa-views';
import errorHandler from './errorHandler';
import favicon from 'koa-favicon';
import serve from 'koa-static';
import requestId from './requestId';
import responseHandler from './responseHandler';
import { join, parse, } from 'path';

import logMiddleware from './log';
import bunyan from 'bunyan';
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
const mdViews = views(join(__dirname, '..', '/views'), {
  extension: 'ejs',
});

export default [
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
