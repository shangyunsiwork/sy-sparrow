/*
 * @Author: highsea.高海
 * @Date: 2019-01-14 10:26:47
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */
// https://github.com/posquit0/koa-rest-api-boilerplate

'use strict';

const bunyan = require('bunyan');
const { myType, } = require('@xy/util');
const assert = require('assert');

function reqSerializer (ctx = {}) {
  return {
    method: ctx.method,
    path: ctx.path,
    // url: ctx.url,
    headers: ctx.headers,
    rawBody: ctx.request.rawBody,
    // koaBody: ctx.request.body,
    // protocol: ctx.protocol,
    // ip: ctx.ip,
    // query: ctx.query,
  };
}

// function resBodySerializer ({ status, code, message, } = {}) {
//   const body = { status, message, };
//   if (code) {
//     body.code = code;
//   }
//   return body;
// }

function resSerializer (ctx = {}) {
  return {
    statusCode: ctx.status,
    responseTime: ctx.responseTime,
    // type: ctx.type,
    // headers: (ctx.response || {}).headers,
    // body: resBodySerializer(ctx.body),
  };
}

/**
 * Return middleware that attachs logger to context and
 * logs HTTP request/response.
 *
 * @param {Object} options={} - Optional configuration.
 * @param {Object} options.logger - Logger instance of bunyan.
 * @return {function} Koa middleware.
 */
function log (options = {}) {
  const { logger = null, } = options;

  assert.ok(myType(logger) === 'object', new TypeError('Logger required'));

  return async (ctx, next) => {
    const startTime = new Date();
    ctx.log = logger.child({ reqId: ctx.reqId, });
    ctx.log.addSerializers({
      req: reqSerializer,
      res: resSerializer,
      err: bunyan.stdSerializers.err,
    });

    ctx.log.info({ req: ctx, event: 'request', }, ` <<<=== req start - id: ${ctx.reqId}`);

    try {
      await next();
    } catch (err) {
      // ctx.log.error({ err, event: 'error', }, ` **** req 未处理的异常: ${ctx.reqId}`);
      throw err;
    }

    ctx.responseTime = new Date() - startTime;
    ctx.log.info(
      {
        req: ctx,
        res: ctx,
        event: 'response',
      },
      ` ===>>> res ok done - id: ${ctx.reqId}`
    );
  };
}

module.exports = log;
