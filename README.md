<p align="center">
  <a href="https://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# glob-parent

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Extract the non-magic parent path from a glob string.

## Usage

```js
var globParent = require("glob-parent");

globParent("path/to/*.js"); // 'path/to'
globParent("/root/path/to/*.js"); // '/root/path/to'
globParent("/*.js"); // '/'
globParent("*.js"); // '.'
globParent("**/*.js"); // '.'
globParent("path/{to,from}"); // 'path'
globParent("path/!(to|from)"); // 'path'
globParent("path/?(to|from)"); // 'path'
globParent("path/+(to|from)"); // 'path'
globParent("path/*(to|from)"); // 'path'
globParent("path/@(to|from)"); // 'path'
globParent("path/**/*"); // 'path'

// if provided a non-glob path, returns the nearest dir
globParent("path/foo/bar.js"); // 'path/foo'
globParent("path/foo/"); // 'path/foo'
globParent("path/foo"); // 'path' (see issue #3 for details)
```

## API

### `globParent(glob: string): string`

Takes a string and returns the part of the path before the glob begins. Be aware of [Escaping] and [Windows] below.

## Escaping

The following characters have special significance in glob patterns and may need to be escaped if you want them to be treated as regular path characters:

- `?` (question mark)
- `*` (asterisk)
- `|` (pipe)
- `(` (opening parenthesis)
- `)` (closing parenthesis)
- `{` (opening curly brace)
- `}` (closing curly brace)
- `[` (opening bracket)
- `]` (closing bracket)

**Example**

```js
globParent("foo/[bar]/"); // 'foo'
globParent("foo/\\[bar]/"); // 'foo/[bar]'
```

## Windows

> [!IMPORTANT]
> Backslashes are not valid path separators for globs.
> If a path with backslashes is provided, glob-parent will **NOT** treat them as path separators.

For example, `C:\\Program Files \\(x86\\)\\*.ext` is not a valid glob. Instead, use `/` for separators and `\\` for escaping special characters, such as `C:/Program Files \\(x86\\)/*.ext`.

## Strict No LLM / No AI Policy

No LLMs for issues.

No LLMs for patches / pull requests.

No LLMs for comments on the bug tracker, including translation.

English is encouraged, but not required. You are welcome to post in your native language and rely on others to have their own translation tools of choice to interpret your words.

## License

ISC

<!-- prettier-ignore-start -->
[Escaping]: #escaping
[Windows]: #windows
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/glob-parent.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/glob-parent
[npm-image]: https://img.shields.io/npm/v/glob-parent.svg?style=flat-square

[ci-url]: https://github.com/gulpjs/glob-parent/actions/workflows/dev.yml
[ci-image]: https://img.shields.io/github/actions/workflow/status/gulpjs/glob-parent/dev.yml?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/glob-parent
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/glob-parent/main.svg?style=flat-square
<!-- prettier-ignore-end -->
