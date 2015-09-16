var should = require("chai").should();
var test_0_1_1 = require("./polygon/test_0_1_1");
var test_0_1_2 = require("./polygon/builded/test_0_1_2");

describe("0.1: Routing checking", function () {

    it("0.1.1: Check simple log", function () {
        var promise = test_0_1_1.doLoggingStuff();

        return promise.then(function(result) {
            var match1 = result[0].match(/test_0_1_1.js:7:30/) ? true : false;
            var match2 = (30 === result[1]);

            match1.should.equal(true);
            match2.should.equal(true);
        });
    });

    it("0.1.2: Check source maps working", function () {
        var promise = test_0_1_2.doLoggingStuff();

        return promise.then(function(result) {
            var match1 = result[0].match(/test_0_1_2.js:7:29/) ? true : false;
            var match2 = (30 === result[1]);

            match1.should.equal(true);
            match2.should.equal(true);
        });
    });
});
