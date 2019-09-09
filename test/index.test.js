'use strict';

var gp = require('../');
var assert = require('assert');
var isWin32 = require('os').platform() === 'win32';

describe('glob-parent', function() {
  it('should strip glob magic to return parent path', function(done) {
    assert.equal(gp('.'), '.');
    assert.equal(gp('.*'), '.');
    assert.equal(gp('/.*'), '/');
    assert.equal(gp('/.*/'), '/');
    assert.equal(gp('a/.*/b'), 'a');
    assert.equal(gp('a*/.*/b'), '.');
    assert.equal(gp('*/a/b/c'), '.');
    assert.equal(gp('*'), '.');
    assert.equal(gp('*/'), '.');
    assert.equal(gp('*/*'), '.');
    assert.equal(gp('*/*/'), '.');
    assert.equal(gp('**'), '.');
    assert.equal(gp('**/'), '.');
    assert.equal(gp('**/*'), '.');
    assert.equal(gp('**/*/'), '.');
    assert.equal(gp('/*.js'), '/');
    assert.equal(gp('*.js'), '.');
    assert.equal(gp('**/*.js'), '.');
    assert.equal(gp('{a,b}'), '.');
    assert.equal(gp('/{a,b}'), '/');
    assert.equal(gp('/{a,b}/'), '/');
    assert.equal(gp('(a|b)'), '.');
    assert.equal(gp('/(a|b)'), '/');
    assert.equal(gp('./(a|b)'), '.');
    assert.equal(gp('a/(b c)'), 'a', 'not an extglob');
    assert.equal(gp('a/(b c)/'), 'a/(b c)', 'not an extglob');
    assert.equal(gp('a/(b c)/d'), 'a/(b c)', 'not an extglob');
    assert.equal(gp('path/to/*.js'), 'path/to');
    assert.equal(gp('/root/path/to/*.js'), '/root/path/to');
    assert.equal(gp('chapter/foo [bar]/'), 'chapter');
    assert.equal(gp('path/[a-z]'), 'path');
    assert.equal(gp('[a-z]'), '.');
    assert.equal(gp('path/{to,from}'), 'path');
    assert.equal(gp('path/(to|from)'), 'path');
    assert.equal(gp('path/(foo bar)/subdir/foo.*'), 'path/(foo bar)/subdir');
    assert.equal(gp('path/!(to|from)'), 'path');
    assert.equal(gp('path/?(to|from)'), 'path');
    assert.equal(gp('path/+(to|from)'), 'path');
    assert.equal(gp('path/*(to|from)'), 'path');
    assert.equal(gp('path/@(to|from)'), 'path');
    assert.equal(gp('path/!/foo'), 'path/!');
    assert.equal(gp('path/?/foo'), 'path/?');
    assert.equal(gp('path/+/foo'), 'path/+');
    assert.equal(gp('path/*/foo'), 'path');
    assert.equal(gp('path/@/foo'), 'path/@');
    assert.equal(gp('path/!/foo/'), 'path/!/foo');
    assert.equal(gp('path/?/foo/'), 'path/?/foo');
    assert.equal(gp('path/+/foo/'), 'path/+/foo');
    assert.equal(gp('path/*/foo/'), 'path');
    assert.equal(gp('path/@/foo/'), 'path/@/foo');
    assert.equal(gp('path/**/*'), 'path');
    assert.equal(gp('path/**/subdir/foo.*'), 'path');
    assert.equal(gp('path/subdir/**/foo.js'), 'path/subdir');
    assert.equal(gp('path/!subdir/foo.js'), 'path/!subdir');
    assert.equal(gp('path/{foo,bar}/'), 'path');

    done();
  });

  it('should respect escaped characters', function(done) {
    assert.equal(gp('path/\\*\\*/subdir/foo.*'), 'path/**/subdir');
    assert.equal(gp('path/\\[\\*\\]/subdir/foo.*'), 'path/[*]/subdir');
    assert.equal(gp('path/\\*(a|b)/subdir/foo.*'), 'path');
    assert.equal(gp('path/\\*/(a|b)/subdir/foo.*'), 'path/*');
    assert.equal(gp('path/\\*\\(a\\|b\\)/subdir/foo.*'), 'path/*(a|b)/subdir');
    assert.equal(gp('path/\\[foo bar\\]/subdir/foo.*'), 'path/[foo bar]/subdir');
    assert.equal(gp('path/\\[bar]/'), 'path/[bar]');
    assert.equal(gp('path/\\[bar]'), 'path/[bar]');
    assert.equal(gp('[bar]'), '.');
    assert.equal(gp('[bar]/'), '.');
    assert.equal(gp('./\\[bar]'), './[bar]');
    assert.equal(gp('\\[bar]/'), '[bar]');
    assert.equal(gp('[bar\\]/'), '.');
    assert.equal(gp('path/foo \\[bar]/'), 'path/foo [bar]');
    assert.equal(gp('path/\\{foo,bar}/'), 'path/{foo,bar}');
    assert.equal(gp('\\{foo,bar}/'), '{foo,bar}');
    assert.equal(gp('\\{foo,bar\\}/'), '{foo,bar}');
    assert.equal(gp('{foo,bar\\}/'), '.');

    if (isWin32) {
      // On Windows we are trying to flip backslashes foo-\\( → foo-/(
      assert.equal(gp('foo-\\(bar\\).md'), 'foo-');
    } else {
      assert.equal(gp('foo-\\(bar\\).md'), '.');
      assert.equal(gp('\\[bar]'), '[bar]');
      assert.equal(gp('[bar\\]'), '.');
      assert.equal(gp('\\{foo,bar\\}'), '{foo,bar}');
      assert.equal(gp('{foo,bar\\}'), '.');
    }

    done();
  });

  it('should respect glob enclosures with embedded separators', function(done) {
    assert.equal(gp('path/{,/,bar/baz,qux}/'), 'path');
    assert.equal(gp('path/\\{,/,bar/baz,qux}/'), 'path/{,/,bar/baz,qux}');
    assert.equal(gp('path/\\{,/,bar/baz,qux\\}/'), 'path/{,/,bar/baz,qux}');
    assert.equal(gp('/{,/,bar/baz,qux}/'), '/');
    assert.equal(gp('/\\{,/,bar/baz,qux}/'), '/{,/,bar/baz,qux}');
    assert.equal(gp('{,/,bar/baz,qux}'), '.');
    assert.equal(gp('\\{,/,bar/baz,qux\\}'), '{,/,bar/baz,qux}');
    assert.equal(gp('\\{,/,bar/baz,qux}/'), '{,/,bar/baz,qux}');
    assert.equal(gp('path/foo[a\\\/]/'), 'path');
    assert.equal(gp('path/foo\\[a\\\/]/'), 'path/foo[a\\\/]');
    assert.equal(gp('foo[a\\\/]'), '.');
    assert.equal(gp('foo\\[a\\\/]'), 'foo[a\\\/]');
    assert.equal(gp('path/(foo/bar|baz)'), 'path');
    assert.equal(gp('path/(foo/bar|baz)/'), 'path');
    assert.equal(gp('path/\\(foo/bar|baz)/'), 'path/(foo/bar|baz)');

    done();
  });

  it('should handle nested braces', function(done) {
    assert.equal(gp('path/{../,./,{bar,/baz\\},qux\\}/'), 'path');
    assert.equal(gp('path/{../,./,\\{bar,/baz},qux}/'), 'path');
    assert.equal(gp('path/\\{../,./,\\{bar,/baz\\},qux\\}/'), 'path/{../,./,{bar,/baz},qux}');
    assert.equal(gp('{../,./,{bar,/baz\\},qux\\}/'), '.');
    assert.equal(gp('{../,./,{bar,/baz\\},qux\\}'), '.');
    assert.equal(gp('path/{,/,bar/{baz,qux\\}}/'), 'path');
    assert.equal(gp('path/{,/,bar/{baz,qux}\\}/'), 'path');
    // assert.equal(gp('path/\\{../,./,{bar,/baz},qux}/'), 'path');

    done();
  });

  it('should return parent dirname from non-glob paths', function(done) {
    assert.equal(gp('path'), '.');
    assert.equal(gp('path/foo'), 'path');
    assert.equal(gp('path/foo/'), 'path/foo');
    assert.equal(gp('path/foo/bar.js'), 'path/foo');

    done();
  });

  it('should respect disabled auto flip backslashes', function(done) {
    assert.equal(gp('foo-\\(bar\\).md', { flipBackslashes: false }), '.');

    done();
  });
});

