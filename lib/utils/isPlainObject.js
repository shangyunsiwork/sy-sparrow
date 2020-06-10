/**
 * @param obj The object to inspect.
 * @returns True if the argument appears to be a plain object.
 */
const isPlainObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) { return false; }
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
};
module.exports = isPlainObject;