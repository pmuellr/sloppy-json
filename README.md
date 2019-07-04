sloppy-json - deals with sloppy json
================================================================================

`sloppy-json` is a JSON parser that allows some slop:

- comma characters "`,`" aren't required in objects or arrays
- not all strings need to be quoted
- new string form - back-tick strings prefixed with "`` ` ``"
- comments are allowed

\o/

specifically:

- the sloppy-json parser will parse completely legal JSON correctly
- in those places you would require a comma character "`,`" in a JSON
  string, you may omit it
- strings which are valid JavaScript identifiers (in the traditional sense,
  not you "`π`") don't need quotes at all
- in addition to the double quote "`"`" used by JSON, you can also use
  a single quote "`'`"
- a new string form is introduced: back-tick strings (see below)
- comments are started with a "`#`" or "`//`" prefix, and continue to the
  end of the line


why
--------------------------------------------------------------------------------

Turns out there are a lot of cases where I need to enter some basic JSON stuff
at the command-line, but it's always a pain what with all the ceremony of
_tradition_ JSON.  Screw that, let's make it easier.


strings
--------------------------------------------------------------------------------

Strings are supported in a couple of fashions:

- traditional double-quote strings using "`"`"

- alternatively, using single-quote strings using "`'`"

- unquoted strings, which are valid JavaScript identifiers, matching the
  following:

      /[A-Za-z_\$][A-Za-z0-9_\$]*/

  are treated as their string value; eg

      { abc: def } === { "abc": "def" }

- back-tick strings: strings preceded by a back-tick character "`` ` ``" will
  take their value from all the characters to the next whitespace character; eg

      { `a:b : `2019-07-03 } == { "a:b": "2019-07-03" }

  Back-tick strings also do no escaping; eg

      { `a:b : `\n } == { "a:b": "\\n" }  // two chars - `\` and `n`, not linefeed


Double- and single-quoted strings are treated the same as in JSON with respect
to escape characters and what-not.

Care should be taken using back-tick strings to ensure you have white-space
terminating the string, eg

      { `a:b: `2019-07-03 } throws an error; the first token is "a:b:"


numbers
--------------------------------------------------------------------------------

Numbers are treated the same as in JSON.


cheating
--------------------------------------------------------------------------------

Strings and numbers are hard, so we make use of `JSON.parse()` to help.

For single- and double-quoted strings, a buffer is constructed with the contents
of the string, the string contents are wrapped in double-quotes, and then
passed to `JSON.parse()`.  Bare double-quote characters used in single-quoted 
strings will be replaced with the escaped form '`\"`'.

Back-tick strings are not processed like this, their verbatim contents are used
as the string value.

For numbers, rather than deal with the arcanity, a number is recognized as
a token that starts with a digit, "`-`", or "`+`".  Subsequent characters that
can be used in a number are then collected into the eventual string to
evaluate; that includes digits, "`-`", "`+`", "`.`", "`e`", "`E`".  All these
characters are collected, and then passed to `JSON.parse()` to do the heavy
lifing.  This means such oddities as `123.456.eee+-8+9` are treated as potential
number, but obviously will not parse as a valid value.  But they aren't valid
JSON either, so it's more of an error reporting issue than anything.

In addition, the underscore character is just ignored in numbers, eg

    123_456 === 123456


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