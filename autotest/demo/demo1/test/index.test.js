'use strict';

require('should');

const hello = require('../index.js');

// 测试分组
describe('My First Test', function () {
    // 定义测试用例
    it('should get "hello HFE"', function () {
        return hello().should.be.eql('hello HFE');
    });
});
