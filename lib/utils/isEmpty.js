/*
 * @Author: shangyun.si
 * @Date: 2020-07-05 00:10:11
 * @Last Modified by:   shangyun.si
 * @Last Modified time: 2020-07-05 00:10:11
 */

const myType = require('./myType');

/**
 * 判断是否是空数据 {}, [], Null, '', undefind, Boolean
 * @param {*} obj any
 */
const isEmpty = obj => {
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

module.exports = isEmpty;
