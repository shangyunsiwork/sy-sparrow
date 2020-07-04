/*
 * @Author: shangyun.si
 * @Date: 2020-07-05 00:07:30
 * @Last Modified by: shangyun.si
 * @Last Modified time: 2020-07-05 00:44:44
 */

'use strict';
// const Log = console;
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

// const config = require('../config');
// const apiPre = config.urlPrefix.a;

/**
 * 先错误处理再格式化返回
 * err.bcode 定义业务错误码
 * @returns md
 */
function errorHandler () {
  return async (ctx, next) => {
    // httpStatusCode 为 200【强制】并且是 API 前缀的 统一封装成 业务码形式
    const URLisAPI = ctx.path.indexOf('/api') === 0;
    try {
      await next();
      // ctx.log.info('[ctx.status] ', ctx.status);
      if (ctx.status === 200 && URLisAPI) ctx.res.ok();
    } catch (err) {
      // ctx.log.info(ctx.status, '[errorHandler] ', err.message);
      if (URLisAPI) ctx.res.fail({ statusCode: 200, code: err.bcode || 50000, message: err.message, });

      ctx.app.emit('error', err, ctx);
    }
  };
}

export default errorHandler;
