'use strict';

var path = require('path');
var isglob = require('is-glob');
var pathDirname = require('path-dirname');

module.exports = function globParent(str) {
	// preserves full path in case of trailing path separator
	str += 'a';

	// replace braces/brackets sections with *
	str = str.replace(/(^|[^\\])(\{([^{}]*?)}|\[([^\[\]]*?)\])/g, '$1*');

	// remove path parts that are globby
	do {str = pathDirname.posix(str)} while (isglob(str));

	// remove escape chars and return result
	return str.replace(/\\([\*\?\|\[\]\(\)\{\}])/g, '$1');
};
