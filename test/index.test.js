'use strict';

var gp = require('../');
var expect = require('expect');
var isWin32 = require('os').platform() === 'win32';

describe('glob-parent', function () {
  it('should strip glob magic to return parent path', function (done) {
    expect(gp('.')).toEqual('.');
    expect(gp('.*')).toEqual('.');
    expect(gp('/.*')).toEqual('/');
    expect(gp('/.*/')).toEqual('/');
    expect(gp('a/.*/b')).toEqual('a');
    expect(gp('a*/.*/b')).toEqual('.');
    expect(gp('*/a/b/c')).toEqual('.');
    expect(gp('*')).toEqual('.');
    expect(gp('*/')).toEqual('.');
    expect(gp('*/*')).toEqual('.');
    expect(gp('*/*/')).toEqual('.');
    expect(gp('**')).toEqual('.');
    expect(gp('**/')).toEqual('.');
    expect(gp('**/*')).toEqual('.');
    expect(gp('**/*/')).toEqual('.');
    expect(gp('/*.js')).toEqual('/');
    expect(gp('*.js')).toEqual('.');
    expect(gp('**/*.js')).toEqual('.');
    expect(gp('{a,b}')).toEqual('.');
    expect(gp('/{a,b}')).toEqual('/');
    expect(gp('/{a,b}/')).toEqual('/');
    expect(gp('(a|b)')).toEqual('.');
    expect(gp('/(a|b)')).toEqual('/');
    expect(gp('./(a|b)')).toEqual('.');
    expect(gp('a/(b c)')).toEqual('a'); // not an extglob
    expect(gp('a/(b c)/')).toEqual('a/(b c)'); // not an extglob
    expect(gp('a/(b c)/d')).toEqual('a/(b c)'); // not an extglob
    expect(gp('path/to/*.js')).toEqual('path/to');
    expect(gp('/root/path/to/*.js')).toEqual('/root/path/to');
    expect(gp('chapter/foo [bar]/')).toEqual('chapter');
    expect(gp('path/[a-z]')).toEqual('path');
    expect(gp('[a-z]')).toEqual('.');
    expect(gp('path/{to,from}')).toEqual('path');
    expect(gp('path/(to|from)')).toEqual('path');
    expect(gp('path/(foo bar)/subdir/foo.*')).toEqual('path/(foo bar)/subdir');
    expect(gp('path/!(to|from)')).toEqual('path');
    expect(gp('path/?(to|from)')).toEqual('path');
    expect(gp('path/+(to|from)')).toEqual('path');
    expect(gp('path/*(to|from)')).toEqual('path');
    expect(gp('path/@(to|from)')).toEqual('path');
    expect(gp('path/!/foo')).toEqual('path/!');
    expect(gp('path/?/foo')).toEqual('path/?');
    expect(gp('path/+/foo')).toEqual('path/+');
    expect(gp('path/*/foo')).toEqual('path');
    expect(gp('path/@/foo')).toEqual('path/@');
    expect(gp('path/!/foo/')).toEqual('path/!/foo');
    expect(gp('path/?/foo/')).toEqual('path/?/foo');
    expect(gp('path/+/foo/')).toEqual('path/+/foo');
    expect(gp('path/*/foo/')).toEqual('path');
    expect(gp('path/@/foo/')).toEqual('path/@/foo');
    expect(gp('path/**/*')).toEqual('path');
    expect(gp('path/**/subdir/foo.*')).toEqual('path');
    expect(gp('path/subdir/**/foo.js')).toEqual('path/subdir');
    expect(gp('path/!subdir/foo.js')).toEqual('path/!subdir');
    expect(gp('path/{foo,bar}/')).toEqual('path');

    done();
  });

  it('should respect escaped characters', function (done) {
    expect(gp('path/\\*\\*/subdir/foo.*')).toEqual('path/**/subdir');
    expect(gp('path/\\[\\*\\]/subdir/foo.*')).toEqual('path/[*]/subdir');
    expect(gp('path/\\*(a|b)/subdir/foo.*')).toEqual('path');
    expect(gp('path/\\*/(a|b)/subdir/foo.*')).toEqual('path/*');
    expect(gp('path/\\*\\(a\\|b\\)/subdir/foo.*')).toEqual(
      'path/*(a|b)/subdir'
    );
    expect(gp('path/\\[foo bar\\]/subdir/foo.*')).toEqual(
      'path/[foo bar]/subdir'
    );
    expect(gp('path/\\[bar]/')).toEqual('path/[bar]');
    expect(gp('path/\\[bar]')).toEqual('path');
    expect(gp('[bar]')).toEqual('.');
    expect(gp('[bar]/')).toEqual('.');
    expect(gp('./\\[bar]')).toEqual('.');
    expect(gp('\\[bar]/')).toEqual('[bar]');
    expect(gp('\\!dir/*')).toEqual('!dir');
    expect(gp('[bar\\]/')).toEqual('.');
    expect(gp('path/foo \\[bar]/')).toEqual('path/foo [bar]');
    expect(gp('path/\\{foo,bar}/')).toEqual('path/{foo,bar}');
    expect(gp('\\{foo,bar}/')).toEqual('{foo,bar}');
    expect(gp('\\{foo,bar\\}/')).toEqual('{foo,bar}');
    expect(gp('{foo,bar\\}/')).toEqual('.');

    if (isWin32) {
      // On Windows we are trying to flip backslashes foo-\\( → foo-/(
      expect(gp('foo-\\(bar\\).md')).toEqual('foo-');
    } else {
      expect(gp('foo-\\(bar\\).md')).toEqual('.');
      expect(gp('\\[bar]')).toEqual('.');
      expect(gp('[bar\\]')).toEqual('.');
      expect(gp('\\{foo,bar\\}')).toEqual('.');
      expect(gp('{foo,bar\\}')).toEqual('.');
    }

    done();
  });

  it('should respect glob enclosures with embedded separators', function (done) {
    /* eslint-disable no-useless-escape */
    expect(gp('path/{,/,bar/baz,qux}/')).toEqual('path');
    expect(gp('path/\\{,/,bar/baz,qux}/')).toEqual('path/{,/,bar/baz,qux}');
    expect(gp('path/\\{,/,bar/baz,qux\\}/')).toEqual('path/{,/,bar/baz,qux}');
    expect(gp('/{,/,bar/baz,qux}/')).toEqual('/');
    expect(gp('/\\{,/,bar/baz,qux}/')).toEqual('/{,/,bar/baz,qux}');
    expect(gp('{,/,bar/baz,qux}')).toEqual('.');
    expect(gp('\\{,/,bar/baz,qux\\}')).toEqual('{,/,bar/baz,qux}');
    expect(gp('\\{,/,bar/baz,qux}/')).toEqual('{,/,bar/baz,qux}');
    expect(gp('path/foo[a\\/]/')).toEqual('path');
    expect(gp('path/foo\\[a\\/]/')).toEqual('path/foo[a\\/]');
    expect(gp('foo[a\\/]')).toEqual('.');
    expect(gp('foo\\[a\\/]')).toEqual('foo[a\\/]');
    expect(gp('path/(foo/bar|baz)')).toEqual('path');
    expect(gp('path/(foo/bar|baz)/')).toEqual('path');
    expect(gp('path/\\(foo/bar|baz)/')).toEqual('path/(foo/bar|baz)');
    /* eslint-enable no-useless-escape */

    done();
  });

  it('should handle nested braces', function (done) {
    expect(gp('path/{../,./,{bar,/baz\\},qux\\}/')).toEqual('path');
    expect(gp('path/{../,./,\\{bar,/baz},qux}/')).toEqual('path');
    expect(gp('path/\\{../,./,\\{bar,/baz\\},qux\\}/')).toEqual(
      'path/{../,./,{bar,/baz},qux}'
    );
    expect(gp('{../,./,{bar,/baz\\},qux\\}/')).toEqual('.');
    expect(gp('{../,./,{bar,/baz\\},qux\\}')).toEqual('.');
    expect(gp('path/{,/,bar/{baz,qux\\}}/')).toEqual('path');
    expect(gp('path/{,/,bar/{baz,qux}\\}/')).toEqual('path');
    // expect(gp('path/\\{../,./,{bar,/baz},qux}/')).toEqual('path');

    done();
  });

  it('should return parent dirname from non-glob paths', function (done) {
    expect(gp('path')).toEqual('.');
    expect(gp('path/foo')).toEqual('path');
    expect(gp('path/foo/')).toEqual('path/foo');
    expect(gp('path/foo/bar.js')).toEqual('path/foo');

    done();
  });

  it('should respect disabled auto flip backslashes', function (done) {
    expect(gp('foo-\\(bar\\).md', { flipBackslashes: false })).toEqual('.');

    done();
  });
});

