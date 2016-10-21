'use strict';

/**
 * This class implements the power regression f(x)=A*x^B
 * Created by acastillo on 5/12/16.
 */

const maybeToPrecision = require('./util').maybeToPrecision;
const SimpleLinearRegression = require('./simple-linear-regression');
const BaseRegression = require('./base-regression');

class PowerRegression extends BaseRegression {
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param options
     */
    constructor(x, y, options) {
        super();
        let opt = options || {};
        if (x === true) { // reloading model
            this.A = y.A;
            this.B = y.B;
            this.quality = y.quality || {};
            if (y.quality.r) {
                this.quality.r = y.quality.r;
                this.quality.r2 = y.quality.r2;
            }
            if (y.quality.chi2) {
                this.quality.chi2 = y.quality.chi2;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }
            var xl = new Array(n), yl = new Array(n);
            for (var i = 0; i < n; i++) {
                xl[i] = Math.log(x[i]);
                yl[i] = Math.log(y[i]);
            }

            var linear = new SimpleLinearRegression(xl, yl, {computeCoefficient: false});
            this.A = Math.exp(linear.intercept);
            this.B = linear.slope;
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(newInputs) {
        return this.A * Math.pow(newInputs, this.B);
    }

    toJSON() {
        var out = {name: 'powerRegression', A: this.A, B: this.B};
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return 'f(x) = ' + maybeToPrecision(this.A, precision) + ' * x^' + maybeToPrecision(this.B, precision);
    }

    toLaTeX(precision) {
        if (this.B >= 0) {
            return 'f(x) = ' + maybeToPrecision(this.A, precision) + 'x^{' + maybeToPrecision(this.B, precision) + '}';
        } else {
            return 'f(x) = \\frac{' + maybeToPrecision(this.A, precision) + '}{x^{' + maybeToPrecision(-this.B, precision) + '}}';
        }
    }

    static load(json) {
        if (json.name !== 'powerRegression') {
            throw new TypeError('not a power regression model');
        }
        return new PowerRegression(true, json);
    }
}

module.exports = PowerRegression;
