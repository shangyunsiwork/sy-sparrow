/*
 * @Author: highsea.高海
 * @Date: 2019-01-14 10:39:50
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */
// https://github.com/posquit0/koa-rest-api-boilerplate

'use strict';

// const Log = console;
/**
 * HTTP Status codes
 */
const statusCodes = {
  CONTINUE: 100,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIME_OUT: 504,
};

// TODO 业务错误码列表
// 10000: 系统错误码
// ...
// 20000: 成功
// ...
// 20001: 参数错误
// ...
// 40000: 缓存错误
// ...
// 50000: DB错误
// ...
// 60000: 文件错误

function responseHandler () {
  return async (ctx, next) => {
    ctx.res.statusCodes = statusCodes;
    ctx.statusCodes = ctx.res.statusCodes;

    // ctx.res.success = ({ statusCode, data = null, message = null, }) => {
    //   if (!!statusCode && statusCode < 400) ctx.status = statusCode;
    //   else if (!(ctx.status < 400)) ctx.status = statusCodes.OK;

    //   ctx.body = { code: 20000, data, message, };
    // };

    ctx.res.fail = ({ statusCode, code, data = null, message = null, }) => {
      if (!!statusCode && (statusCode >= 400 && statusCode < 500)) ctx.status = statusCode;
      else if (!(ctx.status >= 400 && ctx.status < 500)) ctx.status = statusCodes.BAD_REQUEST;
      ctx.body = { code, data, message, };
    };

    // ctx.res.error = ({ statusCode, code, data = null, message = null, }) => {
    //   if (!!statusCode && (statusCode >= 500 && statusCode < 600)) ctx.status = statusCode;
    //   else if (!(ctx.status >= 500 && ctx.status < 600)) ctx.status = statusCodes.INTERNAL_SERVER_ERROR;

    //   ctx.body = { code, data, message, };
    // };

    ctx.res.ok = msg => {
      ctx.status = statusCodes.OK;
      const data = ctx.body;
      const message = msg || 'success';
      ctx.body = { code: 20000, data, message, };
    };

    await next();
  };
}

module.exports = responseHandler;
