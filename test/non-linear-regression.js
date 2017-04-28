'use strict';

var NLR = require('..').NLR;

describe('Non-linear regression', function () {
    describe('Should give the correct parameters ', function () {
        it('Potential regression', function () {
            var x = [0.2, 0.4, 0.6, 0.8, 1.0];
            var y = [0.1960, 0.7850, 1.7665, 3.1405, 4.9075];
            var result = new NLR.PotentialRegression(x, y, 2, {computeQuality: true});
            result.A.should.be.approximately(4.9073, 10e-5);
            result.M.should.equal(2);
            result.quality.r2.should.greaterThan(0.8);
            result.quality.chi2.should.lessThan(0.1);
            result.quality.rmsd.should.lessThan(0.01);
            result.toString(4).should.equal('f(x) = 4.907 * x^2');
            result.toLaTeX(4).should.equal('f(x) = 4.907x^{2}');
        });
    });

    describe('Load and export model ', function () {
        it('Potential regression', function () {
            var regression = NLR.PotentialRegression.load({
                name: 'potentialRegression',
                A: 1,
                M: -1,
                quality: {
                    r: 1,
                    r2: 1,
                    chi2: 145.8,
                    rmsd: 0
                }
            });
            regression.A.should.equal(1);
            regression.M.should.equal(-1);
            regression.toLaTeX().should.equal('f(x) = \\frac{1}{x^{1}}');

            var model = regression.toJSON();
            model.name.should.equal('potentialRegression');
            model.A.should.equal(1);
            model.M.should.equal(-1);
        });
    });
});
