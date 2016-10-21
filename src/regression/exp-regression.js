'use strict';

/*
 * Function that calculate the linear fit in the form f(x) = Ce^(A * x) and
 * return the A and C coefficient of the given formula.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @return {Object} coefficients - The A and C coefficients.
 *
 * Created by acastillo on 5/12/16.
 */

const maybeToPrecision = require('./util').maybeToPrecision;
const SimpleLinearRegression = require('./simple-linear-regression');
const BaseRegression = require('./base-regression');

class ExpRegression extends BaseRegression {
    /**
     * @constructor
     * @param {Array<number>} x - Independent variable
     * @param {Array<number>} y - Dependent variable
     * @param {object} options
     */
    constructor(x, y, options) {
        super();
        let opt = options || {};
        if (x === true) { // reloading model
            this.A = y.A;
            this.C = y.C;
            if (y.quality) {
                this.quality = y.quality;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }
            var yl = new Array(n);
            for (var i = 0; i < n; i++) {
                yl[i] = Math.log(y[i]);
            }

            var linear = new SimpleLinearRegression(x, yl, {computeCoefficient: false});
            this.A = linear.slope;
            this.C = Math.exp(linear.intercept);
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(newInputs) {
        return this.C * Math.exp(newInputs * this.A);
    }

    toJSON() {
        var out = {name: 'expRegression', A: this.A, C: this.C};
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return 'f(x) = ' + maybeToPrecision(this.C, precision) + ' * exp(' + maybeToPrecision(this.A, precision) + ' * x)';
    }

    toLaTeX(precision) {
        if (this.A >= 0) {
            return 'f(x) = ' + maybeToPrecision(this.C, precision) + 'e^{' + maybeToPrecision(this.A, precision) + 'x}';
        } else {
            return 'f(x) = \\frac{' + maybeToPrecision(this.C, precision) + '}{e^{' + maybeToPrecision(-this.A, precision) + 'x}}';
        }

    }

    static load(json) {
        if (json.name !== 'expRegression') {
            throw new TypeError('not a exp regression model');
        }
        return new ExpRegression(true, json);
    }
}


module.exports = ExpRegression;
