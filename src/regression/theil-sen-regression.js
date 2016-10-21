'use strict';

const BaseRegression = require('./base-regression');
const maybeToPrecision = require('./util').maybeToPrecision;
const median = require('ml-stat/array').median;

class TheilSenRegression extends BaseRegression {

    /**
     * Theil–Sen estimator
     * https://en.wikipedia.org/wiki/Theil%E2%80%93Sen_estimator
     * @param {Array<number>} x
     * @param {Array<number>} y
     * @param {object} options
     * @constructor
     */
    constructor(x, y, options) {
        options = options || {};
        super();
        if (x === true) {
            // loads the model
            this.slope = y.slope;
            this.intercept = y.intercept;
            this.quality = Object.assign({}, y.quality, this.quality);
        } else {
            // creates the model
            let len = x.length;
            if (len !== y.length) {
                throw new RangeError('Input and output array have a different length');
            }

            let slopes = new Array(len * len);
            let count = 0;
            for (let i = 0; i < len; ++i) {
                for (let j =  i + 1; j < len; ++j) {
                    if (x[i] !== x[j]) {
                        slopes[count++] = (y[j] - y[i]) / (x[j] - x[i]);
                    }
                }
            }
            slopes.length = count;
            let medianSlope = median(slopes);

            let cuts = new Array(len);
            for (let i = 0; i < len; ++i) {
                cuts[i] = y[i] - medianSlope * x[i];
            }

            this.slope = medianSlope;
            this.intercept = median(cuts);
            this.coefficients = [this.intercept, this.slope];
            if (options.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }

    }

    toJSON() {
        var out = {
            name: 'TheilSenRegression',
            slope: this.slope,
            intercept: this.intercept
        };
        if (this.quality) {
            out.quality = this.quality;
        }

        return out;
    }

    _predict(input) {
        return this.slope * input + this.intercept;
    }

    computeX(input) {
        return (input - this.intercept) / this.slope;
    }

    toString(precision) {
        var result = 'f(x) = ';
        if (this.slope) {
            var xFactor = maybeToPrecision(this.slope, precision);
            result += (Math.abs(xFactor - 1) < 1e-5 ? '' : xFactor + ' * ') + 'x';
            if (this.intercept) {
                var absIntercept = Math.abs(this.intercept);
                var operator = absIntercept === this.intercept ? '+' : '-';
                result += ' ' + operator + ' ' + maybeToPrecision(absIntercept, precision);
            }
        } else {
            result += maybeToPrecision(this.intercept, precision);
        }
        return result;
    }

    toLaTeX(precision) {
        return this.toString(precision);
    }

    static load(json) {
        if (json.name !== 'TheilSenRegression') {
            throw new TypeError('not a Theil-Sen model');
        }
        return new TheilSenRegression(true, json);
    }
}

module.exports = TheilSenRegression;
