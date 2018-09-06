'use strict';

var path = require('path');
var isglob = require('is-glob');
var pathDirname = require('path-dirname');
var isWin32 = require('os').platform() === 'win32';

// Reg exps out of fn to save mem.
var encRe = /[\{\[].*[\/]*.*[\}\]]$/;
var globRe = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escRe = /\\([\*\?\|\[\]\(\)\{\}])/g;

module.exports = function globParent(str) {
	// flip windows path separators
	if (isWin32 && str.indexOf('/') < 0) str = str.split('\\').join('/');

	// special case for strings ending in enclosure containing path separator
	if (encRe.test(str)) str += '/';

	// preserves full path in case of trailing path separator
	str += 'a';

	// remove path parts that are globby
	do {str = pathDirname.posix(str)}
	while (isglob(str) || globRe.test(str));

	// remove escape chars and return result
	return str.replace(escRe, '$1');
};
