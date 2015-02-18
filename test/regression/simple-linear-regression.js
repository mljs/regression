'use strict';

var SLR = require('../..').SLR;

describe('Simple linear regression', function () {
    it('SLR1', function () {
        var inputs = [80, 60, 10, 20, 30];
        var outputs = [20, 40, 30, 50, 60];

        var regression = new SLR();
        regression.regress(inputs, outputs);

        var y = regression.compute(85);
        var s = regression.slope;
        var c = regression.intercept;

        y.should.be.approximately(28.088235294117649, 1e-10);
        s.should.be.approximately(-0.264706, 1e-5);
        c.should.be.approximately(50.588235, 1e-5);
    });
    it('SLR2', function () {
        var inputs2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var outputs2 = [1, 6, 17, 34, 57, 86, 121, 162, 209, 262, 321];

        var regression2 = new SLR();
        regression2.regress(inputs2, outputs2);

        var toString1 = regression2.toString();
        var toString2 = regression2.toString(2);

        toString1.should.equal('y(x) = 32x + -44');
        toString2.should.equal('y(x) = 32.00x + -44.00');
    });
});
