'use strict'

var NLR = require("../..").NLR;
var Math = require("ml-matrix");
var math = Math.algebra;

describe('Non-linear regression', function() {

    describe('Should give the correct parameters ', function() {

        it('Potential regression', function () {
            var x = [0.2, 0.4, 0.6, 0.8, 1.0];
            var y = [0.1960, 0.7850, 1.7665, 3.1405, 4.9075];
            var result = NLR.potentialRegression(x, y, 2);
            result.should.be.approximately(4.9073, 10e-5);
        });

        it('Exponential regresion', function () {
            var x = [0, 1, 2, 3, 4];
            var y = [1.5, 2.5, 3.5, 5.0, 7.5];
            var result = NLR.expRegression(x, y);
            result.A.should.be.approximately(0.3912023, 10e-7);
            result.C.should.be.approximately(1.579910, 10e-7);
        });

        it('Polynomial regression', function () {
            var x = [-3, 0, 2, 4];
            var y = [3, 1, 1, 3];
            var result = NLR.polynomialRegression(x, y, 2);
            var expected = [0.850519, -0.192495, 0.178462];
            for(var i = 0; i < expected.length; ++i) {
                math.subset(result, math.index(i, 0)).should.be.approximately(expected[i], 10e-6);
            }
        });

        it.only('Power regression', function () {
            var x = [17.6, 26, 31.9,38.9,45.8,51.2,58.1];
            var y = [159.9,206.9,236.8,269.9,300.6,323.6,351.7];
            var result = NLR.powerRegression(x, y);
            result.A.should.approximately(24.1299,10e-4);
            result.B.should.approximately(0.6595,10e-4);

        });

    });
});