/*
 * @Author: shangyun.si
 * @Date: 2020-07-05 00:15:07
 * @Last Modified by: shangyun.si
 * @Last Modified time: 2020-07-05 00:43:10
 */

/**
 * 判断输入数据类型
 * @param {any} params
 */
export const myType = params => {
  let ty = 'undefined';
  // try {
  ty = Object.prototype.toString.call(params);
  // } catch (error) {
  // return ty;
  // }
  let res = {
    '[object Object]': 'object',
    '[object Array]': 'array',
    '[object String]': 'string',
    '[object Null]': 'null',
    '[object Number]': 'number',
    '[object Undefined]': 'undefined',
    '[object Function]': 'function',
    '[object AsyncFunction]': 'function',
    '[object AsyncGeneratorFunction]': 'function',
    '[object GeneratorFunction]': 'function',
    '[object Boolean]': 'boolean',
    '[object Date]': 'date',
    '[object Location]': 'browser',
    '[object Navigator]': 'browser',
    '[object Window]': 'browser',
    '[object History]': 'browser',
    '[object Screen]': 'browser',
    // '[object HTMLDocument]': 'htmldocument',
    // '[object HTMLDivElement]': 'htmldiv',
    // '[object HTMLCollection]': 'htmltagname',
    // '[object HTMLAnchorElement]': 'htmla',
  };
  // global window
  if (/HTML/.test(ty)) return 'html';
  if (res[ty] !== 'number') return res[ty];
  return (
    {
      Infinity: 'infinity',
      NaN: 'nan',
    }[params.toString()] || res[ty]
  );
};

/**
 * 来源 http://gitlab.quvideo.com/WEB/xnpm-hook/blob/master/app/common/utils.js#L425
 * 自定义的错误方法
 * @param {Number} bcode
 * @param {Object|String} Error | message
 *
 * example
 * ```js
 * let myerr;
 *
 * try{
 *   x < 2;
 * }catch(e){
 *   myerr = new XError(30030, e);
 *   // myerr = new XError(30030, 'yours message');
 * }
 *
 * console.log(myerr.bcode, myerr.message, myerr.stack)
 * // 30030
 * // "ReferenceError: x is not defined"
 * // "Error: ReferenceError: x is not defined
 * // at <anonymous>:6:7"
 *
 * ```
 */
export function XError (bcode, message) {
  let instance = new Error(message);
  instance.bcode = bcode;
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, XError);
  }
  return instance;
}

/**
 * 判断是否是空数据 {}, [], Null, '', undefind, Boolean
 * @param {*} obj any
 */
export const isEmpty = obj => {
  let type = myType(obj);
  // 约定：传入boolean类型，说明实际是有值的
  if (type === 'boolean') return false;
  if (type === 'string') return obj.length === 0;
  if (type === 'nan') return true;
  if (type === 'array') return obj.length === 0;
  if (type === 'object') return Object.keys(obj).length === 0;
  if ([ 'date', 'html', 'browser', 'number', 'infinity', 'function', ].includes(type)) return false;
  if (!obj) return true;
  // return false;
};

XError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});

// 避免设置一个对象的 [[Prototype]]。相反，应使用 Object.create()来创建带有[[Prototype]]的新对象
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
Object.setPrototypeOf(XError, Error);
