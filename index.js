'use strict';

var isGlob = require('is-glob');
var path = require('path');
var pathPosixDirname = path.posix.dirname;
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

  var winDriveOrUncVolume = '';
  if (isWin32) {
    winDriveOrUncVolume = getWinDriveOrUncVolume(str);
    str = str.slice(winDriveOrUncVolume.length);
  }

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
  str = str.replace(escaped, '$1');

  // replace continuous slashes to single slash
  str = str.replace(/\/+/g, '/');

  // remove last single dot
  if (str.slice(-2) === '/.') {
    str = str.slice(0, -1)
  }
  // remove last './'
  while (str.slice(-3) === '/./') {
    str = str.slice(0, -2)
  }

  if (isWin32 && winDriveOrUncVolume) {
    if (str === '.' || str === './') {
      str = '';
    }
    str = winDriveOrUncVolume + str;
  }

  return str;
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

  var foundIndex = str.indexOf(enclosureStart);
  if (foundIndex < 0) {
    return false;
  }

  return str.slice(foundIndex + 1, -1).includes(slash);
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

function getWinDriveOrUncVolume(fp) {
  if (/^([a-zA-Z]:|\\\\)/.test(fp)) {
    var root = path.win32.parse(fp).root;
    if (path.win32.isAbsolute(fp)) {
      root = root.slice(0, -1);  // Strip last path separator
    }
    return root;
  }
  return '';
}
