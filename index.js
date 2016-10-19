'use strict';

var path = require('path');
var isglob = require('is-glob');
var pathDirname = require('path-dirname');

module.exports = function globParent(str) {
	// special case for strings ending in enclosure containing path separator
	if (/[\{\[].*[\/]*.*[\}\]]$/.test(str)) str += '/';

	// preserves full path in case of trailing path separator
	str += 'a';

	// remove path parts that are globby
	do {str = pathDirname.posix(str)}
	while (isglob(str) || /(^|[^\\])[\{\[]/.test(str));

	// remove escape chars and return result
	return str.replace(/\\([\*\?\|\[\]\(\)\{\}])/g, '$1');
};
