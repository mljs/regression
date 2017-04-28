'use strict';

/*
 * Function that calculate the potential fit in the form f(x) = A*x^M
 * with a given M and return de A coefficient.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the x positions of the points.
 * @param {Number, BigNumber} M - The exponent of the potential fit.
 * @return {Number|BigNumber} A - The A coefficient of the potential fit.
 * Created by acastillo on 5/12/16.
 */

const maybeToPrecision = require('./util').maybeToPrecision;
const PolynomialRegression = require('ml-regression-polynomial');
// const PowerRegression = require('./power-regression');
const BaseRegression = require('./base-regression');

class PotentialRegression extends BaseRegression {
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param M
     * @param options
     */
    constructor(x, y, M, options) {
        super();
        let opt = options || {};
        if (x === true) { // reloading model
            this.A = y.A;
            this.M = y.M;
            if (y.quality) {
                this.quality = y.quality;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }

            var linear = new PolynomialRegression(x, y, [M]);
            this.A = linear.coefficients[0];
            this.M = M;
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(x) {
        return this.A * Math.pow(x, this.M);
    }

    toJSON() {
        var out = {name: 'potentialRegression', A: this.A, M: this.M};
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return 'f(x) = ' + maybeToPrecision(this.A, precision) + ' * x^' + this.M;
    }

    toLaTeX(precision) {

        if (this.M >= 0) {
            return 'f(x) = ' + maybeToPrecision(this.A, precision) + 'x^{' + this.M + '}';
        } else {
            return 'f(x) = \\frac{' + maybeToPrecision(this.A, precision) + '}{x^{' + (-this.M) + '}}';
        }
    }

    static load(json) {
        if (json.name !== 'potentialRegression') {
            throw new TypeError('not a potential regression model');
        }
        return new PotentialRegression(true, json);
    }
}

module.exports = PotentialRegression;
