var Math = require("ml-matrix");
var math = Math.algebra;

/*
 * Function that calculate the linear fit in the form f(x) = Ax + B and
 * return the A and B coefficients
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @return {Object} coefficients - Returns the coefficients of the function A and B.
 *
 * */
function linearRegression(X, Y) {
	var x2 = math.sum(math.dotPow(X, 2));
	var x = math.sum(X);
	var y = math.sum(Y);
	var xy = math.sum(math.dotMultiply(X, Y));
	var n = math.subset(math.size(X), math.index(0));

	var A = math.matrix([[x2, x], [x, n]]);
	var B = math.matrix([[xy], [y]]);

	var result = math.solve(A, B);

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
	var result = this.linearFit(X, math.log(Y));
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
	//TODO
	return [0,0];
}

module.exports.potentialRegression = potentialRegression;
module.exports.expRegression = expRegression;
module.exports.polynomialRegression = polynomialRegression;
module.exports.powerRegression = powerRegression;