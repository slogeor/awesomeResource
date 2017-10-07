'use strict';

require('should');
var myPromise = require('../index');

describe('promise Test', function () {
  it('Welcome to HFE', function () {
    return myPromise('HFE').should.be.fulfilledWith('Hello HFE');
  });
});
