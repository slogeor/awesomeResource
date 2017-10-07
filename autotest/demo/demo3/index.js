module.exports = function (info) {
    // 使用should测试Promise对象时，一定要return，否则断言将无效
    return new Promise(function (resolve) {
        return resolve("Hello " + info);
    });
};
