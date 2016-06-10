'use strict';

/**
 * This class implements the power regression f(x)=A*x^B
 * Created by acastillo on 5/12/16.
 */

const maybeToPrecision = require('./util').maybeToPrecision;
const SimpleLinearRegression = require('./simple-linear-regression');
const BaseRegression = require('./base-regression');

class PowerRegression extends BaseRegression{
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
            this.B = outputs.B;
            if(y.r){
                this.r = y.r;
                this.r2 = y.r2;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }
            var xl = new Array(n), yl = new Array(n);
            for (var i = 0; i < n; i++) {
                xl[i]=Math.log(x[i]);
                yl[i]=Math.log(y[i]);
            }

            var linear = new SimpleLinearRegression(xl, yl, {computeCoefficient:false});
            this.A = Math.exp(linear.intercept);
            this.B = linear.slope;
            if(opt.computeCoefficient){
                this.r = this.rCoefficient(x,y);
                this.r2 = this.r*this.r;
            }
        }
    }

    _predict(newInputs) {
        return this.A*Math.pow(newInputs,this.B);
    }

    toJSON() {
        var out = {name: 'powerRegression', A: this.A, B: this.B};
        if(this.r){
            out.r = this.r;
            out.r2=this.r2;
        }
        return out;
    }

    toString(precision){
        return maybeToPrecision(this.A, precision)+"*x^"+maybeToPrecision(this.B, precision);
    }

    static load(json) {
        if (json.name !== 'powerRegression') {
            throw new TypeError('not a power regression model');
        }
        return new PowerRegression(true, json);
    }
}

module.exports = PowerRegression;