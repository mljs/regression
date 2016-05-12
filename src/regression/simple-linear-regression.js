'use strict';

var maybeToPrecision = require('./util').maybeToPrecision;
const BaseRegression = require('./base-regression');


class SimpleLinearRegression extends BaseRegression {

    constructor(x, y, options) {
        options = options || {};
        super();
        if(x===true){
            this.slope = y.slope;
            this.intercept = y.intercept;
            if(y.r){
                this.r = y.r;
                this.r2 = y.r2;
            }
        }
        else{
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
            if(options.computeCoefficient){
                this.r = this.rCoefficient(x,y);
                this.r2 = this.r*this.r;
            }
        }

    }
    
    toJSON() {
        var out = {
            name: "simpleLinearRegression",
            slope: this.slope,
            intercept: this.intercept
        }
        if (this.r) {
            out. r=this.r;
            out.r2 = this.r2;
        }

        return out;
    }

    _compute(input) {
        return this.slope * input + this.intercept;
    };

    computeX(input) {
        return (input - this.intercept) / this.slope;
    };

    toString(precision) {
        var result = 'y = ';
        if (this.slope) {
            var xFactor = maybeToPrecision(this.slope, precision);
            result += (xFactor == 1 ? '' : xFactor) + 'x';
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

    static load(json) {
        if (json.name !== 'simpleLinearRegression') {
            throw new TypeError('not a SLR model');
        }
        return new SimpleLinearRegression(true, json);
    }
}

module.exports = SimpleLinearRegression;
