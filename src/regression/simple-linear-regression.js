'use strict';
// https://github.com/accord-net/framework/blob/development/Sources/Accord.Statistics/Models/Regression/Linear/SimpleLinearRegression.cs

var MLR = require('./multiple-linear-regression');
var Matrix = require('ml-matrix');

function SimpleLinearRegression(intercept) {
    this.regression = new MLR(2, intercept);
}

SimpleLinearRegression.prototype = {
    get slope() {
        return this.regression.coefficients[1];
    },
    get intercept() {
        return this.regression.coefficients[0];
    },
    regress: function (inputs, outputs) {
        if (!Array.isArray(inputs) || !Array.isArray(outputs)) {
            throw new TypeError('Regression expects two arrays');
        }
        if (inputs.length !== outputs.length) {
            throw new RangeError('Number of input and output samples does not match');
        }
        var X = new Array(inputs.length);
        for (var i = 0; i < inputs.length; i++) {
            X[i] = [1, inputs[i]];
        }
        return this.regression.regress(new Matrix(X), outputs);
    },
    compute: function (input) {
        if (Array.isArray(input)) {
            return computeArray(this, input);
        }
        return this.slope * input + this.intercept;
    },
    coefficientOfDetermination: function (inputs, outputs, adjust) {
        if (adjust === undefined) {
            adjust = false;
        }
        var X = new Array(inputs.length);
        for (var i = 0; i < inputs.length; i++) {
            X[i] = [1, inputs[i]];
        }
        return this.regression.coefficientOfDetermination(new Matrix(X), outputs, adjust);
    },
    toString: function (decimals) {
        if (decimals === undefined) {
            return "y(x) = " + parseFloat(this.slope.toFixed(10)) + "x + " + parseFloat(this.intercept.toFixed(10));
        } else {
            return "y(x) = " + this.slope.toFixed(decimals) + "x + " + this.intercept.toFixed(decimals);
        }
    }
};

function computeArray(slr, input) {
    var output = new Array(input.length);
    for (var i = 0; i < input.length; i++) {
        output[i] = slr.compute(input[i]);
    }
    return output;
}

module.exports = SimpleLinearRegression;
