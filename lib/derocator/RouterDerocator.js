/*
 * @Author: shangyun.si
 * @Date: 2020-06-10 14:35:17
 * @Last Modified by:   shangyun.si
 * @Last Modified time: 2020-06-10 14:35:17
 */

const $PREFIX = '$router_';

const METHODS = [
  'Head',
  'Options',
  'Get',
  'Post',
  'Put',
  'Patch',
  'Delete',
  'All',
];

for (let method of METHODS) {
  exports[method] = (pathPattern) => {
    return (target, key) => {
      target[`${$PREFIX}${key}`] = { method, pathPattern, };
    };
  };
}

exports.Controller = function (pathName) {
  return function (target) {
    const propsName = Object.getOwnPropertyNames(target.prototype).filter(name => name.includes($PREFIX));
    target.$path = propsName.map(prop => {
      const { method, pathPattern, } = target.prototype[prop];

      const path = `${pathName}${pathPattern}`;
      const executer = prop.substring($PREFIX.length);
      return {
        path,
        executer,
        method,
      };
    });

    target.$controllerPath = pathName;
    return target;
  };
};
