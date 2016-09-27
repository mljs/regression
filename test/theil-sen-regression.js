'use strict';

const TheilSenRegression = require('..').TheilSenRegression;

describe('Theil-Sen regression', function () {
    it('Simple case', function () {
        var inputs = [1, 2, 3, 4, 5];
        var outputs = [2, 3, 4, 5, 6];

        var regression = new TheilSenRegression(inputs, outputs);

        regression.coefficients.should.be.an.Array().with.lengthOf(2);
        regression.slope.should.equal(regression.coefficients[1]);
        regression.intercept.should.equal(regression.coefficients[0]);

        regression.slope.should.be.approximately(1, 1e-5);
        regression.intercept.should.be.approximately(1, 1e-5);

        var y = regression.predict(85);
        regression.computeX(y).should.be.approximately(85, 1e-5);
        y.should.be.approximately(86, 1e-5);

        regression.toString(3).should.equal('f(x) = x + 1.00');
        regression.toLaTeX(3).should.equal('f(x) = x + 1.00');
        regression.toJSON().slope.should.equal(1);
    });
    it('Outlier', function () {
        // outlier in the 4th value
        var inputs = [1, 2, 3, 4, 10, 12, 18];
        var outputs = [10, 14, 180, 22, 46, 54, 78];

        var regression = new TheilSenRegression(inputs, outputs, {computeQuality: true});

        regression.slope.should.be.approximately(4, 1e-3);
        regression.intercept.should.be.approximately(6, 1e-3);
    });
    it('Constant', function () {
        var inputs = [0, 1, 2, 3];
        var outputs = [2, 2, 2, 2];

        var regression = new TheilSenRegression(inputs, outputs);

        regression.toString().should.equal('f(x) = 2');
        regression.toString(1).should.equal('f(x) = 2');
        regression.toString(5).should.equal('f(x) = 2.0000');
    });
    it('different size on input and output', function () {
        var inputs = [0, 1, 2];
        var outputs = [0, 1];
        (function () {
            new TheilSenRegression(inputs, outputs);
        }).should.throw(RangeError, {message: 'Input and output array have a different length'});
    });
    it('Load and export model', function () {
        var regression = TheilSenRegression.load({
            name: 'TheilSenRegression',
            slope: -1,
            intercept: 0,
            quality: {
                r: 1,
                r2: 1,
                chi2: 145.8,
                rmsd: 0
            }
        });
        regression.slope.should.equal(-1);
        regression.intercept.should.equal(0);
        regression.toString().should.equal('f(x) = - 1 * x');

        var model = regression.toJSON();
        model.name.should.equal('TheilSenRegression');
        model.slope.should.equal(-1);
        model.intercept.should.equal(0);
        model.quality.r.should.equal(1);

        TheilSenRegression.load.bind(null, {name: 1}).should.throw('not a Theil-Sen model');
        var noQuality = TheilSenRegression.load({
            name: 'TheilSenRegression',
            slope: -1,
            intercept: 1
        });
        noQuality.quality.should.deepEqual({});
    });
});
