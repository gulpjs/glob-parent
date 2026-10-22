"use strict";

var gp = require("../");
var assert = require("node:assert");
var { describe, it } = require("node:test");
var isWin32 = require("os").platform() === "win32";

describe("glob-parent", function () {
  it("should strip glob magic to return parent path", function () {
    assert.deepStrictEqual(gp("."), ".");
    assert.deepStrictEqual(gp(".*"), ".");
    assert.deepStrictEqual(gp("?"), ".");
    assert.deepStrictEqual(gp("/.*"), "/");
    assert.deepStrictEqual(gp("/.*/"), "/");
    assert.deepStrictEqual(gp("//"), "/");
    // TODO: Something to do with UNC
    // assert.deepStrictEqual(gp("//*"), "/");
    assert.deepStrictEqual(gp(".//"), ".");
    assert.deepStrictEqual(gp(".//*"), ".");
    assert.deepStrictEqual(gp("a/.*/b"), "a");
    assert.deepStrictEqual(gp("a*/.*/b"), ".");
    assert.deepStrictEqual(gp("*/a/b/c"), ".");
    assert.deepStrictEqual(gp("*"), ".");
    assert.deepStrictEqual(gp("*/"), ".");
    assert.deepStrictEqual(gp("*/*"), ".");
    assert.deepStrictEqual(gp("*/*/"), ".");
    assert.deepStrictEqual(gp("**"), ".");
    assert.deepStrictEqual(gp("**/"), ".");
    assert.deepStrictEqual(gp("**/*"), ".");
    assert.deepStrictEqual(gp("**/*/"), ".");
    assert.deepStrictEqual(gp("/*.js"), "/");
    assert.deepStrictEqual(gp("*.js"), ".");
    assert.deepStrictEqual(gp("**/*.js"), ".");
    assert.deepStrictEqual(gp("{a,b}"), ".");
    assert.deepStrictEqual(gp("/{a,b}"), "/");
    assert.deepStrictEqual(gp("/{a,b}/"), "/");
    // assert.deepStrictEqual(gp("(a|b)"), ".");
    // assert.deepStrictEqual(gp("/(a|b)"), "/");
    // assert.deepStrictEqual(gp("./(a|b)"), ".");
    assert.deepStrictEqual(gp("a/(b c)"), "a"); // not an extglob
    assert.deepStrictEqual(gp("a/(b c)/"), "a/(b c)"); // not an extglob
    assert.deepStrictEqual(gp("a/(b c)/d"), "a/(b c)"); // not an extglob
    assert.deepStrictEqual(gp("path/to/*.js"), "path/to");
    assert.deepStrictEqual(gp("/root/path/to/*.js"), "/root/path/to");
    assert.deepStrictEqual(gp("chapter/foo [bar]/"), "chapter");
    assert.deepStrictEqual(gp("path/[a-z]"), "path");
    assert.deepStrictEqual(gp("[a-z]"), ".");
    assert.deepStrictEqual(gp("path/{to,from}"), "path");
    assert.deepStrictEqual(gp("path/(to|from)"), "path");
    assert.deepStrictEqual(
      gp("path/(foo bar)/subdir/foo.*"),
      "path/(foo bar)/subdir",
    );
    assert.deepStrictEqual(gp("path/!(to|from)"), "path");
    assert.deepStrictEqual(gp("path/?(to|from)"), "path");
    assert.deepStrictEqual(gp("path/+(to|from)"), "path");
    assert.deepStrictEqual(gp("path/*(to|from)"), "path");
    assert.deepStrictEqual(gp("path/@(to|from)"), "path");
    assert.deepStrictEqual(gp("path/!/foo"), "path/!");
    assert.deepStrictEqual(gp("path/?/foo"), "path");
    assert.deepStrictEqual(gp("path/+/foo"), "path/+");
    assert.deepStrictEqual(gp("path/*/foo"), "path");
    assert.deepStrictEqual(gp("path/@/foo"), "path/@");
    assert.deepStrictEqual(gp("path/!/foo/"), "path/!/foo");
    assert.deepStrictEqual(gp("path/?/foo/"), "path");
    assert.deepStrictEqual(gp("path/+/foo/"), "path/+/foo");
    assert.deepStrictEqual(gp("path/*/foo/"), "path");
    assert.deepStrictEqual(gp("path/@/foo/"), "path/@/foo");
    assert.deepStrictEqual(gp("path/**/*"), "path");
    assert.deepStrictEqual(gp("path/**/subdir/foo.*"), "path");
    assert.deepStrictEqual(gp("path/subdir/**/foo.js"), "path/subdir");
    assert.deepStrictEqual(gp("path/!subdir/foo.js"), "path/!subdir");
    assert.deepStrictEqual(gp("path/{foo,bar}/"), "path");
  });

  it("should respect escaped characters", function () {
    assert.deepStrictEqual(gp("path/\\*\\*/subdir/foo.*"), "path/**/subdir");
    assert.deepStrictEqual(
      gp("path/\\[\\*\\]/subdir/foo.*"),
      "path/[*]/subdir",
    );
    // assert.deepStrictEqual(gp("path/\\*(a|b)/subdir/foo.*"), "path");
    // assert.deepStrictEqual(gp("path/\\*/(a|b)/subdir/foo.*"), "path/*");
    assert.deepStrictEqual(
      gp("path/\\*\\(a\\|b\\)/subdir/foo.*"),
      "path/*(a|b)/subdir",
    );
    assert.deepStrictEqual(
      gp("path/\\[foo bar\\]/subdir/foo.*"),
      "path/[foo bar]/subdir",
    );
    assert.deepStrictEqual(gp("path/\\[bar]/"), "path/[bar]");
    assert.deepStrictEqual(gp("path/\\[bar]"), "path");
    assert.deepStrictEqual(gp("[bar]"), ".");
    assert.deepStrictEqual(gp("[bar]/"), ".");
    assert.deepStrictEqual(gp("./\\[bar]"), ".");
    assert.deepStrictEqual(gp("\\[bar]/"), "[bar]");
    assert.deepStrictEqual(gp("\\!dir/*"), "!dir");
    // assert.deepStrictEqual(gp("[bar\\]/"), ".");
    assert.deepStrictEqual(gp("path/foo \\[bar]/"), "path/foo [bar]");
    assert.deepStrictEqual(gp("path/\\{foo,bar}/"), "path/{foo,bar}");
    assert.deepStrictEqual(gp("\\{foo,bar}/"), "{foo,bar}");
    assert.deepStrictEqual(gp("\\{foo,bar\\}/"), "{foo,bar}");
    // assert.deepStrictEqual(gp("{foo,bar\\}/"), ".");

    if (isWin32) {
      // On Windows we are trying to flip backslashes foo-\\( → foo-/(
      // TODO: Something related to parens when they need a prefix?
      // assert.deepStrictEqual(gp("foo-\\(bar\\).md"), "foo-");
    } else {
      assert.deepStrictEqual(gp("foo-\\(bar\\).md"), ".");
      assert.deepStrictEqual(gp("\\[bar]"), ".");
      assert.deepStrictEqual(gp("[bar\\]"), ".");
      assert.deepStrictEqual(gp("\\{foo,bar\\}"), ".");
      assert.deepStrictEqual(gp("{foo,bar\\}"), ".");
    }
  });

  it("should respect glob enclosures with embedded separators", function () {
    assert.deepStrictEqual(gp("path/{,/,bar/baz,qux}/"), "path");
    assert.deepStrictEqual(
      gp("path/\\{,/,bar/baz,qux}/"),
      "path/{,/,bar/baz,qux}",
    );
    assert.deepStrictEqual(
      gp("path/\\{,/,bar/baz,qux\\}/"),
      "path/{,/,bar/baz,qux}",
    );
    assert.deepStrictEqual(gp("/{,/,bar/baz,qux}/"), "/");
    assert.deepStrictEqual(gp("/\\{,/,bar/baz,qux}/"), "/{,/,bar/baz,qux}");
    assert.deepStrictEqual(gp("{,/,bar/baz,qux}"), ".");
    assert.deepStrictEqual(gp("\\{,/,bar/baz,qux\\}"), "{,/,bar");
    assert.deepStrictEqual(gp("\\{,/,bar/baz,qux}/"), "{,/,bar/baz,qux}");
    // assert.deepStrictEqual(gp("path/foo[a\\/]/"), "path");
    assert.deepStrictEqual(gp("path/foo\\[a\\/]/"), "path/foo[a\\/]");
    // assert.deepStrictEqual(gp("foo[a\\/]"), ".");
    assert.deepStrictEqual(gp("foo\\[a\\/]"), "foo[a\\");
    // assert.deepStrictEqual(gp("path/(foo/bar|baz)"), "path");
    // assert.deepStrictEqual(gp("path/(foo/bar|baz)/"), "path");
    assert.deepStrictEqual(gp("path/\\(foo/bar|baz)/"), "path/(foo/bar|baz)");
  });

  it("should handle nested braces", function () {
    // both closing } are escaped and there is a trailing slash
    assert.deepStrictEqual(
      gp("path/{../,./,{bar,/baz\\},qux\\}/"),
      "path/{../,./,{bar,/baz},qux}",
    );
    assert.deepStrictEqual(gp("path/{../,./,\\{bar,/baz},qux}/"), "path");
    assert.deepStrictEqual(
      gp("path/\\{../,./,\\{bar,/baz\\},qux\\}/"),
      "path/{../,./,{bar,/baz},qux}",
    );
    // both closing } are escaped and there is a trailing slash
    assert.deepStrictEqual(
      gp("{../,./,{bar,/baz\\},qux\\}/"),
      "{../,./,{bar,/baz},qux}",
    );
    // both closing } are escaped and there is NO trailing slash
    assert.deepStrictEqual(gp("{../,./,{bar,/baz\\},qux\\}"), "{../,./,{bar,");
    // only one closing } is escaped so the tightest match is {baz,qux\\}}
    assert.deepStrictEqual(gp("path/{,/,bar/{baz,qux\\}}/"), "path/{,/,bar");
    // only one closing } is escaped so the tighest match is {baz,qux}
    assert.deepStrictEqual(gp("path/{,/,bar/{baz,qux}\\}/"), "path/{,/,bar");
    assert.deepStrictEqual(gp("path/\\{../,./,{bar,/baz},qux}"), "path/{../,.");
    assert.deepStrictEqual(
      gp("path/\\{../,./,{bar,/baz},qux}/"),
      "path/{../,.",
    );
  });

  it("should return parent dirname from non-glob paths", function () {
    assert.deepStrictEqual(gp("path"), ".");
    assert.deepStrictEqual(gp("path/foo"), "path");
    assert.deepStrictEqual(gp("path/foo/"), "path/foo");
    assert.deepStrictEqual(gp("path/foo/bar.js"), "path/foo");
  });

  it("should respect disabled auto flip backslashes", function () {
    assert.deepStrictEqual(
      gp("foo-\\(bar\\).md", { flipBackslashes: false }),
      ".",
    );
  });

  it("should remove tail '.' and './'", function () {
    assert.deepStrictEqual(gp("foo/./*"), "foo/");
    assert.deepStrictEqual(gp("foo/./././*"), "foo/");
    assert.deepStrictEqual(gp("./././*"), "./");
    assert.deepStrictEqual(gp("/./././*"), "/");

    if (isWin32) {
      assert.deepStrictEqual(gp("C:/foo/./*"), "C:/foo/");
      assert.deepStrictEqual(gp("C:/foo/./././*"), "C:/foo/");
      assert.deepStrictEqual(gp("C:/./././*"), "C:/");

      assert.deepStrictEqual(gp("C:\\foo\\.\\*"), "C:/foo/");
      assert.deepStrictEqual(gp("C:\\foo\\.\\.\\.\\*"), "C:/foo/");
      assert.deepStrictEqual(gp("C:\\.\\.\\.\\*"), "C:/");

      assert.deepStrictEqual(gp("C:foo/./*"), "C:foo/");
      assert.deepStrictEqual(gp("C:foo/./././*"), "C:foo/");
      assert.deepStrictEqual(gp("C:./././*"), "C:");

      assert.deepStrictEqual(gp("C:foo\\.\\*"), "C:foo/");
      assert.deepStrictEqual(gp("C:foo\\.\\.\\.\\*"), "C:foo/");
      assert.deepStrictEqual(gp("C:.\\.\\.\\*"), "C:");
    }
  });

  it("should treat escaped brackets as normal chars", function () {
    if (isWin32) {
      assert.deepStrictEqual(gp("aaa\\}"), "aaa");
      assert.deepStrictEqual(gp("\\{aaa/bbb\\}"), "{aaa");
      assert.deepStrictEqual(gp("\\{\\{aaa/bbb\\}"), "{{aaa");
      // assert.deepStrictEqual(gp("{\\{aaa/bbb}"), ".");
      // assert.deepStrictEqual(gp("ccc/{\\{aaa/bbb}"), "ccc");
      assert.deepStrictEqual(gp("ccc\\/\\{\\{aaa/bbb}"), "ccc\\/{{aaa");

      var opts = { flipBackslashes: false };
      assert.deepStrictEqual(gp("aaa\\}", opts), ".");
      assert.deepStrictEqual(gp("\\{aaa/bbb\\}", opts), "{aaa");
      assert.deepStrictEqual(gp("\\{\\{aaa/bbb\\}", opts), "{{aaa");
      // assert.deepStrictEqual(gp("{\\{aaa/bbb}", opts), ".");
      // assert.deepStrictEqual(gp("ccc/{\\{aaa/bbb}", opts), "ccc");
      assert.deepStrictEqual(gp("ccc\\/\\{\\{aaa/bbb}", opts), "ccc\\/{{aaa");
    } else {
      assert.deepStrictEqual(gp("aaa\\}"), ".");
      assert.deepStrictEqual(gp("\\{aaa/bbb\\}"), "{aaa");
      assert.deepStrictEqual(gp("\\{\\{aaa/bbb\\}"), "{{aaa");
      // TODO: These seem to have magic but they don't expand to more than one set due to only one pattern in the braces
      // assert.deepStrictEqual(gp("{\\{aaa/bbb}"), ".");
      // assert.deepStrictEqual(gp("ccc/{\\{aaa/bbb}"), "ccc");
      assert.deepStrictEqual(gp("ccc\\/\\{\\{aaa/bbb}"), "ccc\\/{{aaa");
    }
  });
});

