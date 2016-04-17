'use strict';

var path = require('path');
var isGlob = /([*!?{}(|)[\]]|[@?!+*]\()/;

module.exports = function globParent(str) {
	str += 'a'; // preserves full path in case of trailing path separator
	do {str = path.dirname(str)} while (isGlob.test(str));
	return str;
};
