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
var Matrix = require("ml-matrix");


class PolynomialRegression extends BaseRegression{
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param M: Maximum degree of the polynomial
     * @param options
     */
    constructor(x, y, M, options) {
        super();
        let opt = options||{};
        if (x === true) { // reloading model
            this.coefficients = outputs.coefficients;
            this.powers = outputs.powers;
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
            if(Array.isArray(M)){
                var powers = M;
                M = powers.length;
            }
            else{
                M++;
                var powers = new Array(M);
                for( k = 0; k < M; k++) {
                    powers[k]=k;
                }
            }
            var F = new Matrix(n, M);
            var Y = new Matrix([y]);
            var k,i;
            for( k = 0; k < M; k++) {
                for(i=0; i< n;i++){
                    if(powers[k]==0)
                        F[i][k]=1;
                    else{
                        F[i][k]=Math.pow(x[i],powers[k]);
                    }
                }
            }

            var FT = F.transpose();
            var A = FT.mmul(F);
            var B = FT.mmul(Y.transpose());

            this.coefficients = A.solve(B);
            this.powers = powers;
            this.M = M-1;
            if(opt.computeCoefficient){
                this.r = this.rCoefficient(x,y);
                this.r2 = this.r*this.r;
            }
        }
    }

    _predict(x) {
        var y =0;
        for(var  k = 0; k < this.powers.length; k++) {
            y+=this.coefficients[k]*Math.pow(x,this.powers[k]);
        }
        return y;
    }

    toJSON() {
        var out = {name: 'polynomialRegression',
            coefficients: this.coefficients,
            powers: this.powers,
            M: this.M
        };

        if(this.r){
            out.r = this.r;
            out.r2=this.r2;
        }
        return out;
    }

    toString(precision){
        var fn =  "",str;
        for(var  k = 0; k < this.coefficients.length ; k++) {
            str="";
            if(this.coefficients[k]!=0) {
                if (this.powers[k] == 0)
                    str = maybeToPrecision(this.coefficients[k], precision);
                else {
                    if (this.powers[k] == 1)
                        str = maybeToPrecision(this.coefficients[k], precision) + "*x";
                    else {
                        str = maybeToPrecision(this.coefficients[k], precision) + "*x^" + this.powers[k];
                    }
                }
                if (this.coefficients[k] > 0)
                    str= "+"+str;
            }
            fn=str+fn;
        }
        if(fn.charAt(0)=='+'){
            fn.splice(0,1);
        }

        return fn;
    }

    static load(json) {
        if (json.name !== 'polynomialRegression') {
            throw new TypeError('not a polynomial regression model');
        }
        return new PolynomialRegression(true, json);
    }
}

module.exports = PolynomialRegression;