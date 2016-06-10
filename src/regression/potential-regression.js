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
const PolynomialRegression = require('./polynomial-regression');
const BaseRegression = require('./base-regression');

class PotentialRegression extends BaseRegression{
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param options
     */
    constructor(x, y, M,options) {
        super();
        let opt = options||{};
        if (x === true) { // reloading model
            this.A = outputs.A;
            this.M = outputs.M;
            if(y.r){
                this.r = y.r;
                this.r2 = y.r2;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }

            var linear = new PolynomialRegression(x, y, [M] ,{computeCoefficient:true});
            this.A = linear.coefficients[0];
            this.M = M;
            if(opt.computeCoefficient){
                this.r = this.rCoefficient(x,y);
                this.r2 = this.r*this.r;
            }
        }
    }

    _predict(x) {
        return this.A*Math.pow(x,this.M);
    }

    toJSON() {
        var out = {name: 'potentialRegression', A: this.A, M: this.M};
        if(this.r){
            out.r = this.r;
            out.r2=this.r2;
        }
        return out;
    }

    toString(precision){
        return maybeToPrecision(this.A, precision)+"*x^"+this.M;
    }

    static load(json) {
        if (json.name !== 'potentialRegression') {
            throw new TypeError('not a potential regression model');
        }
        return new PowerRegression(true, json);
    }
}

module.exports = PotentialRegression;