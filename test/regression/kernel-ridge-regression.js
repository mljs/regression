'use strict';

var Matrix = require('ml-matrix');
var KernelRidgeRegression = require('../..').KernelRidgeRegression;

var nSamples = 10;
var nVars = 2;

var Xs = Matrix.random(nSamples, nVars);
Xs.sub(0.5);
var Ys = Matrix.zeros(nSamples, 1);
for (var i = 0; i < nSamples; i++) {
    Ys[i][0] = Xs[i][0] * Xs[i][0] + 2 * Xs[i][0] * Xs[i][1] + Xs[i][1] * Xs[i][1];
}

describe('Kernel ridge regression', function () {
    it('constant outputs', function () {
        var model = new KernelRidgeRegression([[0, 0], [1, 1]], [[0], [0]]);
        Array.from(model.predict([[1, 1], [2, 5], [4, 7]])).should.eql([[0], [0], [0]]);
    });
    it('Polynomial kernel should overfit the pattern', function () {
        var model = new KernelRidgeRegression(Xs, Ys, {
            kernelType: 'polynomial',
            lambda: 0.0001,
            kernelOptions: {degree: 2, constant: 1}
        });
        var Y = model.predict(Xs);

        for (i = 0; i < Y.length; i++) {
            Y[i][0].should.be.approximately(Ys[i][0], 5e-3);
        }
    });
    it('Gaussian kernel should overfit the pattern', function () {
        var model = new KernelRidgeRegression(Xs, Ys, {
            kernelType: 'gaussian',
            lambda: 0.0001,
            kernelOptions: {sigma: 0.1}
        });
        var Y = model.predict(Xs);
        for (var i = 0; i < Y.length; i++) {
            Y[i][0].should.be.approximately(Ys[i][0], 5e-3);
        }
    });
});