describe('glob2base test patterns', function () {
  it('should get a base name', function (done) {
    expect(gp('js/*.js')).toEqual('js');

    done();
  });

  it('should get a base name from a nested glob', function (done) {
    expect(gp('js/**/test/*.js')).toEqual('js');

    done();
  });

  it('should get a base name from a flat file', function (done) {
    expect(gp('js/test/wow.js')).toEqual('js/test');
    expect(gp('js/test/wow.js')).toEqual('js/test');

    done();
  });

  it('should get a base name from character class pattern', function (done) {
    expect(gp('js/t[a-z]st}/*.js')).toEqual('js');

    done();
  });

  it('should get a base name from brace , expansion', function (done) {
    expect(gp('js/{src,test}/*.js')).toEqual('js');

    done();
  });

  it('should get a base name from brace .. expansion', function (done) {
    expect(gp('js/test{0..9}/*.js')).toEqual('js');

    done();
  });

  it('should get a base name from extglob', function (done) {
    expect(gp('js/t+(wo|est)/*.js')).toEqual('js');

    done();
  });

  it('should get a base name from a path with non-exglob parens', function (done) {
    expect(gp('js/t(wo|est)/*.js')).toEqual('js');
    expect(gp('js/t/(wo|est)/*.js')).toEqual('js/t');

    done();
  });

  it('should get a base name from a complex brace glob', function (done) {
    expect(gp('lib/{components,pages}/**/{test,another}/*.txt')).toEqual('lib');

    expect(gp('js/test/**/{images,components}/*.js')).toEqual('js/test');

    expect(gp('ooga/{booga,sooga}/**/dooga/{eooga,fooga}')).toEqual('ooga');

    done();
  });

  it('should not be susceptible to SNYK-JS-GLOBPARENT-1016905', function (done) {
    // This will time out if susceptible.
    gp('{' + '/'.repeat(5000));

    done();
  });

  it("should finish in reasonable time for '{' + '/'.repeat(n) [CVE-2021-35065]", function (done) {
    this.timeout(1000);
    gp('{' + '/'.repeat(500000));
    done();
  });

  it("should finish in reasonable time for '{'.repeat(n)", function (done) {
    this.timeout(1000);
    gp('{'.repeat(500000));
    done();
  });

  it("should finish in reasonable time for '('.repeat(n)", function (done) {
    this.timeout(1000);
    gp('('.repeat(500000));
    done();
  });

  it("should finish in reasonable time for '/('.repeat(n) + ')'", function (done) {
    this.timeout(1000);
    gp('/('.repeat(500000) + ')');
    done();
  });
});

if (isWin32) {
  describe('technically invalid windows globs', function () {
    it('should manage simple globs with backslash path separator', function (done) {
      expect(gp('C:\\path\\*.js')).toEqual('C:/path');

      done();
    });
  });
}
