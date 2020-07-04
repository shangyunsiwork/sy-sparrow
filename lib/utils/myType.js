/*
 * @Author: shangyun.si
 * @Date: 2020-07-05 00:13:16
 * @Last Modified by:   shangyun.si
 * @Last Modified time: 2020-07-05 00:13:16
 */

/**
 * 判断输入数据类型
 * @param {any} params
 */
const myType = params => {
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

module.exports = myType;
