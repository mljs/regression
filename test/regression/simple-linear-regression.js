'use strict';

var SLR = require('../..').SLR;

describe('Simple linear regression', function () {
    it('SLR1', function () {
        var inputs = [80, 60, 10, 20, 30];
        var outputs = [20, 40, 30, 50, 60];

        var regression = new SLR(inputs, outputs);

        regression.coefficients.should.be.an.Array().with.lengthOf(2);
        regression.slope.should.equal(regression.coefficients[1]);
        regression.intercept.should.equal(regression.coefficients[0]);

        regression.slope.should.be.approximately(-0.264706, 1e-5);
        regression.intercept.should.be.approximately(50.588235, 1e-5);

        var y = regression.compute(85);
        y.should.be.approximately(28.088235294117649, 1e-10);
    });
    it('SLR2', function () {
        // example from https://en.wikipedia.org/wiki/Simple_linear_regression#Numerical_example
        var inputs = [1.47, 1.50, 1.52, 1.55, 1.57, 1.60, 1.63, 1.65, 1.68, 1.70, 1.73, 1.75, 1.78, 1.80, 1.83];
        var outputs = [52.21, 53.12, 54.48, 55.84, 57.20, 58.57, 59.93, 61.29, 63.11, 64.47, 66.28, 68.10, 69.92, 72.19, 74.46];

        var regression = new SLR(inputs, outputs);

        regression.r2.should.be.a.Number().and.equal(regression.coefficientOfDetermination);

        regression.slope.should.be.approximately(61.272, 1e-3);
        regression.intercept.should.be.approximately(-39.062, 1e-3);
        regression.r.should.be.approximately(0.9945, 1e-4);
        regression.r2.should.equal(regression.r * regression.r);
    });
});
