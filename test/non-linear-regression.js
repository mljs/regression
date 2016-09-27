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

        it('Exponential regresion', function () {
            var x = [0, 1, 2, 3, 4];
            var y = [1.5, 2.5, 3.5, 5.0, 7.5];
            var result = new NLR.ExpRegression(x, y, {computeQuality: true});
            result.A.should.be.approximately(0.3912023, 10e-7);
            result.C.should.be.approximately(1.579910, 10e-7);
            result.quality.r2.should.greaterThan(0.8);
            result.quality.chi2.should.lessThan(0.1);
            result.quality.rmsd.should.lessThan(0.01);
            result.toString(4).should.equal('f(x) = 1.580 * exp(0.3912 * x)');
            result.toLaTeX(4).should.equal('f(x) = 1.580e^{0.3912x}');
        });

        it('Polynomial regression', function () {
            var x = [-3, 0, 2, 4];
            var y = [3, 1, 1, 3];
            var result = new NLR.PolynomialRegression(x, y, 2, {computeQuality: true});
            var expected = [0.850519, -0.192495, 0.178462];

            for (var i = 0; i < expected.length; ++i) {
                result.coefficients[i].should.be.approximately(expected[i], 10e-6);
                result.powers[i].should.equal(i);
            }
            result.quality.r2.should.greaterThan(0.8);
            result.quality.chi2.should.lessThan(0.1);
            result.quality.rmsd.should.lessThan(0.01);
            result.toString(4).should.equal('f(x) = 0.1785 * x^2 - 0.1925 * x + 0.8505');
            result.toLaTeX(4).should.equal('f(x) = 0.1785x^{2} - 0.1925x + 0.8505');
        });

        it('Power regression', function () {
            var x = [17.6, 26, 31.9, 38.9, 45.8, 51.2, 58.1, 64.7, 66.7, 80.8, 82.9];
            var y = [159.9, 206.9, 236.8, 269.9, 300.6, 323.6, 351.7, 377.6, 384.1, 437.2, 444.7];
            var result = new NLR.PowerRegression(x, y, {computeQuality: true});

            var expected = {A: 24.12989312,
                            B: 0.65949782
                            };
            result.A.should.approximately(expected.A, 10e-4);
            result.B.should.approximately(expected.B, 10e-4);

            var x2 = [20, 30];
            var y2 = result.predict(x2);

            y2[0].should.approximately(expected.A * Math.pow(x2[0], expected.B), 10e-4);
            y2[1].should.approximately(expected.A * Math.pow(x2[1], expected.B), 10e-4);
            result.quality.r2.should.greaterThan(0.8);
            result.quality.chi2.should.lessThan(0.1);
            result.quality.rmsd.should.lessThan(0.01);
            result.toString(4).should.equal('f(x) = 24.13 * x^0.6595');
            result.toLaTeX(4).should.equal('f(x) = 24.13x^{0.6595}');

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

        it('Exponential regresion', function () {
            var regression = NLR.ExpRegression.load({
                name: 'expRegression',
                A: -1,
                C: 1,
                quality: {
                    r: 1,
                    r2: 1,
                    chi2: 145.8,
                    rmsd: 0
                }
            });
            regression.A.should.equal(-1);
            regression.C.should.equal(1);
            regression.toLaTeX().should.equal('f(x) = \\frac{1}{e^{1x}}');

            var model = regression.toJSON();
            model.name.should.equal('expRegression');
            model.A.should.equal(-1);
            model.C.should.equal(1);
        });

        it('Polynomial regression', function () {
            var regression = NLR.PolynomialRegression.load({
                name: 'polynomialRegression',
                coefficients: -1,
                powers: 1,
                M: 1,
                quality: {
                    r: 1,
                    r2: 1,
                    chi2: 145.8,
                    rmsd: 0
                }
            });
            regression.coefficients.should.equal(-1);
            regression.powers.should.equal(1);
            regression.M.should.equal(1);

            var model = regression.toJSON();
            model.name.should.equal('polynomialRegression');
            model.coefficients.should.equal(-1);
            model.powers.should.equal(1);
            model.M.should.equal(1);
        });

        it('Power regression', function () {
            var regression = NLR.PowerRegression.load({
                name: 'powerRegression',
                A: 1,
                B: -1,
                quality: {
                    r: 1,
                    r2: 1,
                    chi2: 145.8,
                    rmsd: 0
                }
            });
            regression.A.should.equal(1);
            regression.B.should.equal(-1);
            regression.toLaTeX().should.equal('f(x) = \\frac{1}{x^{1}}');

            var model = regression.toJSON();
            model.name.should.equal('powerRegression');
            model.A.should.equal(1);
            model.B.should.equal(-1);
        });

    });
});
