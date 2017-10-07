"use strict";

function asyn(info, callback) {
    // retrun 不可少
    return setTimeout(function () {
        // retrun 不可少
        return callback("Hello " + (info || 'World'));
    }, 1000);
}

module.exports = asyn;
