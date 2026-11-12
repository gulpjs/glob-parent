"use strict";

const os = require("node:os");
const { describe, it } = require("node:test");

const gp = require("../");

const isWin32 = os.platform() === "win32";

describe("glob-parent", () => {
  it("should strip glob magic to return parent path", (t) => {
    t.assert.strictEqual(gp("."), ".");
    t.assert.strictEqual(gp(".*"), ".");
    t.assert.strictEqual(gp("?"), ".");
    t.assert.strictEqual(gp("/.*"), "/");
    t.assert.strictEqual(gp("/.*/"), "/");
    t.assert.strictEqual(gp("//"), "/");
    t.assert.strictEqual(gp("//*"), "/");
    t.assert.strictEqual(gp(".//"), ".");
    t.assert.strictEqual(gp(".//*"), ".");
    t.assert.strictEqual(gp("a/.*/b"), "a");
    t.assert.strictEqual(gp("a*/.*/b"), ".");
    t.assert.strictEqual(gp("*/a/b/c"), ".");
    t.assert.strictEqual(gp("*"), ".");
    t.assert.strictEqual(gp("*/"), ".");
    t.assert.strictEqual(gp("*/*"), ".");
    t.assert.strictEqual(gp("*/*/"), ".");
    t.assert.strictEqual(gp("**"), ".");
    t.assert.strictEqual(gp("**/"), ".");
    t.assert.strictEqual(gp("**/*"), ".");
    t.assert.strictEqual(gp("**/*/"), ".");
    t.assert.strictEqual(gp("/*.js"), "/");
    t.assert.strictEqual(gp("*.js"), ".");
    t.assert.strictEqual(gp("**/*.js"), ".");
    t.assert.strictEqual(gp("{a,b}"), ".");
    t.assert.strictEqual(gp("/{a,b}"), "/");
    t.assert.strictEqual(gp("/{a,b}/"), "/");
    // No trailing seperator, so base is discarded
    t.assert.strictEqual(gp("(a|b)"), ".");
    // Not a properly specified exglob
    t.assert.strictEqual(gp("(a|b)/"), "(a|b)");
    // Properly specified extglob
    t.assert.strictEqual(gp("?(a|b)/"), ".");
    // No trailing seperator, so base is discarded
    t.assert.strictEqual(gp("/(a|b)"), "/");
    // Not a properly specified exglob
    t.assert.strictEqual(gp("/(a|b)/"), "/(a|b)");
    // Properly specified extglob
    t.assert.strictEqual(gp("/+(a|b)/"), "/");
    // No trailing seperator, so base is discarded
    t.assert.strictEqual(gp("./(a|b)"), ".");
    // Not a properly specified exglob
    t.assert.strictEqual(gp("./(a|b)/"), "./(a|b)");
    // Properly specified extglob
    t.assert.strictEqual(gp("./*(a|b)/"), ".");
    t.assert.strictEqual(gp("a/(b c)"), "a"); // not an extglob
    t.assert.strictEqual(gp("a/(b c)/"), "a/(b c)"); // not an extglob
    t.assert.strictEqual(gp("a/(b c)/d"), "a/(b c)"); // not an extglob
    t.assert.strictEqual(gp("path/to/*.js"), "path/to");
    t.assert.strictEqual(gp("/root/path/to/*.js"), "/root/path/to");
    t.assert.strictEqual(gp("chapter/foo [bar]/"), "chapter");
    t.assert.strictEqual(gp("path/[a-z]"), "path");
    t.assert.strictEqual(gp("[a-z]"), ".");
    t.assert.strictEqual(gp("path/{to,from}"), "path");
    t.assert.strictEqual(gp("path/(to|from)"), "path");
    t.assert.strictEqual(
      gp("path/(foo bar)/subdir/foo.*"),
      "path/(foo bar)/subdir",
    );
    t.assert.strictEqual(gp("path/!(to|from)"), "path");
    t.assert.strictEqual(gp("path/?(to|from)"), "path");
    t.assert.strictEqual(gp("path/+(to|from)"), "path");
    t.assert.strictEqual(gp("path/*(to|from)"), "path");
    t.assert.strictEqual(gp("path/@(to|from)"), "path");
    t.assert.strictEqual(gp("path/!/foo"), "path/!");
    t.assert.strictEqual(gp("path/?/foo"), "path");
    t.assert.strictEqual(gp("path/+/foo"), "path/+");
    t.assert.strictEqual(gp("path/*/foo"), "path");
    t.assert.strictEqual(gp("path/@/foo"), "path/@");
    t.assert.strictEqual(gp("path/!/foo/"), "path/!/foo");
    t.assert.strictEqual(gp("path/?/foo/"), "path");
    t.assert.strictEqual(gp("path/+/foo/"), "path/+/foo");
    t.assert.strictEqual(gp("path/*/foo/"), "path");
    t.assert.strictEqual(gp("path/@/foo/"), "path/@/foo");
    t.assert.strictEqual(gp("path/**/*"), "path");
    t.assert.strictEqual(gp("path/**/subdir/foo.*"), "path");
    t.assert.strictEqual(gp("path/subdir/**/foo.js"), "path/subdir");
    t.assert.strictEqual(gp("path/!subdir/foo.js"), "path/!subdir");
    t.assert.strictEqual(gp("path/{foo,bar}/"), "path");
  });

  it("should respect escaped characters", (t) => {
    t.assert.strictEqual(gp("path/\\*\\*/subdir/foo.*"), "path/**/subdir");
    t.assert.strictEqual(gp("path/\\[\\*\\]/subdir/foo.*"), "path/[*]/subdir");
    // Before minimatch, this escape was not respected
    t.assert.strictEqual(
      gp("path/\\*(a|b)/subdir/foo.*"),
      "path/*(a|b)/subdir",
    );
    // Before minimatch, parens were accepted but are an invalid extglob
    t.assert.strictEqual(
      gp("path/\\*/(a|b)/subdir/foo.*"),
      "path/*/(a|b)/subdir",
    );
    // Instead, they should be brackets, like `[a|b]`
    t.assert.strictEqual(gp("path/\\*/[a|b]/subdir/foo.*"), "path/*");
    t.assert.strictEqual(
      gp("path/\\*\\(a\\|b\\)/subdir/foo.*"),
      "path/*(a|b)/subdir",
    );
    t.assert.strictEqual(
      gp("path/\\[foo bar\\]/subdir/foo.*"),
      "path/[foo bar]/subdir",
    );
    t.assert.strictEqual(gp("path/\\[bar]/"), "path/[bar]");
    t.assert.strictEqual(gp("path/\\[bar]"), "path");
    t.assert.strictEqual(gp("[bar]"), ".");
    t.assert.strictEqual(gp("[bar]/"), ".");
    t.assert.strictEqual(gp("./\\[bar]"), ".");
    t.assert.strictEqual(gp("\\[bar]/"), "[bar]");
    t.assert.strictEqual(gp("\\!dir/*"), "!dir");
    // Before minimatch, this escape was not respected
    t.assert.strictEqual(gp("[bar\\]/"), "[bar]");
    t.assert.strictEqual(gp("path/foo \\[bar]/"), "path/foo [bar]");
    t.assert.strictEqual(gp("path/\\{foo,bar}/"), "path/{foo,bar}");
    t.assert.strictEqual(gp("\\{foo,bar}/"), "{foo,bar}");
    t.assert.strictEqual(gp("\\{foo,bar\\}/"), "{foo,bar}");
    // Before minimatch, this escape was not respected
    t.assert.strictEqual(gp("{foo,bar\\}/"), "{foo,bar}");

    t.assert.strictEqual(gp("foo-\\(bar\\).md"), ".");
    t.assert.strictEqual(gp("\\[bar]"), ".");
    t.assert.strictEqual(gp("[bar\\]"), ".");
    t.assert.strictEqual(gp("\\{foo,bar\\}"), ".");
    t.assert.strictEqual(gp("{foo,bar\\}"), ".");
  });

  it("should respect glob enclosures with embedded separators", (t) => {
    t.assert.strictEqual(gp("path/{,/,bar/baz,qux}/"), "path");
    t.assert.strictEqual(
      gp("path/\\{,/,bar/baz,qux}/"),
      "path/{,/,bar/baz,qux}",
    );
    t.assert.strictEqual(
      gp("path/\\{,/,bar/baz,qux\\}/"),
      "path/{,/,bar/baz,qux}",
    );
    t.assert.strictEqual(gp("/{,/,bar/baz,qux}/"), "/");
    t.assert.strictEqual(gp("/\\{,/,bar/baz,qux}/"), "/{,/,bar/baz,qux}");
    t.assert.strictEqual(gp("{,/,bar/baz,qux}"), ".");
    t.assert.strictEqual(gp("\\{,/,bar/baz,qux\\}"), "{,/,bar");
    t.assert.strictEqual(gp("\\{,/,bar/baz,qux}/"), "{,/,bar/baz,qux}");
    // Before minimatch, an escaped `/` was accepted within brackets, but minimatch does not accept that
    t.assert.strictEqual(gp("path/foo[a\\/]/"), "path/foo[a\\/]");
    t.assert.strictEqual(gp("path/foo\\[a\\/]/"), "path/foo[a\\/]");
    // Before minimatch, an escaped `/` was accepted within brackets, but minimatch does not accept that
    t.assert.strictEqual(gp("foo[a\\/]"), "foo[a\\");
    t.assert.strictEqual(gp("foo\\[a\\/]"), "foo[a\\");
    // This wasn't a properly specified extglob, but works with a preceding extglob character
    t.assert.strictEqual(gp("path/(foo/bar|baz)"), "path/(foo");
    t.assert.strictEqual(gp("path/?(foo/bar|baz)"), "path");
    // This wasn't a properly specified extglob, but works with a preceding extglob character
    t.assert.strictEqual(gp("path/(foo/bar|baz)/"), "path/(foo/bar|baz)");
    t.assert.strictEqual(gp("path/?(foo/bar|baz)/"), "path");
    t.assert.strictEqual(gp("path/\\(foo/bar|baz)/"), "path/(foo/bar|baz)");
  });

  it("should handle nested braces", (t) => {
    // Before minimatch, escapes on both closing } were not respected
    // Note: This has a trailing slash
    t.assert.strictEqual(
      gp("path/{../,./,{bar,/baz\\},qux\\}/"),
      "path/{../,./,{bar,/baz},qux}",
    );
    t.assert.strictEqual(gp("path/{../,./,\\{bar,/baz},qux}/"), "path");
    t.assert.strictEqual(
      gp("path/\\{../,./,\\{bar,/baz\\},qux\\}/"),
      "path/{../,./,{bar,/baz},qux}",
    );
    // Before minimatch, escapes on both closing } were not respected
    // Note: This has a trailing slash
    t.assert.strictEqual(
      gp("{../,./,{bar,/baz\\},qux\\}/"),
      "{../,./,{bar,/baz},qux}",
    );
    // Before minimatch, escapes on both closing } were not respected
    // Note: This has NO trailing slash
    t.assert.strictEqual(gp("{../,./,{bar,/baz\\},qux\\}"), "{../,./,{bar,");
    // Before minimatch, the escape was not respected
    // Note: Only one closing } is escaped so the tightest match is {baz,qux\\}}
    t.assert.strictEqual(gp("path/{,/,bar/{baz,qux\\}}/"), "path/{,/,bar");
    // Before minimatch, the escape was not respected
    // Note: Only one closing } is escaped so the tighest match is {baz,qux}
    t.assert.strictEqual(gp("path/{,/,bar/{baz,qux}\\}/"), "path/{,/,bar");
    t.assert.strictEqual(gp("path/\\{../,./,{bar,/baz},qux}"), "path/{../,.");
    t.assert.strictEqual(gp("path/\\{../,./,{bar,/baz},qux}/"), "path/{../,.");
  });

  it("should return parent dirname from non-glob paths", (t) => {
    t.assert.strictEqual(gp("path"), ".");
    t.assert.strictEqual(gp("path/foo"), "path");
    t.assert.strictEqual(gp("path/foo/"), "path/foo");
    t.assert.strictEqual(gp("path/foo/bar.js"), "path/foo");
  });

  it("should remove tail '.' and './'", (t) => {
    t.assert.strictEqual(gp("foo/./*"), "foo/");
    t.assert.strictEqual(gp("foo/./././*"), "foo/");
    t.assert.strictEqual(gp("./././*"), "./");
    t.assert.strictEqual(gp("/./././*"), "/");
  });

  it("(win) should remove tail '.' and './'", (t) => {
    t.assert.strictEqual(gp("C:/foo/./*"), "C:/foo/");
    t.assert.strictEqual(gp("C:/foo/./././*"), "C:/foo/");
    t.assert.strictEqual(gp("C:/./././*"), "C:/");

    t.assert.strictEqual(gp("C:foo/./*"), "C:foo/");
    t.assert.strictEqual(gp("C:foo/./././*"), "C:foo/");
    t.assert.strictEqual(gp("C:./././*"), "C:");
  });

  it(
    "(win) treat escaped brackets as normal chars",
    { skip: !isWin32 },
    (t) => {
      t.assert.strictEqual(gp("aaa\\}"), ".");
      t.assert.strictEqual(gp("\\{aaa/bbb\\}"), "{aaa");
      t.assert.strictEqual(gp("\\{\\{aaa/bbb\\}"), "{{aaa");
      // Before minimatch, a pattern that matched exactly one item was still determined as magic
      t.assert.strictEqual(gp("{\\{aaa/bbb}"), "{{aaa");
      t.assert.strictEqual(gp("{\\{aaa/bbb}/"), "{{aaa/bbb}");
      t.assert.strictEqual(gp("{\\{aaa/bbb,ccc}"), ".");
      t.assert.strictEqual(gp("{\\{aaa/bbb,ccc}/"), ".");
      // Before minimatch, a pattern that matched exactly one item was still determined as magic
      t.assert.strictEqual(gp("ccc/{\\{aaa/bbb}"), "ccc/{{aaa");
      t.assert.strictEqual(gp("ccc/{\\{aaa/bbb}/"), "ccc/{{aaa/bbb}");
      t.assert.strictEqual(gp("ccc/{\\{aaa/bbb,ccc}"), "ccc");
      t.assert.strictEqual(gp("ccc/{\\{aaa/bbb,ccc}/"), "ccc");
      t.assert.strictEqual(gp("ccc\\/\\{\\{aaa/bbb}"), "ccc\\/{{aaa");
    },
  );

  it("(nix) treat escaped brackets as normal chars", { skip: isWin32 }, (t) => {
    t.assert.strictEqual(gp("aaa\\}"), ".");
    t.assert.strictEqual(gp("\\{aaa/bbb\\}"), "{aaa");
    t.assert.strictEqual(gp("\\{\\{aaa/bbb\\}"), "{{aaa");
    // Before minimatch, a pattern that matched exactly one item was still determined as magic
    t.assert.strictEqual(gp("{\\{aaa/bbb,ccc}"), ".");
    // Before minimatch, a pattern that matched exactly one item was still determined as magic
    t.assert.strictEqual(gp("ccc/{\\{aaa/bbb,ddd}"), "ccc");
    t.assert.strictEqual(gp("ccc\\/\\{\\{aaa/bbb}"), "ccc\\/{{aaa");
  });
});

