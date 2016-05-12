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

class ExpRegression extends BaseRegression{
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param options
     */
    constructor(x, y, options) {
        super();
        let opt = options||{};
        if (x === true) { // reloading model
            this.A = outputs.A;
            this.C = outputs.C;
            if(y.r){
                this.r = y.r;
                this.r2 = y.r2;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }
            var yl = new Array(n);
            for (var i = 0; i < n; i++) {
                yl[i]=Math.log(y[i]);
            }

            var linear = new SimpleLinearRegression(x, yl, {computeCoefficient:false});
            this.A = linear.slope;
            this.C = Math.exp(linear.intercept);
            if(opt.computeCoefficient){
                this.r = this.rCoefficient(x,y);
                this.r2 = this.r*this.r;
            }
        }
    }

    _compute(newInputs) {
        return this.C*Math.exp(newInputs*this.A);
    }

    toJSON() {
        var out = {name: 'expRegression', A: this.A, C: this.C};
        if(this.r){
            out.r = this.r;
            out.r2=this.r2;
        }
        return out;
    }

    toString(precision){
        return maybeToPrecision(this.C, precision)+"*exp("+maybeToPrecision(this.A, precision)+"*x)";
    }

    static load(json) {
        if (json.name !== 'expRegression') {
            throw new TypeError('not a exp regression model');
        }
        return new expRegression(true, json);
    }
}



module.exports = ExpRegression;