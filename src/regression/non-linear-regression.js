'use strict';

var matrix = require("ml-matrix");

/*
 * Function that calculate the linear fit in the form f(x) = Ax + B and
 * return the A and B coefficients
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @return {Object} coefficients - Returns the coefficients of the function A and B.
 *
 * */

function linearRegression(Xi, Yi) {
	var X = Xi;
	var Y = Yi;
	if(matrix.isMatrix(X))
		X = new matrix(X);
	if(matrix.isMatrix(Y))
		Y = new matrix(Y);

	var x2 = X.mmul(X.transpose()).sum();
	var x = X.sum();
	var y = Y.sum();
	var xy = X.mmul(Y.transpose()).sum();
	var n = X.rows;

	var A = new matrix([[x2, x], [x, n]]);
	var B = new matrix([[xy], [y]]);

	var result = matrix.solve(A, B);

	return {
		A : result[0][0],
		B : result[1][0]
	};
}

/*
 * Function that calculate the potential fit in the form f(x) = A*x^M
 * with a given M and return de A coefficient.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the x positions of the points.
 * @param {Number, BigNumber} M - The exponent of the potential fit.
 * @return {Number|BigNumber} A - The A coefficient of the potential fit.
 * */
function potentialRegression(X, Y, M) {
	var numerator = 0;
	var denominator = 0;
	var size = math.subset(math.size(X), math.index(0));
	for(var i = 0; i < size; ++i) {
		numerator += math.multiply( math.pow(math.subset(X, math.index(i)), M), math.subset(Y, math.index(i)));
		denominator += math.pow(math.subset(X, math.index(i)), math.multiply(2, M));
	}

	return math.divide(numerator, denominator);
}

/*
 * Function that calculate the linear fit in the form f(x) = Ce^(A * x) and
 * return the A and C coefficient of the given formula.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @return {Object} coefficients - The A and C coefficients.
 *
 * */
function expRegression(X, Y) {
	var result = linearRegression(X, math.log(Y));
	return {
		A : result.A,
		C : math.exp(result.B)
	};
}

/*
 *
 * Function that return a constants of the M degree polynomial that
 * fit the given points, this constants is given from lower to higher
 * order of the polynomial.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @param {Number|BigNumber} M - Degree of the polynomial.
 * @param {Vector} constants - Vector of constants of the function.
 * */

function polynomialRegression(X, Y, M) {
	M++;

	var n = math.subset(math.size(X), math.index(0));
	var F = math.zeros(n, M);
	var B = math.zeros(M);
	for(var k = 0; k < M; ++k) {
		F = math.subset(F, math.index([0, n], k), math.transpose(math.dotPow(X, k)));
	}
	var transposeF = math.transpose(F);
	var A = math.multiply(transposeF, F);
	B = math.multiply(transposeF, math.transpose(Y));

	//vector transpose, not supported by mathjs
	var size = math.subset(math.size(B), math.index(0));
	var BTransposed = [];
	for(var i = 0; i < size; ++i) {
		BTransposed[i] = [];
		BTransposed[i][0] = math.subset(B, math.index(i));
	}
	B = math.matrix(BTransposed);

	var constants = SolutionLinearSystem.solve(A, B);
	return constants;
}

/*
 *
 * Function that returns the power regression coefficients f(x)=A*x^B
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @return [A,B]
 * */
function powerRegression(X,Y){
	var result = linearRegression(matrix.log([X]), matrix.log([Y]));
	console.log(result);
	return {
		A : Math.exp(result.A),
		B : Math.exp(result.B)
	};
}

module.exports.potentialRegression = potentialRegression;
module.exports.expRegression = expRegression;
module.exports.polynomialRegression = polynomialRegression;
module.exports.powerRegression = powerRegression;