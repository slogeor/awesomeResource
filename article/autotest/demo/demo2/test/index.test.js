require('should');
var async = require('../index.js');

setTimeout(function () {
    describe('async Test', function () {
        // done 标识异步测试
        it('Welcome to HFE', function (done) {
            async('HFE', function (rst) {
                rst.should.be.eql('Hello HFE');
                done();
            });
        });
    });
    run();
}, 1000);

