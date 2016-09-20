'use strict';

exports.SimpleLinearRegression = exports.SLR = require('./regression/simple-linear-regression');
exports.NonLinearRegression = exports.NLR = {
    PolynomialRegression: require('./regression/polynomial-regression'),
    PotentialRegression: require('./regression/potential-regression'),
    ExpRegression: require('./regression/exp-regression'),
    PowerRegression: require('./regression/power-regression')
};
exports.KernelRidgeRegression = exports.KRR = require('./regression/kernel-ridge-regression');
//exports.MultipleLinearRegression = exports.MLR = require('./regression/multiple-linear-regression');
//exports.MultivariateLinearRegression = exports.MVLR = require('./regression/multivariate-linear-regression');
exports.PolinomialFitting2D = require('./regression/poly-fit-regression2d');
exports.TheilSenRegression = require('./regression/theil-sen-regression');
