/*!
 * etag
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';
// 该库核心函数已经 2年未更新
// https://github.com/jshttp/etag/blob/master/index.js

/**
 * Module exports.
 * @public
 */

/**
 * Module dependencies.
 * @private
 */

let crypto = require('crypto');
let Stats = require('fs').Stats;

/**
 * Module variables.
 * @private
 */

let toString = Object.prototype.toString;

/**
 * Generate an entity tag.
 *
 * @param {Buffer|string} entity
 * @return {string}
 * @private
 */

function entitytag (entity) {
  if (entity.length === 0) {
    // fast-path empty
    return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"';
  }

  // compute hash of entity
  let hash = crypto
    .createHash('sha1')
    .update(entity, 'utf8')
    .digest('base64')
    .substring(0, 27);

  // compute length of entity
  let len = typeof entity === 'string' ? Buffer.byteLength(entity, 'utf8') : entity.length;

  return '"' + len.toString(16) + '-' + hash + '"';
}

/**
 * Create a simple ETag.
 *
 * @param {string|Buffer|Stats} entity
 * @param {object} [options]
 * @param {boolean} [options.weak]
 * @return {String}
 * @public
 */

function etag (entity, options) {
  if (entity == null) {
    throw new TypeError('argument entity is required');
  }

  // support fs.Stats object
  let isStats = isstats(entity);
  let weak = options && typeof options.weak === 'boolean' ? options.weak : isStats;

  // validate argument
  if (!isStats && typeof entity !== 'string' && !Buffer.isBuffer(entity)) {
    throw new TypeError('argument entity must be string, Buffer, or fs.Stats');
  }

  // generate entity tag
  let tag = isStats ? stattag(entity) : entitytag(entity);

  return weak ? 'W/' + tag : tag;
}

/**
 * Determine if object is a Stats object.
 *
 * @param {object} obj
 * @return {boolean}
 * @api private
 */

function isstats (obj) {
  // genuine fs.Stats
  if (typeof Stats === 'function' && obj instanceof Stats) {
    return true;
  }

  // quack quack
  return (
    obj &&
    typeof obj === 'object' &&
    'ctime' in obj &&
    toString.call(obj.ctime) === '[object Date]' &&
    'mtime' in obj &&
    toString.call(obj.mtime) === '[object Date]' &&
    'ino' in obj &&
    typeof obj.ino === 'number' &&
    'size' in obj &&
    typeof obj.size === 'number'
  );
}

/**
 * Generate a tag for a stat.
 *
 * @param {object} stat
 * @return {string}
 * @private
 */

function stattag (stat) {
  let mtime = stat.mtime.getTime().toString(16);
  let size = stat.size.toString(16);

  return '"' + size + '-' + mtime + '"';
}

export default etag;
