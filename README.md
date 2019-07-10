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

      /^[A-Za-z_$][A-Za-z0-9_$]*$/

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


example
--------------------------------------------------------------------------------

```console
$ sloppy-json -E < package.json
{
    name: "sloppy-json"
    version: "1.0.0"
    private: true
    description: "deals with sloppy json"
    license: MIT
    author: "Patrick Mueller <pmuellr@apache.org> (https://github.com/pmuellr)"
    homepage: "https://github.com/pmuellr/sloppy-json"
    main: "sloppy-json.js"
    bin: {
        "sloppy-json": "./lib/cli.js"
    }
    scripts: {
        build: "echo npm run build: TBD"
        "deps-check": "node tools/deps-check.js"
        "ts-check": "echo 'running ts-check'; tsc --allowJs --checkJs --noEmit --target ES5 --resolveJsonModule *.js"
        "ts-check-skip": "echo 'skipping ts-check for the moment'"
        ncu: "ncu -u --packageFile package.json"
        serve: serve
        standard: "echo 'running standard'; standard --verbose"
        test: "npm run -s deps-check && npm run -s standard && npm run -s ts-check && npm run -s test:unit"
        "test:unit": "echo 'running unit tests'; jest --colors"
        watch: "nodemon --exec 'npm run -s test; node tools/log-time finished'"
    }
    repository: {
        type: git
        url: "https://github.com/pmuellr/sloppy-json.git"
    }
    bugs: {
        url: "https://github.com/pmuellr/sloppy-json/issues"
    }
    standard: {
        ignore: [
            "tmp/**/*"
            "docs/**/*"
        ]
    }
    jest: {
        testEnvironment: node
        verbose: true
    }
    nodemonConfig: {
        ext: "js,ts,json"
    }
    dependencies: {}
    devDependencies: {
        "@types/jest": "^24.0.15"
        "@types/node": "^12.0.10"
        "dependency-check": "^3.3.0"
        jest: "^24.8.0"
        nodemon: "^1.19.1"
        "random-seed": "^0.3.0"
        serve: "^11.0.2"
        standard: "^12.0.1"
        typescript: "^3.5.2"
        uuid: "^3.3.2"
    }
}
```


cli usage
--------------------------------------------------------------------------------

```console
$ sloppy-json
sloppy-json 1.0.0

usage:
  sloppy-json -d <value>  - decode the value
  sloppy-json -D <value>  - decode the value indented
  sloppy-json -e <value>  - encode the value
  sloppy-json -E <value>  - encode the value indented
  sloppy-json -h          - print this help
  sloppy-json -v          - print the version

<value> should be a string to be encoded or decoded.  If it is not
provided the value will be read from stdin.

Decoding will return a JSON respresentation of the sloppy JSON
passed as a parameter.
Encoding will return a sloopy JSON respresentation of the sloppy json
passed as a parameter.
```

api usage
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