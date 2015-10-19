"use strict";

var Polyfit = require('../..').PolinomialFitting2D;

describe("2D polinomial fit", function () {
    var X = new Array(21);
    var y = new Array(21);
    for(var i = 0; i < 21; ++i) {
        X[i] = [i, i + 10];
        y[i] = i + 20;
    }

    var pf = new Polyfit();
    pf.train(X, y, {
        order: 2
    });

    it("Training coefficients", function () {
        var estimatedCoefficients = [1.5587e1, 3.8873e-1, 5.2582e-3, 4.8498e-1, 2.1127e-3, -7.3709e-3];
        for(var i = 0; i < estimatedCoefficients.length; ++i) {
            pf.coefficients[i][0].should.be.approximately(estimatedCoefficients[i], 1e-2);
        }
    });

    it("Prediction", function () {
        var test = new Array(11);
        var val = 0.5;
        for(var i = 0; i < 11; ++i) {
            test[i] = [val, val + 10];
            val++;
        }

        var y = pf.predict(test);

        var j = 0;
        for(i = 20.5; i < 30.5; i++, j++) {
            y[j].should.be.approximately(i, 1e-2);
        }
    });


});
