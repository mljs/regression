'use strict';

const BaseRegression = require('../src/regression/base-regression');

describe('Theil-Sen regression', function () {

    it('Implementation of methods', function () {
        class Test extends BaseRegression {}
        const test = new Test();

        test.toString().should.be.equal('');
        test.toLaTeX().should.be.equal('');
        (test.train() === undefined).should.be.equal(true);
    });

    it('Predict exceptions', function () {
        class Test extends BaseRegression {}
        const test = new Test();
        const data = [1, 2];

        test.predict.bind(test, data).should.throw('_compute not implemented');
        test.predict.bind(test, 'a').should.throw('x must be a number or array');
    });
});
