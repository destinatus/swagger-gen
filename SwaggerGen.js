"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var SwaggerGen = /** @class */ (function () {
    function SwaggerGen() {
    }
    SwaggerGen.prototype.parseTests = function () {
        fs_1["default"].readFile("./Sample.test.ts", function (err, data) {
            console.log(data);
        });
    };
    return SwaggerGen;
}());
exports["default"] = SwaggerGen;
