var Utils = (function (exports) {
    'use strict';

    function sum(a, b) {
        return a + b;
    }
    function sub(a, b) {
        return a - b;
    }
    function mul(a, b) {
        return a * b;
    }
    function div(a, b) {
        return a / b;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function trim(str) {
        return str.trim();
    }

    exports.capitalize = capitalize;
    exports.div = div;
    exports.mul = mul;
    exports.sub = sub;
    exports.sum = sum;
    exports.trim = trim;

    return exports;

})({});
//# sourceMappingURL=index.iife.js.map
