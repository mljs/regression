'use strict';

var Polyfit = require('../src/index.js').PolinomialFitting2D;
//var Matrix = require('ml-matrix');
describe('2D polinomial fit', function () {
    var X = new Array(21);
    var y = new Array(21);
    for (var i = 0; i < 21; ++i) {
        X[i] = [i, i + 10];
        y[i] = i + 20;
    }

    var pf = new Polyfit(X, y, {
        order: 2
    });

    it('Training coefficients', function () {
        var estimatedCoefficients = [1.5587e1, 3.8873e-1, 5.2582e-3, 4.8498e-1, 2.1127e-3, -7.3709e-3];
        for (var i = 0; i < estimatedCoefficients.length; ++i) {
            pf.coefficients[i][0].should.be.approximately(estimatedCoefficients[i], 1e-2);
        }
    });

    /*
    it('Input matrix', function () {
        var pf = new Polyfit(new Matrix(X), (new Matrix([y])).transpose(), {
            order: 2
        });
        console.log(pf);
    });
    */

    it('Prediction', function () {
        var test = new Array(11);
        var val = 0.5;
        for (var i = 0; i < 11; ++i) {
            test[i] = [val, val + 10];
            val++;
        }

        var y = pf.predict(test);

        var j = 0;
        for (i = 20.5; i < 30.5; i++, j++) {
            y[j].should.be.approximately(i, 1e-2);
        }
    });

    it('Other function test', function () {
        var testValues = [15.041667, 9.375000, 5.041667, 2.041667,
            0.375000, 0.041667, 1.041667, 3.375000,
            7.041667, 12.041667];

        var len = 21;

        var X = new Array(len);
        var val = 5.0;
        var y = new Array(len);
        for (var i = 0; i < len; ++i, val += 0.5) {
            X[i] = [val, val];
            y[i] = val * val + val * val;
        }

        var polyFit = new Polyfit(X, y, {
            order: 2
        });

        var test = 10, x1 = -4.75, x2 = 4.75;
        var X1 = new Array(test);
        for (i = 0; i < test; ++i) {
            X1[i] = [x1, x2];
            x1++;
            x2--;
        }

        var predict = polyFit.predict(X1);
        for (i = 0; i < testValues.length; ++i) {
            predict[i].should.be.approximately(testValues[i], 1e-2);
        }

    });

    it('Export and load options', function () {
        /*
        var model = pf.toJSON();
        model = JSON.parse(JSON.stringify(model));
        var pf1 = Polyfit.load(model);
        */

        var estimatedCoefficients = [1.5587e1, 3.8873e-1, 5.2582e-3, 4.8498e-1, 2.1127e-3, -7.3709e-3];
        for (var i = 0; i < estimatedCoefficients.length; ++i) {
            pf.coefficients[i][0].should.be.approximately(estimatedCoefficients[i], 1e-2);
        }
    });
});
