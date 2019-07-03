sloppy-json - deals with sloppy json
================================================================================

`sloppy-json` is a JSON parser that allows some slop:

- comma characters `,` aren't required in objects or arrays
- not all strings need to be quoted
- comments are allowed

\o/

specifically:

- the sloppy-json parser will parse completely legal JSON correctly
- in those places you would require a comma character `,` in a JSON
  string, you may omit it
- strings which don't contain any "special characters" don't need to
  be quoted
- in addition to the double quote `"` used by JSON, you can also use
  a single quote `'` or back-tic ```` as a string delimiter
- comments are started with a `#` or `//` prefix, and continue to the
  end of the line


why
--------------------------------------------------------------------------------

Turns out there are a lot of cases where I need to enter some basic JSON stuff
at the command-line, but it's always a pain what with all the ceremony of
_tradition_ JSON.  Screw that, let's make it easier.


install
--------------------------------------------------------------------------------

    npm install pmuellr/sloppy-json


usage
--------------------------------------------------------------------------------

    const SloppyJSON = require('sloppy-json')
    const object = SloppyJSON.parse('{a:b c:d}') // { a: "b", c: "d" }
    const boring = JSON.stringify(object)        // { "a": "b", "c": "d" }
    const sloppy = SloppyJSON.stringify(object)  // "{a:b c:d}"

api
--------------------------------------------------------------------------------

### `SloppyJSON.parse(string)`

Like `JSON.parse()`, but accepts some slop, and no other arguments besides the
string to parse.

### `SloppyJSON.stringify(object, [ ignored, [ indent] ] )`

Like `JSON.stringify()`, but the second argument is ignored.


license
================================================================================

This package is licensed under the MIT license.  See the [LICENSE.md][] file
for more information.


contributing
================================================================================

Awesome!  We're happy that you want to contribute.

Please read the [CONTRIBUTING.md][] file for more information.


[LICENSE.md]: LICENSE.md
[CONTRIBUTING.md]: CONTRIBUTING.md
[CHANGELOG.md]: CHANGELOG.md