describe("glob2base test patterns", () => {
  it("should get a base name", (t) => {
    t.assert.strictEqual(gp("js/*.js"), "js");
  });

  it("should get a base name from a nested glob", (t) => {
    t.assert.strictEqual(gp("js/**/test/*.js"), "js");
  });

  it("should get a base name from a flat file", (t) => {
    t.assert.strictEqual(gp("js/test/wow.js"), "js/test");
    t.assert.strictEqual(gp("js/test/wow.js"), "js/test");
  });

  it("should get a base name from character class pattern", (t) => {
    t.assert.strictEqual(gp("js/t[a-z]st}/*.js"), "js");
  });

  it("should get a base name from brace , expansion", (t) => {
    t.assert.strictEqual(gp("js/{src,test}/*.js"), "js");
  });

  it("should get a base name from brace .. expansion", (t) => {
    t.assert.strictEqual(gp("js/test{0..9}/*.js"), "js");
  });

  it("should get a base name from extglob", (t) => {
    t.assert.strictEqual(gp("js/t+(wo|est)/*.js"), "js");
  });

  it("should get a base name from a path with non-exglob parens", (t) => {
    // Before minimatch, this invalid extglob were accepted, but they work if properly specified
    t.assert.strictEqual(gp("js/t(wo|est)/*.js"), "js/t(wo|est)");
    t.assert.strictEqual(gp("js/t+(wo|est)/*.js"), "js");
    // Before minimatch, this invalid extglob were accepted, but they work if properly specified
    t.assert.strictEqual(gp("js/t/(wo|est)/*.js"), "js/t/(wo|est)");
    t.assert.strictEqual(gp("js/t/+(wo|est)/*.js"), "js/t");
  });

  it("should get a base name from a complex brace glob", (t) => {
    t.assert.strictEqual(
      gp("lib/{components,pages}/**/{test,another}/*.txt"),
      "lib",
    );

    t.assert.strictEqual(gp("js/test/**/{images,components}/*.js"), "js/test");

    t.assert.strictEqual(
      gp("ooga/{booga,sooga}/**/dooga/{eooga,fooga}"),
      "ooga",
    );
  });

  it("should not be susceptible to SNYK-JS-GLOBPARENT-1016905", { timeout: 1 }, () => {
    // This will time out if susceptible.
    gp("{" + "/".repeat(5000));
  });

  // Minimatch limit
  it("fails on patterns of size >=65,536 (1024*64)", (t) => {
    var expected = {
      name: "TypeError",
      message: "pattern is too long",
    };
    t.assert.throws(() => {
      // [CVE-2021-35065]
      gp("{" + "/".repeat(500000));
    }, expected);
    t.assert.throws(() => {
      gp("{".repeat(500000));
    }, expected);
    t.assert.throws(() => {
      gp("(".repeat(500000));
    }, expected);
    t.assert.throws(() => {
      gp("/(".repeat(500000) + ")");
    }, expected);
    t.assert.throws(() => {
      gp("*/".repeat(500000));
    }, expected);
  });
});

