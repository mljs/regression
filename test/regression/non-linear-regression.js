var FIT = require("../regression/non-linear-regression");
var Math = require("ml-matrix");
var math = Math.algebra;

/*describe('Non-linear regression', function() {

    describe('Should give the correct parameters ', function() {

        it('Potential regression', function () {
            var x = math.matrix([0.2, 0.4, 0.6, 0.8, 1.0]);
            var y = math.matrix([0.1960, 0.7850, 1.7665, 3.1405, 4.9075]);
            var result = Fit.potentialRegression(x, y, 2);
            result.should.be.approximately(4.9073, 10e-5);
        });

        it('Exponential regresion', function () {
            var x = math.matrix([0, 1, 2, 3, 4]);
            var y = math.matrix([1.5, 2.5, 3.5, 5.0, 7.5]);
            var result = Fit.expRegression(x, y);
            result.A.should.be.approximately(0.3912023, 10e-7);
            result.C.should.be.approximately(1.579910, 10e-7);
        });

        it('Polynomial regression', function () {
            var x = math.matrix([-3, 0, 2, 4]);
            var y = math.matrix([3, 1, 1, 3]);
            var result = Fit.polynomialRegression(x, y, 2);
            var expected = [0.850519, -0.192495, 0.178462];
            for(var i = 0; i < expected.length; ++i) {
                math.subset(result, math.index(i, 0)).should.be.approximately(expected[i], 10e-6);
            }
        });

        it('Power regression', function () {
            var x = math.matrix([-3, 0, 2, 4]);
            var y = math.matrix([3, 1, 1, 3]);
            var result = Fit.powerRegression(x, y, 2);
            var expected = [0.850519, -0.192495];
            for(var i = 0; i < expected.length; ++i) {
                math.subset(result, math.index(i, 0)).should.be.approximately(expected[i], 10e-6);
            }
        });

    });
});
    */