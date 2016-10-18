'use strict';

var path = require('path');
var isglob = require('is-glob');
var pathDirname = require('path-dirname');

module.exports = function globParent(str) {
	str += 'a'; // preserves full path in case of trailing path separator
	// replace braces/brackets sections with *
	str = str.replace(/(^|[^\\])(\{([^{}]*?)}|\[([^\[\]]*?)\])/g, '$1*');
	do {str = pathDirname.posix(str)} while (isglob(str));
	return str.replace(/\\([\*\?\|\[\]\(\)\{\}])/g, '$1');
};
