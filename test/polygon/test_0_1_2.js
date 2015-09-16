var logger = require("../../../verboseConsoleLog.js");

module.exports = {
    doLoggingStuff: function() {
        var a = 10;
        var b = 20;
        var promise = logger.test_log(a+b);

        return promise;
    }
}