describe("glob2base test patterns", function () {
  it("should get a base name", function () {
    assert.deepStrictEqual(gp("js/*.js"), "js");
  });

  it("should get a base name from a nested glob", function () {
    assert.deepStrictEqual(gp("js/**/test/*.js"), "js");
  });

  it("should get a base name from a flat file", function () {
    assert.deepStrictEqual(gp("js/test/wow.js"), "js/test");
    assert.deepStrictEqual(gp("js/test/wow.js"), "js/test");
  });

  it("should get a base name from character class pattern", function () {
    assert.deepStrictEqual(gp("js/t[a-z]st}/*.js"), "js");
  });

  it("should get a base name from brace , expansion", function () {
    assert.deepStrictEqual(gp("js/{src,test}/*.js"), "js");
  });

  it("should get a base name from brace .. expansion", function () {
    assert.deepStrictEqual(gp("js/test{0..9}/*.js"), "js");
  });

  it("should get a base name from extglob", function () {
    assert.deepStrictEqual(gp("js/t+(wo|est)/*.js"), "js");
  });

  it("should get a base name from a path with non-exglob parens", function () {
    // TODO: parens are unsupported, need to use []
    // assert.deepStrictEqual(gp("js/t(wo|est)/*.js"), "js");
    // assert.deepStrictEqual(gp("js/t/(wo|est)/*.js"), "js/t");
  });

  it("should get a base name from a complex brace glob", function () {
    assert.deepStrictEqual(
      gp("lib/{components,pages}/**/{test,another}/*.txt"),
      "lib",
    );

    assert.deepStrictEqual(
      gp("js/test/**/{images,components}/*.js"),
      "js/test",
    );

    assert.deepStrictEqual(
      gp("ooga/{booga,sooga}/**/dooga/{eooga,fooga}"),
      "ooga",
    );
  });

  it("should not be susceptible to SNYK-JS-GLOBPARENT-1016905", function () {
    // This will time out if susceptible.
    gp("{" + "/".repeat(5000));
  });

  // Minimatch limit
  it("fails on patterns of size >=65,536 (1024*64)", function () {
    var expected = {
      name: "TypeError",
      message: "pattern is too long",
    };
    assert.throws(() => {
      // [CVE-2021-35065]
      gp("{" + "/".repeat(500000));
    }, expected);
    assert.throws(() => {
      gp("{".repeat(500000));
    }, expected);
    assert.throws(() => {
      gp("(".repeat(500000));
    }, expected);
    assert.throws(() => {
      gp("/(".repeat(500000) + ")");
    }, expected);
  });
});

if (isWin32) {
  describe("technically invalid windows globs", function () {
    it("should manage simple globs with backslash path separator", function () {
      assert.deepStrictEqual(gp("C:\\path\\*.js"), "C:/path");
    });
  });
}
