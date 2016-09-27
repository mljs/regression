'use strict';

var SLR = require('..').SLR;

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

        var y = regression.predict(85);
        regression.computeX(y).should.equal(85);
        y.should.be.approximately(28.088235294117649, 1e-10);

        regression.toString(3).should.equal('f(x) = - 0.265 * x + 50.6');
    });
    it('SLR2', function () {
        // example from https://en.wikipedia.org/wiki/Simple_linear_regression#Numerical_example
        var inputs = [1.47, 1.50, 1.52, 1.55, 1.57, 1.60, 1.63, 1.65, 1.68, 1.70, 1.73, 1.75, 1.78, 1.80, 1.83];
        var outputs = [52.21, 53.12, 54.48, 55.84, 57.20, 58.57, 59.93, 61.29, 63.11, 64.47, 66.28, 68.10, 69.92, 72.19, 74.46];

        var regression = new SLR(inputs, outputs, {computeQuality: true});

        //regression.quality.r2.should.be.a.Number().and.equal(regression.coefficientOfDetermination);

        regression.slope.should.be.approximately(61.272, 1e-3);
        regression.intercept.should.be.approximately(-39.062, 1e-3);
        regression.quality.r.should.be.approximately(0.9945, 1e-4);
        regression.quality.r2.should.equal(regression.quality.r * regression.quality.r);
        regression.quality.chi2.should.lessThan(1);
        regression.quality.rmsd.should.lessThan(1);
    });
    it('SLR3', function () {
        var inputs = [0, 1, 2, 3, 4, 5];
        var outputs = [10, 8, 6, 4, 2, 0];

        var regression = new SLR(inputs, outputs, {computeQuality: true});

        regression.quality.r2.should.equal(1);
        regression.slope.should.equal(-2);
        regression.intercept.should.equal(10);
        regression.predict(6).should.equal(-2);
        regression.predict(-1).should.equal(12);
        regression.predict(2.5).should.equal(5);
        regression.computeX(5).should.equal(2.5);
        regression.computeX(9).should.equal(0.5);
        regression.computeX(-12).should.equal(11);
        regression.quality.r.should.be.greaterThan(0);
        regression.quality.chi2.should.equal(0);
        regression.quality.rmsd.should.equal(0);

        regression.toString(3).should.equal('f(x) = - 2.00 * x + 10.0');
    });
    it('SLR constant', function () {
        var inputs = [0, 1, 2, 3];
        var outputs = [2, 2, 2, 2];

        var regression = new SLR(inputs, outputs);

        regression.toLaTeX().should.equal('f(x) = 2');
        regression.toString().should.equal('f(x) = 2');
        regression.toString(1).should.equal('f(x) = 2');
        regression.toString(5).should.equal('f(x) = 2.0000');
    });
    it('negative intercept and slope', function () {
        var inputs = [-1, 0, 1];
        var outputs = [-2, -1, 0];

        var regression = new SLR(inputs, outputs);

        regression.toString().should.equal('f(x) = x - 1');
    });
    it('different size on input and output', function () {
        var inputs = [0, 1, 2];
        var outputs = [0, 1];
        (function () {
            new SLR(inputs, outputs);
        }).should.throw(RangeError, {message: 'input and output array have a different length'});
    });
    it('Load and export model', function () {
        var regression = SLR.load({
            name: 'simpleLinearRegression',
            slope: 1,
            intercept: 1,
            quality: {
                r: 1,
                r2: 1,
                chi2: 145.8,
                rmsd: 0
            }
        });
        regression.slope.should.equal(1);
        regression.intercept.should.equal(1);

        var model = regression.toJSON();
        model.name.should.equal('simpleLinearRegression');
        model.slope.should.equal(1);
        model.intercept.should.equal(1);
    });
});
