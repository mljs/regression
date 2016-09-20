//require(["../../../../scripts/datamining/statistics/models/regression/multivariate-linear-regression","datamining/math/matrix"],function(MLR,Matrix){
//
//    module("Multivariate linear regression");
//    test("Multivariate linear regression 1", function() {
//        var X = new Matrix([[4.47],[208.30],[3400.00]]);
//        var Y = new Matrix([[0.51],[105.66],[1800.00]]);
//
//        var eB = 0.5303528166;
//        var eA = -3.290915095;
//
//        var target = new MLR(1, 1, true);
//
//        target.regress(X, Y);
//
//        floatEqual(target.coefficients[0][0], eB, 0.001, "target coeff[0][0]");
//        floatEqual(target.intercepts[0], eA, 0.001, "target intercept[0]");
//        equal(target.inputs, 1, "inputs");
//        equal(target.outputs, 1, "outputs");
//
//        var X1 = new Matrix([[4.47,1],[208.30,1],[3400.00,1]]);
//
//        var target2 = new MLR(2, 1, false);
//
//        target2.regress(X1, Y);
//
//        floatEqual(target2.coefficients[0][0], eB, 0.001, "target2 coeff[0][0]");
//        floatEqual(target2.coefficients[1][0], eA, 0.001, "target2 coeff[1][0]");
//
//        equal(target2.inputs, 2, "inputs 2");
//        equal(target2.outputs, 1, "outputs 2");
//    });
//
//    test("Multivariate linear regression 2", function() {
//        var inputs = new Matrix([[1, 1, 1],[2, 1, 1],[3, 1, 1]]);
//        var outputs = new Matrix([[2, 3],[4, 6],[6, 9]]);
//
//        var regression = new MLR(3, 2);
//        var error = regression.regress(inputs, outputs);
//
//        floatEqual(regression.coefficients[0][0], 2, 1e-10, "target coeff[0][0]");
//        floatEqual(regression.coefficients[0][1], 3, 1e-10, "target coeff[0][1]");
//        floatEqual(regression.coefficients[1][0], 0, 1e-10, "target coeff[1][0]");
//        floatEqual(regression.coefficients[1][1], 0, 1e-10, "target coeff[1][1]");
//        floatEqual(regression.coefficients[2][0], 0, 1e-10, "target coeff[2][0]");
//        floatEqual(regression.coefficients[2][1], 0, 1e-10, "target coeff[2][1]");
//
//        var r2 = regression.coefficientOfDetermination(inputs, outputs);
//        equal(r2[0], 1, "first r2");
//        equal(r2[1], 1, "second r2");
//
//        floatEqual(error, 0, 1e-10, "error is 0");
//
//    });
//
//});