describe("windows path with drive or UNC volume", { skip: !isWin32 }, () => {
  it("should return parent dirname from absolute path with drive letter", (t) => {
    t.assert.strictEqual(gp("C:/"), "C:/");
    t.assert.strictEqual(gp("C:/."), "C:/");
    t.assert.strictEqual(gp("C:/*"), "C:/");
    t.assert.strictEqual(gp("C:/./*"), "C:/");
    t.assert.strictEqual(gp("C://"), "C:/");
    t.assert.strictEqual(gp("C://*"), "C:/");
    t.assert.strictEqual(gp("C:/path/*.js"), "C:/path");
  });

  it("should return parent dirname from relative path with drive letter", (t) => {
    t.assert.strictEqual(gp("C:"), "C:");
    t.assert.strictEqual(gp("C:."), "C:");
    t.assert.strictEqual(gp("C:*"), ".");
    t.assert.strictEqual(gp("C:./*"), "C:");
    t.assert.strictEqual(gp("C:.//"), "C:");
    t.assert.strictEqual(gp("C:.//*"), "C:");
    t.assert.strictEqual(gp("C:path/*.js"), "C:path");
  });

  it("should return parent dirname from UNC path", (t) => {
    t.assert.strictEqual(gp("//ComputerName/Share/"), "//ComputerName/Share/");
    t.assert.strictEqual(gp("//ComputerName/Share/."), "//ComputerName/Share/");
    t.assert.strictEqual(gp("//ComputerName/Share/*"), "//ComputerName/Share/");
    t.assert.strictEqual(
      gp("//ComputerName/Share/./*"),
      "//ComputerName/Share/",
    );
    t.assert.strictEqual(gp("//ComputerName/Share//"), "//ComputerName/Share/");
    t.assert.strictEqual(
      gp("//ComputerName/Share//*"),
      "//ComputerName/Share/",
    );
    t.assert.strictEqual(
      gp("//ComputerName/Share/path/*.js"),
      "//ComputerName/Share/path",
    );

    t.assert.strictEqual(gp("//?/C:/"), "//?/C:/");
    t.assert.strictEqual(gp("//?/C:/."), "//?/C:/");
    t.assert.strictEqual(gp("//?/C:/*"), "//?/C:/");
    t.assert.strictEqual(gp("//?/C:/./*"), "//?/C:/");
    t.assert.strictEqual(gp("//?/C://"), "//?/C:/");
    t.assert.strictEqual(gp("//?/C://*"), "//?/C:/");
    t.assert.strictEqual(gp("//?/C:/path/*.js"), "//?/C:/path");
  });
});
