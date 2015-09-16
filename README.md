# verbose-console-log
Standard node.js console.log not shows line numbers, verbose-console-log do.

You can use this with source maps, if there is appropriate *.map file next to your file, for example:

```
/src
 | index.js
 | index.js.map
```

##Examples

```
var logger = require("verbose-console-log");

console.log("foo", "bar");

try {
    something.wrong();
} catch(err) {
    logger.error("asdf", "qwer");
}
```

### Allowed methods:

log, error, warn, debug

## Dev, testing

For testing, you must install mocha and run gulp and mocha

```
cd verbose-console-log
npm i -g mocha
gulp
mocha
```