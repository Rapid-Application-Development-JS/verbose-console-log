var should = require("chai").should();
var logger = require("../verboseConsoleLog.js");

describe("0.1: Routing checking", function () {

    it("0.1.1: Check simple log, error etc", function () {
        "asdf".should.equal('asdff');
    });

    it("0.1.2: Check source maps working", function () {
        "qwer".should.equal('qwer');
    });
});
