//'use strict';
//
//var MLR = require('../..').MLR;
//var Matrix = require('ml-matrix');
//
//describe('Multiple linear regression', function () {
//    it('MLR1', function () {
//        var target = new MLR(1, true);
//        var inputs = Matrix.columnVector([80, 60, 10, 20, 30]);
//        var outputs = [20, 40, 30, 50, 60];
//
//        var error = target.regress(inputs, outputs);
//        var slope = target.coefficients[0];
//        var intercept = target.coefficients[1];
//
//        var r = target.coefficientOfDetermination(inputs, outputs);
//
//        var str = target.toString();
//
//        slope.should.be.approximately(-0.264706, 1e-5);
//        intercept.should.be.approximately(50.588235, 1e-5);
//        error.should.be.approximately(761.764705, 1e-5);
//
//        r.should.be.approximately(0.23823529, 1e-6);
//
//        str.should.equal('y(x0) = -0.2647058824*x0 + 50.5882352941');
//    });
//    it('MLR2', function () {
//        var target = new MLR(2, false);
//        var inputs = new Matrix([[80, 1], [60, 1], [10, 1], [20, 1], [30, 1]]);
//        var outputs = [20, 40, 30, 50, 60];
//
//        var error = target.regress(inputs, outputs);
//
//        var slope = target.coefficients[0];
//        var intercept = target.coefficients[1];
//
//        var r = target.coefficientOfDetermination(inputs, outputs);
//
//        var str = target.toString(5);
//
//        slope.should.be.approximately(-0.264706, 1e-5);
//        intercept.should.be.approximately(50.588235, 1e-5);
//        error.should.be.approximately(761.764705, 1e-5);
//
//        r.should.be.approximately(0.23823529, 1e-6);
//
//        str.should.equal('y(x0, x1) = -0.26471*x0 + 50.58824*x1');
//    });
//    it('MLR3', function () {
//        var target = new MLR(2, true);
//
//        var inputs = new Matrix([[1, 1], [0, 1], [1, 0], [0, 0]]);
//        var outputs = [1, 1, 1, 1];
//
//        var error = target.regress(inputs, outputs);
//
//        var a = target.coefficients[0];
//        var b = target.coefficients[1];
//        var c = target.coefficients[2];
//
//        var r = target.coefficientOfDetermination(inputs, outputs);
//
//        a.should.be.approximately(0, 1e-6);
//        b.should.be.approximately(0, 1e-6);
//        c.should.be.approximately(1, 1e-6);
//        error.should.be.approximately(0, 1e-6);
//
//        r.should.equal(1);
//    });
//    it('MLR4', function () {
//        var count = 1000;
//        var inputs = Matrix.empty(count, 2);
//        var outputs = new Array(count);
//
//        for (var i = 0; i < count; i++) {
//            var x = i + 1;
//            var y = 2 * (i + 1) - 1;
//            inputs.setRow(i, [x, y]);
//            outputs[i] = 4 * x - y + 3;
//        }
//
//        var target = new MLR(2, true);
//        var error = target.regress(inputs, outputs);
//
//        target.coefficients.length.should.equal(3);
//        target.hasIntercept().should.be.true;
//        error.should.be.approximately(0, 1e-10);
//
//        target = new MLR(2, false);
//        error = target.regress(inputs, outputs);
//
//        target.coefficients.length.should.equal(2);
//        target.hasIntercept().should.be.false;
//        error.should.be.approximately(0, 1e-10);
//    });
//    it('MLR5', function () {
//        var target = new MLR(2, false);
//
//        var inputs = new Matrix([[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]);
//        var outputs = [20, 40, 30, 50, 60];
//
//        var error = target.regress(inputs, outputs);
//
//        var slope = target.coefficients[0];
//        var intercept = target.coefficients[1];
//
//        slope.should.be.approximately(0, 1e-5);
//        intercept.should.be.approximately(0, 1e-5);
//        error.should.equal(9000);
//
//        var r = target.coefficientOfDetermination(inputs, outputs);
//        r.should.be.approximately(-8, 1e-6);
//
//        var str = target.toString();
//        str.should.equal('y(x0, x1) = 0*x0 + 0*x1');
//    });
//});