describe('glob2base test patterns', function() {
  it('should get a base name', function(done) {
    assert.equal(gp('js/*.js'), 'js');

    done();
  });

  it('should get a base name from a nested glob', function(done) {
    assert.equal(gp('js/**/test/*.js'), 'js');

    done();
  });

  it('should get a base name from a flat file', function(done) {
    assert.equal(gp('js/test/wow.js'), 'js/test');
    assert.equal(gp('js/test/wow.js'), 'js/test');

    done();
  });

  it('should get a base name from character class pattern', function(done) {
    assert.equal(gp('js/t[a-z]st}/*.js'), 'js');

    done();
  });

  it('should get a base name from brace , expansion', function(done) {
    assert.equal(gp('js/{src,test}/*.js'), 'js');

    done();
  });

  it('should get a base name from brace .. expansion', function(done) {
    assert.equal(gp('js/test{0..9}/*.js'), 'js');

    done();
  });

  it('should get a base name from extglob', function(done) {
    assert.equal(gp('js/t+(wo|est)/*.js'), 'js');

    done();
  });

  it('should get a base name from a path with non-exglob parens', function(done) {
    assert.equal(gp('js/t(wo|est)/*.js'), 'js');
    assert.equal(gp('js/t/(wo|est)/*.js'), 'js/t');

    done();
  });

  it('should get a base name from a complex brace glob', function(done) {
    assert.equal(gp('lib/{components,pages}/**/{test,another}/*.txt'), 'lib');

    assert.equal(gp('js/test/**/{images,components}/*.js'), 'js/test');

    assert.equal(gp('ooga/{booga,sooga}/**/dooga/{eooga,fooga}'), 'ooga');

    done();
  });
});

if (isWin32) {
  describe('technically invalid windows globs', function() {
    it('should manage simple globs with backslash path separator', function(done) {
      assert.equal(gp('C:\\path\\*.js'), 'C:/path');

      done();
    });
  });
}
