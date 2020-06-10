/*
 * @Author: shangyun.si
 * @Date: 2020-06-10 14:34:52
 * @Last Modified by:   shangyun.si
 * @Last Modified time: 2020-06-10 14:34:52
 */
/* eslint-disable security/detect-object-injection */
'use strict';

const Joi = require('@hapi/joi');
const { isEmpty, } = require('@xy/util');

const paramFormat = () => {
  return async function (ctx, next) {
    let rawData = ctx.request.body;
    try {
      if (typeof rawData === 'string' && rawData.length) rawData = JSON.parse(rawData);
      // console.info({ req: ctx, event: 'request', }, `ctx.request.body is raw data(${Number(ctx.request.body.length)})`);
    } catch (error) {
      // console.warn({ req: ctx, event: 'request', }, `JSON.parse req.body error ${error}`);
    }
    const reqParam = {
      // headers: {},
      router: ctx.params,
      query: ctx.query,
      body: rawData,
      files: ctx.request.files,

      // 兼容 swagger 测试 curl 发送的请求, https://swagger.io/docs/specification/describing-request-body/
      // 并去除其他属性，防止报错：Cannot convert object to primitive value
      // swagger 没有用 -d 发送 body 数据
      merge: Object.assign(JSON.parse(JSON.stringify(ctx.query)), rawData),
      // 需要修改 swagger curl POST 请求 发送方式如下：
      // curl --header "Content-Type: application/json" \
      // --request POST \
      // --data '{"urlOrigin":"..."}' \
      // http://0.0.0.0:5000/api/url
      // 简写 ： (-H : --header, -d : --data)
    };

    ctx.reqParam = reqParam;
    return next();
  };
};

const paramSchema = (schema) => {
  return async function (ctx, next) {
    if (!schema) return next();
    let schemaKeys = Object.getOwnPropertyNames(schema);
    if (!schemaKeys.length) return next();
    const reqParam = ctx.reqParam;

    schemaKeys.some(item => {
      let validObj = reqParam[item];

      // 兼容 swagger 测试 curl 发送的请求, 同上
      if (isEmpty(validObj)) {
        validObj = reqParam['merge'];
        reqParam['body'] = validObj;
      }
      // 兼容 swagger 测试 curl 发送的请求, 结束
      let validResult = Joi.validate(validObj, schema[item], { allowUnknown: true, });
      if (validResult.error) {
        ctx.throw(422, new Error(validResult.error.message), { bcode: 20001, });
      }
    });
    await next();
  };
};

module.exports = {
  paramFormat,
  paramSchema,
};
