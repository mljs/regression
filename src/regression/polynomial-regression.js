'use strict';

/**
 * Function that return a constants of the M degree polynomial that
 * fit the given points, this constants is given from lower to higher
 * order of the polynomial.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @param {Number|BigNumber} M - Degree of the polynomial.
 * @param {Vector} constants - Vector of constants of the function.
 * Created by acastillo on 5/12/16.
 */

const maybeToPrecision = require('./util').maybeToPrecision;
const BaseRegression = require('./base-regression');
const matrixLib = require('ml-matrix');
const Matrix = matrixLib.Matrix;
const solve = matrixLib.solve;

class PolynomialRegression extends BaseRegression {
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param M: Maximum degree of the polynomial
     * @param options
     */
    constructor(x, y, M, options) {
        super();
        let opt = options || {};
        if (x === true) { // reloading model
            this.coefficients = y.coefficients;
            this.powers = y.powers;
            this.M = y.M;
            if (y.quality) {
                this.quality = y.quality;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }

            let powers;
            if (Array.isArray(M)) {
                powers = M;
                M = powers.length;
            } else {
                M++;
                powers = new Array(M);
                for (k = 0; k < M; k++) {
                    powers[k] = k;
                }
            }
            var F = new Matrix(n, M);
            var Y = new Matrix([y]);
            var k, i;
            for (k = 0; k < M; k++) {
                for (i = 0; i < n; i++) {
                    if (powers[k] === 0) {
                        F[i][k] = 1;
                    } else {
                        F[i][k] = Math.pow(x[i], powers[k]);
                    }
                }
            }

            var FT = F.transposeView();
            var A = FT.mmul(F);
            var B = FT.mmul(Y.transposeView());

            this.coefficients = solve(A, B).to1DArray();
            this.powers = powers;
            this.M = M - 1;
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(x) {
        var y = 0;
        for (var  k = 0; k < this.powers.length; k++) {
            y += this.coefficients[k] * Math.pow(x, this.powers[k]);
        }
        return y;
    }

    toJSON() {
        var out = {name: 'polynomialRegression',
            coefficients: this.coefficients,
            powers: this.powers,
            M: this.M
        };

        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return this._toFormula(precision, false);
    }

    toLaTeX(precision) {
        return this._toFormula(precision, true);
    }

    _toFormula(precision, isLaTeX) {
        var sup = '^';
        var closeSup = '';
        var times = ' * ';
        if (isLaTeX) {
            sup = '^{';
            closeSup = '}';
            times = '';
        }

        var fn =  '', str;
        for (var k = 0; k < this.coefficients.length; k++) {
            str = '';
            if (this.coefficients[k] !== 0) {
                if (this.powers[k] === 0) {
                    str = maybeToPrecision(this.coefficients[k], precision);
                } else {
                    if (this.powers[k] === 1) {
                        str = maybeToPrecision(this.coefficients[k], precision) + times + 'x';
                    } else {
                        str = maybeToPrecision(this.coefficients[k], precision) + times + 'x' + sup + this.powers[k] + closeSup;
                    }
                }

                if (this.coefficients[k] > 0 && k !== (this.coefficients.length - 1)) {
                    str = ' + ' + str;
                } else if (k !== (this.coefficients.length - 1)) {
                    str = ' ' + str;
                }
            }
            fn = str + fn;
        }
        if (fn.charAt(0) === ' + ') {
            fn = fn.slice(1);
        }

        return 'f(x) = ' + fn;
    }

    static load(json) {
        if (json.name !== 'polynomialRegression') {
            throw new TypeError('not a polynomial regression model');
        }
        return new PolynomialRegression(true, json);
    }
}

module.exports = PolynomialRegression;
