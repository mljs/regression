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
    pf.fit(X, y, {
        order: 2
    });

    it.only("Training coefficients", function () {
        var estimatedCoefficients = [1.5587e1, 3.8873e-1, 5.2582e-3, 4.8498e-1, 2.1127e-3, -7.3709e-3];
        for(var i = 0; i < estimatedCoefficients.length; ++i) {
            pf.coefficients[i][0].should.be.approximately(estimatedCoefficients[i], 1e-2);
        }
    })


});
