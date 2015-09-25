/**
 * Created by anatoliybondar on 9/14/15.
 */

var fs = require('fs');
var SourceMapConsumer = require('source-map').SourceMapConsumer;

logger = {
    // For testing purposes - messages will be returned instead of writing to io
    testing: false,

    log: function() {this.testing = false; this.doAction({loggerArguments:arguments, action: "log"});},
    error: function() {this.testing = false; this.doAction({loggerArguments:arguments, action: "error"});},
    warn: function() {this.testing = false; this.doAction({loggerArguments:arguments, action: "warn"});},
    test_log: function() {this.testing = true; return this.doTestAction({loggerArguments:arguments, action: "log"});},

    doTestAction: function(options) {
        var self = this;
        return new Promise(function(resolve, reject) {
            options.resolve = resolve;
            options.reject = reject;
            self.doAction(options);
        });
    },

    doAction: function(options) {
        var self = this;
        var resolve = options.resolve;
        var reject = options.reject;

        try {
            var originalArgumentsArr = Array.prototype.slice.call(options.loggerArguments);
            var updatedArgumentsArr = originalArgumentsArr;
        } catch(err) {
            console.error(err);
            if(self.testing) {
                reject(err);
            }
            return;
        }

        /**
         * @param argumentsArr - Array of arguments with first argument as CallSite.
         * For example if originalArgumentsArr = ["foo", "bar"]
         * then argumentsArr = ["/source/js/my_file.js:12:8", "foo", "bar"]
         */
        function log(argumentsArr) {
            try {
                if(true === self.testing) {
                    resolve(argumentsArr);
                } else {
                    console[options.action].apply(self, argumentsArr);
                }
            } catch(err) {
                console.error(err);
                if(self.testing) {
                    reject(err);
                }
                return;
            }
        }

        var stack = this._getStack();

        for(var i in stack) {
            if(this._isValidFileName(stack[i].getFileName())) {
                // is *.map (source map) file exists
                try {
                    var rawSourceMap = fs.readFileSync(stack[i].getFileName()+'.map');

                    // If no error, there is *.map file, try to retrieve original "fileName" and "lineNumber"
                    try {
                        var smc = new SourceMapConsumer(rawSourceMap.toString('utf8', 0, rawSourceMap.length));
                        var originalPosition = smc.originalPositionFor({
                            line: stack[i].getLineNumber(),
                            column: stack[i].getColumnNumber()
                        });

                        updatedArgumentsArr.unshift(originalPosition.source+":"+originalPosition.line+":"+originalPosition.column);
                        log(updatedArgumentsArr);
                    } catch(err) {
                        console.error(err);
                        if(self.testing) {
                            reject(err);
                        }
                        return;
                    }
                } catch(e) {
                    // *.map not exists, just do "console.log" stuff
                    updatedArgumentsArr.unshift(stack[i].getFileName()+":"+stack[i].getLineNumber()+":"+stack[i].getColumnNumber());
                    log(updatedArgumentsArr);
                }
                return;
            }
        }
    },

    /**
     * Check is fileName one of system files
     */
    _isValidFileName: function(fileName) {
        if(
            !fileName
            || (fileName && fileName.match(/v8-debug/))
            || (fileName && fileName.match(/ConsoleAgent/))
            || (fileName && fileName.match(/verboseConsoleLog\.js/))
        ) {
            return false;
        }

        return true;
    },

    _getStack: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack){ return stack; };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
}

module.exports = logger;