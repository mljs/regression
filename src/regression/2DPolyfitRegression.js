"use strict";

var Matrix = require("ml-matrix");
var isInteger = require("is-integer");
var SVD = Matrix.DC.SingularValueDecomposition;

module.exports = PolynomialFitRegression2D;

/**
 * Constructor for the 2D polynomial fitting
 *
 * @param reload - for load purposes
 * @param model - for load purposes
 * @constructor
 */
function PolynomialFitRegression2D(reload, model) {
    if (reload) {
        this.coefficients = Matrix.columnVector(model.coefficients);
        this.order = model.order;
    } else {
        this.coefficients = [];
        this.order = 2;
    }
}

/**
 * Function that fits the model given the data(X) and predictions(y).
 * The third argument is an object with the following options:
 * * order: order of the polynomial to fit.
 *
 * @param X - A matrix with n rows and 2 columns.
 * @param y - A vector of the prediction values.
 * @param options
 */
PolynomialFitRegression2D.prototype.train = function (X, y, options) {
    if(!Matrix.isMatrix(X)) X = new Matrix(X);
    if(!Matrix.isMatrix(y)) y = Matrix.columnVector(y);
    else y = y.transpose();

    if(options === undefined) options = {};
    if(options.order !== undefined && isInteger(options.order)) this.order = options.order;

    if(X.columns !== 2)
        throw new RangeError("You give X with " + X.columns + " columns and it must be 2");
    if(X.rows !== y.rows)
        throw new RangeError("X and y must have the same rows");

    var examples = X.rows;
    var coefficients = ((this.order + 2) * (this.order + 1)) / 2;
    this.coefficients = new Array(coefficients);

    var x1 = X.getColumnVector(0);
    var x2 = X.getColumnVector(1);

    var scaleX1 = 1.0 / x1.clone().apply(abs).max();
    var scaleX2 = 1.0 / x2.clone().apply(abs).max();
    var scaleY = 1.0 / y.clone().apply(abs).max();

    x1.mulColumn(0, scaleX1);
    x2.mulColumn(0, scaleX2);
    y.mulColumn(0, scaleY);

    var A = new Matrix(examples, coefficients);
    var col = 0;

    for(var i = 0; i <= this.order; ++i) {
        var limit = this.order - i;
        for(var j = 0; j <= limit; ++j) {
            var result = powColVector(x1, i).mulColumnVector(powColVector(x2, j));
            A.setColumn(col, result);
            col++;
        }
    }

    var svd = new SVD(A.transpose(), {
        computeLeftSingularVectors: true,
        computeRightSingularVectors: true,
        autoTranspose: false
    });

    var qqs = Matrix.rowVector(svd.diagonal);
    qqs = qqs.apply(function(i, j) {
        if(this[i][j] >= 1e-15) this[i][j] = 1 / this[i][j];
        else this[i][j] = 0;
    });

    var qqs1 = Matrix.zeros(examples, coefficients);
    for(i = 0; i < coefficients; ++i) {
        qqs1[i][i] = qqs[0][i];
    }

    qqs = qqs1;

    var U = svd.rightSingularVectors;
    var V = svd.leftSingularVectors;

    this.coefficients = V.mmul(qqs.transpose()).mmul(U.transpose()).mmul(y);

    col = 0;

    for(i = 0; i <= coefficients; ++i) {
        limit = this.order - i;
        for(j = 0; j <= limit; ++j) {
            this.coefficients[col][0] = (this.coefficients[col][0] * Math.pow(scaleX1, i) * Math.pow(scaleX2, j)) / scaleY;
            col++;
        }
    }
};

/**
 * Function that returns a prediction for the given dataset(X)
 *
 * @param X - dataset
 * @returns {Matrix} - prediction for the dataset.
 */

PolynomialFitRegression2D.prototype.predict = function (X) {
    if(!Matrix.isMatrix(X)) X = new Matrix(X);

    var rows = X.rows;

    var x1 = X.getColumnVector(0);
    var x2 = X.getColumnVector(1);

    var y = Matrix.zeros(rows, 1);
    var column = 0;

    for(var i = 0; i <= this.order; ++i) {
        for(var j = 0; j <= this.order - i; ++j) {
            var value = powColVector(x1, i).mulColumnVector(powColVector(x2, j));
            value.mulColumn(0, this.coefficients[column][0]);
            y.addColumnVector(value);
            column++;
        }
    }

    return y;
};

/**
 * Function that exports the current model.
 *
 * @returns {{modelName: string, order: *, coefficients: *}} - JSON object with the model.
 */

PolynomialFitRegression2D.prototype.export = function () {
    return {
        modelName: "Polyfit2D",
        order: this.order,
        coefficients: this.coefficients
    };
};


/**
 * Function that load the given model and returns a PolynomialFitRegression2D object.
 *
 * @param model
 * @returns {PolynomialFitRegression2D}
 */
PolynomialFitRegression2D.load = function (model) {
    if(model.modelName !== "Polyfit2D")
        throw new RangeError("The current model in invalid!");

    return new PolynomialFitRegression2D(true, model);
};

/**
 * Function that given a column vector return this: vector^power
 *
 * @param x - Column vector.
 * @param power - Pow number.
 * @returns {Suite|Matrix}
 */
function powColVector(x, power) {
    var result = x.clone();
    for(var i = 0; i < x.rows; ++i) {
        result[i][0] = Math.pow(result[i][0], power);
    }
    return result;
}

/**
 * Function to use in the apply method to get the absolute value
 * of each element of the matrix
 *
 * @param i - current row.
 * @param j - current column.
 */
function abs(i, j) {
    this[i][j] = Math.abs(this[i][j]);
}