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
        var model = new KernelRidgeRegression([[0, 0], [1,1]], [[0], [0]]);
        Array.from(model.compute([[1,1], [2,5], [4,7]])).should.eql([[0], [0], [0]]);
    });
    it.skip('Polynomial kernel should overfit the pattern', function () {
        var model = new KernelRidgeRegression(Xs, Ys, {
            kernelType: 'polynomial',
            lambda: 0.01,
            kernelParams: {degree: 2, bias: 0.1}
        });
        var Y = model.compute(Xs);

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
        var Y = model.compute(Xs);
        for (var i = 0; i < Y.length; i++) {
            Y[i][0].should.be.approximately(Ys[i][0], 5e-3);
        }
    });
});
