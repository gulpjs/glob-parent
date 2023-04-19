'use strict';

var isGlob = require('is-glob');
var pathPosixDirname = require('path').posix.dirname;
var isWin32 = require('os').platform() === 'win32';

var slash = '/';
var backslash = /\\/g;
var escaped = /\\([!*?|[\](){}])/g;

/**
 * @param {string} str
 * @param {Object} opts
 * @param {boolean} [opts.flipBackslashes=true]
 */
module.exports = function globParent(str, opts) {
  var options = Object.assign({ flipBackslashes: true }, opts);

  // flip windows path separators
  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }

  // special case for strings ending in enclosure containing path separator
  if (isEnclosure(str)) {
    str += slash;
  }

  // preserves full path in case of trailing path separator
  str += 'a';

  // remove path parts that are globby
  do {
    str = pathPosixDirname(str);
  } while (isGlobby(str));

  // remove escape chars and return result
  return str.replace(escaped, '$1');
};

function isEnclosure(str) {
  var lastChar = str.slice(-1);

  var enclosureStart;
  switch (lastChar) {
    case '}':
      enclosureStart = '{';
      break;
    case ']':
      enclosureStart = '[';
      break;
    default:
      return false;
  }

  var enclosureIndex = str.length - 1;
  var foundIndex = findLastNonBsCharFrom(str, enclosureIndex - 1);
  if ((enclosureIndex - foundIndex) % 2 === 0) {
    // Last enclosure is escaped.
    return false;
  }

  while (foundIndex >= 0) {
    enclosureIndex = str.lastIndexOf(enclosureStart, foundIndex);
    if (enclosureIndex < 0) {
      return false;
    }

    foundIndex = findLastNonBsCharFrom(str, enclosureIndex - 1);
    if ((enclosureIndex - foundIndex) % 2 === 0) {
      // Enclosure is escaped.
      return false;
    }
  }

  return str.slice(enclosureIndex + 1, -1).includes(slash);
}

function findLastNonBsCharFrom(str, startIndex) {
  for (var i = startIndex; i >= 0; i--) {
    if (str[i] !== '\\') {
      return i;
    }
  }
  return -1;
}

function isGlobby(str) {
  if (/\([^()]+$/.test(str)) {
    return true;
  }
  if (str[0] === '{' || str[0] === '[') {
    return true;
  }
  if (/[^\\][{[]/.test(str)) {
    return true;
  }
  return isGlob(str);
}
