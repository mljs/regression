'use strict';

exports.SimpleLinearRegression = exports.SLR = require('ml-regression-simple-linear');
exports.PolynomialRegression = require('ml-regression-polynomial');
exports.ExponentialRegression = require('ml-regression-exponential');
exports.PowerRegression = require('ml-regression-power');

exports.NonLinearRegression = exports.NLR = {
    PotentialRegression: require('./regression/potential-regression')
};
exports.KernelRidgeRegression = exports.KRR = require('./regression/kernel-ridge-regression');
//exports.MultipleLinearRegression = exports.MLR = require('./regression/multiple-linear-regression');
//exports.MultivariateLinearRegression = exports.MVLR = require('./regression/multivariate-linear-regression');
exports.PolinomialFitting2D = require('./regression/poly-fit-regression2d');
exports.TheilSenRegression = require('./regression/theil-sen-regression');
