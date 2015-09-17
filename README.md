# verbose-console-log

Standard node.js console.log not shows line numbers, verbose-console-log do.

## Installation

```bash
npm install verbose-console-log --save
```

## Usage

```javascript
var logger = require("./verboseConsoleLog.js");

logger.log("foo", "bar");
logger.warn("baz", "bat");

try {
    something.wrong();
} catch(err) {
    logger.error("asdf", "qwer");
}
```

Output:

```bash
~/src/index.js:3:8 foo bar
~/src/index.js:4:8 baz bat
~/src/index.js:9:12 asdf qwer
```

## Capabilities

You can use this with source maps, if there is appropriate *.map file next to your file, for example:

```
/src
 | index.js
 | index.js.map
```

## Testing

For testing, you must install mocha and run gulp and mocha

```bash
cd verbose-console-log
npm i -g mocha
gulp
mocha
```