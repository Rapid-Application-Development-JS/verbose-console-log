/**
 * Created by anatoliybondar on 9/14/15.
 */

var fs = require('fs');
var SourceMapConsumer = require('source-map').SourceMapConsumer;

logger = {
    log: function() {this.doAction({loggerArguments:arguments, action: "log"});},
    error: function() {this.doAction({loggerArguments:arguments, action: "error"});},
    warn: function() {this.doAction({loggerArguments:arguments, action: "warn"});},
    debug: function() {this.doAction({loggerArguments:arguments, action: "debug"});},

    doAction: function(options) {
        var self = this;

        try {
            var originalArgumentsArr = Array.prototype.slice.call(options.loggerArguments);
            var updatedArgumentsArr = originalArgumentsArr;
        } catch(err) {
            console.error(err);
            return;
        }

        // Array of arguments with first argument as CallSite. For example if originalArgumentsArr = ["foo", "bar"]
        // then updatedArgumentsArr = ["/source/js/my_file.js:12:8", "foo", "bar"]
        //var updatedArgumentsArr = this.addCallSiteInfoToArguments(originalArgumentsArr);

        function log(argumentsArr) {
            try {
                console[options.action].apply(self, argumentsArr);
            } catch(err) {
                console.error(err);
                return;
            }
        }

        var stack = this._getStack();

        for(var i in stack) {
            if(this._isValidFileName(stack[i].getFileName())) {
                // is *.map (source map) file exists
                fs.stat(stack[i].getFileName()+'.map', function(err, statObject) {
                    if(err) {
                        // *.map not exists, just do "console.log" stuff
                        updatedArgumentsArr.unshift(stack[i].getFileName()+":"+stack[i].getLineNumber()+":"+stack[i].getColumnNumber());
                        log(updatedArgumentsArr);
                    } else {
                        // there is *.map file, try to retrieve original "fileName" and "lineNumber"
                        fs.readFile(stack[i].getFileName()+".map", function (err, rawSourceMap) {
                            if (err) {
                                console.error(err);
                                return;
                            }

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
                                return;
                            }
                        });
                    }
                });
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
            || (fileName && fileName.match(/verboseConsoleLog/))
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