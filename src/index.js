'use strict';

exports.SimpleLinearRegression = exports.SLR = require('ml-regression-simple-linear').default;
exports.PolynomialRegression = require('ml-regression-polynomial').default;
exports.ExponentialRegression = require('ml-regression-exponential').default;
exports.PowerRegression = require('ml-regression-power').default;
exports.MultivariateLinearRegression = require('ml-regression-multivariate-linear').default;

exports.NonLinearRegression = exports.NLR = {
    PotentialRegression: require('./regression/potential-regression')
};
exports.KernelRidgeRegression = exports.KRR = require('./regression/kernel-ridge-regression');
//exports.MultipleLinearRegression = exports.MLR = require('./regression/multiple-linear-regression');
exports.PolinomialFitting2D = require('./regression/poly-fit-regression2d');

// robust regressions
exports.TheilSenRegression = require('ml-regression-theil-sen').default;
exports.RobustPolynomialRegression = require('ml-regression-robust-polynomial').default;
