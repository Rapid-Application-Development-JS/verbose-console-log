"use strict";

var logger = require("../../../verboseConsoleLog.js");

module.exports = {
    doLoggingStuff: function doLoggingStuff() {
        var a = 10;
        var b = 20;
        var promise = logger.test_log(a + b);

        return promise;
    }
};
//# sourceMappingURL=test_0_1_2.js.map