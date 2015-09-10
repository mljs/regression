'use strict';

var maybeToPrecision = require('./util').maybeToPrecision;

function SimpleLinearRegression(x, y) {
    if (!(this instanceof SimpleLinearRegression)) {
        return new SimpleLinearRegression(x, y);
    }

    var n = x.length;
    if (n !== y.length) {
        throw new RangeError('input and output array have a different length');
    }

    var xSum = 0;
    var ySum = 0;

    var xSquared = 0;
    var ySquared = 0;
    var xY = 0;

    for (var i = 0; i < n; i++) {
        xSum += x[i];
        ySum += y[i];
        xSquared += x[i] * x[i];
        ySquared += y[i] * y[i];
        xY += x[i] * y[i];
    }

    var numerator = (n * xY - xSum * ySum);

    this.slope = numerator / (n * xSquared - xSum * xSum);
    this.intercept = (1 / n) * ySum - this.slope * (1 / n) * xSum;
    this.coefficients = [this.intercept, this.slope];

    this.r = numerator / Math.sqrt((n * xSquared - xSum * xSum) * (n * ySquared - ySum * ySum));
    this.coefficientOfDetermination = this.r2 = this.r * this.r;
}

SimpleLinearRegression.prototype.compute = function compute(input) {
    return this.slope * input + this.intercept;
};

SimpleLinearRegression.prototype.computeX = function computeX(input) {
    return (input - this.intercept) / this.slope;
};

SimpleLinearRegression.prototype.toString = function toString(precision) {
    var result = 'y = ';
    if (this.slope) {
        result += maybeToPrecision(this.slope, precision) + 'x';
        if (this.intercept) {
            var absIntercept = Math.abs(this.intercept);
            var operator = absIntercept === this.intercept ? '+' : '-';
            result += ' ' + operator + ' ' + maybeToPrecision(absIntercept, precision);
        }
    } else {
        result += maybeToPrecision(this.intercept, precision);
    }
    return result;
};

module.exports = SimpleLinearRegression;
