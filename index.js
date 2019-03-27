'use strict';

var dirname = require('path').posix.dirname;
var isGlob = require('is-glob');
var isWin32 = require('os').platform() === 'win32';

var slash = '/';
var enclosure = /[\{\[].*[\/]*.*[\}\]]$/;
var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escaped = /\\([\*\?\|\[\]\(\)\{\}])/g;

module.exports = function globParent(str) {
	// flip windows path separators
	if (isWin32 && str.indexOf(slash) < 0) str = str.replace(/\\/g, '/');

	// special case for strings ending in enclosure containing path separator
	if (enclosure.test(str)) str += slash;

	// preserves full path in case of trailing path separator
	str += 'a';

	// remove path parts that are globby
	do {
		str = dirname(str)
	} while (isGlob(str) || globby.test(str));

	// remove escape chars and return result
	return str.replace(escaped, '$1');
};
