/**
 * ml-regression - Regression algorithms
 * @version v6.2.0
 * @link https://github.com/mljs/regression
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Regression = {}));
})(this, (function (exports) { 'use strict';

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const toString = Object.prototype.toString;
    /**
     * Checks if an object is an instance of an Array (array or typed array, except those that contain bigint values).
     *
     * @param value - Object to check.
     * @returns True if the object is an array or a typed array.
     */
    function isAnyArray$1(value) {
      const tag = toString.call(value);
      return tag.endsWith('Array]') && !tag.includes('Big');
    }

    var libEsm = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isAnyArray: isAnyArray$1
    });

    /**
     * Check that x and y are arrays with the same length.
     * @param x - first array
     * @param y - second array
     * @throws if x or y are not the same length, or if they are not arrays
     */
    function checkArrayLength(x, y) {
      if (!isAnyArray$1(x) || !isAnyArray$1(y)) {
        throw new TypeError('x and y must be arrays');
      }
      if (x.length !== y.length) {
        throw new RangeError('x and y arrays must have the same length');
      }
    }

    class BaseRegression {
      constructor() {
        if (new.target === BaseRegression) {
          throw new Error('BaseRegression must be subclassed');
        }
      }
      predict(x) {
        if (typeof x === 'number') {
          return this._predict(x);
        } else if (isAnyArray$1(x)) {
          const y = [];
          for (const xVal of x) {
            y.push(this._predict(xVal));
          }
          return y;
        } else {
          throw new TypeError('x must be a number or array');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _predict(x) {
        throw new Error('_predict must be implemented');
      }
      train() {
        // Do nothing for this package
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      toString(precision) {
        return '';
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      toLaTeX(precision) {
        return '';
      }
      /**
       * Return the correlation coefficient of determination (r) and chi-square.
       * @param x - explanatory variable
       * @param y - response variable
       * @return - Object with further statistics.
       */
      score(x, y) {
        checkArrayLength(x, y);
        const n = x.length;
        const y2 = new Array(n);
        for (let i = 0; i < n; i++) {
          y2[i] = this._predict(x[i]);
        }
        let xSum = 0;
        let ySum = 0;
        let chi2 = 0;
        let rmsd = 0;
        let xSquared = 0;
        let ySquared = 0;
        let xY = 0;
        for (let i = 0; i < n; i++) {
          xSum += y2[i];
          ySum += y[i];
          xSquared += y2[i] * y2[i];
          ySquared += y[i] * y[i];
          xY += y2[i] * y[i];
          if (y[i] !== 0) {
            chi2 += (y[i] - y2[i]) * (y[i] - y2[i]) / y[i];
          }
          rmsd += (y[i] - y2[i]) * (y[i] - y2[i]);
        }
        const r = (n * xY - xSum * ySum) / Math.sqrt((n * xSquared - xSum * xSum) * (n * ySquared - ySum * ySum));
        return {
          r,
          r2: r * r,
          chi2,
          rmsd: Math.sqrt(rmsd / n)
        };
      }
    }

    /**
     * Cast `number` to string. Optionally `digits` specifies significant figures.
     * @param number
     * @param figures
     * @returns - A string representation of `number`.
     */
    function maybeToPrecision(number, figures) {
      if (number < 0) {
        number = 0 - number;
        if (typeof figures === 'number') {
          return `- ${number.toPrecision(figures)}`;
        } else {
          return `- ${number.toString()}`;
        }
      } else if (typeof figures === 'number') {
        return number.toPrecision(figures);
      } else {
        return number.toString();
      }
    }

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function getAugmentedNamespace(n) {
      if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
      var f = n.default;
    	if (typeof f == "function") {
    		var a = function a () {
    			if (this instanceof a) {
            return Reflect.construct(f, arguments, this.constructor);
    			}
    			return f.apply(this, arguments);
    		};
    		a.prototype = f.prototype;
      } else a = {};
      Object.defineProperty(a, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    var matrix = {};

    var require$$0$1 = /*@__PURE__*/getAugmentedNamespace(libEsm);

    function max(input) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!isAnyArray$1(input)) {
        throw new TypeError('input must be an array');
      }
      if (input.length === 0) {
        throw new TypeError('input must not be empty');
      }
      var _options$fromIndex = options.fromIndex,
        fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
        _options$toIndex = options.toIndex,
        toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;
      if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
        throw new Error('fromIndex must be a positive integer smaller than length');
      }
      if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
        throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
      }
      var maxValue = input[fromIndex];
      for (var i = fromIndex + 1; i < toIndex; i++) {
        if (input[i] > maxValue) maxValue = input[i];
      }
      return maxValue;
    }

    function min(input) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!isAnyArray$1(input)) {
        throw new TypeError('input must be an array');
      }
      if (input.length === 0) {
        throw new TypeError('input must not be empty');
      }
      var _options$fromIndex = options.fromIndex,
        fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
        _options$toIndex = options.toIndex,
        toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;
      if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
        throw new Error('fromIndex must be a positive integer smaller than length');
      }
      if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
        throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
      }
      var minValue = input[fromIndex];
      for (var i = fromIndex + 1; i < toIndex; i++) {
        if (input[i] < minValue) minValue = input[i];
      }
      return minValue;
    }

    function rescale$1(input) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!isAnyArray$1(input)) {
        throw new TypeError('input must be an array');
      } else if (input.length === 0) {
        throw new TypeError('input must not be empty');
      }
      var output;
      if (options.output !== undefined) {
        if (!isAnyArray$1(options.output)) {
          throw new TypeError('output option must be an array if specified');
        }
        output = options.output;
      } else {
        output = new Array(input.length);
      }
      var currentMin = min(input);
      var currentMax = max(input);
      if (currentMin === currentMax) {
        throw new RangeError('minimum and maximum input values are equal. Cannot rescale a constant array');
      }
      var _options$min = options.min,
        minValue = _options$min === void 0 ? options.autoMinMax ? currentMin : 0 : _options$min,
        _options$max = options.max,
        maxValue = _options$max === void 0 ? options.autoMinMax ? currentMax : 1 : _options$max;
      if (minValue >= maxValue) {
        throw new RangeError('min option must be smaller than max option');
      }
      var factor = (maxValue - minValue) / (currentMax - currentMin);
      for (var i = 0; i < input.length; i++) {
        output[i] = (input[i] - currentMin) * factor + minValue;
      }
      return output;
    }

    var libEs6 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: rescale$1
    });

    var require$$1 = /*@__PURE__*/getAugmentedNamespace(libEs6);

    Object.defineProperty(matrix, '__esModule', {
      value: true
    });
    var isAnyArray = require$$0$1;
    var rescale = require$$1;
    const indent = ' '.repeat(2);
    const indentData = ' '.repeat(4);

    /**
     * @this {Matrix}
     * @returns {string}
     */
    function inspectMatrix() {
      return inspectMatrixWithOptions(this);
    }
    function inspectMatrixWithOptions(matrix, options = {}) {
      const {
        maxRows = 15,
        maxColumns = 10,
        maxNumSize = 8,
        padMinus = 'auto'
      } = options;
      return `${matrix.constructor.name} {
${indent}[
${indentData}${inspectData(matrix, maxRows, maxColumns, maxNumSize, padMinus)}
${indent}]
${indent}rows: ${matrix.rows}
${indent}columns: ${matrix.columns}
}`;
    }
    function inspectData(matrix, maxRows, maxColumns, maxNumSize, padMinus) {
      const {
        rows,
        columns
      } = matrix;
      const maxI = Math.min(rows, maxRows);
      const maxJ = Math.min(columns, maxColumns);
      const result = [];
      if (padMinus === 'auto') {
        padMinus = false;
        loop: for (let i = 0; i < maxI; i++) {
          for (let j = 0; j < maxJ; j++) {
            if (matrix.get(i, j) < 0) {
              padMinus = true;
              break loop;
            }
          }
        }
      }
      for (let i = 0; i < maxI; i++) {
        let line = [];
        for (let j = 0; j < maxJ; j++) {
          line.push(formatNumber(matrix.get(i, j), maxNumSize, padMinus));
        }
        result.push(`${line.join(' ')}`);
      }
      if (maxJ !== columns) {
        result[result.length - 1] += ` ... ${columns - maxColumns} more columns`;
      }
      if (maxI !== rows) {
        result.push(`... ${rows - maxRows} more rows`);
      }
      return result.join(`\n${indentData}`);
    }
    function formatNumber(num, maxNumSize, padMinus) {
      return (num >= 0 && padMinus ? ` ${formatNumber2(num, maxNumSize - 1)}` : formatNumber2(num, maxNumSize)).padEnd(maxNumSize);
    }
    function formatNumber2(num, len) {
      // small.length numbers should be as is
      let str = num.toString();
      if (str.length <= len) return str;

      // (7)'0.00123' is better then (7)'1.23e-2'
      // (8)'0.000123' is worse then (7)'1.23e-3',
      let fix = num.toFixed(len);
      if (fix.length > len) {
        fix = num.toFixed(Math.max(0, len - (fix.length - len)));
      }
      if (fix.length <= len && !fix.startsWith('0.000') && !fix.startsWith('-0.000')) {
        return fix;
      }

      // well, if it's still too long the user should've used longer numbers
      let exp = num.toExponential(len);
      if (exp.length > len) {
        exp = num.toExponential(Math.max(0, len - (exp.length - len)));
      }
      return exp.slice(0);
    }
    function installMathOperations(AbstractMatrix, Matrix) {
      AbstractMatrix.prototype.add = function add(value) {
        if (typeof value === 'number') return this.addS(value);
        return this.addM(value);
      };
      AbstractMatrix.prototype.addS = function addS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.addM = function addM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.add = function add(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.add(value);
      };
      AbstractMatrix.prototype.sub = function sub(value) {
        if (typeof value === 'number') return this.subS(value);
        return this.subM(value);
      };
      AbstractMatrix.prototype.subS = function subS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.subM = function subM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.sub = function sub(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.sub(value);
      };
      AbstractMatrix.prototype.subtract = AbstractMatrix.prototype.sub;
      AbstractMatrix.prototype.subtractS = AbstractMatrix.prototype.subS;
      AbstractMatrix.prototype.subtractM = AbstractMatrix.prototype.subM;
      AbstractMatrix.subtract = AbstractMatrix.sub;
      AbstractMatrix.prototype.mul = function mul(value) {
        if (typeof value === 'number') return this.mulS(value);
        return this.mulM(value);
      };
      AbstractMatrix.prototype.mulS = function mulS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.mulM = function mulM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.mul = function mul(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.mul(value);
      };
      AbstractMatrix.prototype.multiply = AbstractMatrix.prototype.mul;
      AbstractMatrix.prototype.multiplyS = AbstractMatrix.prototype.mulS;
      AbstractMatrix.prototype.multiplyM = AbstractMatrix.prototype.mulM;
      AbstractMatrix.multiply = AbstractMatrix.mul;
      AbstractMatrix.prototype.div = function div(value) {
        if (typeof value === 'number') return this.divS(value);
        return this.divM(value);
      };
      AbstractMatrix.prototype.divS = function divS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.divM = function divM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.div = function div(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.div(value);
      };
      AbstractMatrix.prototype.divide = AbstractMatrix.prototype.div;
      AbstractMatrix.prototype.divideS = AbstractMatrix.prototype.divS;
      AbstractMatrix.prototype.divideM = AbstractMatrix.prototype.divM;
      AbstractMatrix.divide = AbstractMatrix.div;
      AbstractMatrix.prototype.mod = function mod(value) {
        if (typeof value === 'number') return this.modS(value);
        return this.modM(value);
      };
      AbstractMatrix.prototype.modS = function modS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) % value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.modM = function modM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) % matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.mod = function mod(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.mod(value);
      };
      AbstractMatrix.prototype.modulus = AbstractMatrix.prototype.mod;
      AbstractMatrix.prototype.modulusS = AbstractMatrix.prototype.modS;
      AbstractMatrix.prototype.modulusM = AbstractMatrix.prototype.modM;
      AbstractMatrix.modulus = AbstractMatrix.mod;
      AbstractMatrix.prototype.and = function and(value) {
        if (typeof value === 'number') return this.andS(value);
        return this.andM(value);
      };
      AbstractMatrix.prototype.andS = function andS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) & value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.andM = function andM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) & matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.and = function and(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.and(value);
      };
      AbstractMatrix.prototype.or = function or(value) {
        if (typeof value === 'number') return this.orS(value);
        return this.orM(value);
      };
      AbstractMatrix.prototype.orS = function orS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) | value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.orM = function orM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) | matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.or = function or(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.or(value);
      };
      AbstractMatrix.prototype.xor = function xor(value) {
        if (typeof value === 'number') return this.xorS(value);
        return this.xorM(value);
      };
      AbstractMatrix.prototype.xorS = function xorS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) ^ value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.xorM = function xorM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) ^ matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.xor = function xor(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.xor(value);
      };
      AbstractMatrix.prototype.leftShift = function leftShift(value) {
        if (typeof value === 'number') return this.leftShiftS(value);
        return this.leftShiftM(value);
      };
      AbstractMatrix.prototype.leftShiftS = function leftShiftS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) << value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.leftShiftM = function leftShiftM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) << matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.leftShift = function leftShift(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.leftShift(value);
      };
      AbstractMatrix.prototype.signPropagatingRightShift = function signPropagatingRightShift(value) {
        if (typeof value === 'number') return this.signPropagatingRightShiftS(value);
        return this.signPropagatingRightShiftM(value);
      };
      AbstractMatrix.prototype.signPropagatingRightShiftS = function signPropagatingRightShiftS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >> value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.signPropagatingRightShiftM = function signPropagatingRightShiftM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >> matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.signPropagatingRightShift = function signPropagatingRightShift(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.signPropagatingRightShift(value);
      };
      AbstractMatrix.prototype.rightShift = function rightShift(value) {
        if (typeof value === 'number') return this.rightShiftS(value);
        return this.rightShiftM(value);
      };
      AbstractMatrix.prototype.rightShiftS = function rightShiftS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >>> value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.rightShiftM = function rightShiftM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >>> matrix.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.rightShift = function rightShift(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.rightShift(value);
      };
      AbstractMatrix.prototype.zeroFillRightShift = AbstractMatrix.prototype.rightShift;
      AbstractMatrix.prototype.zeroFillRightShiftS = AbstractMatrix.prototype.rightShiftS;
      AbstractMatrix.prototype.zeroFillRightShiftM = AbstractMatrix.prototype.rightShiftM;
      AbstractMatrix.zeroFillRightShift = AbstractMatrix.rightShift;
      AbstractMatrix.prototype.not = function not() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, ~this.get(i, j));
          }
        }
        return this;
      };
      AbstractMatrix.not = function not(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.not();
      };
      AbstractMatrix.prototype.abs = function abs() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.abs(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.abs = function abs(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.abs();
      };
      AbstractMatrix.prototype.acos = function acos() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.acos(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.acos = function acos(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.acos();
      };
      AbstractMatrix.prototype.acosh = function acosh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.acosh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.acosh = function acosh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.acosh();
      };
      AbstractMatrix.prototype.asin = function asin() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.asin(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.asin = function asin(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.asin();
      };
      AbstractMatrix.prototype.asinh = function asinh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.asinh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.asinh = function asinh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.asinh();
      };
      AbstractMatrix.prototype.atan = function atan() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.atan(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.atan = function atan(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.atan();
      };
      AbstractMatrix.prototype.atanh = function atanh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.atanh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.atanh = function atanh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.atanh();
      };
      AbstractMatrix.prototype.cbrt = function cbrt() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.cbrt(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.cbrt = function cbrt(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.cbrt();
      };
      AbstractMatrix.prototype.ceil = function ceil() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.ceil(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.ceil = function ceil(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.ceil();
      };
      AbstractMatrix.prototype.clz32 = function clz32() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.clz32(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.clz32 = function clz32(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.clz32();
      };
      AbstractMatrix.prototype.cos = function cos() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.cos(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.cos = function cos(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.cos();
      };
      AbstractMatrix.prototype.cosh = function cosh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.cosh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.cosh = function cosh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.cosh();
      };
      AbstractMatrix.prototype.exp = function exp() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.exp(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.exp = function exp(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.exp();
      };
      AbstractMatrix.prototype.expm1 = function expm1() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.expm1(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.expm1 = function expm1(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.expm1();
      };
      AbstractMatrix.prototype.floor = function floor() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.floor(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.floor = function floor(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.floor();
      };
      AbstractMatrix.prototype.fround = function fround() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.fround(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.fround = function fround(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.fround();
      };
      AbstractMatrix.prototype.log = function log() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.log = function log(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.log();
      };
      AbstractMatrix.prototype.log1p = function log1p() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log1p(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.log1p = function log1p(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.log1p();
      };
      AbstractMatrix.prototype.log10 = function log10() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log10(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.log10 = function log10(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.log10();
      };
      AbstractMatrix.prototype.log2 = function log2() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log2(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.log2 = function log2(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.log2();
      };
      AbstractMatrix.prototype.round = function round() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.round(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.round = function round(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.round();
      };
      AbstractMatrix.prototype.sign = function sign() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sign(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.sign = function sign(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.sign();
      };
      AbstractMatrix.prototype.sin = function sin() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sin(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.sin = function sin(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.sin();
      };
      AbstractMatrix.prototype.sinh = function sinh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sinh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.sinh = function sinh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.sinh();
      };
      AbstractMatrix.prototype.sqrt = function sqrt() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sqrt(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.sqrt = function sqrt(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.sqrt();
      };
      AbstractMatrix.prototype.tan = function tan() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.tan(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.tan = function tan(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.tan();
      };
      AbstractMatrix.prototype.tanh = function tanh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.tanh(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.tanh = function tanh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.tanh();
      };
      AbstractMatrix.prototype.trunc = function trunc() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.trunc(this.get(i, j)));
          }
        }
        return this;
      };
      AbstractMatrix.trunc = function trunc(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.trunc();
      };
      AbstractMatrix.pow = function pow(matrix, arg0) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.pow(arg0);
      };
      AbstractMatrix.prototype.pow = function pow(value) {
        if (typeof value === 'number') return this.powS(value);
        return this.powM(value);
      };
      AbstractMatrix.prototype.powS = function powS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) ** value);
          }
        }
        return this;
      };
      AbstractMatrix.prototype.powM = function powM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) ** matrix.get(i, j));
          }
        }
        return this;
      };
    }

    /**
     * @private
     * Check that a row index is not out of bounds
     * @param {Matrix} matrix
     * @param {number} index
     * @param {boolean} [outer]
     */
    function checkRowIndex(matrix, index, outer) {
      let max = outer ? matrix.rows : matrix.rows - 1;
      if (index < 0 || index > max) {
        throw new RangeError('Row index out of range');
      }
    }

    /**
     * @private
     * Check that a column index is not out of bounds
     * @param {Matrix} matrix
     * @param {number} index
     * @param {boolean} [outer]
     */
    function checkColumnIndex(matrix, index, outer) {
      let max = outer ? matrix.columns : matrix.columns - 1;
      if (index < 0 || index > max) {
        throw new RangeError('Column index out of range');
      }
    }

    /**
     * @private
     * Check that the provided vector is an array with the right length
     * @param {Matrix} matrix
     * @param {Array|Matrix} vector
     * @return {Array}
     * @throws {RangeError}
     */
    function checkRowVector(matrix, vector) {
      if (vector.to1DArray) {
        vector = vector.to1DArray();
      }
      if (vector.length !== matrix.columns) {
        throw new RangeError('vector size must be the same as the number of columns');
      }
      return vector;
    }

    /**
     * @private
     * Check that the provided vector is an array with the right length
     * @param {Matrix} matrix
     * @param {Array|Matrix} vector
     * @return {Array}
     * @throws {RangeError}
     */
    function checkColumnVector(matrix, vector) {
      if (vector.to1DArray) {
        vector = vector.to1DArray();
      }
      if (vector.length !== matrix.rows) {
        throw new RangeError('vector size must be the same as the number of rows');
      }
      return vector;
    }
    function checkRowIndices(matrix, rowIndices) {
      if (!isAnyArray.isAnyArray(rowIndices)) {
        throw new TypeError('row indices must be an array');
      }
      for (let i = 0; i < rowIndices.length; i++) {
        if (rowIndices[i] < 0 || rowIndices[i] >= matrix.rows) {
          throw new RangeError('row indices are out of range');
        }
      }
    }
    function checkColumnIndices(matrix, columnIndices) {
      if (!isAnyArray.isAnyArray(columnIndices)) {
        throw new TypeError('column indices must be an array');
      }
      for (let i = 0; i < columnIndices.length; i++) {
        if (columnIndices[i] < 0 || columnIndices[i] >= matrix.columns) {
          throw new RangeError('column indices are out of range');
        }
      }
    }
    function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
      if (arguments.length !== 5) {
        throw new RangeError('expected 4 arguments');
      }
      checkNumber('startRow', startRow);
      checkNumber('endRow', endRow);
      checkNumber('startColumn', startColumn);
      checkNumber('endColumn', endColumn);
      if (startRow > endRow || startColumn > endColumn || startRow < 0 || startRow >= matrix.rows || endRow < 0 || endRow >= matrix.rows || startColumn < 0 || startColumn >= matrix.columns || endColumn < 0 || endColumn >= matrix.columns) {
        throw new RangeError('Submatrix indices are out of range');
      }
    }
    function newArray(length, value = 0) {
      let array = [];
      for (let i = 0; i < length; i++) {
        array.push(value);
      }
      return array;
    }
    function checkNumber(name, value) {
      if (typeof value !== 'number') {
        throw new TypeError(`${name} must be a number`);
      }
    }
    function checkNonEmpty(matrix) {
      if (matrix.isEmpty()) {
        throw new Error('Empty matrix has no elements to index');
      }
    }
    function sumByRow(matrix) {
      let sum = newArray(matrix.rows);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum[i] += matrix.get(i, j);
        }
      }
      return sum;
    }
    function sumByColumn(matrix) {
      let sum = newArray(matrix.columns);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum[j] += matrix.get(i, j);
        }
      }
      return sum;
    }
    function sumAll(matrix) {
      let v = 0;
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          v += matrix.get(i, j);
        }
      }
      return v;
    }
    function productByRow(matrix) {
      let sum = newArray(matrix.rows, 1);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum[i] *= matrix.get(i, j);
        }
      }
      return sum;
    }
    function productByColumn(matrix) {
      let sum = newArray(matrix.columns, 1);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum[j] *= matrix.get(i, j);
        }
      }
      return sum;
    }
    function productAll(matrix) {
      let v = 1;
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          v *= matrix.get(i, j);
        }
      }
      return v;
    }
    function varianceByRow(matrix, unbiased, mean) {
      const rows = matrix.rows;
      const cols = matrix.columns;
      const variance = [];
      for (let i = 0; i < rows; i++) {
        let sum1 = 0;
        let sum2 = 0;
        let x = 0;
        for (let j = 0; j < cols; j++) {
          x = matrix.get(i, j) - mean[i];
          sum1 += x;
          sum2 += x * x;
        }
        if (unbiased) {
          variance.push((sum2 - sum1 * sum1 / cols) / (cols - 1));
        } else {
          variance.push((sum2 - sum1 * sum1 / cols) / cols);
        }
      }
      return variance;
    }
    function varianceByColumn(matrix, unbiased, mean) {
      const rows = matrix.rows;
      const cols = matrix.columns;
      const variance = [];
      for (let j = 0; j < cols; j++) {
        let sum1 = 0;
        let sum2 = 0;
        let x = 0;
        for (let i = 0; i < rows; i++) {
          x = matrix.get(i, j) - mean[j];
          sum1 += x;
          sum2 += x * x;
        }
        if (unbiased) {
          variance.push((sum2 - sum1 * sum1 / rows) / (rows - 1));
        } else {
          variance.push((sum2 - sum1 * sum1 / rows) / rows);
        }
      }
      return variance;
    }
    function varianceAll(matrix, unbiased, mean) {
      const rows = matrix.rows;
      const cols = matrix.columns;
      const size = rows * cols;
      let sum1 = 0;
      let sum2 = 0;
      let x = 0;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          x = matrix.get(i, j) - mean;
          sum1 += x;
          sum2 += x * x;
        }
      }
      if (unbiased) {
        return (sum2 - sum1 * sum1 / size) / (size - 1);
      } else {
        return (sum2 - sum1 * sum1 / size) / size;
      }
    }
    function centerByRow(matrix, mean) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) - mean[i]);
        }
      }
    }
    function centerByColumn(matrix, mean) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) - mean[j]);
        }
      }
    }
    function centerAll(matrix, mean) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) - mean);
        }
      }
    }
    function getScaleByRow(matrix) {
      const scale = [];
      for (let i = 0; i < matrix.rows; i++) {
        let sum = 0;
        for (let j = 0; j < matrix.columns; j++) {
          sum += matrix.get(i, j) ** 2 / (matrix.columns - 1);
        }
        scale.push(Math.sqrt(sum));
      }
      return scale;
    }
    function scaleByRow(matrix, scale) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) / scale[i]);
        }
      }
    }
    function getScaleByColumn(matrix) {
      const scale = [];
      for (let j = 0; j < matrix.columns; j++) {
        let sum = 0;
        for (let i = 0; i < matrix.rows; i++) {
          sum += matrix.get(i, j) ** 2 / (matrix.rows - 1);
        }
        scale.push(Math.sqrt(sum));
      }
      return scale;
    }
    function scaleByColumn(matrix, scale) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) / scale[j]);
        }
      }
    }
    function getScaleAll(matrix) {
      const divider = matrix.size - 1;
      let sum = 0;
      for (let j = 0; j < matrix.columns; j++) {
        for (let i = 0; i < matrix.rows; i++) {
          sum += matrix.get(i, j) ** 2 / divider;
        }
      }
      return Math.sqrt(sum);
    }
    function scaleAll(matrix, scale) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) / scale);
        }
      }
    }
    class AbstractMatrix {
      static from1DArray(newRows, newColumns, newData) {
        let length = newRows * newColumns;
        if (length !== newData.length) {
          throw new RangeError('data length does not match given dimensions');
        }
        let newMatrix = new Matrix$2(newRows, newColumns);
        for (let row = 0; row < newRows; row++) {
          for (let column = 0; column < newColumns; column++) {
            newMatrix.set(row, column, newData[row * newColumns + column]);
          }
        }
        return newMatrix;
      }
      static rowVector(newData) {
        let vector = new Matrix$2(1, newData.length);
        for (let i = 0; i < newData.length; i++) {
          vector.set(0, i, newData[i]);
        }
        return vector;
      }
      static columnVector(newData) {
        let vector = new Matrix$2(newData.length, 1);
        for (let i = 0; i < newData.length; i++) {
          vector.set(i, 0, newData[i]);
        }
        return vector;
      }
      static zeros(rows, columns) {
        return new Matrix$2(rows, columns);
      }
      static ones(rows, columns) {
        return new Matrix$2(rows, columns).fill(1);
      }
      static rand(rows, columns, options = {}) {
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const {
          random = Math.random
        } = options;
        let matrix = new Matrix$2(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            matrix.set(i, j, random());
          }
        }
        return matrix;
      }
      static randInt(rows, columns, options = {}) {
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const {
          min = 0,
          max = 1000,
          random = Math.random
        } = options;
        if (!Number.isInteger(min)) throw new TypeError('min must be an integer');
        if (!Number.isInteger(max)) throw new TypeError('max must be an integer');
        if (min >= max) throw new RangeError('min must be smaller than max');
        let interval = max - min;
        let matrix = new Matrix$2(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            let value = min + Math.round(random() * interval);
            matrix.set(i, j, value);
          }
        }
        return matrix;
      }
      static eye(rows, columns, value) {
        if (columns === undefined) columns = rows;
        if (value === undefined) value = 1;
        let min = Math.min(rows, columns);
        let matrix = this.zeros(rows, columns);
        for (let i = 0; i < min; i++) {
          matrix.set(i, i, value);
        }
        return matrix;
      }
      static diag(data, rows, columns) {
        let l = data.length;
        if (rows === undefined) rows = l;
        if (columns === undefined) columns = rows;
        let min = Math.min(l, rows, columns);
        let matrix = this.zeros(rows, columns);
        for (let i = 0; i < min; i++) {
          matrix.set(i, i, data[i]);
        }
        return matrix;
      }
      static min(matrix1, matrix2) {
        matrix1 = this.checkMatrix(matrix1);
        matrix2 = this.checkMatrix(matrix2);
        let rows = matrix1.rows;
        let columns = matrix1.columns;
        let result = new Matrix$2(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
          }
        }
        return result;
      }
      static max(matrix1, matrix2) {
        matrix1 = this.checkMatrix(matrix1);
        matrix2 = this.checkMatrix(matrix2);
        let rows = matrix1.rows;
        let columns = matrix1.columns;
        let result = new this(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
          }
        }
        return result;
      }
      static checkMatrix(value) {
        return AbstractMatrix.isMatrix(value) ? value : new Matrix$2(value);
      }
      static isMatrix(value) {
        return value != null && value.klass === 'Matrix';
      }
      get size() {
        return this.rows * this.columns;
      }
      apply(callback) {
        if (typeof callback !== 'function') {
          throw new TypeError('callback must be a function');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            callback.call(this, i, j);
          }
        }
        return this;
      }
      to1DArray() {
        let array = [];
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            array.push(this.get(i, j));
          }
        }
        return array;
      }
      to2DArray() {
        let copy = [];
        for (let i = 0; i < this.rows; i++) {
          copy.push([]);
          for (let j = 0; j < this.columns; j++) {
            copy[i].push(this.get(i, j));
          }
        }
        return copy;
      }
      toJSON() {
        return this.to2DArray();
      }
      isRowVector() {
        return this.rows === 1;
      }
      isColumnVector() {
        return this.columns === 1;
      }
      isVector() {
        return this.rows === 1 || this.columns === 1;
      }
      isSquare() {
        return this.rows === this.columns;
      }
      isEmpty() {
        return this.rows === 0 || this.columns === 0;
      }
      isSymmetric() {
        if (this.isSquare()) {
          for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j <= i; j++) {
              if (this.get(i, j) !== this.get(j, i)) {
                return false;
              }
            }
          }
          return true;
        }
        return false;
      }
      isDistance() {
        if (!this.isSymmetric()) return false;
        for (let i = 0; i < this.rows; i++) {
          if (this.get(i, i) !== 0) return false;
        }
        return true;
      }
      isEchelonForm() {
        let i = 0;
        let j = 0;
        let previousColumn = -1;
        let isEchelonForm = true;
        let checked = false;
        while (i < this.rows && isEchelonForm) {
          j = 0;
          checked = false;
          while (j < this.columns && checked === false) {
            if (this.get(i, j) === 0) {
              j++;
            } else if (this.get(i, j) === 1 && j > previousColumn) {
              checked = true;
              previousColumn = j;
            } else {
              isEchelonForm = false;
              checked = true;
            }
          }
          i++;
        }
        return isEchelonForm;
      }
      isReducedEchelonForm() {
        let i = 0;
        let j = 0;
        let previousColumn = -1;
        let isReducedEchelonForm = true;
        let checked = false;
        while (i < this.rows && isReducedEchelonForm) {
          j = 0;
          checked = false;
          while (j < this.columns && checked === false) {
            if (this.get(i, j) === 0) {
              j++;
            } else if (this.get(i, j) === 1 && j > previousColumn) {
              checked = true;
              previousColumn = j;
            } else {
              isReducedEchelonForm = false;
              checked = true;
            }
          }
          for (let k = j + 1; k < this.rows; k++) {
            if (this.get(i, k) !== 0) {
              isReducedEchelonForm = false;
            }
          }
          i++;
        }
        return isReducedEchelonForm;
      }
      echelonForm() {
        let result = this.clone();
        let h = 0;
        let k = 0;
        while (h < result.rows && k < result.columns) {
          let iMax = h;
          for (let i = h; i < result.rows; i++) {
            if (result.get(i, k) > result.get(iMax, k)) {
              iMax = i;
            }
          }
          if (result.get(iMax, k) === 0) {
            k++;
          } else {
            result.swapRows(h, iMax);
            let tmp = result.get(h, k);
            for (let j = k; j < result.columns; j++) {
              result.set(h, j, result.get(h, j) / tmp);
            }
            for (let i = h + 1; i < result.rows; i++) {
              let factor = result.get(i, k) / result.get(h, k);
              result.set(i, k, 0);
              for (let j = k + 1; j < result.columns; j++) {
                result.set(i, j, result.get(i, j) - result.get(h, j) * factor);
              }
            }
            h++;
            k++;
          }
        }
        return result;
      }
      reducedEchelonForm() {
        let result = this.echelonForm();
        let m = result.columns;
        let n = result.rows;
        let h = n - 1;
        while (h >= 0) {
          if (result.maxRow(h) === 0) {
            h--;
          } else {
            let p = 0;
            let pivot = false;
            while (p < n && pivot === false) {
              if (result.get(h, p) === 1) {
                pivot = true;
              } else {
                p++;
              }
            }
            for (let i = 0; i < h; i++) {
              let factor = result.get(i, p);
              for (let j = p; j < m; j++) {
                let tmp = result.get(i, j) - factor * result.get(h, j);
                result.set(i, j, tmp);
              }
            }
            h--;
          }
        }
        return result;
      }
      set() {
        throw new Error('set method is unimplemented');
      }
      get() {
        throw new Error('get method is unimplemented');
      }
      repeat(options = {}) {
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const {
          rows = 1,
          columns = 1
        } = options;
        if (!Number.isInteger(rows) || rows <= 0) {
          throw new TypeError('rows must be a positive integer');
        }
        if (!Number.isInteger(columns) || columns <= 0) {
          throw new TypeError('columns must be a positive integer');
        }
        let matrix = new Matrix$2(this.rows * rows, this.columns * columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            matrix.setSubMatrix(this, this.rows * i, this.columns * j);
          }
        }
        return matrix;
      }
      fill(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, value);
          }
        }
        return this;
      }
      neg() {
        return this.mulS(-1);
      }
      getRow(index) {
        checkRowIndex(this, index);
        let row = [];
        for (let i = 0; i < this.columns; i++) {
          row.push(this.get(index, i));
        }
        return row;
      }
      getRowVector(index) {
        return Matrix$2.rowVector(this.getRow(index));
      }
      setRow(index, array) {
        checkRowIndex(this, index);
        array = checkRowVector(this, array);
        for (let i = 0; i < this.columns; i++) {
          this.set(index, i, array[i]);
        }
        return this;
      }
      swapRows(row1, row2) {
        checkRowIndex(this, row1);
        checkRowIndex(this, row2);
        for (let i = 0; i < this.columns; i++) {
          let temp = this.get(row1, i);
          this.set(row1, i, this.get(row2, i));
          this.set(row2, i, temp);
        }
        return this;
      }
      getColumn(index) {
        checkColumnIndex(this, index);
        let column = [];
        for (let i = 0; i < this.rows; i++) {
          column.push(this.get(i, index));
        }
        return column;
      }
      getColumnVector(index) {
        return Matrix$2.columnVector(this.getColumn(index));
      }
      setColumn(index, array) {
        checkColumnIndex(this, index);
        array = checkColumnVector(this, array);
        for (let i = 0; i < this.rows; i++) {
          this.set(i, index, array[i]);
        }
        return this;
      }
      swapColumns(column1, column2) {
        checkColumnIndex(this, column1);
        checkColumnIndex(this, column2);
        for (let i = 0; i < this.rows; i++) {
          let temp = this.get(i, column1);
          this.set(i, column1, this.get(i, column2));
          this.set(i, column2, temp);
        }
        return this;
      }
      addRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + vector[j]);
          }
        }
        return this;
      }
      subRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - vector[j]);
          }
        }
        return this;
      }
      mulRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * vector[j]);
          }
        }
        return this;
      }
      divRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / vector[j]);
          }
        }
        return this;
      }
      addColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + vector[i]);
          }
        }
        return this;
      }
      subColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - vector[i]);
          }
        }
        return this;
      }
      mulColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * vector[i]);
          }
        }
        return this;
      }
      divColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / vector[i]);
          }
        }
        return this;
      }
      mulRow(index, value) {
        checkRowIndex(this, index);
        for (let i = 0; i < this.columns; i++) {
          this.set(index, i, this.get(index, i) * value);
        }
        return this;
      }
      mulColumn(index, value) {
        checkColumnIndex(this, index);
        for (let i = 0; i < this.rows; i++) {
          this.set(i, index, this.get(i, index) * value);
        }
        return this;
      }
      max(by) {
        if (this.isEmpty()) {
          return NaN;
        }
        switch (by) {
          case 'row':
            {
              const max = new Array(this.rows).fill(Number.NEGATIVE_INFINITY);
              for (let row = 0; row < this.rows; row++) {
                for (let column = 0; column < this.columns; column++) {
                  if (this.get(row, column) > max[row]) {
                    max[row] = this.get(row, column);
                  }
                }
              }
              return max;
            }
          case 'column':
            {
              const max = new Array(this.columns).fill(Number.NEGATIVE_INFINITY);
              for (let row = 0; row < this.rows; row++) {
                for (let column = 0; column < this.columns; column++) {
                  if (this.get(row, column) > max[column]) {
                    max[column] = this.get(row, column);
                  }
                }
              }
              return max;
            }
          case undefined:
            {
              let max = this.get(0, 0);
              for (let row = 0; row < this.rows; row++) {
                for (let column = 0; column < this.columns; column++) {
                  if (this.get(row, column) > max) {
                    max = this.get(row, column);
                  }
                }
              }
              return max;
            }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      maxIndex() {
        checkNonEmpty(this);
        let v = this.get(0, 0);
        let idx = [0, 0];
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            if (this.get(i, j) > v) {
              v = this.get(i, j);
              idx[0] = i;
              idx[1] = j;
            }
          }
        }
        return idx;
      }
      min(by) {
        if (this.isEmpty()) {
          return NaN;
        }
        switch (by) {
          case 'row':
            {
              const min = new Array(this.rows).fill(Number.POSITIVE_INFINITY);
              for (let row = 0; row < this.rows; row++) {
                for (let column = 0; column < this.columns; column++) {
                  if (this.get(row, column) < min[row]) {
                    min[row] = this.get(row, column);
                  }
                }
              }
              return min;
            }
          case 'column':
            {
              const min = new Array(this.columns).fill(Number.POSITIVE_INFINITY);
              for (let row = 0; row < this.rows; row++) {
                for (let column = 0; column < this.columns; column++) {
                  if (this.get(row, column) < min[column]) {
                    min[column] = this.get(row, column);
                  }
                }
              }
              return min;
            }
          case undefined:
            {
              let min = this.get(0, 0);
              for (let row = 0; row < this.rows; row++) {
                for (let column = 0; column < this.columns; column++) {
                  if (this.get(row, column) < min) {
                    min = this.get(row, column);
                  }
                }
              }
              return min;
            }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      minIndex() {
        checkNonEmpty(this);
        let v = this.get(0, 0);
        let idx = [0, 0];
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            if (this.get(i, j) < v) {
              v = this.get(i, j);
              idx[0] = i;
              idx[1] = j;
            }
          }
        }
        return idx;
      }
      maxRow(row) {
        checkRowIndex(this, row);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(row, 0);
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) > v) {
            v = this.get(row, i);
          }
        }
        return v;
      }
      maxRowIndex(row) {
        checkRowIndex(this, row);
        checkNonEmpty(this);
        let v = this.get(row, 0);
        let idx = [row, 0];
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) > v) {
            v = this.get(row, i);
            idx[1] = i;
          }
        }
        return idx;
      }
      minRow(row) {
        checkRowIndex(this, row);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(row, 0);
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) < v) {
            v = this.get(row, i);
          }
        }
        return v;
      }
      minRowIndex(row) {
        checkRowIndex(this, row);
        checkNonEmpty(this);
        let v = this.get(row, 0);
        let idx = [row, 0];
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) < v) {
            v = this.get(row, i);
            idx[1] = i;
          }
        }
        return idx;
      }
      maxColumn(column) {
        checkColumnIndex(this, column);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(0, column);
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) > v) {
            v = this.get(i, column);
          }
        }
        return v;
      }
      maxColumnIndex(column) {
        checkColumnIndex(this, column);
        checkNonEmpty(this);
        let v = this.get(0, column);
        let idx = [0, column];
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) > v) {
            v = this.get(i, column);
            idx[0] = i;
          }
        }
        return idx;
      }
      minColumn(column) {
        checkColumnIndex(this, column);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(0, column);
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) < v) {
            v = this.get(i, column);
          }
        }
        return v;
      }
      minColumnIndex(column) {
        checkColumnIndex(this, column);
        checkNonEmpty(this);
        let v = this.get(0, column);
        let idx = [0, column];
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) < v) {
            v = this.get(i, column);
            idx[0] = i;
          }
        }
        return idx;
      }
      diag() {
        let min = Math.min(this.rows, this.columns);
        let diag = [];
        for (let i = 0; i < min; i++) {
          diag.push(this.get(i, i));
        }
        return diag;
      }
      norm(type = 'frobenius') {
        switch (type) {
          case 'max':
            return this.max();
          case 'frobenius':
            return Math.sqrt(this.dot(this));
          default:
            throw new RangeError(`unknown norm type: ${type}`);
        }
      }
      cumulativeSum() {
        let sum = 0;
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            sum += this.get(i, j);
            this.set(i, j, sum);
          }
        }
        return this;
      }
      dot(vector2) {
        if (AbstractMatrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
        let vector1 = this.to1DArray();
        if (vector1.length !== vector2.length) {
          throw new RangeError('vectors do not have the same size');
        }
        let dot = 0;
        for (let i = 0; i < vector1.length; i++) {
          dot += vector1[i] * vector2[i];
        }
        return dot;
      }
      mmul(other) {
        other = Matrix$2.checkMatrix(other);
        let m = this.rows;
        let n = this.columns;
        let p = other.columns;
        let result = new Matrix$2(m, p);
        let Bcolj = new Float64Array(n);
        for (let j = 0; j < p; j++) {
          for (let k = 0; k < n; k++) {
            Bcolj[k] = other.get(k, j);
          }
          for (let i = 0; i < m; i++) {
            let s = 0;
            for (let k = 0; k < n; k++) {
              s += this.get(i, k) * Bcolj[k];
            }
            result.set(i, j, s);
          }
        }
        return result;
      }
      mpow(scalar) {
        if (!this.isSquare()) {
          throw new RangeError('Matrix must be square');
        }
        if (!Number.isInteger(scalar) || scalar < 0) {
          throw new RangeError('Exponent must be a non-negative integer');
        }
        // Russian Peasant exponentiation, i.e. exponentiation by squaring
        let result = Matrix$2.eye(this.rows);
        let bb = this;
        // Note: Don't bit shift. In JS, that would truncate at 32 bits
        for (let e = scalar; e >= 1; e /= 2) {
          if ((e & 1) !== 0) {
            result = result.mmul(bb);
          }
          bb = bb.mmul(bb);
        }
        return result;
      }
      strassen2x2(other) {
        other = Matrix$2.checkMatrix(other);
        let result = new Matrix$2(2, 2);
        const a11 = this.get(0, 0);
        const b11 = other.get(0, 0);
        const a12 = this.get(0, 1);
        const b12 = other.get(0, 1);
        const a21 = this.get(1, 0);
        const b21 = other.get(1, 0);
        const a22 = this.get(1, 1);
        const b22 = other.get(1, 1);

        // Compute intermediate values.
        const m1 = (a11 + a22) * (b11 + b22);
        const m2 = (a21 + a22) * b11;
        const m3 = a11 * (b12 - b22);
        const m4 = a22 * (b21 - b11);
        const m5 = (a11 + a12) * b22;
        const m6 = (a21 - a11) * (b11 + b12);
        const m7 = (a12 - a22) * (b21 + b22);

        // Combine intermediate values into the output.
        const c00 = m1 + m4 - m5 + m7;
        const c01 = m3 + m5;
        const c10 = m2 + m4;
        const c11 = m1 - m2 + m3 + m6;
        result.set(0, 0, c00);
        result.set(0, 1, c01);
        result.set(1, 0, c10);
        result.set(1, 1, c11);
        return result;
      }
      strassen3x3(other) {
        other = Matrix$2.checkMatrix(other);
        let result = new Matrix$2(3, 3);
        const a00 = this.get(0, 0);
        const a01 = this.get(0, 1);
        const a02 = this.get(0, 2);
        const a10 = this.get(1, 0);
        const a11 = this.get(1, 1);
        const a12 = this.get(1, 2);
        const a20 = this.get(2, 0);
        const a21 = this.get(2, 1);
        const a22 = this.get(2, 2);
        const b00 = other.get(0, 0);
        const b01 = other.get(0, 1);
        const b02 = other.get(0, 2);
        const b10 = other.get(1, 0);
        const b11 = other.get(1, 1);
        const b12 = other.get(1, 2);
        const b20 = other.get(2, 0);
        const b21 = other.get(2, 1);
        const b22 = other.get(2, 2);
        const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
        const m2 = (a00 - a10) * (-b01 + b11);
        const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
        const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
        const m5 = (a10 + a11) * (-b00 + b01);
        const m6 = a00 * b00;
        const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
        const m8 = (-a00 + a20) * (b02 - b12);
        const m9 = (a20 + a21) * (-b00 + b02);
        const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
        const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
        const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
        const m13 = (a02 - a22) * (b11 - b21);
        const m14 = a02 * b20;
        const m15 = (a21 + a22) * (-b20 + b21);
        const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
        const m17 = (a02 - a12) * (b12 - b22);
        const m18 = (a11 + a12) * (-b20 + b22);
        const m19 = a01 * b10;
        const m20 = a12 * b21;
        const m21 = a10 * b02;
        const m22 = a20 * b01;
        const m23 = a22 * b22;
        const c00 = m6 + m14 + m19;
        const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
        const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
        const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
        const c11 = m2 + m4 + m5 + m6 + m20;
        const c12 = m14 + m16 + m17 + m18 + m21;
        const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
        const c21 = m12 + m13 + m14 + m15 + m22;
        const c22 = m6 + m7 + m8 + m9 + m23;
        result.set(0, 0, c00);
        result.set(0, 1, c01);
        result.set(0, 2, c02);
        result.set(1, 0, c10);
        result.set(1, 1, c11);
        result.set(1, 2, c12);
        result.set(2, 0, c20);
        result.set(2, 1, c21);
        result.set(2, 2, c22);
        return result;
      }
      mmulStrassen(y) {
        y = Matrix$2.checkMatrix(y);
        let x = this.clone();
        let r1 = x.rows;
        let c1 = x.columns;
        let r2 = y.rows;
        let c2 = y.columns;
        if (c1 !== r2) {
          // eslint-disable-next-line no-console
          console.warn(`Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`);
        }

        // Put a matrix into the top left of a matrix of zeros.
        // `rows` and `cols` are the dimensions of the output matrix.
        function embed(mat, rows, cols) {
          let r = mat.rows;
          let c = mat.columns;
          if (r === rows && c === cols) {
            return mat;
          } else {
            let resultat = AbstractMatrix.zeros(rows, cols);
            resultat = resultat.setSubMatrix(mat, 0, 0);
            return resultat;
          }
        }

        // Make sure both matrices are the same size.
        // This is exclusively for simplicity:
        // this algorithm can be implemented with matrices of different sizes.

        let r = Math.max(r1, r2);
        let c = Math.max(c1, c2);
        x = embed(x, r, c);
        y = embed(y, r, c);

        // Our recursive multiplication function.
        function blockMult(a, b, rows, cols) {
          // For small matrices, resort to naive multiplication.
          if (rows <= 512 || cols <= 512) {
            return a.mmul(b); // a is equivalent to this
          }

          // Apply dynamic padding.
          if (rows % 2 === 1 && cols % 2 === 1) {
            a = embed(a, rows + 1, cols + 1);
            b = embed(b, rows + 1, cols + 1);
          } else if (rows % 2 === 1) {
            a = embed(a, rows + 1, cols);
            b = embed(b, rows + 1, cols);
          } else if (cols % 2 === 1) {
            a = embed(a, rows, cols + 1);
            b = embed(b, rows, cols + 1);
          }
          let halfRows = parseInt(a.rows / 2, 10);
          let halfCols = parseInt(a.columns / 2, 10);
          // Subdivide input matrices.
          let a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
          let b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);
          let a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
          let b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);
          let a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
          let b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);
          let a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
          let b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);

          // Compute intermediate values.
          let m1 = blockMult(AbstractMatrix.add(a11, a22), AbstractMatrix.add(b11, b22), halfRows, halfCols);
          let m2 = blockMult(AbstractMatrix.add(a21, a22), b11, halfRows, halfCols);
          let m3 = blockMult(a11, AbstractMatrix.sub(b12, b22), halfRows, halfCols);
          let m4 = blockMult(a22, AbstractMatrix.sub(b21, b11), halfRows, halfCols);
          let m5 = blockMult(AbstractMatrix.add(a11, a12), b22, halfRows, halfCols);
          let m6 = blockMult(AbstractMatrix.sub(a21, a11), AbstractMatrix.add(b11, b12), halfRows, halfCols);
          let m7 = blockMult(AbstractMatrix.sub(a12, a22), AbstractMatrix.add(b21, b22), halfRows, halfCols);

          // Combine intermediate values into the output.
          let c11 = AbstractMatrix.add(m1, m4);
          c11.sub(m5);
          c11.add(m7);
          let c12 = AbstractMatrix.add(m3, m5);
          let c21 = AbstractMatrix.add(m2, m4);
          let c22 = AbstractMatrix.sub(m1, m2);
          c22.add(m3);
          c22.add(m6);

          // Crop output to the desired size (undo dynamic padding).
          let result = AbstractMatrix.zeros(2 * c11.rows, 2 * c11.columns);
          result = result.setSubMatrix(c11, 0, 0);
          result = result.setSubMatrix(c12, c11.rows, 0);
          result = result.setSubMatrix(c21, 0, c11.columns);
          result = result.setSubMatrix(c22, c11.rows, c11.columns);
          return result.subMatrix(0, rows - 1, 0, cols - 1);
        }
        return blockMult(x, y, r, c);
      }
      scaleRows(options = {}) {
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const {
          min = 0,
          max = 1
        } = options;
        if (!Number.isFinite(min)) throw new TypeError('min must be a number');
        if (!Number.isFinite(max)) throw new TypeError('max must be a number');
        if (min >= max) throw new RangeError('min must be smaller than max');
        let newMatrix = new Matrix$2(this.rows, this.columns);
        for (let i = 0; i < this.rows; i++) {
          const row = this.getRow(i);
          if (row.length > 0) {
            rescale(row, {
              min,
              max,
              output: row
            });
          }
          newMatrix.setRow(i, row);
        }
        return newMatrix;
      }
      scaleColumns(options = {}) {
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const {
          min = 0,
          max = 1
        } = options;
        if (!Number.isFinite(min)) throw new TypeError('min must be a number');
        if (!Number.isFinite(max)) throw new TypeError('max must be a number');
        if (min >= max) throw new RangeError('min must be smaller than max');
        let newMatrix = new Matrix$2(this.rows, this.columns);
        for (let i = 0; i < this.columns; i++) {
          const column = this.getColumn(i);
          if (column.length) {
            rescale(column, {
              min,
              max,
              output: column
            });
          }
          newMatrix.setColumn(i, column);
        }
        return newMatrix;
      }
      flipRows() {
        const middle = Math.ceil(this.columns / 2);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < middle; j++) {
            let first = this.get(i, j);
            let last = this.get(i, this.columns - 1 - j);
            this.set(i, j, last);
            this.set(i, this.columns - 1 - j, first);
          }
        }
        return this;
      }
      flipColumns() {
        const middle = Math.ceil(this.rows / 2);
        for (let j = 0; j < this.columns; j++) {
          for (let i = 0; i < middle; i++) {
            let first = this.get(i, j);
            let last = this.get(this.rows - 1 - i, j);
            this.set(i, j, last);
            this.set(this.rows - 1 - i, j, first);
          }
        }
        return this;
      }
      kroneckerProduct(other) {
        other = Matrix$2.checkMatrix(other);
        let m = this.rows;
        let n = this.columns;
        let p = other.rows;
        let q = other.columns;
        let result = new Matrix$2(m * p, n * q);
        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            for (let k = 0; k < p; k++) {
              for (let l = 0; l < q; l++) {
                result.set(p * i + k, q * j + l, this.get(i, j) * other.get(k, l));
              }
            }
          }
        }
        return result;
      }
      kroneckerSum(other) {
        other = Matrix$2.checkMatrix(other);
        if (!this.isSquare() || !other.isSquare()) {
          throw new Error('Kronecker Sum needs two Square Matrices');
        }
        let m = this.rows;
        let n = other.rows;
        let AxI = this.kroneckerProduct(Matrix$2.eye(n, n));
        let IxB = Matrix$2.eye(m, m).kroneckerProduct(other);
        return AxI.add(IxB);
      }
      transpose() {
        let result = new Matrix$2(this.columns, this.rows);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            result.set(j, i, this.get(i, j));
          }
        }
        return result;
      }
      sortRows(compareFunction = compareNumbers) {
        for (let i = 0; i < this.rows; i++) {
          this.setRow(i, this.getRow(i).sort(compareFunction));
        }
        return this;
      }
      sortColumns(compareFunction = compareNumbers) {
        for (let i = 0; i < this.columns; i++) {
          this.setColumn(i, this.getColumn(i).sort(compareFunction));
        }
        return this;
      }
      subMatrix(startRow, endRow, startColumn, endColumn) {
        checkRange(this, startRow, endRow, startColumn, endColumn);
        let newMatrix = new Matrix$2(endRow - startRow + 1, endColumn - startColumn + 1);
        for (let i = startRow; i <= endRow; i++) {
          for (let j = startColumn; j <= endColumn; j++) {
            newMatrix.set(i - startRow, j - startColumn, this.get(i, j));
          }
        }
        return newMatrix;
      }
      subMatrixRow(indices, startColumn, endColumn) {
        if (startColumn === undefined) startColumn = 0;
        if (endColumn === undefined) endColumn = this.columns - 1;
        if (startColumn > endColumn || startColumn < 0 || startColumn >= this.columns || endColumn < 0 || endColumn >= this.columns) {
          throw new RangeError('Argument out of range');
        }
        let newMatrix = new Matrix$2(indices.length, endColumn - startColumn + 1);
        for (let i = 0; i < indices.length; i++) {
          for (let j = startColumn; j <= endColumn; j++) {
            if (indices[i] < 0 || indices[i] >= this.rows) {
              throw new RangeError(`Row index out of range: ${indices[i]}`);
            }
            newMatrix.set(i, j - startColumn, this.get(indices[i], j));
          }
        }
        return newMatrix;
      }
      subMatrixColumn(indices, startRow, endRow) {
        if (startRow === undefined) startRow = 0;
        if (endRow === undefined) endRow = this.rows - 1;
        if (startRow > endRow || startRow < 0 || startRow >= this.rows || endRow < 0 || endRow >= this.rows) {
          throw new RangeError('Argument out of range');
        }
        let newMatrix = new Matrix$2(endRow - startRow + 1, indices.length);
        for (let i = 0; i < indices.length; i++) {
          for (let j = startRow; j <= endRow; j++) {
            if (indices[i] < 0 || indices[i] >= this.columns) {
              throw new RangeError(`Column index out of range: ${indices[i]}`);
            }
            newMatrix.set(j - startRow, i, this.get(j, indices[i]));
          }
        }
        return newMatrix;
      }
      setSubMatrix(matrix, startRow, startColumn) {
        matrix = Matrix$2.checkMatrix(matrix);
        if (matrix.isEmpty()) {
          return this;
        }
        let endRow = startRow + matrix.rows - 1;
        let endColumn = startColumn + matrix.columns - 1;
        checkRange(this, startRow, endRow, startColumn, endColumn);
        for (let i = 0; i < matrix.rows; i++) {
          for (let j = 0; j < matrix.columns; j++) {
            this.set(startRow + i, startColumn + j, matrix.get(i, j));
          }
        }
        return this;
      }
      selection(rowIndices, columnIndices) {
        checkRowIndices(this, rowIndices);
        checkColumnIndices(this, columnIndices);
        let newMatrix = new Matrix$2(rowIndices.length, columnIndices.length);
        for (let i = 0; i < rowIndices.length; i++) {
          let rowIndex = rowIndices[i];
          for (let j = 0; j < columnIndices.length; j++) {
            let columnIndex = columnIndices[j];
            newMatrix.set(i, j, this.get(rowIndex, columnIndex));
          }
        }
        return newMatrix;
      }
      trace() {
        let min = Math.min(this.rows, this.columns);
        let trace = 0;
        for (let i = 0; i < min; i++) {
          trace += this.get(i, i);
        }
        return trace;
      }
      clone() {
        return this.constructor.copy(this, new Matrix$2(this.rows, this.columns));
      }

      /**
       * @template {AbstractMatrix} M
       * @param {AbstractMatrix} from
       * @param {M} to
       * @return {M}
       */
      static copy(from, to) {
        for (const [row, column, value] of from.entries()) {
          to.set(row, column, value);
        }
        return to;
      }
      sum(by) {
        switch (by) {
          case 'row':
            return sumByRow(this);
          case 'column':
            return sumByColumn(this);
          case undefined:
            return sumAll(this);
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      product(by) {
        switch (by) {
          case 'row':
            return productByRow(this);
          case 'column':
            return productByColumn(this);
          case undefined:
            return productAll(this);
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      mean(by) {
        const sum = this.sum(by);
        switch (by) {
          case 'row':
            {
              for (let i = 0; i < this.rows; i++) {
                sum[i] /= this.columns;
              }
              return sum;
            }
          case 'column':
            {
              for (let i = 0; i < this.columns; i++) {
                sum[i] /= this.rows;
              }
              return sum;
            }
          case undefined:
            return sum / this.size;
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      variance(by, options = {}) {
        if (typeof by === 'object') {
          options = by;
          by = undefined;
        }
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const {
          unbiased = true,
          mean = this.mean(by)
        } = options;
        if (typeof unbiased !== 'boolean') {
          throw new TypeError('unbiased must be a boolean');
        }
        switch (by) {
          case 'row':
            {
              if (!isAnyArray.isAnyArray(mean)) {
                throw new TypeError('mean must be an array');
              }
              return varianceByRow(this, unbiased, mean);
            }
          case 'column':
            {
              if (!isAnyArray.isAnyArray(mean)) {
                throw new TypeError('mean must be an array');
              }
              return varianceByColumn(this, unbiased, mean);
            }
          case undefined:
            {
              if (typeof mean !== 'number') {
                throw new TypeError('mean must be a number');
              }
              return varianceAll(this, unbiased, mean);
            }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      standardDeviation(by, options) {
        if (typeof by === 'object') {
          options = by;
          by = undefined;
        }
        const variance = this.variance(by, options);
        if (by === undefined) {
          return Math.sqrt(variance);
        } else {
          for (let i = 0; i < variance.length; i++) {
            variance[i] = Math.sqrt(variance[i]);
          }
          return variance;
        }
      }
      center(by, options = {}) {
        if (typeof by === 'object') {
          options = by;
          by = undefined;
        }
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const {
          center = this.mean(by)
        } = options;
        switch (by) {
          case 'row':
            {
              if (!isAnyArray.isAnyArray(center)) {
                throw new TypeError('center must be an array');
              }
              centerByRow(this, center);
              return this;
            }
          case 'column':
            {
              if (!isAnyArray.isAnyArray(center)) {
                throw new TypeError('center must be an array');
              }
              centerByColumn(this, center);
              return this;
            }
          case undefined:
            {
              if (typeof center !== 'number') {
                throw new TypeError('center must be a number');
              }
              centerAll(this, center);
              return this;
            }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      scale(by, options = {}) {
        if (typeof by === 'object') {
          options = by;
          by = undefined;
        }
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        let scale = options.scale;
        switch (by) {
          case 'row':
            {
              if (scale === undefined) {
                scale = getScaleByRow(this);
              } else if (!isAnyArray.isAnyArray(scale)) {
                throw new TypeError('scale must be an array');
              }
              scaleByRow(this, scale);
              return this;
            }
          case 'column':
            {
              if (scale === undefined) {
                scale = getScaleByColumn(this);
              } else if (!isAnyArray.isAnyArray(scale)) {
                throw new TypeError('scale must be an array');
              }
              scaleByColumn(this, scale);
              return this;
            }
          case undefined:
            {
              if (scale === undefined) {
                scale = getScaleAll(this);
              } else if (typeof scale !== 'number') {
                throw new TypeError('scale must be a number');
              }
              scaleAll(this, scale);
              return this;
            }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }
      toString(options) {
        return inspectMatrixWithOptions(this, options);
      }
      [Symbol.iterator]() {
        return this.entries();
      }

      /**
       * iterator from left to right, from top to bottom
       * yield [row, column, value]
       * @returns {Generator<[number, number, number], void, void>}
       */
      *entries() {
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.columns; col++) {
            yield [row, col, this.get(row, col)];
          }
        }
      }

      /**
       * iterator from left to right, from top to bottom
       * yield value
       * @returns {Generator<number, void, void>}
       */
      *values() {
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.columns; col++) {
            yield this.get(row, col);
          }
        }
      }
    }
    AbstractMatrix.prototype.klass = 'Matrix';
    if (typeof Symbol !== 'undefined') {
      AbstractMatrix.prototype[Symbol.for('nodejs.util.inspect.custom')] = inspectMatrix;
    }
    function compareNumbers(a, b) {
      return a - b;
    }
    function isArrayOfNumbers(array) {
      return array.every(element => {
        return typeof element === 'number';
      });
    }

    // Synonyms
    AbstractMatrix.random = AbstractMatrix.rand;
    AbstractMatrix.randomInt = AbstractMatrix.randInt;
    AbstractMatrix.diagonal = AbstractMatrix.diag;
    AbstractMatrix.prototype.diagonal = AbstractMatrix.prototype.diag;
    AbstractMatrix.identity = AbstractMatrix.eye;
    AbstractMatrix.prototype.negate = AbstractMatrix.prototype.neg;
    AbstractMatrix.prototype.tensorProduct = AbstractMatrix.prototype.kroneckerProduct;
    let Matrix$2 = class Matrix extends AbstractMatrix {
      /**
       * @type {Float64Array[]}
       */
      data;

      /**
       * Init an empty matrix
       * @param {number} nRows
       * @param {number} nColumns
       */
      #initData(nRows, nColumns) {
        this.data = [];
        if (Number.isInteger(nColumns) && nColumns >= 0) {
          for (let i = 0; i < nRows; i++) {
            this.data.push(new Float64Array(nColumns));
          }
        } else {
          throw new TypeError('nColumns must be a positive integer');
        }
        this.rows = nRows;
        this.columns = nColumns;
      }
      constructor(nRows, nColumns) {
        super();
        if (Matrix.isMatrix(nRows)) {
          this.#initData(nRows.rows, nRows.columns);
          Matrix.copy(nRows, this);
        } else if (Number.isInteger(nRows) && nRows >= 0) {
          this.#initData(nRows, nColumns);
        } else if (isAnyArray.isAnyArray(nRows)) {
          // Copy the values from the 2D array
          const arrayData = nRows;
          nRows = arrayData.length;
          nColumns = nRows ? arrayData[0].length : 0;
          if (typeof nColumns !== 'number') {
            throw new TypeError('Data must be a 2D array with at least one element');
          }
          this.data = [];
          for (let i = 0; i < nRows; i++) {
            if (arrayData[i].length !== nColumns) {
              throw new RangeError('Inconsistent array dimensions');
            }
            if (!isArrayOfNumbers(arrayData[i])) {
              throw new TypeError('Input data contains non-numeric values');
            }
            this.data.push(Float64Array.from(arrayData[i]));
          }
          this.rows = nRows;
          this.columns = nColumns;
        } else {
          throw new TypeError('First argument must be a positive number or an array');
        }
      }
      set(rowIndex, columnIndex, value) {
        this.data[rowIndex][columnIndex] = value;
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.data[rowIndex][columnIndex];
      }
      removeRow(index) {
        checkRowIndex(this, index);
        this.data.splice(index, 1);
        this.rows -= 1;
        return this;
      }
      addRow(index, array) {
        if (array === undefined) {
          array = index;
          index = this.rows;
        }
        checkRowIndex(this, index, true);
        array = Float64Array.from(checkRowVector(this, array));
        this.data.splice(index, 0, array);
        this.rows += 1;
        return this;
      }
      removeColumn(index) {
        checkColumnIndex(this, index);
        for (let i = 0; i < this.rows; i++) {
          const newRow = new Float64Array(this.columns - 1);
          for (let j = 0; j < index; j++) {
            newRow[j] = this.data[i][j];
          }
          for (let j = index + 1; j < this.columns; j++) {
            newRow[j - 1] = this.data[i][j];
          }
          this.data[i] = newRow;
        }
        this.columns -= 1;
        return this;
      }
      addColumn(index, array) {
        if (typeof array === 'undefined') {
          array = index;
          index = this.columns;
        }
        checkColumnIndex(this, index, true);
        array = checkColumnVector(this, array);
        for (let i = 0; i < this.rows; i++) {
          const newRow = new Float64Array(this.columns + 1);
          let j = 0;
          for (; j < index; j++) {
            newRow[j] = this.data[i][j];
          }
          newRow[j++] = array[i];
          for (; j < this.columns + 1; j++) {
            newRow[j] = this.data[i][j - 1];
          }
          this.data[i] = newRow;
        }
        this.columns += 1;
        return this;
      }
    };
    installMathOperations(AbstractMatrix, Matrix$2);

    /**
     * @typedef {0 | 1 | number | boolean} Mask
     */

    class SymmetricMatrix extends AbstractMatrix {
      /** @type {Matrix} */
      #matrix;
      get size() {
        return this.#matrix.size;
      }
      get rows() {
        return this.#matrix.rows;
      }
      get columns() {
        return this.#matrix.columns;
      }
      get diagonalSize() {
        return this.rows;
      }

      /**
       * not the same as matrix.isSymmetric()
       * Here is to check if it's instanceof SymmetricMatrix without bundling issues
       *
       * @param value
       * @returns {boolean}
       */
      static isSymmetricMatrix(value) {
        return Matrix$2.isMatrix(value) && value.klassType === 'SymmetricMatrix';
      }

      /**
       * @param diagonalSize
       * @return {SymmetricMatrix}
       */
      static zeros(diagonalSize) {
        return new this(diagonalSize);
      }

      /**
       * @param diagonalSize
       * @return {SymmetricMatrix}
       */
      static ones(diagonalSize) {
        return new this(diagonalSize).fill(1);
      }

      /**
       * @param {number | AbstractMatrix | ArrayLike<ArrayLike<number>>} diagonalSize
       * @return {this}
       */
      constructor(diagonalSize) {
        super();
        if (Matrix$2.isMatrix(diagonalSize)) {
          if (!diagonalSize.isSymmetric()) {
            throw new TypeError('not symmetric data');
          }
          this.#matrix = Matrix$2.copy(diagonalSize, new Matrix$2(diagonalSize.rows, diagonalSize.rows));
        } else if (Number.isInteger(diagonalSize) && diagonalSize >= 0) {
          this.#matrix = new Matrix$2(diagonalSize, diagonalSize);
        } else {
          this.#matrix = new Matrix$2(diagonalSize);
          if (!this.isSymmetric()) {
            throw new TypeError('not symmetric data');
          }
        }
      }
      clone() {
        const matrix = new SymmetricMatrix(this.diagonalSize);
        for (const [row, col, value] of this.upperRightEntries()) {
          matrix.set(row, col, value);
        }
        return matrix;
      }
      toMatrix() {
        return new Matrix$2(this);
      }
      get(rowIndex, columnIndex) {
        return this.#matrix.get(rowIndex, columnIndex);
      }
      set(rowIndex, columnIndex, value) {
        // symmetric set
        this.#matrix.set(rowIndex, columnIndex, value);
        this.#matrix.set(columnIndex, rowIndex, value);
        return this;
      }
      removeCross(index) {
        // symmetric remove side
        this.#matrix.removeRow(index);
        this.#matrix.removeColumn(index);
        return this;
      }
      addCross(index, array) {
        if (array === undefined) {
          array = index;
          index = this.diagonalSize;
        }
        const row = array.slice();
        row.splice(index, 1);
        this.#matrix.addRow(index, row);
        this.#matrix.addColumn(index, array);
        return this;
      }

      /**
       * @param {Mask[]} mask
       */
      applyMask(mask) {
        if (mask.length !== this.diagonalSize) {
          throw new RangeError('Mask size do not match with matrix size');
        }

        // prepare sides to remove from matrix from mask
        /** @type {number[]} */
        const sidesToRemove = [];
        for (const [index, passthroughs] of mask.entries()) {
          if (passthroughs) continue;
          sidesToRemove.push(index);
        }
        // to remove from highest to lowest for no mutation shifting
        sidesToRemove.reverse();

        // remove sides
        for (const sideIndex of sidesToRemove) {
          this.removeCross(sideIndex);
        }
        return this;
      }

      /**
       * Compact format upper-right corner of matrix
       * iterate from left to right, from top to bottom.
       *
       * ```
       *   A B C D
       * A 1 2 3 4
       * B 2 5 6 7
       * C 3 6 8 9
       * D 4 7 9 10
       * ```
       *
       * will return compact 1D array `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`
       *
       * length is S(i=0, n=sideSize) => 10 for a 4 sideSized matrix
       *
       * @returns {number[]}
       */
      toCompact() {
        const {
          diagonalSize
        } = this;

        /** @type {number[]} */
        const compact = new Array(diagonalSize * (diagonalSize + 1) / 2);
        for (let col = 0, row = 0, index = 0; index < compact.length; index++) {
          compact[index] = this.get(row, col);
          if (++col >= diagonalSize) col = ++row;
        }
        return compact;
      }

      /**
       * @param {number[]} compact
       * @return {SymmetricMatrix}
       */
      static fromCompact(compact) {
        const compactSize = compact.length;
        // compactSize = (sideSize * (sideSize + 1)) / 2
        // https://mathsolver.microsoft.com/fr/solve-problem/y%20%3D%20%20x%20%60cdot%20%20%20%60frac%7B%20%20%60left(%20x%2B1%20%20%60right)%20%20%20%20%7D%7B%202%20%20%7D
        // sideSize = (Sqrt(8 × compactSize + 1) - 1) / 2
        const diagonalSize = (Math.sqrt(8 * compactSize + 1) - 1) / 2;
        if (!Number.isInteger(diagonalSize)) {
          throw new TypeError(`This array is not a compact representation of a Symmetric Matrix, ${JSON.stringify(compact)}`);
        }
        const matrix = new SymmetricMatrix(diagonalSize);
        for (let col = 0, row = 0, index = 0; index < compactSize; index++) {
          matrix.set(col, row, compact[index]);
          if (++col >= diagonalSize) col = ++row;
        }
        return matrix;
      }

      /**
       * half iterator upper-right-corner from left to right, from top to bottom
       * yield [row, column, value]
       *
       * @returns {Generator<[number, number, number], void, void>}
       */
      *upperRightEntries() {
        for (let row = 0, col = 0; row < this.diagonalSize; void 0) {
          const value = this.get(row, col);
          yield [row, col, value];

          // at the end of row, move cursor to next row at diagonal position
          if (++col >= this.diagonalSize) col = ++row;
        }
      }

      /**
       * half iterator upper-right-corner from left to right, from top to bottom
       * yield value
       *
       * @returns {Generator<[number, number, number], void, void>}
       */
      *upperRightValues() {
        for (let row = 0, col = 0; row < this.diagonalSize; void 0) {
          const value = this.get(row, col);
          yield value;

          // at the end of row, move cursor to next row at diagonal position
          if (++col >= this.diagonalSize) col = ++row;
        }
      }
    }
    SymmetricMatrix.prototype.klassType = 'SymmetricMatrix';
    class DistanceMatrix extends SymmetricMatrix {
      /**
       * not the same as matrix.isSymmetric()
       * Here is to check if it's instanceof SymmetricMatrix without bundling issues
       *
       * @param value
       * @returns {boolean}
       */
      static isDistanceMatrix(value) {
        return SymmetricMatrix.isSymmetricMatrix(value) && value.klassSubType === 'DistanceMatrix';
      }
      constructor(sideSize) {
        super(sideSize);
        if (!this.isDistance()) {
          throw new TypeError('Provided arguments do no produce a distance matrix');
        }
      }
      set(rowIndex, columnIndex, value) {
        // distance matrix diagonal is 0
        if (rowIndex === columnIndex) value = 0;
        return super.set(rowIndex, columnIndex, value);
      }
      addCross(index, array) {
        if (array === undefined) {
          array = index;
          index = this.diagonalSize;
        }

        // ensure distance
        array = array.slice();
        array[index] = 0;
        return super.addCross(index, array);
      }
      toSymmetricMatrix() {
        return new SymmetricMatrix(this);
      }
      clone() {
        const matrix = new DistanceMatrix(this.diagonalSize);
        for (const [row, col, value] of this.upperRightEntries()) {
          if (row === col) continue;
          matrix.set(row, col, value);
        }
        return matrix;
      }

      /**
       * Compact format upper-right corner of matrix
       * no diagonal (only zeros)
       * iterable from left to right, from top to bottom.
       *
       * ```
       *   A B C D
       * A 0 1 2 3
       * B 1 0 4 5
       * C 2 4 0 6
       * D 3 5 6 0
       * ```
       *
       * will return compact 1D array `[1, 2, 3, 4, 5, 6]`
       *
       * length is S(i=0, n=sideSize-1) => 6 for a 4 side sized matrix
       *
       * @returns {number[]}
       */
      toCompact() {
        const {
          diagonalSize
        } = this;
        const compactLength = (diagonalSize - 1) * diagonalSize / 2;

        /** @type {number[]} */
        const compact = new Array(compactLength);
        for (let col = 1, row = 0, index = 0; index < compact.length; index++) {
          compact[index] = this.get(row, col);
          if (++col >= diagonalSize) col = ++row + 1;
        }
        return compact;
      }

      /**
       * @param {number[]} compact
       */
      static fromCompact(compact) {
        const compactSize = compact.length;
        if (compactSize === 0) {
          return new this(0);
        }

        // compactSize in Natural integer range ]0;∞]
        // compactSize = (sideSize * (sideSize - 1)) / 2
        // sideSize = (Sqrt(8 × compactSize + 1) + 1) / 2
        const diagonalSize = (Math.sqrt(8 * compactSize + 1) + 1) / 2;
        if (!Number.isInteger(diagonalSize)) {
          throw new TypeError(`This array is not a compact representation of a DistanceMatrix, ${JSON.stringify(compact)}`);
        }
        const matrix = new this(diagonalSize);
        for (let col = 1, row = 0, index = 0; index < compactSize; index++) {
          matrix.set(col, row, compact[index]);
          if (++col >= diagonalSize) col = ++row + 1;
        }
        return matrix;
      }
    }
    DistanceMatrix.prototype.klassSubType = 'DistanceMatrix';
    class BaseView extends AbstractMatrix {
      constructor(matrix, rows, columns) {
        super();
        this.matrix = matrix;
        this.rows = rows;
        this.columns = columns;
      }
    }
    class MatrixColumnView extends BaseView {
      constructor(matrix, column) {
        checkColumnIndex(matrix, column);
        super(matrix, matrix.rows, 1);
        this.column = column;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.column, value);
        return this;
      }
      get(rowIndex) {
        return this.matrix.get(rowIndex, this.column);
      }
    }
    class MatrixColumnSelectionView extends BaseView {
      constructor(matrix, columnIndices) {
        checkColumnIndices(matrix, columnIndices);
        super(matrix, matrix.rows, columnIndices.length);
        this.columnIndices = columnIndices;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.columnIndices[columnIndex], value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(rowIndex, this.columnIndices[columnIndex]);
      }
    }
    class MatrixFlipColumnView extends BaseView {
      constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
      }
    }
    class MatrixFlipRowView extends BaseView {
      constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
      }
    }
    class MatrixRowView extends BaseView {
      constructor(matrix, row) {
        checkRowIndex(matrix, row);
        super(matrix, 1, matrix.columns);
        this.row = row;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(this.row, columnIndex, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(this.row, columnIndex);
      }
    }
    class MatrixRowSelectionView extends BaseView {
      constructor(matrix, rowIndices) {
        checkRowIndices(matrix, rowIndices);
        super(matrix, rowIndices.length, matrix.columns);
        this.rowIndices = rowIndices;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rowIndices[rowIndex], columnIndex, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(this.rowIndices[rowIndex], columnIndex);
      }
    }
    class MatrixSelectionView extends BaseView {
      constructor(matrix, rowIndices, columnIndices) {
        checkRowIndices(matrix, rowIndices);
        checkColumnIndices(matrix, columnIndices);
        super(matrix, rowIndices.length, columnIndices.length);
        this.rowIndices = rowIndices;
        this.columnIndices = columnIndices;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rowIndices[rowIndex], this.columnIndices[columnIndex], value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(this.rowIndices[rowIndex], this.columnIndices[columnIndex]);
      }
    }
    class MatrixSubView extends BaseView {
      constructor(matrix, startRow, endRow, startColumn, endColumn) {
        checkRange(matrix, startRow, endRow, startColumn, endColumn);
        super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
        this.startRow = startRow;
        this.startColumn = startColumn;
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(this.startRow + rowIndex, this.startColumn + columnIndex, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(this.startRow + rowIndex, this.startColumn + columnIndex);
      }
    }
    let MatrixTransposeView$2 = class MatrixTransposeView extends BaseView {
      constructor(matrix) {
        super(matrix, matrix.columns, matrix.rows);
      }
      set(rowIndex, columnIndex, value) {
        this.matrix.set(columnIndex, rowIndex, value);
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.matrix.get(columnIndex, rowIndex);
      }
    };
    class WrapperMatrix1D extends AbstractMatrix {
      constructor(data, options = {}) {
        const {
          rows = 1
        } = options;
        if (data.length % rows !== 0) {
          throw new Error('the data length is not divisible by the number of rows');
        }
        super();
        this.rows = rows;
        this.columns = data.length / rows;
        this.data = data;
      }
      set(rowIndex, columnIndex, value) {
        let index = this._calculateIndex(rowIndex, columnIndex);
        this.data[index] = value;
        return this;
      }
      get(rowIndex, columnIndex) {
        let index = this._calculateIndex(rowIndex, columnIndex);
        return this.data[index];
      }
      _calculateIndex(row, column) {
        return row * this.columns + column;
      }
    }
    class WrapperMatrix2D extends AbstractMatrix {
      constructor(data) {
        super();
        this.data = data;
        this.rows = data.length;
        this.columns = data[0].length;
      }
      set(rowIndex, columnIndex, value) {
        this.data[rowIndex][columnIndex] = value;
        return this;
      }
      get(rowIndex, columnIndex) {
        return this.data[rowIndex][columnIndex];
      }
    }
    function wrap(array, options) {
      if (isAnyArray.isAnyArray(array)) {
        if (array[0] && isAnyArray.isAnyArray(array[0])) {
          return new WrapperMatrix2D(array);
        } else {
          return new WrapperMatrix1D(array, options);
        }
      } else {
        throw new Error('the argument is not an array');
      }
    }
    class LuDecomposition {
      constructor(matrix) {
        matrix = WrapperMatrix2D.checkMatrix(matrix);
        let lu = matrix.clone();
        let rows = lu.rows;
        let columns = lu.columns;
        let pivotVector = new Float64Array(rows);
        let pivotSign = 1;
        let i, j, k, p, s, t, v;
        let LUcolj, kmax;
        for (i = 0; i < rows; i++) {
          pivotVector[i] = i;
        }
        LUcolj = new Float64Array(rows);
        for (j = 0; j < columns; j++) {
          for (i = 0; i < rows; i++) {
            LUcolj[i] = lu.get(i, j);
          }
          for (i = 0; i < rows; i++) {
            kmax = Math.min(i, j);
            s = 0;
            for (k = 0; k < kmax; k++) {
              s += lu.get(i, k) * LUcolj[k];
            }
            LUcolj[i] -= s;
            lu.set(i, j, LUcolj[i]);
          }
          p = j;
          for (i = j + 1; i < rows; i++) {
            if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
              p = i;
            }
          }
          if (p !== j) {
            for (k = 0; k < columns; k++) {
              t = lu.get(p, k);
              lu.set(p, k, lu.get(j, k));
              lu.set(j, k, t);
            }
            v = pivotVector[p];
            pivotVector[p] = pivotVector[j];
            pivotVector[j] = v;
            pivotSign = -pivotSign;
          }
          if (j < rows && lu.get(j, j) !== 0) {
            for (i = j + 1; i < rows; i++) {
              lu.set(i, j, lu.get(i, j) / lu.get(j, j));
            }
          }
        }
        this.LU = lu;
        this.pivotVector = pivotVector;
        this.pivotSign = pivotSign;
      }
      isSingular() {
        let data = this.LU;
        let col = data.columns;
        for (let j = 0; j < col; j++) {
          if (data.get(j, j) === 0) {
            return true;
          }
        }
        return false;
      }
      solve(value) {
        value = Matrix$2.checkMatrix(value);
        let lu = this.LU;
        let rows = lu.rows;
        if (rows !== value.rows) {
          throw new Error('Invalid matrix dimensions');
        }
        if (this.isSingular()) {
          throw new Error('LU matrix is singular');
        }
        let count = value.columns;
        let X = value.subMatrixRow(this.pivotVector, 0, count - 1);
        let columns = lu.columns;
        let i, j, k;
        for (k = 0; k < columns; k++) {
          for (i = k + 1; i < columns; i++) {
            for (j = 0; j < count; j++) {
              X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
            }
          }
        }
        for (k = columns - 1; k >= 0; k--) {
          for (j = 0; j < count; j++) {
            X.set(k, j, X.get(k, j) / lu.get(k, k));
          }
          for (i = 0; i < k; i++) {
            for (j = 0; j < count; j++) {
              X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
            }
          }
        }
        return X;
      }
      get determinant() {
        let data = this.LU;
        if (!data.isSquare()) {
          throw new Error('Matrix must be square');
        }
        let determinant = this.pivotSign;
        let col = data.columns;
        for (let j = 0; j < col; j++) {
          determinant *= data.get(j, j);
        }
        return determinant;
      }
      get lowerTriangularMatrix() {
        let data = this.LU;
        let rows = data.rows;
        let columns = data.columns;
        let X = new Matrix$2(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            if (i > j) {
              X.set(i, j, data.get(i, j));
            } else if (i === j) {
              X.set(i, j, 1);
            } else {
              X.set(i, j, 0);
            }
          }
        }
        return X;
      }
      get upperTriangularMatrix() {
        let data = this.LU;
        let rows = data.rows;
        let columns = data.columns;
        let X = new Matrix$2(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            if (i <= j) {
              X.set(i, j, data.get(i, j));
            } else {
              X.set(i, j, 0);
            }
          }
        }
        return X;
      }
      get pivotPermutationVector() {
        return Array.from(this.pivotVector);
      }
    }
    function hypotenuse(a, b) {
      let r = 0;
      if (Math.abs(a) > Math.abs(b)) {
        r = b / a;
        return Math.abs(a) * Math.sqrt(1 + r * r);
      }
      if (b !== 0) {
        r = a / b;
        return Math.abs(b) * Math.sqrt(1 + r * r);
      }
      return 0;
    }
    class QrDecomposition {
      constructor(value) {
        value = WrapperMatrix2D.checkMatrix(value);
        let qr = value.clone();
        let m = value.rows;
        let n = value.columns;
        let rdiag = new Float64Array(n);
        let i, j, k, s;
        for (k = 0; k < n; k++) {
          let nrm = 0;
          for (i = k; i < m; i++) {
            nrm = hypotenuse(nrm, qr.get(i, k));
          }
          if (nrm !== 0) {
            if (qr.get(k, k) < 0) {
              nrm = -nrm;
            }
            for (i = k; i < m; i++) {
              qr.set(i, k, qr.get(i, k) / nrm);
            }
            qr.set(k, k, qr.get(k, k) + 1);
            for (j = k + 1; j < n; j++) {
              s = 0;
              for (i = k; i < m; i++) {
                s += qr.get(i, k) * qr.get(i, j);
              }
              s = -s / qr.get(k, k);
              for (i = k; i < m; i++) {
                qr.set(i, j, qr.get(i, j) + s * qr.get(i, k));
              }
            }
          }
          rdiag[k] = -nrm;
        }
        this.QR = qr;
        this.Rdiag = rdiag;
      }
      solve(value) {
        value = Matrix$2.checkMatrix(value);
        let qr = this.QR;
        let m = qr.rows;
        if (value.rows !== m) {
          throw new Error('Matrix row dimensions must agree');
        }
        if (!this.isFullRank()) {
          throw new Error('Matrix is rank deficient');
        }
        let count = value.columns;
        let X = value.clone();
        let n = qr.columns;
        let i, j, k, s;
        for (k = 0; k < n; k++) {
          for (j = 0; j < count; j++) {
            s = 0;
            for (i = k; i < m; i++) {
              s += qr.get(i, k) * X.get(i, j);
            }
            s = -s / qr.get(k, k);
            for (i = k; i < m; i++) {
              X.set(i, j, X.get(i, j) + s * qr.get(i, k));
            }
          }
        }
        for (k = n - 1; k >= 0; k--) {
          for (j = 0; j < count; j++) {
            X.set(k, j, X.get(k, j) / this.Rdiag[k]);
          }
          for (i = 0; i < k; i++) {
            for (j = 0; j < count; j++) {
              X.set(i, j, X.get(i, j) - X.get(k, j) * qr.get(i, k));
            }
          }
        }
        return X.subMatrix(0, n - 1, 0, count - 1);
      }
      isFullRank() {
        let columns = this.QR.columns;
        for (let i = 0; i < columns; i++) {
          if (this.Rdiag[i] === 0) {
            return false;
          }
        }
        return true;
      }
      get upperTriangularMatrix() {
        let qr = this.QR;
        let n = qr.columns;
        let X = new Matrix$2(n, n);
        let i, j;
        for (i = 0; i < n; i++) {
          for (j = 0; j < n; j++) {
            if (i < j) {
              X.set(i, j, qr.get(i, j));
            } else if (i === j) {
              X.set(i, j, this.Rdiag[i]);
            } else {
              X.set(i, j, 0);
            }
          }
        }
        return X;
      }
      get orthogonalMatrix() {
        let qr = this.QR;
        let rows = qr.rows;
        let columns = qr.columns;
        let X = new Matrix$2(rows, columns);
        let i, j, k, s;
        for (k = columns - 1; k >= 0; k--) {
          for (i = 0; i < rows; i++) {
            X.set(i, k, 0);
          }
          X.set(k, k, 1);
          for (j = k; j < columns; j++) {
            if (qr.get(k, k) !== 0) {
              s = 0;
              for (i = k; i < rows; i++) {
                s += qr.get(i, k) * X.get(i, j);
              }
              s = -s / qr.get(k, k);
              for (i = k; i < rows; i++) {
                X.set(i, j, X.get(i, j) + s * qr.get(i, k));
              }
            }
          }
        }
        return X;
      }
    }
    class SingularValueDecomposition {
      constructor(value, options = {}) {
        value = WrapperMatrix2D.checkMatrix(value);
        if (value.isEmpty()) {
          throw new Error('Matrix must be non-empty');
        }
        let m = value.rows;
        let n = value.columns;
        const {
          computeLeftSingularVectors = true,
          computeRightSingularVectors = true,
          autoTranspose = false
        } = options;
        let wantu = Boolean(computeLeftSingularVectors);
        let wantv = Boolean(computeRightSingularVectors);
        let swapped = false;
        let a;
        if (m < n) {
          if (!autoTranspose) {
            a = value.clone();
            // eslint-disable-next-line no-console
            console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
          } else {
            a = value.transpose();
            m = a.rows;
            n = a.columns;
            swapped = true;
            let aux = wantu;
            wantu = wantv;
            wantv = aux;
          }
        } else {
          a = value.clone();
        }
        let nu = Math.min(m, n);
        let ni = Math.min(m + 1, n);
        let s = new Float64Array(ni);
        let U = new Matrix$2(m, nu);
        let V = new Matrix$2(n, n);
        let e = new Float64Array(n);
        let work = new Float64Array(m);
        let si = new Float64Array(ni);
        for (let i = 0; i < ni; i++) si[i] = i;
        let nct = Math.min(m - 1, n);
        let nrt = Math.max(0, Math.min(n - 2, m));
        let mrc = Math.max(nct, nrt);
        for (let k = 0; k < mrc; k++) {
          if (k < nct) {
            s[k] = 0;
            for (let i = k; i < m; i++) {
              s[k] = hypotenuse(s[k], a.get(i, k));
            }
            if (s[k] !== 0) {
              if (a.get(k, k) < 0) {
                s[k] = -s[k];
              }
              for (let i = k; i < m; i++) {
                a.set(i, k, a.get(i, k) / s[k]);
              }
              a.set(k, k, a.get(k, k) + 1);
            }
            s[k] = -s[k];
          }
          for (let j = k + 1; j < n; j++) {
            if (k < nct && s[k] !== 0) {
              let t = 0;
              for (let i = k; i < m; i++) {
                t += a.get(i, k) * a.get(i, j);
              }
              t = -t / a.get(k, k);
              for (let i = k; i < m; i++) {
                a.set(i, j, a.get(i, j) + t * a.get(i, k));
              }
            }
            e[j] = a.get(k, j);
          }
          if (wantu && k < nct) {
            for (let i = k; i < m; i++) {
              U.set(i, k, a.get(i, k));
            }
          }
          if (k < nrt) {
            e[k] = 0;
            for (let i = k + 1; i < n; i++) {
              e[k] = hypotenuse(e[k], e[i]);
            }
            if (e[k] !== 0) {
              if (e[k + 1] < 0) {
                e[k] = 0 - e[k];
              }
              for (let i = k + 1; i < n; i++) {
                e[i] /= e[k];
              }
              e[k + 1] += 1;
            }
            e[k] = -e[k];
            if (k + 1 < m && e[k] !== 0) {
              for (let i = k + 1; i < m; i++) {
                work[i] = 0;
              }
              for (let i = k + 1; i < m; i++) {
                for (let j = k + 1; j < n; j++) {
                  work[i] += e[j] * a.get(i, j);
                }
              }
              for (let j = k + 1; j < n; j++) {
                let t = -e[j] / e[k + 1];
                for (let i = k + 1; i < m; i++) {
                  a.set(i, j, a.get(i, j) + t * work[i]);
                }
              }
            }
            if (wantv) {
              for (let i = k + 1; i < n; i++) {
                V.set(i, k, e[i]);
              }
            }
          }
        }
        let p = Math.min(n, m + 1);
        if (nct < n) {
          s[nct] = a.get(nct, nct);
        }
        if (m < p) {
          s[p - 1] = 0;
        }
        if (nrt + 1 < p) {
          e[nrt] = a.get(nrt, p - 1);
        }
        e[p - 1] = 0;
        if (wantu) {
          for (let j = nct; j < nu; j++) {
            for (let i = 0; i < m; i++) {
              U.set(i, j, 0);
            }
            U.set(j, j, 1);
          }
          for (let k = nct - 1; k >= 0; k--) {
            if (s[k] !== 0) {
              for (let j = k + 1; j < nu; j++) {
                let t = 0;
                for (let i = k; i < m; i++) {
                  t += U.get(i, k) * U.get(i, j);
                }
                t = -t / U.get(k, k);
                for (let i = k; i < m; i++) {
                  U.set(i, j, U.get(i, j) + t * U.get(i, k));
                }
              }
              for (let i = k; i < m; i++) {
                U.set(i, k, -U.get(i, k));
              }
              U.set(k, k, 1 + U.get(k, k));
              for (let i = 0; i < k - 1; i++) {
                U.set(i, k, 0);
              }
            } else {
              for (let i = 0; i < m; i++) {
                U.set(i, k, 0);
              }
              U.set(k, k, 1);
            }
          }
        }
        if (wantv) {
          for (let k = n - 1; k >= 0; k--) {
            if (k < nrt && e[k] !== 0) {
              for (let j = k + 1; j < n; j++) {
                let t = 0;
                for (let i = k + 1; i < n; i++) {
                  t += V.get(i, k) * V.get(i, j);
                }
                t = -t / V.get(k + 1, k);
                for (let i = k + 1; i < n; i++) {
                  V.set(i, j, V.get(i, j) + t * V.get(i, k));
                }
              }
            }
            for (let i = 0; i < n; i++) {
              V.set(i, k, 0);
            }
            V.set(k, k, 1);
          }
        }
        let pp = p - 1;
        let eps = Number.EPSILON;
        while (p > 0) {
          let k, kase;
          for (k = p - 2; k >= -1; k--) {
            if (k === -1) {
              break;
            }
            const alpha = Number.MIN_VALUE + eps * Math.abs(s[k] + Math.abs(s[k + 1]));
            if (Math.abs(e[k]) <= alpha || Number.isNaN(e[k])) {
              e[k] = 0;
              break;
            }
          }
          if (k === p - 2) {
            kase = 4;
          } else {
            let ks;
            for (ks = p - 1; ks >= k; ks--) {
              if (ks === k) {
                break;
              }
              let t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
              if (Math.abs(s[ks]) <= eps * t) {
                s[ks] = 0;
                break;
              }
            }
            if (ks === k) {
              kase = 3;
            } else if (ks === p - 1) {
              kase = 1;
            } else {
              kase = 2;
              k = ks;
            }
          }
          k++;
          switch (kase) {
            case 1:
              {
                let f = e[p - 2];
                e[p - 2] = 0;
                for (let j = p - 2; j >= k; j--) {
                  let t = hypotenuse(s[j], f);
                  let cs = s[j] / t;
                  let sn = f / t;
                  s[j] = t;
                  if (j !== k) {
                    f = -sn * e[j - 1];
                    e[j - 1] = cs * e[j - 1];
                  }
                  if (wantv) {
                    for (let i = 0; i < n; i++) {
                      t = cs * V.get(i, j) + sn * V.get(i, p - 1);
                      V.set(i, p - 1, -sn * V.get(i, j) + cs * V.get(i, p - 1));
                      V.set(i, j, t);
                    }
                  }
                }
                break;
              }
            case 2:
              {
                let f = e[k - 1];
                e[k - 1] = 0;
                for (let j = k; j < p; j++) {
                  let t = hypotenuse(s[j], f);
                  let cs = s[j] / t;
                  let sn = f / t;
                  s[j] = t;
                  f = -sn * e[j];
                  e[j] = cs * e[j];
                  if (wantu) {
                    for (let i = 0; i < m; i++) {
                      t = cs * U.get(i, j) + sn * U.get(i, k - 1);
                      U.set(i, k - 1, -sn * U.get(i, j) + cs * U.get(i, k - 1));
                      U.set(i, j, t);
                    }
                  }
                }
                break;
              }
            case 3:
              {
                const scale = Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2]), Math.abs(e[p - 2]), Math.abs(s[k]), Math.abs(e[k]));
                const sp = s[p - 1] / scale;
                const spm1 = s[p - 2] / scale;
                const epm1 = e[p - 2] / scale;
                const sk = s[k] / scale;
                const ek = e[k] / scale;
                const b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
                const c = sp * epm1 * (sp * epm1);
                let shift = 0;
                if (b !== 0 || c !== 0) {
                  if (b < 0) {
                    shift = 0 - Math.sqrt(b * b + c);
                  } else {
                    shift = Math.sqrt(b * b + c);
                  }
                  shift = c / (b + shift);
                }
                let f = (sk + sp) * (sk - sp) + shift;
                let g = sk * ek;
                for (let j = k; j < p - 1; j++) {
                  let t = hypotenuse(f, g);
                  if (t === 0) t = Number.MIN_VALUE;
                  let cs = f / t;
                  let sn = g / t;
                  if (j !== k) {
                    e[j - 1] = t;
                  }
                  f = cs * s[j] + sn * e[j];
                  e[j] = cs * e[j] - sn * s[j];
                  g = sn * s[j + 1];
                  s[j + 1] = cs * s[j + 1];
                  if (wantv) {
                    for (let i = 0; i < n; i++) {
                      t = cs * V.get(i, j) + sn * V.get(i, j + 1);
                      V.set(i, j + 1, -sn * V.get(i, j) + cs * V.get(i, j + 1));
                      V.set(i, j, t);
                    }
                  }
                  t = hypotenuse(f, g);
                  if (t === 0) t = Number.MIN_VALUE;
                  cs = f / t;
                  sn = g / t;
                  s[j] = t;
                  f = cs * e[j] + sn * s[j + 1];
                  s[j + 1] = -sn * e[j] + cs * s[j + 1];
                  g = sn * e[j + 1];
                  e[j + 1] = cs * e[j + 1];
                  if (wantu && j < m - 1) {
                    for (let i = 0; i < m; i++) {
                      t = cs * U.get(i, j) + sn * U.get(i, j + 1);
                      U.set(i, j + 1, -sn * U.get(i, j) + cs * U.get(i, j + 1));
                      U.set(i, j, t);
                    }
                  }
                }
                e[p - 2] = f;
                break;
              }
            case 4:
              {
                if (s[k] <= 0) {
                  s[k] = s[k] < 0 ? -s[k] : 0;
                  if (wantv) {
                    for (let i = 0; i <= pp; i++) {
                      V.set(i, k, -V.get(i, k));
                    }
                  }
                }
                while (k < pp) {
                  if (s[k] >= s[k + 1]) {
                    break;
                  }
                  let t = s[k];
                  s[k] = s[k + 1];
                  s[k + 1] = t;
                  if (wantv && k < n - 1) {
                    for (let i = 0; i < n; i++) {
                      t = V.get(i, k + 1);
                      V.set(i, k + 1, V.get(i, k));
                      V.set(i, k, t);
                    }
                  }
                  if (wantu && k < m - 1) {
                    for (let i = 0; i < m; i++) {
                      t = U.get(i, k + 1);
                      U.set(i, k + 1, U.get(i, k));
                      U.set(i, k, t);
                    }
                  }
                  k++;
                }
                p--;
                break;
              }
            // no default
          }
        }
        if (swapped) {
          let tmp = V;
          V = U;
          U = tmp;
        }
        this.m = m;
        this.n = n;
        this.s = s;
        this.U = U;
        this.V = V;
      }
      solve(value) {
        let Y = value;
        let e = this.threshold;
        let scols = this.s.length;
        let Ls = Matrix$2.zeros(scols, scols);
        for (let i = 0; i < scols; i++) {
          if (Math.abs(this.s[i]) <= e) {
            Ls.set(i, i, 0);
          } else {
            Ls.set(i, i, 1 / this.s[i]);
          }
        }
        let U = this.U;
        let V = this.rightSingularVectors;
        let VL = V.mmul(Ls);
        let vrows = V.rows;
        let urows = U.rows;
        let VLU = Matrix$2.zeros(vrows, urows);
        for (let i = 0; i < vrows; i++) {
          for (let j = 0; j < urows; j++) {
            let sum = 0;
            for (let k = 0; k < scols; k++) {
              sum += VL.get(i, k) * U.get(j, k);
            }
            VLU.set(i, j, sum);
          }
        }
        return VLU.mmul(Y);
      }
      solveForDiagonal(value) {
        return this.solve(Matrix$2.diag(value));
      }
      inverse() {
        let V = this.V;
        let e = this.threshold;
        let vrows = V.rows;
        let vcols = V.columns;
        let X = new Matrix$2(vrows, this.s.length);
        for (let i = 0; i < vrows; i++) {
          for (let j = 0; j < vcols; j++) {
            if (Math.abs(this.s[j]) > e) {
              X.set(i, j, V.get(i, j) / this.s[j]);
            }
          }
        }
        let U = this.U;
        let urows = U.rows;
        let ucols = U.columns;
        let Y = new Matrix$2(vrows, urows);
        for (let i = 0; i < vrows; i++) {
          for (let j = 0; j < urows; j++) {
            let sum = 0;
            for (let k = 0; k < ucols; k++) {
              sum += X.get(i, k) * U.get(j, k);
            }
            Y.set(i, j, sum);
          }
        }
        return Y;
      }
      get condition() {
        return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
      }
      get norm2() {
        return this.s[0];
      }
      get rank() {
        let tol = Math.max(this.m, this.n) * this.s[0] * Number.EPSILON;
        let r = 0;
        let s = this.s;
        for (let i = 0, ii = s.length; i < ii; i++) {
          if (s[i] > tol) {
            r++;
          }
        }
        return r;
      }
      get diagonal() {
        return Array.from(this.s);
      }
      get threshold() {
        return Number.EPSILON / 2 * Math.max(this.m, this.n) * this.s[0];
      }
      get leftSingularVectors() {
        return this.U;
      }
      get rightSingularVectors() {
        return this.V;
      }
      get diagonalMatrix() {
        return Matrix$2.diag(this.s);
      }
    }
    function inverse(matrix, useSVD = false) {
      matrix = WrapperMatrix2D.checkMatrix(matrix);
      if (useSVD) {
        return new SingularValueDecomposition(matrix).inverse();
      } else {
        return solve$1(matrix, Matrix$2.eye(matrix.rows));
      }
    }
    function solve$1(leftHandSide, rightHandSide, useSVD = false) {
      leftHandSide = WrapperMatrix2D.checkMatrix(leftHandSide);
      rightHandSide = WrapperMatrix2D.checkMatrix(rightHandSide);
      if (useSVD) {
        return new SingularValueDecomposition(leftHandSide).solve(rightHandSide);
      } else {
        return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
      }
    }
    function determinant(matrix) {
      matrix = Matrix$2.checkMatrix(matrix);
      if (matrix.isSquare()) {
        if (matrix.columns === 0) {
          return 1;
        }
        let a, b, c, d;
        if (matrix.columns === 2) {
          // 2 x 2 matrix
          a = matrix.get(0, 0);
          b = matrix.get(0, 1);
          c = matrix.get(1, 0);
          d = matrix.get(1, 1);
          return a * d - b * c;
        } else if (matrix.columns === 3) {
          // 3 x 3 matrix
          let subMatrix0, subMatrix1, subMatrix2;
          subMatrix0 = new MatrixSelectionView(matrix, [1, 2], [1, 2]);
          subMatrix1 = new MatrixSelectionView(matrix, [1, 2], [0, 2]);
          subMatrix2 = new MatrixSelectionView(matrix, [1, 2], [0, 1]);
          a = matrix.get(0, 0);
          b = matrix.get(0, 1);
          c = matrix.get(0, 2);
          return a * determinant(subMatrix0) - b * determinant(subMatrix1) + c * determinant(subMatrix2);
        } else {
          // general purpose determinant using the LU decomposition
          return new LuDecomposition(matrix).determinant;
        }
      } else {
        throw Error('determinant can only be calculated for a square matrix');
      }
    }
    function xrange(n, exception) {
      let range = [];
      for (let i = 0; i < n; i++) {
        if (i !== exception) {
          range.push(i);
        }
      }
      return range;
    }
    function dependenciesOneRow(error, matrix, index, thresholdValue = 10e-10, thresholdError = 10e-10) {
      if (error > thresholdError) {
        return new Array(matrix.rows + 1).fill(0);
      } else {
        let returnArray = matrix.addRow(index, [0]);
        for (let i = 0; i < returnArray.rows; i++) {
          if (Math.abs(returnArray.get(i, 0)) < thresholdValue) {
            returnArray.set(i, 0, 0);
          }
        }
        return returnArray.to1DArray();
      }
    }
    function linearDependencies(matrix, options = {}) {
      const {
        thresholdValue = 10e-10,
        thresholdError = 10e-10
      } = options;
      matrix = Matrix$2.checkMatrix(matrix);
      let n = matrix.rows;
      let results = new Matrix$2(n, n);
      for (let i = 0; i < n; i++) {
        let b = Matrix$2.columnVector(matrix.getRow(i));
        let Abis = matrix.subMatrixRow(xrange(n, i)).transpose();
        let svd = new SingularValueDecomposition(Abis);
        let x = svd.solve(b);
        let error = Matrix$2.sub(b, Abis.mmul(x)).abs().max();
        results.setRow(i, dependenciesOneRow(error, x, i, thresholdValue, thresholdError));
      }
      return results;
    }
    function pseudoInverse$1(matrix, threshold = Number.EPSILON) {
      matrix = Matrix$2.checkMatrix(matrix);
      if (matrix.isEmpty()) {
        // with a zero dimension, the pseudo-inverse is the transpose, since all 0xn and nx0 matrices are singular
        // (0xn)*(nx0)*(0xn) = 0xn
        // (nx0)*(0xn)*(nx0) = nx0
        return matrix.transpose();
      }
      let svdSolution = new SingularValueDecomposition(matrix, {
        autoTranspose: true
      });
      let U = svdSolution.leftSingularVectors;
      let V = svdSolution.rightSingularVectors;
      let s = svdSolution.diagonal;
      for (let i = 0; i < s.length; i++) {
        if (Math.abs(s[i]) > threshold) {
          s[i] = 1.0 / s[i];
        } else {
          s[i] = 0.0;
        }
      }
      return V.mmul(Matrix$2.diag(s).mmul(U.transpose()));
    }
    function covariance(xMatrix, yMatrix = xMatrix, options = {}) {
      xMatrix = new Matrix$2(xMatrix);
      let yIsSame = false;
      if (typeof yMatrix === 'object' && !Matrix$2.isMatrix(yMatrix) && !isAnyArray.isAnyArray(yMatrix)) {
        options = yMatrix;
        yMatrix = xMatrix;
        yIsSame = true;
      } else {
        yMatrix = new Matrix$2(yMatrix);
      }
      if (xMatrix.rows !== yMatrix.rows) {
        throw new TypeError('Both matrices must have the same number of rows');
      }
      const {
        center = true
      } = options;
      if (center) {
        xMatrix = xMatrix.center('column');
        if (!yIsSame) {
          yMatrix = yMatrix.center('column');
        }
      }
      const cov = xMatrix.transpose().mmul(yMatrix);
      for (let i = 0; i < cov.rows; i++) {
        for (let j = 0; j < cov.columns; j++) {
          cov.set(i, j, cov.get(i, j) * (1 / (xMatrix.rows - 1)));
        }
      }
      return cov;
    }
    function correlation(xMatrix, yMatrix = xMatrix, options = {}) {
      xMatrix = new Matrix$2(xMatrix);
      let yIsSame = false;
      if (typeof yMatrix === 'object' && !Matrix$2.isMatrix(yMatrix) && !isAnyArray.isAnyArray(yMatrix)) {
        options = yMatrix;
        yMatrix = xMatrix;
        yIsSame = true;
      } else {
        yMatrix = new Matrix$2(yMatrix);
      }
      if (xMatrix.rows !== yMatrix.rows) {
        throw new TypeError('Both matrices must have the same number of rows');
      }
      const {
        center = true,
        scale = true
      } = options;
      if (center) {
        xMatrix.center('column');
        if (!yIsSame) {
          yMatrix.center('column');
        }
      }
      if (scale) {
        xMatrix.scale('column');
        if (!yIsSame) {
          yMatrix.scale('column');
        }
      }
      const sdx = xMatrix.standardDeviation('column', {
        unbiased: true
      });
      const sdy = yIsSame ? sdx : yMatrix.standardDeviation('column', {
        unbiased: true
      });
      const corr = xMatrix.transpose().mmul(yMatrix);
      for (let i = 0; i < corr.rows; i++) {
        for (let j = 0; j < corr.columns; j++) {
          corr.set(i, j, corr.get(i, j) * (1 / (sdx[i] * sdy[j])) * (1 / (xMatrix.rows - 1)));
        }
      }
      return corr;
    }
    class EigenvalueDecomposition {
      constructor(matrix, options = {}) {
        const {
          assumeSymmetric = false
        } = options;
        matrix = WrapperMatrix2D.checkMatrix(matrix);
        if (!matrix.isSquare()) {
          throw new Error('Matrix is not a square matrix');
        }
        if (matrix.isEmpty()) {
          throw new Error('Matrix must be non-empty');
        }
        let n = matrix.columns;
        let V = new Matrix$2(n, n);
        let d = new Float64Array(n);
        let e = new Float64Array(n);
        let value = matrix;
        let i, j;
        let isSymmetric = false;
        if (assumeSymmetric) {
          isSymmetric = true;
        } else {
          isSymmetric = matrix.isSymmetric();
        }
        if (isSymmetric) {
          for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
              V.set(i, j, value.get(i, j));
            }
          }
          tred2(n, e, d, V);
          tql2(n, e, d, V);
        } else {
          let H = new Matrix$2(n, n);
          let ort = new Float64Array(n);
          for (j = 0; j < n; j++) {
            for (i = 0; i < n; i++) {
              H.set(i, j, value.get(i, j));
            }
          }
          orthes(n, H, ort, V);
          hqr2(n, e, d, V, H);
        }
        this.n = n;
        this.e = e;
        this.d = d;
        this.V = V;
      }
      get realEigenvalues() {
        return Array.from(this.d);
      }
      get imaginaryEigenvalues() {
        return Array.from(this.e);
      }
      get eigenvectorMatrix() {
        return this.V;
      }
      get diagonalMatrix() {
        let n = this.n;
        let e = this.e;
        let d = this.d;
        let X = new Matrix$2(n, n);
        let i, j;
        for (i = 0; i < n; i++) {
          for (j = 0; j < n; j++) {
            X.set(i, j, 0);
          }
          X.set(i, i, d[i]);
          if (e[i] > 0) {
            X.set(i, i + 1, e[i]);
          } else if (e[i] < 0) {
            X.set(i, i - 1, e[i]);
          }
        }
        return X;
      }
    }
    function tred2(n, e, d, V) {
      let f, g, h, i, j, k, hh, scale;
      for (j = 0; j < n; j++) {
        d[j] = V.get(n - 1, j);
      }
      for (i = n - 1; i > 0; i--) {
        scale = 0;
        h = 0;
        for (k = 0; k < i; k++) {
          scale = scale + Math.abs(d[k]);
        }
        if (scale === 0) {
          e[i] = d[i - 1];
          for (j = 0; j < i; j++) {
            d[j] = V.get(i - 1, j);
            V.set(i, j, 0);
            V.set(j, i, 0);
          }
        } else {
          for (k = 0; k < i; k++) {
            d[k] /= scale;
            h += d[k] * d[k];
          }
          f = d[i - 1];
          g = Math.sqrt(h);
          if (f > 0) {
            g = -g;
          }
          e[i] = scale * g;
          h = h - f * g;
          d[i - 1] = f - g;
          for (j = 0; j < i; j++) {
            e[j] = 0;
          }
          for (j = 0; j < i; j++) {
            f = d[j];
            V.set(j, i, f);
            g = e[j] + V.get(j, j) * f;
            for (k = j + 1; k <= i - 1; k++) {
              g += V.get(k, j) * d[k];
              e[k] += V.get(k, j) * f;
            }
            e[j] = g;
          }
          f = 0;
          for (j = 0; j < i; j++) {
            e[j] /= h;
            f += e[j] * d[j];
          }
          hh = f / (h + h);
          for (j = 0; j < i; j++) {
            e[j] -= hh * d[j];
          }
          for (j = 0; j < i; j++) {
            f = d[j];
            g = e[j];
            for (k = j; k <= i - 1; k++) {
              V.set(k, j, V.get(k, j) - (f * e[k] + g * d[k]));
            }
            d[j] = V.get(i - 1, j);
            V.set(i, j, 0);
          }
        }
        d[i] = h;
      }
      for (i = 0; i < n - 1; i++) {
        V.set(n - 1, i, V.get(i, i));
        V.set(i, i, 1);
        h = d[i + 1];
        if (h !== 0) {
          for (k = 0; k <= i; k++) {
            d[k] = V.get(k, i + 1) / h;
          }
          for (j = 0; j <= i; j++) {
            g = 0;
            for (k = 0; k <= i; k++) {
              g += V.get(k, i + 1) * V.get(k, j);
            }
            for (k = 0; k <= i; k++) {
              V.set(k, j, V.get(k, j) - g * d[k]);
            }
          }
        }
        for (k = 0; k <= i; k++) {
          V.set(k, i + 1, 0);
        }
      }
      for (j = 0; j < n; j++) {
        d[j] = V.get(n - 1, j);
        V.set(n - 1, j, 0);
      }
      V.set(n - 1, n - 1, 1);
      e[0] = 0;
    }
    function tql2(n, e, d, V) {
      let g, h, i, j, k, l, m, p, r, dl1, c, c2, c3, el1, s, s2;
      for (i = 1; i < n; i++) {
        e[i - 1] = e[i];
      }
      e[n - 1] = 0;
      let f = 0;
      let tst1 = 0;
      let eps = Number.EPSILON;
      for (l = 0; l < n; l++) {
        tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
        m = l;
        while (m < n) {
          if (Math.abs(e[m]) <= eps * tst1) {
            break;
          }
          m++;
        }
        if (m > l) {
          do {
            g = d[l];
            p = (d[l + 1] - g) / (2 * e[l]);
            r = hypotenuse(p, 1);
            if (p < 0) {
              r = -r;
            }
            d[l] = e[l] / (p + r);
            d[l + 1] = e[l] * (p + r);
            dl1 = d[l + 1];
            h = g - d[l];
            for (i = l + 2; i < n; i++) {
              d[i] -= h;
            }
            f = f + h;
            p = d[m];
            c = 1;
            c2 = c;
            c3 = c;
            el1 = e[l + 1];
            s = 0;
            s2 = 0;
            for (i = m - 1; i >= l; i--) {
              c3 = c2;
              c2 = c;
              s2 = s;
              g = c * e[i];
              h = c * p;
              r = hypotenuse(p, e[i]);
              e[i + 1] = s * r;
              s = e[i] / r;
              c = p / r;
              p = c * d[i] - s * g;
              d[i + 1] = h + s * (c * g + s * d[i]);
              for (k = 0; k < n; k++) {
                h = V.get(k, i + 1);
                V.set(k, i + 1, s * V.get(k, i) + c * h);
                V.set(k, i, c * V.get(k, i) - s * h);
              }
            }
            p = -s * s2 * c3 * el1 * e[l] / dl1;
            e[l] = s * p;
            d[l] = c * p;
          } while (Math.abs(e[l]) > eps * tst1);
        }
        d[l] = d[l] + f;
        e[l] = 0;
      }
      for (i = 0; i < n - 1; i++) {
        k = i;
        p = d[i];
        for (j = i + 1; j < n; j++) {
          if (d[j] < p) {
            k = j;
            p = d[j];
          }
        }
        if (k !== i) {
          d[k] = d[i];
          d[i] = p;
          for (j = 0; j < n; j++) {
            p = V.get(j, i);
            V.set(j, i, V.get(j, k));
            V.set(j, k, p);
          }
        }
      }
    }
    function orthes(n, H, ort, V) {
      let low = 0;
      let high = n - 1;
      let f, g, h, i, j, m;
      let scale;
      for (m = low + 1; m <= high - 1; m++) {
        scale = 0;
        for (i = m; i <= high; i++) {
          scale = scale + Math.abs(H.get(i, m - 1));
        }
        if (scale !== 0) {
          h = 0;
          for (i = high; i >= m; i--) {
            ort[i] = H.get(i, m - 1) / scale;
            h += ort[i] * ort[i];
          }
          g = Math.sqrt(h);
          if (ort[m] > 0) {
            g = -g;
          }
          h = h - ort[m] * g;
          ort[m] = ort[m] - g;
          for (j = m; j < n; j++) {
            f = 0;
            for (i = high; i >= m; i--) {
              f += ort[i] * H.get(i, j);
            }
            f = f / h;
            for (i = m; i <= high; i++) {
              H.set(i, j, H.get(i, j) - f * ort[i]);
            }
          }
          for (i = 0; i <= high; i++) {
            f = 0;
            for (j = high; j >= m; j--) {
              f += ort[j] * H.get(i, j);
            }
            f = f / h;
            for (j = m; j <= high; j++) {
              H.set(i, j, H.get(i, j) - f * ort[j]);
            }
          }
          ort[m] = scale * ort[m];
          H.set(m, m - 1, scale * g);
        }
      }
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          V.set(i, j, i === j ? 1 : 0);
        }
      }
      for (m = high - 1; m >= low + 1; m--) {
        if (H.get(m, m - 1) !== 0) {
          for (i = m + 1; i <= high; i++) {
            ort[i] = H.get(i, m - 1);
          }
          for (j = m; j <= high; j++) {
            g = 0;
            for (i = m; i <= high; i++) {
              g += ort[i] * V.get(i, j);
            }
            g = g / ort[m] / H.get(m, m - 1);
            for (i = m; i <= high; i++) {
              V.set(i, j, V.get(i, j) + g * ort[i]);
            }
          }
        }
      }
    }
    function hqr2(nn, e, d, V, H) {
      let n = nn - 1;
      let low = 0;
      let high = nn - 1;
      let eps = Number.EPSILON;
      let exshift = 0;
      let norm = 0;
      let p = 0;
      let q = 0;
      let r = 0;
      let s = 0;
      let z = 0;
      let iter = 0;
      let i, j, k, l, m, t, w, x, y;
      let ra, sa, vr, vi;
      let notlast, cdivres;
      for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
          d[i] = H.get(i, i);
          e[i] = 0;
        }
        for (j = Math.max(i - 1, 0); j < nn; j++) {
          norm = norm + Math.abs(H.get(i, j));
        }
      }
      while (n >= low) {
        l = n;
        while (l > low) {
          s = Math.abs(H.get(l - 1, l - 1)) + Math.abs(H.get(l, l));
          if (s === 0) {
            s = norm;
          }
          if (Math.abs(H.get(l, l - 1)) < eps * s) {
            break;
          }
          l--;
        }
        if (l === n) {
          H.set(n, n, H.get(n, n) + exshift);
          d[n] = H.get(n, n);
          e[n] = 0;
          n--;
          iter = 0;
        } else if (l === n - 1) {
          w = H.get(n, n - 1) * H.get(n - 1, n);
          p = (H.get(n - 1, n - 1) - H.get(n, n)) / 2;
          q = p * p + w;
          z = Math.sqrt(Math.abs(q));
          H.set(n, n, H.get(n, n) + exshift);
          H.set(n - 1, n - 1, H.get(n - 1, n - 1) + exshift);
          x = H.get(n, n);
          if (q >= 0) {
            z = p >= 0 ? p + z : p - z;
            d[n - 1] = x + z;
            d[n] = d[n - 1];
            if (z !== 0) {
              d[n] = x - w / z;
            }
            e[n - 1] = 0;
            e[n] = 0;
            x = H.get(n, n - 1);
            s = Math.abs(x) + Math.abs(z);
            p = x / s;
            q = z / s;
            r = Math.sqrt(p * p + q * q);
            p = p / r;
            q = q / r;
            for (j = n - 1; j < nn; j++) {
              z = H.get(n - 1, j);
              H.set(n - 1, j, q * z + p * H.get(n, j));
              H.set(n, j, q * H.get(n, j) - p * z);
            }
            for (i = 0; i <= n; i++) {
              z = H.get(i, n - 1);
              H.set(i, n - 1, q * z + p * H.get(i, n));
              H.set(i, n, q * H.get(i, n) - p * z);
            }
            for (i = low; i <= high; i++) {
              z = V.get(i, n - 1);
              V.set(i, n - 1, q * z + p * V.get(i, n));
              V.set(i, n, q * V.get(i, n) - p * z);
            }
          } else {
            d[n - 1] = x + p;
            d[n] = x + p;
            e[n - 1] = z;
            e[n] = -z;
          }
          n = n - 2;
          iter = 0;
        } else {
          x = H.get(n, n);
          y = 0;
          w = 0;
          if (l < n) {
            y = H.get(n - 1, n - 1);
            w = H.get(n, n - 1) * H.get(n - 1, n);
          }
          if (iter === 10) {
            exshift += x;
            for (i = low; i <= n; i++) {
              H.set(i, i, H.get(i, i) - x);
            }
            s = Math.abs(H.get(n, n - 1)) + Math.abs(H.get(n - 1, n - 2));
            // eslint-disable-next-line no-multi-assign
            x = y = 0.75 * s;
            w = -0.4375 * s * s;
          }
          if (iter === 30) {
            s = (y - x) / 2;
            s = s * s + w;
            if (s > 0) {
              s = Math.sqrt(s);
              if (y < x) {
                s = -s;
              }
              s = x - w / ((y - x) / 2 + s);
              for (i = low; i <= n; i++) {
                H.set(i, i, H.get(i, i) - s);
              }
              exshift += s;
              // eslint-disable-next-line no-multi-assign
              x = y = w = 0.964;
            }
          }
          iter = iter + 1;
          m = n - 2;
          while (m >= l) {
            z = H.get(m, m);
            r = x - z;
            s = y - z;
            p = (r * s - w) / H.get(m + 1, m) + H.get(m, m + 1);
            q = H.get(m + 1, m + 1) - z - r - s;
            r = H.get(m + 2, m + 1);
            s = Math.abs(p) + Math.abs(q) + Math.abs(r);
            p = p / s;
            q = q / s;
            r = r / s;
            if (m === l) {
              break;
            }
            if (Math.abs(H.get(m, m - 1)) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H.get(m - 1, m - 1)) + Math.abs(z) + Math.abs(H.get(m + 1, m + 1))))) {
              break;
            }
            m--;
          }
          for (i = m + 2; i <= n; i++) {
            H.set(i, i - 2, 0);
            if (i > m + 2) {
              H.set(i, i - 3, 0);
            }
          }
          for (k = m; k <= n - 1; k++) {
            notlast = k !== n - 1;
            if (k !== m) {
              p = H.get(k, k - 1);
              q = H.get(k + 1, k - 1);
              r = notlast ? H.get(k + 2, k - 1) : 0;
              x = Math.abs(p) + Math.abs(q) + Math.abs(r);
              if (x !== 0) {
                p = p / x;
                q = q / x;
                r = r / x;
              }
            }
            if (x === 0) {
              break;
            }
            s = Math.sqrt(p * p + q * q + r * r);
            if (p < 0) {
              s = -s;
            }
            if (s !== 0) {
              if (k !== m) {
                H.set(k, k - 1, -s * x);
              } else if (l !== m) {
                H.set(k, k - 1, -H.get(k, k - 1));
              }
              p = p + s;
              x = p / s;
              y = q / s;
              z = r / s;
              q = q / p;
              r = r / p;
              for (j = k; j < nn; j++) {
                p = H.get(k, j) + q * H.get(k + 1, j);
                if (notlast) {
                  p = p + r * H.get(k + 2, j);
                  H.set(k + 2, j, H.get(k + 2, j) - p * z);
                }
                H.set(k, j, H.get(k, j) - p * x);
                H.set(k + 1, j, H.get(k + 1, j) - p * y);
              }
              for (i = 0; i <= Math.min(n, k + 3); i++) {
                p = x * H.get(i, k) + y * H.get(i, k + 1);
                if (notlast) {
                  p = p + z * H.get(i, k + 2);
                  H.set(i, k + 2, H.get(i, k + 2) - p * r);
                }
                H.set(i, k, H.get(i, k) - p);
                H.set(i, k + 1, H.get(i, k + 1) - p * q);
              }
              for (i = low; i <= high; i++) {
                p = x * V.get(i, k) + y * V.get(i, k + 1);
                if (notlast) {
                  p = p + z * V.get(i, k + 2);
                  V.set(i, k + 2, V.get(i, k + 2) - p * r);
                }
                V.set(i, k, V.get(i, k) - p);
                V.set(i, k + 1, V.get(i, k + 1) - p * q);
              }
            }
          }
        }
      }
      if (norm === 0) {
        return;
      }
      for (n = nn - 1; n >= 0; n--) {
        p = d[n];
        q = e[n];
        if (q === 0) {
          l = n;
          H.set(n, n, 1);
          for (i = n - 1; i >= 0; i--) {
            w = H.get(i, i) - p;
            r = 0;
            for (j = l; j <= n; j++) {
              r = r + H.get(i, j) * H.get(j, n);
            }
            if (e[i] < 0) {
              z = w;
              s = r;
            } else {
              l = i;
              if (e[i] === 0) {
                H.set(i, n, w !== 0 ? -r / w : -r / (eps * norm));
              } else {
                x = H.get(i, i + 1);
                y = H.get(i + 1, i);
                q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
                t = (x * s - z * r) / q;
                H.set(i, n, t);
                H.set(i + 1, n, Math.abs(x) > Math.abs(z) ? (-r - w * t) / x : (-s - y * t) / z);
              }
              t = Math.abs(H.get(i, n));
              if (eps * t * t > 1) {
                for (j = i; j <= n; j++) {
                  H.set(j, n, H.get(j, n) / t);
                }
              }
            }
          }
        } else if (q < 0) {
          l = n - 1;
          if (Math.abs(H.get(n, n - 1)) > Math.abs(H.get(n - 1, n))) {
            H.set(n - 1, n - 1, q / H.get(n, n - 1));
            H.set(n - 1, n, -(H.get(n, n) - p) / H.get(n, n - 1));
          } else {
            cdivres = cdiv(0, -H.get(n - 1, n), H.get(n - 1, n - 1) - p, q);
            H.set(n - 1, n - 1, cdivres[0]);
            H.set(n - 1, n, cdivres[1]);
          }
          H.set(n, n - 1, 0);
          H.set(n, n, 1);
          for (i = n - 2; i >= 0; i--) {
            ra = 0;
            sa = 0;
            for (j = l; j <= n; j++) {
              ra = ra + H.get(i, j) * H.get(j, n - 1);
              sa = sa + H.get(i, j) * H.get(j, n);
            }
            w = H.get(i, i) - p;
            if (e[i] < 0) {
              z = w;
              r = ra;
              s = sa;
            } else {
              l = i;
              if (e[i] === 0) {
                cdivres = cdiv(-ra, -sa, w, q);
                H.set(i, n - 1, cdivres[0]);
                H.set(i, n, cdivres[1]);
              } else {
                x = H.get(i, i + 1);
                y = H.get(i + 1, i);
                vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
                vi = (d[i] - p) * 2 * q;
                if (vr === 0 && vi === 0) {
                  vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
                }
                cdivres = cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi);
                H.set(i, n - 1, cdivres[0]);
                H.set(i, n, cdivres[1]);
                if (Math.abs(x) > Math.abs(z) + Math.abs(q)) {
                  H.set(i + 1, n - 1, (-ra - w * H.get(i, n - 1) + q * H.get(i, n)) / x);
                  H.set(i + 1, n, (-sa - w * H.get(i, n) - q * H.get(i, n - 1)) / x);
                } else {
                  cdivres = cdiv(-r - y * H.get(i, n - 1), -s - y * H.get(i, n), z, q);
                  H.set(i + 1, n - 1, cdivres[0]);
                  H.set(i + 1, n, cdivres[1]);
                }
              }
              t = Math.max(Math.abs(H.get(i, n - 1)), Math.abs(H.get(i, n)));
              if (eps * t * t > 1) {
                for (j = i; j <= n; j++) {
                  H.set(j, n - 1, H.get(j, n - 1) / t);
                  H.set(j, n, H.get(j, n) / t);
                }
              }
            }
          }
        }
      }
      for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
          for (j = i; j < nn; j++) {
            V.set(i, j, H.get(i, j));
          }
        }
      }
      for (j = nn - 1; j >= low; j--) {
        for (i = low; i <= high; i++) {
          z = 0;
          for (k = low; k <= Math.min(j, high); k++) {
            z = z + V.get(i, k) * H.get(k, j);
          }
          V.set(i, j, z);
        }
      }
    }
    function cdiv(xr, xi, yr, yi) {
      let r, d;
      if (Math.abs(yr) > Math.abs(yi)) {
        r = yi / yr;
        d = yr + r * yi;
        return [(xr + r * xi) / d, (xi - r * xr) / d];
      } else {
        r = yr / yi;
        d = yi + r * yr;
        return [(r * xr + xi) / d, (r * xi - xr) / d];
      }
    }
    class CholeskyDecomposition {
      constructor(value) {
        value = WrapperMatrix2D.checkMatrix(value);
        if (!value.isSymmetric()) {
          throw new Error('Matrix is not symmetric');
        }
        let a = value;
        let dimension = a.rows;
        let l = new Matrix$2(dimension, dimension);
        let positiveDefinite = true;
        let i, j, k;
        for (j = 0; j < dimension; j++) {
          let d = 0;
          for (k = 0; k < j; k++) {
            let s = 0;
            for (i = 0; i < k; i++) {
              s += l.get(k, i) * l.get(j, i);
            }
            s = (a.get(j, k) - s) / l.get(k, k);
            l.set(j, k, s);
            d = d + s * s;
          }
          d = a.get(j, j) - d;
          positiveDefinite &&= d > 0;
          l.set(j, j, Math.sqrt(Math.max(d, 0)));
          for (k = j + 1; k < dimension; k++) {
            l.set(j, k, 0);
          }
        }
        this.L = l;
        this.positiveDefinite = positiveDefinite;
      }
      isPositiveDefinite() {
        return this.positiveDefinite;
      }
      solve(value) {
        value = WrapperMatrix2D.checkMatrix(value);
        let l = this.L;
        let dimension = l.rows;
        if (value.rows !== dimension) {
          throw new Error('Matrix dimensions do not match');
        }
        if (this.isPositiveDefinite() === false) {
          throw new Error('Matrix is not positive definite');
        }
        let count = value.columns;
        let B = value.clone();
        let i, j, k;
        for (k = 0; k < dimension; k++) {
          for (j = 0; j < count; j++) {
            for (i = 0; i < k; i++) {
              B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(k, i));
            }
            B.set(k, j, B.get(k, j) / l.get(k, k));
          }
        }
        for (k = dimension - 1; k >= 0; k--) {
          for (j = 0; j < count; j++) {
            for (i = k + 1; i < dimension; i++) {
              B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(i, k));
            }
            B.set(k, j, B.get(k, j) / l.get(k, k));
          }
        }
        return B;
      }
      get lowerTriangularMatrix() {
        return this.L;
      }
    }
    class nipals {
      constructor(X, options = {}) {
        X = WrapperMatrix2D.checkMatrix(X);
        let {
          Y
        } = options;
        const {
          scaleScores = false,
          maxIterations = 1000,
          terminationCriteria = 1e-10
        } = options;
        let u;
        if (Y) {
          if (isAnyArray.isAnyArray(Y) && typeof Y[0] === 'number') {
            Y = Matrix$2.columnVector(Y);
          } else {
            Y = WrapperMatrix2D.checkMatrix(Y);
          }
          if (Y.rows !== X.rows) {
            throw new Error('Y should have the same number of rows as X');
          }
          u = Y.getColumnVector(0);
        } else {
          u = X.getColumnVector(0);
        }
        let diff = 1;
        let t, q, w, tOld;
        for (let counter = 0; counter < maxIterations && diff > terminationCriteria; counter++) {
          w = X.transpose().mmul(u).div(u.transpose().mmul(u).get(0, 0));
          w = w.div(w.norm());
          t = X.mmul(w).div(w.transpose().mmul(w).get(0, 0));
          if (counter > 0) {
            diff = t.clone().sub(tOld).pow(2).sum();
          }
          tOld = t.clone();
          if (Y) {
            q = Y.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
            q = q.div(q.norm());
            u = Y.mmul(q).div(q.transpose().mmul(q).get(0, 0));
          } else {
            u = t;
          }
        }
        if (Y) {
          let p = X.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
          p = p.div(p.norm());
          let xResidual = X.clone().sub(t.clone().mmul(p.transpose()));
          let residual = u.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
          let yResidual = Y.clone().sub(t.clone().mulS(residual.get(0, 0)).mmul(q.transpose()));
          this.t = t;
          this.p = p.transpose();
          this.w = w.transpose();
          this.q = q;
          this.u = u;
          this.s = t.transpose().mmul(t);
          this.xResidual = xResidual;
          this.yResidual = yResidual;
          this.betas = residual;
        } else {
          this.w = w.transpose();
          this.s = t.transpose().mmul(t).sqrt();
          if (scaleScores) {
            this.t = t.clone().div(this.s.get(0, 0));
          } else {
            this.t = t;
          }
          this.xResidual = X.sub(t.mmul(w.transpose()));
        }
      }
    }
    matrix.AbstractMatrix = AbstractMatrix;
    matrix.CHO = CholeskyDecomposition;
    matrix.CholeskyDecomposition = CholeskyDecomposition;
    matrix.DistanceMatrix = DistanceMatrix;
    matrix.EVD = EigenvalueDecomposition;
    matrix.EigenvalueDecomposition = EigenvalueDecomposition;
    matrix.LU = LuDecomposition;
    matrix.LuDecomposition = LuDecomposition;
    var Matrix_1 = matrix.Matrix = Matrix$2;
    matrix.MatrixColumnSelectionView = MatrixColumnSelectionView;
    matrix.MatrixColumnView = MatrixColumnView;
    matrix.MatrixFlipColumnView = MatrixFlipColumnView;
    matrix.MatrixFlipRowView = MatrixFlipRowView;
    matrix.MatrixRowSelectionView = MatrixRowSelectionView;
    matrix.MatrixRowView = MatrixRowView;
    matrix.MatrixSelectionView = MatrixSelectionView;
    matrix.MatrixSubView = MatrixSubView;
    var MatrixTransposeView_1 = matrix.MatrixTransposeView = MatrixTransposeView$2;
    matrix.NIPALS = nipals;
    matrix.Nipals = nipals;
    matrix.QR = QrDecomposition;
    matrix.QrDecomposition = QrDecomposition;
    var SVD$1 = matrix.SVD = SingularValueDecomposition;
    matrix.SingularValueDecomposition = SingularValueDecomposition;
    matrix.SymmetricMatrix = SymmetricMatrix;
    matrix.WrapperMatrix1D = WrapperMatrix1D;
    matrix.WrapperMatrix2D = WrapperMatrix2D;
    matrix.correlation = correlation;
    matrix.covariance = covariance;
    var _default = matrix.default = Matrix$2;
    matrix.determinant = determinant;
    matrix.inverse = inverse;
    matrix.linearDependencies = linearDependencies;
    var pseudoInverse_1 = matrix.pseudoInverse = pseudoInverse$1;
    var solve_1 = matrix.solve = solve$1;
    matrix.wrap = wrap;

    const Matrix$1 = Matrix_1;
    const MatrixTransposeView$1 = MatrixTransposeView_1;
    const SVD = SVD$1;
    _default.Matrix ? _default.Matrix : Matrix_1;
    const pseudoInverse = pseudoInverse_1;
    const solve = solve_1;

    class PolynomialRegression extends BaseRegression {
      /**
       * @param x - independent or explanatory variable
       * @param y - dependent or response variable
       * @param degree - degree of the polynomial regression, or array of powers to be used. When degree is an array, intercept at zero is forced to false/ignored.
       * @example `new PolynomialRegression(x, y, 2)`, in this case, you can pass the option `interceptAtZero`, if you need it.
       * @example `new PolynomialRegression(x, y, [1, 3, 5])`
       * Each of the degrees corresponds to a column, so if you have them switched, just do:
       * @example `new PolynomialRegression(x, y, [3, 1, 5])`
       *
       * @param options.interceptAtZero - force the polynomial regression so that f(0) = 0
       */
      constructor(x, y, degree, options = {}) {
        super();
        // @ts-expect-error internal use only
        if (x === true) {
          // @ts-expect-error internal use only
          this.degree = y.degree;
          // @ts-expect-error internal use only
          this.powers = y.powers;
          // @ts-expect-error internal use only
          this.coefficients = y.coefficients;
        } else {
          checkArrayLength(x, y);
          const result = regress$3(x, y, degree, options);
          this.degree = result.degree;
          this.powers = result.powers;
          this.coefficients = result.coefficients;
        }
      }
      _predict(x) {
        let y = 0;
        for (let k = 0; k < this.powers.length; k++) {
          y += this.coefficients[k] * x ** this.powers[k];
        }
        return y;
      }
      toJSON() {
        return {
          name: 'polynomialRegression',
          degree: this.degree,
          powers: this.powers,
          coefficients: this.coefficients
        };
      }
      toString(precision) {
        return this._toFormula(precision, false);
      }
      toLaTeX(precision) {
        return this._toFormula(precision, true);
      }
      _toFormula(precision, isLaTeX) {
        let sup = '^';
        let closeSup = '';
        let times = ' * ';
        if (isLaTeX) {
          sup = '^{';
          closeSup = '}';
          times = '';
        }
        let fn = '';
        let str = '';
        for (let k = 0; k < this.coefficients.length; k++) {
          str = '';
          if (this.coefficients[k] !== 0) {
            if (this.powers[k] === 0) {
              str = maybeToPrecision(this.coefficients[k], precision);
            } else if (this.powers[k] === 1) {
              str = `${maybeToPrecision(this.coefficients[k], precision) + times}x`;
            } else {
              str = `${maybeToPrecision(this.coefficients[k], precision) + times}x${sup}${this.powers[k]}${closeSup}`;
            }
            if (this.coefficients[k] > 0 && k !== this.coefficients.length - 1) {
              str = ` + ${str}`;
            } else if (k !== this.coefficients.length - 1) {
              str = ` ${str}`;
            }
          }
          fn = str + fn;
        }
        if (fn.startsWith('+')) {
          fn = fn.slice(1);
        }
        return `f(x) = ${fn}`;
      }
      static load(json) {
        if (json.name !== 'polynomialRegression') {
          throw new TypeError('not a polynomial regression model');
        }
        // @ts-expect-error internal use only
        return new PolynomialRegression(true, json);
      }
    }
    /**
     * Perform a polynomial regression on the given data set.
     * This is an internal function.
     * @param x - independent or explanatory variable
     * @param y - dependent or response variable
     * @param degree - degree of the polynomial regression
     * @param options.interceptAtZero - force the polynomial regression so that $f(0) = 0$
     */
    function regress$3(x, y, degree, options = {}) {
      const n = x.length;
      let {
        interceptAtZero = false
      } = options;
      let powers = [];
      if (Array.isArray(degree)) {
        powers = degree;
        interceptAtZero = false; //must be false in this case
      } else if (typeof degree === 'number') {
        if (interceptAtZero) {
          powers = new Array(degree);
          for (let k = 0; k < degree; k++) {
            powers[k] = k + 1;
          }
        } else {
          powers = new Array(degree + 1);
          for (let k = 0; k <= degree; k++) {
            powers[k] = k;
          }
        }
      }
      const nCoefficients = powers.length; //1 per power, in any case.
      const F = new Matrix$1(n, nCoefficients);
      const Y = new Matrix$1([y]);
      for (let k = 0; k < nCoefficients; k++) {
        for (let i = 0; i < n; i++) {
          if (powers[k] === 0) {
            F.set(i, k, 1);
          } else {
            F.set(i, k, x[i] ** powers[k]);
          }
        }
      }
      const FT = new MatrixTransposeView$1(F);
      const A = FT.mmul(F);
      const B = FT.mmul(new MatrixTransposeView$1(Y));
      return {
        coefficients: solve(A, B).to1DArray(),
        degree: Math.max(...powers),
        powers
      };
    }

    /*
     * Function that calculate the potential fit in the form f(x) = A*x^M
     * with a given M and return de A coefficient.
     *
     * @param {Vector} X - Vector of the x positions of the points.
     * @param {Vector} Y - Vector of the x positions of the points.
     * @param {Number} M - The exponent of the potential fit.
     * @return {Number} A - The A coefficient of the potential fit.
     */
    class PotentialRegression extends BaseRegression {
      /**
       * @class
       * @param x - Independent variable
       * @param y - Dependent variable
       * @param M
       */
      constructor(x, y, M) {
        super();
        if (x === true) {
          // reloading model
          this.A = y.A;
          this.M = y.M;
        } else {
          let n = x.length;
          if (n !== y.length) {
            throw new RangeError("input and output array have a different length");
          }
          let linear = new PolynomialRegression(x, y, [M]);
          this.A = linear.coefficients[0];
          this.M = M;
        }
      }
      _predict(x) {
        return this.A * x ** this.M;
      }
      toJSON() {
        return {
          name: "potentialRegression",
          A: this.A,
          M: this.M
        };
      }
      toString(precision) {
        return `f(x) = ${maybeToPrecision(this.A, precision)} * x^${this.M}`;
      }
      toLaTeX(precision) {
        if (this.M >= 0) {
          return `f(x) = ${maybeToPrecision(this.A, precision)}x^{${this.M}}`;
        } else {
          return `f(x) = \\frac{${maybeToPrecision(this.A, precision)}}{x^{${-this.M}}}`;
        }
      }
      static load(json) {
        if (json.name !== "potentialRegression") {
          throw new TypeError("not a potential regression model");
        }
        return new PotentialRegression(true, json);
      }
    }

    /**
     * Class representing simple linear regression.
     * The regression uses OLS to calculate intercept and slope.
     */
    class SimpleLinearRegression extends BaseRegression {
      /**
       * @param x - explanatory variable
       * @param y - response variable
       */
      constructor(x, y) {
        super();
        // @ts-expect-error internal use of the constructor, from `this.load`
        if (x === true) {
          // @ts-expect-error internal use of the constructor, from `this.load`
          const yObj = y;
          this.slope = yObj.slope;
          this.intercept = yObj.intercept;
          this.coefficients = [yObj.intercept, yObj.slope];
        } else {
          checkArrayLength(x, y);
          const result = regress$2(x, y);
          this.slope = result.slope;
          this.intercept = result.intercept;
          this.coefficients = [result.intercept, result.slope];
        }
      }
      /**
       * Get the parameters and model name in JSON format
       * @returns
       */
      toJSON() {
        return {
          name: 'simpleLinearRegression',
          slope: this.slope,
          intercept: this.intercept
        };
      }
      _predict(x) {
        return this.slope * x + this.intercept;
      }
      /**
       * Finds x for the given y value.
       * @param y - response variable value
       * @returns - x value
       */
      computeX(y) {
        return (y - this.intercept) / this.slope;
      }
      /**
       * Strings the linear function in the form 'f(x) = ax + b'
       * @param precision - number of significant figures.
       * @returns
       */
      toString(precision) {
        let result = 'f(x) = ';
        if (this.slope !== 0) {
          const xFactor = maybeToPrecision(this.slope, precision);
          result += `${xFactor === '1' ? '' : `${xFactor} * `}x`;
          if (this.intercept !== 0) {
            const absIntercept = Math.abs(this.intercept);
            const operator = absIntercept === this.intercept ? '+' : '-';
            result += ` ${operator} ${maybeToPrecision(absIntercept, precision)}`;
          }
        } else {
          result += maybeToPrecision(this.intercept, precision);
        }
        return result;
      }
      /**
       * Strings the linear function in the form 'f(x) = ax + b'
       * @param precision - number of significant figures.
       * @returns
       */
      toLaTeX(precision) {
        return this.toString(precision);
      }
      /**
       * Class instance from a JSON Object.
       * @param json
       * @returns
       */
      static load(json) {
        if (json.name !== 'simpleLinearRegression') {
          throw new TypeError('not a SLR model');
        }
        // @ts-expect-error internal use of the constructor
        return new SimpleLinearRegression(true, json);
      }
    }
    /**
     * Internal  function.
     * It determines the parameters (slope, intercept) of the line that best fit the `x,y` vector-data (simple linear regression).
     * @param x - explanatory variable
     * @param y - response variable
     * @returns - slope and intercept of the best fit line
     */
    function regress$2(x, y) {
      const n = x.length;
      let xSum = 0;
      let ySum = 0;
      let xSquared = 0;
      let xY = 0;
      for (let i = 0; i < n; i++) {
        xSum += x[i];
        ySum += y[i];
        xSquared += x[i] * x[i];
        xY += x[i] * y[i];
      }
      const numerator = n * xY - xSum * ySum;
      const slope = numerator / (n * xSquared - xSum * xSum);
      return {
        slope,
        intercept: 1 / n * ySum - slope * (1 / n) * xSum
      };
    }

    class ExponentialRegression extends BaseRegression {
      constructor(x, y) {
        super();
        if (x === true) {
          this.A = y.A;
          this.B = y.B;
        } else {
          checkArrayLength(x, y);
          regress$1(this, x, y);
        }
      }
      _predict(input) {
        return this.B * Math.exp(input * this.A);
      }
      toJSON() {
        return {
          name: 'exponentialRegression',
          A: this.A,
          B: this.B
        };
      }
      toString(precision) {
        return `f(x) = ${maybeToPrecision(this.B, precision)} * e^(${maybeToPrecision(this.A, precision)} * x)`;
      }
      toLaTeX(precision) {
        if (this.A >= 0) {
          return `f(x) = ${maybeToPrecision(this.B, precision)}e^{${maybeToPrecision(this.A, precision)}x}`;
        } else {
          return `f(x) = \\frac{${maybeToPrecision(this.B, precision)}}{e^{${maybeToPrecision(-this.A, precision)}x}}`;
        }
      }
      static load(json) {
        if (json.name !== 'exponentialRegression') {
          throw new TypeError('not a exponential regression model');
        }
        return new ExponentialRegression(true, json);
      }
    }
    function regress$1(er, x, y) {
      const n = x.length;
      const yl = new Array(n);
      for (let i = 0; i < n; i++) {
        yl[i] = Math.log(y[i]);
      }
      const linear = new SimpleLinearRegression(x, yl);
      er.A = linear.slope;
      er.B = Math.exp(linear.intercept);
    }

    class PowerRegression extends BaseRegression {
      constructor(x, y) {
        super();
        if (x === true) {
          // reloading model
          this.A = y.A;
          this.B = y.B;
        } else {
          checkArrayLength(x, y);
          regress(this, x, y);
        }
      }
      _predict(newInputs) {
        return this.A * newInputs ** this.B;
      }
      toJSON() {
        return {
          name: 'powerRegression',
          A: this.A,
          B: this.B
        };
      }
      toString(precision) {
        return `f(x) = ${maybeToPrecision(this.A, precision)} * x^${maybeToPrecision(this.B, precision)}`;
      }
      toLaTeX(precision) {
        let latex = '';
        if (this.B >= 0) {
          latex = `f(x) = ${maybeToPrecision(this.A, precision)}x^{${maybeToPrecision(this.B, precision)}}`;
        } else {
          latex = `f(x) = \\frac{${maybeToPrecision(this.A, precision)}}{x^{${maybeToPrecision(-this.B, precision)}}}`;
        }
        latex = latex.replace(/e([+-]?[0-9]+)/g, 'e^{$1}');
        return latex;
      }
      static load(json) {
        if (json.name !== 'powerRegression') {
          throw new TypeError('not a power regression model');
        }
        return new PowerRegression(true, json);
      }
    }
    function regress(pr, x, y) {
      const n = x.length;
      const xl = new Array(n);
      const yl = new Array(n);
      for (let i = 0; i < n; i++) {
        xl[i] = Math.log(x[i]);
        yl[i] = Math.log(y[i]);
      }
      const linear = new SimpleLinearRegression(xl, yl);
      pr.A = Math.exp(linear.intercept);
      pr.B = linear.slope;
    }

    class MultivariateLinearRegression {
      constructor(x, y, options = {}) {
        const {
          intercept = true,
          statistics = true
        } = options;
        this.statistics = statistics;
        if (x === true) {
          this.weights = y.weights;
          this.inputs = y.inputs;
          this.outputs = y.outputs;
          this.intercept = y.intercept;
        } else {
          x = new Matrix$1(x);
          y = new Matrix$1(y);
          if (intercept) {
            x.addColumn(new Array(x.rows).fill(1));
          }
          let xt = x.transpose();
          const xx = xt.mmul(x);
          const xy = xt.mmul(y);
          const invxx = new SVD(xx).inverse();
          const beta = xy.transpose().mmul(invxx).transpose();
          this.weights = beta.to2DArray();
          this.inputs = x.columns;
          this.outputs = y.columns;
          if (intercept) this.inputs--;
          this.intercept = intercept;
          if (statistics) {
            /*
             * Let's add some basic statistics about the beta's to be able to interpret them.
             * source: http://dept.stat.lsa.umich.edu/~kshedden/Courses/Stat401/Notes/401-multreg.pdf
             * validated against Excel Regression AddIn
             * test: "datamining statistics test"
             */
            const fittedValues = x.mmul(beta);
            const residuals = y.clone().addM(fittedValues.neg());
            const variance = residuals.to2DArray().map(ri => Math.pow(ri[0], 2)).reduce((a, b) => a + b) / (y.rows - x.columns);
            this.stdError = Math.sqrt(variance);
            this.stdErrorMatrix = pseudoInverse(xx).mul(variance);
            this.stdErrors = this.stdErrorMatrix.diagonal().map(d => Math.sqrt(d));
            this.tStats = this.weights.map((d, i) => this.stdErrors[i] === 0 ? 0 : d[0] / this.stdErrors[i]);
          }
        }
      }
      predict(x) {
        if (Array.isArray(x)) {
          if (typeof x[0] === 'number') {
            return this._predict(x);
          } else if (Array.isArray(x[0])) {
            const y = new Array(x.length);
            for (let i = 0; i < x.length; i++) {
              y[i] = this._predict(x[i]);
            }
            return y;
          }
        } else if (Matrix$1.isMatrix(x)) {
          const y = new Matrix$1(x.rows, this.outputs);
          for (let i = 0; i < x.rows; i++) {
            y.setRow(i, this._predict(x.getRow(i)));
          }
          return y;
        }
        throw new TypeError('x must be a matrix or array of numbers');
      }
      _predict(x) {
        const result = new Array(this.outputs);
        if (this.intercept) {
          for (let i = 0; i < this.outputs; i++) {
            result[i] = this.weights[this.inputs][i];
          }
        } else {
          result.fill(0);
        }
        for (let i = 0; i < this.inputs; i++) {
          for (let j = 0; j < this.outputs; j++) {
            result[j] += this.weights[i][j] * x[i];
          }
        }
        return result;
      }
      score() {
        throw new Error('score method is not implemented yet');
      }
      toJSON() {
        return {
          name: 'multivariateLinearRegression',
          weights: this.weights,
          inputs: this.inputs,
          outputs: this.outputs,
          intercept: this.intercept,
          summary: this.statistics ? {
            regressionStatistics: {
              standardError: this.stdError,
              observations: this.outputs
            },
            variables: this.weights.map((d, i) => {
              return {
                label: i === this.weights.length - 1 ? 'Intercept' : `X Variable ${i + 1}`,
                coefficients: d,
                standardError: this.stdErrors[i],
                tStat: this.tStats[i]
              };
            })
          } : undefined
        };
      }
      static load(model) {
        if (model.name !== 'multivariateLinearRegression') {
          throw new Error('not a MLR model');
        }
        return new MultivariateLinearRegression(true, model);
      }
    }

    function squaredEuclidean$4(p, q) {
      let d = 0;
      for (let i = 0; i < p.length; i++) {
        d += (p[i] - q[i]) * (p[i] - q[i]);
      }
      return d;
    }
    function euclidean$2(p, q) {
      return Math.sqrt(squaredEuclidean$4(p, q));
    }

    var euclidean$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        euclidean: euclidean$2,
        squaredEuclidean: squaredEuclidean$4
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(euclidean$3);

    const {
      squaredEuclidean: squaredEuclidean$3
    } = require$$0;
    const defaultOptions$a = {
      sigma: 1
    };
    let GaussianKernel$1 = class GaussianKernel {
      constructor(options) {
        options = Object.assign({}, defaultOptions$a, options);
        this.sigma = options.sigma;
        this.divisor = 2 * options.sigma * options.sigma;
      }
      compute(x, y) {
        const distance = squaredEuclidean$3(x, y);
        return Math.exp(-distance / this.divisor);
      }
    };
    var gaussianKernel = GaussianKernel$1;

    const defaultOptions$9 = {
      degree: 1,
      constant: 1,
      scale: 1
    };
    let PolynomialKernel$1 = class PolynomialKernel {
      constructor(options) {
        options = Object.assign({}, defaultOptions$9, options);
        this.degree = options.degree;
        this.constant = options.constant;
        this.scale = options.scale;
      }
      compute(x, y) {
        var sum = 0;
        for (var i = 0; i < x.length; i++) {
          sum += x[i] * y[i];
        }
        return Math.pow(this.scale * sum + this.constant, this.degree);
      }
    };
    var polynomialKernel = PolynomialKernel$1;

    const defaultOptions$8 = {
      alpha: 0.01,
      constant: -Math.E
    };
    let SigmoidKernel$1 = class SigmoidKernel {
      constructor(options) {
        options = Object.assign({}, defaultOptions$8, options);
        this.alpha = options.alpha;
        this.constant = options.constant;
      }
      compute(x, y) {
        var sum = 0;
        for (var i = 0; i < x.length; i++) {
          sum += x[i] * y[i];
        }
        return Math.tanh(this.alpha * sum + this.constant);
      }
    };
    var sigmoidKernel = SigmoidKernel$1;

    const defaultOptions$7 = {
      sigma: 1,
      degree: 1
    };
    let ANOVAKernel$1 = class ANOVAKernel {
      constructor(options) {
        options = Object.assign({}, defaultOptions$7, options);
        this.sigma = options.sigma;
        this.degree = options.degree;
      }
      compute(x, y) {
        var sum = 0;
        var len = Math.min(x.length, y.length);
        for (var i = 1; i <= len; ++i) {
          sum += Math.pow(Math.exp(-this.sigma * Math.pow(Math.pow(x[i - 1], i) - Math.pow(y[i - 1], i), 2)), this.degree);
        }
        return sum;
      }
    };
    var anovaKernel = ANOVAKernel$1;

    const {
      squaredEuclidean: squaredEuclidean$2
    } = require$$0;
    const defaultOptions$6 = {
      sigma: 1
    };
    let CauchyKernel$1 = class CauchyKernel {
      constructor(options) {
        options = Object.assign({}, defaultOptions$6, options);
        this.sigma = options.sigma;
      }
      compute(x, y) {
        return 1 / (1 + squaredEuclidean$2(x, y) / (this.sigma * this.sigma));
      }
    };
    var cauchyKernel = CauchyKernel$1;

    const {
      euclidean: euclidean$1
    } = require$$0;
    const defaultOptions$5 = {
      sigma: 1
    };
    let ExponentialKernel$1 = class ExponentialKernel {
      constructor(options) {
        options = Object.assign({}, defaultOptions$5, options);
        this.sigma = options.sigma;
        this.divisor = 2 * options.sigma * options.sigma;
      }
      compute(x, y) {
        const distance = euclidean$1(x, y);
        return Math.exp(-distance / this.divisor);
      }
    };
    var exponentialKernel = ExponentialKernel$1;

    class HistogramIntersectionKernel {
      compute(x, y) {
        var min = Math.min(x.length, y.length);
        var sum = 0;
        for (var i = 0; i < min; ++i) {
          sum += Math.min(x[i], y[i]);
        }
        return sum;
      }
    }
    var histogramIntersectionKernel = HistogramIntersectionKernel;

    const {
      euclidean
    } = require$$0;
    const defaultOptions$4 = {
      sigma: 1
    };
    let LaplacianKernel$1 = class LaplacianKernel {
      constructor(options) {
        options = Object.assign({}, defaultOptions$4, options);
        this.sigma = options.sigma;
      }
      compute(x, y) {
        const distance = euclidean(x, y);
        return Math.exp(-distance / this.sigma);
      }
    };
    var laplacianKernel = LaplacianKernel$1;

    const {
      squaredEuclidean: squaredEuclidean$1
    } = require$$0;
    const defaultOptions$3 = {
      constant: 1
    };
    let MultiquadraticKernel$1 = class MultiquadraticKernel {
      constructor(options) {
        options = Object.assign({}, defaultOptions$3, options);
        this.constant = options.constant;
      }
      compute(x, y) {
        return Math.sqrt(squaredEuclidean$1(x, y) + this.constant * this.constant);
      }
    };
    var multiquadraticKernel = MultiquadraticKernel$1;

    const {
      squaredEuclidean
    } = require$$0;
    const defaultOptions$2 = {
      constant: 1
    };
    class RationalQuadraticKernel {
      constructor(options) {
        options = Object.assign({}, defaultOptions$2, options);
        this.constant = options.constant;
      }
      compute(x, y) {
        const distance = squaredEuclidean(x, y);
        return 1 - distance / (distance + this.constant);
      }
    }
    var rationalQuadraticKernel = RationalQuadraticKernel;

    const {
      Matrix,
      MatrixTransposeView
    } = matrix;
    const GaussianKernel = gaussianKernel;
    const PolynomialKernel = polynomialKernel;
    const SigmoidKernel = sigmoidKernel;
    const ANOVAKernel = anovaKernel;
    const CauchyKernel = cauchyKernel;
    const ExponentialKernel = exponentialKernel;
    const HistogramKernel = histogramIntersectionKernel;
    const LaplacianKernel = laplacianKernel;
    const MultiquadraticKernel = multiquadraticKernel;
    const RationalKernel = rationalQuadraticKernel;
    const kernelType = {
      gaussian: GaussianKernel,
      rbf: GaussianKernel,
      polynomial: PolynomialKernel,
      poly: PolynomialKernel,
      anova: ANOVAKernel,
      cauchy: CauchyKernel,
      exponential: ExponentialKernel,
      histogram: HistogramKernel,
      min: HistogramKernel,
      laplacian: LaplacianKernel,
      multiquadratic: MultiquadraticKernel,
      rational: RationalKernel,
      sigmoid: SigmoidKernel,
      mlp: SigmoidKernel
    };
    class Kernel {
      constructor(type, options) {
        this.kernelType = type;
        if (type === 'linear') return;
        if (typeof type === 'string') {
          type = type.toLowerCase();
          var KernelConstructor = kernelType[type];
          if (KernelConstructor) {
            this.kernelFunction = new KernelConstructor(options);
          } else {
            throw new Error(`unsupported kernel type: ${type}`);
          }
        } else if (typeof type === 'object' && typeof type.compute === 'function') {
          this.kernelFunction = type;
        } else {
          throw new TypeError('first argument must be a valid kernel type or instance');
        }
      }
      compute(inputs, landmarks) {
        inputs = Matrix.checkMatrix(inputs);
        if (landmarks === undefined) {
          landmarks = inputs;
        } else {
          landmarks = Matrix.checkMatrix(landmarks);
        }
        if (this.kernelType === 'linear') {
          return inputs.mmul(new MatrixTransposeView(landmarks));
        }
        const kernelMatrix = new Matrix(inputs.rows, landmarks.rows);
        if (inputs === landmarks) {
          // fast path, matrix is symmetric
          for (let i = 0; i < inputs.rows; i++) {
            for (let j = i; j < inputs.rows; j++) {
              const value = this.kernelFunction.compute(inputs.getRow(i), inputs.getRow(j));
              kernelMatrix.set(i, j, value);
              kernelMatrix.set(j, i, value);
            }
          }
        } else {
          for (let i = 0; i < inputs.rows; i++) {
            for (let j = 0; j < landmarks.rows; j++) {
              kernelMatrix.set(i, j, this.kernelFunction.compute(inputs.getRow(i), landmarks.getRow(j)));
            }
          }
        }
        return kernelMatrix;
      }
    }
    var kernel = Kernel;
    var Kernel$1 = /*@__PURE__*/getDefaultExportFromCjs(kernel);

    const defaultOptions$1 = {
      lambda: 0.1,
      kernelType: "gaussian",
      kernelOptions: {},
      computeCoefficient: false
    };

    // Implements the Kernel ridge regression algorithm.
    // http://www.ics.uci.edu/~welling/classnotes/papers_class/Kernel-Ridge.pdf
    class KernelRidgeRegression extends BaseRegression {
      constructor(inputs, outputs, options) {
        super();
        if (inputs === true) {
          // reloading model
          this.alpha = outputs.alpha;
          this.inputs = outputs.inputs;
          this.kernelType = outputs.kernelType;
          this.kernelOptions = outputs.kernelOptions;
          this.kernel = new Kernel$1(outputs.kernelType, outputs.kernelOptions);
        } else {
          inputs = Matrix$1.checkMatrix(inputs);
          options = {
            ...defaultOptions$1,
            ...options
          };
          const kernelFunction = new Kernel$1(options.kernelType, options.kernelOptions);
          const K = kernelFunction.compute(inputs);
          const n = inputs.rows;
          K.add(Matrix$1.eye(n, n).mul(options.lambda));
          this.alpha = solve(K, outputs);
          this.inputs = inputs;
          this.kernelType = options.kernelType;
          this.kernelOptions = options.kernelOptions;
          this.kernel = kernelFunction;
        }
      }
      _predict(newInputs) {
        return this.kernel.compute([newInputs], this.inputs).mmul(this.alpha).getRow(0);
      }
      toJSON() {
        return {
          name: "kernelRidgeRegression",
          alpha: this.alpha,
          inputs: this.inputs,
          kernelType: this.kernelType,
          kernelOptions: this.kernelOptions
        };
      }
      static load(json) {
        if (json.name !== "kernelRidgeRegression") {
          throw new TypeError("not a KRR model");
        }
        return new KernelRidgeRegression(true, json);
      }
    }

    const defaultOptions = {
      order: 2
    };
    // Implements the Kernel ridge regression algorithm.
    // http://www.ics.uci.edu/~welling/classnotes/papers_class/Kernel-Ridge.pdf
    class PolynomialFitRegression2D extends BaseRegression {
      /**
       * Constructor for the 2D polynomial fitting
       * @param inputs
       * @param outputs
       * @param options
       */
      constructor(inputs, outputs, options = {}) {
        super();
        if (inputs === true) {
          // reloading model
          this.coefficients = Matrix$1.columnVector(outputs.coefficients);
          this.order = outputs.order;
          if (outputs.r) {
            this.r = outputs.r;
            this.r2 = outputs.r2;
          }
          if (outputs.chi2) {
            this.chi2 = outputs.chi2;
          }
        } else {
          options = {
            ...defaultOptions,
            ...options
          };
          this.order = options.order;
          this.coefficients = [];
          this.X = inputs;
          this.y = outputs;
          this.train(this.X, this.y, options);
        }
      }

      /**
       * Function that fits the model given the data(X) and predictions(y).
       * The third argument is an object with the following options:
       * order: order of the polynomial to fit.
       * @param {Matrix} X - A matrix with n rows and 2 columns.
       * @param {Matrix} y - A vector of the prediction values.
       */
      train(X, y) {
        if (!Matrix$1.isMatrix(X)) X = new Matrix$1(X);
        if (!Matrix$1.isMatrix(y)) y = Matrix$1.columnVector(y);
        if (y.rows !== X.rows) {
          y = y.transpose();
        }
        if (X.columns !== 2) {
          throw new RangeError(`You give X with ${X.columns} columns and it must be 2`);
        }
        if (X.rows !== y.rows) {
          throw new RangeError("X and y must have the same rows");
        }
        let examples = X.rows;
        let coefficients = (this.order + 2) * (this.order + 1) / 2;
        if (examples < coefficients) {
          throw new Error("Insufficient number of points to create regression model.");
        }
        this.coefficients = new Array(coefficients);
        let x1 = X.getColumnVector(0);
        let x2 = X.getColumnVector(1);
        let scaleX1 = 1 / x1.clone().abs().max();
        let scaleX2 = 1 / x2.clone().abs().max();
        let scaleY = 1 / y.clone().abs().max();
        x1.mulColumn(0, scaleX1);
        x2.mulColumn(0, scaleX2);
        y.mulColumn(0, scaleY);
        let A = new Matrix$1(examples, coefficients);
        let col = 0;
        for (let i = 0; i <= this.order; ++i) {
          let limit = this.order - i;
          for (let j = 0; j <= limit; ++j) {
            let result = powColVector(x1, i).mulColumnVector(powColVector(x2, j));
            A.setColumn(col, result);
            col++;
          }
        }
        let svd = new SVD(A.transpose(), {
          computeLeftSingularVectors: true,
          computeRightSingularVectors: true,
          autoTranspose: false
        });
        let qqs = Matrix$1.rowVector(svd.diagonal);
        qqs = qqs.apply((i, j) => {
          if (qqs.get(i, j) >= 1e-15) qqs.set(i, j, 1 / qqs.get(i, j));else qqs.set(i, j, 0);
        });
        let qqs1 = Matrix$1.zeros(examples, coefficients);
        for (let i = 0; i < coefficients; ++i) {
          qqs1.set(i, i, qqs.get(0, i));
        }
        qqs = qqs1;
        let U = svd.rightSingularVectors;
        let V = svd.leftSingularVectors;
        this.coefficients = V.mmul(qqs.transpose()).mmul(U.transpose()).mmul(y);
        col = 0;
        for (let i = 0; i <= coefficients; ++i) {
          let limit = this.order - i;
          for (let j = 0; j <= limit; ++j) {
            this.coefficients.set(col, 0, this.coefficients.get(col, 0) * scaleX1 ** i * scaleX2 ** j / scaleY);
            col++;
          }
        }
      }
      _predict(newInputs) {
        let x1 = newInputs[0];
        let x2 = newInputs[1];
        let y = 0;
        let column = 0;
        for (let i = 0; i <= this.order; i++) {
          for (let j = 0; j <= this.order - i; j++) {
            y += x1 ** i * x2 ** j * this.coefficients.get(column, 0);
            column++;
          }
        }
        return y;
      }
      toJSON() {
        return {
          name: "polyfit2D",
          order: this.order,
          coefficients: this.coefficients
        };
      }
      static load(json) {
        if (json.name !== "polyfit2D") {
          throw new TypeError("not a polyfit2D model");
        }
        return new PolynomialFitRegression2D(true, json);
      }
    }

    /**
     * Function that given a column vector return this: vector^power
     * @param x - Column vector.
     * @param power - Pow number.
     * @returns {Suite|Matrix}
     */
    function powColVector(x, power) {
      let result = x.clone();
      for (let i = 0; i < x.rows; ++i) {
        result.set(i, 0, result.get(i, 0) ** power);
      }
      return result;
    }

    var medianQuickselect_min = {exports: {}};

    (function (module) {
      (function () {
        function a(d) {
          for (var e = 0, f = d.length - 1, g = void 0, h = void 0, i = void 0, j = c(e, f); true;) {
            if (f <= e) return d[j];
            if (f == e + 1) return d[e] > d[f] && b(d, e, f), d[j];
            for (g = c(e, f), d[g] > d[f] && b(d, g, f), d[e] > d[f] && b(d, e, f), d[g] > d[e] && b(d, g, e), b(d, g, e + 1), h = e + 1, i = f; true;) {
              do h++; while (d[e] > d[h]);
              do i--; while (d[i] > d[e]);
              if (i < h) break;
              b(d, h, i);
            }
            b(d, e, i), i <= j && (e = h), i >= j && (f = i - 1);
          }
        }
        var b = function b(d, e, f) {
            var _ref;
            return _ref = [d[f], d[e]], d[e] = _ref[0], d[f] = _ref[1], _ref;
          },
          c = function c(d, e) {
            return ~~((d + e) / 2);
          };
        module.exports ? module.exports = a : window.median = a;
      })();
    })(medianQuickselect_min);
    var medianQuickselect_minExports = medianQuickselect_min.exports;
    var quickSelectMedian = /*@__PURE__*/getDefaultExportFromCjs(medianQuickselect_minExports);

    function median(input) {
      if (!isAnyArray$1(input)) {
        throw new TypeError('input must be an array');
      }
      if (input.length === 0) {
        throw new TypeError('input must not be empty');
      }
      return quickSelectMedian(input.slice());
    }

    class TheilSenRegression extends BaseRegression {
      /**
       * Theil–Sen estimator
       * https://en.wikipedia.org/wiki/Theil%E2%80%93Sen_estimator
       * @param {Array<number>|boolean} x
       * @param {Array<number>|object} y
       * @constructor
       */
      constructor(x, y) {
        super();
        if (x === true) {
          // loads the model
          this.slope = y.slope;
          this.intercept = y.intercept;
          this.coefficients = y.coefficients;
        } else {
          // creates the model
          checkArrayLength(x, y);
          theilSen(this, x, y);
        }
      }
      toJSON() {
        return {
          name: 'TheilSenRegression',
          slope: this.slope,
          intercept: this.intercept
        };
      }
      _predict(input) {
        return this.slope * input + this.intercept;
      }
      computeX(input) {
        return (input - this.intercept) / this.slope;
      }
      toString(precision) {
        let result = 'f(x) = ';
        if (this.slope) {
          let xFactor = maybeToPrecision(this.slope, precision);
          result += `${Math.abs(xFactor - 1) < 1e-5 ? '' : `${xFactor} * `}x`;
          if (this.intercept) {
            let absIntercept = Math.abs(this.intercept);
            let operator = absIntercept === this.intercept ? '+' : '-';
            result += ` ${operator} ${maybeToPrecision(absIntercept, precision)}`;
          }
        } else {
          result += maybeToPrecision(this.intercept, precision);
        }
        return result;
      }
      toLaTeX(precision) {
        return this.toString(precision);
      }
      static load(json) {
        if (json.name !== 'TheilSenRegression') {
          throw new TypeError('not a Theil-Sen model');
        }
        return new TheilSenRegression(true, json);
      }
    }
    function theilSen(regression, x, y) {
      let len = x.length;
      let slopes = new Array(len * len);
      let count = 0;
      for (let i = 0; i < len; ++i) {
        for (let j = i + 1; j < len; ++j) {
          if (x[i] !== x[j]) {
            slopes[count++] = (y[j] - y[i]) / (x[j] - x[i]);
          }
        }
      }
      slopes.length = count;
      let medianSlope = median(slopes);
      let cuts = new Array(len);
      for (let i = 0; i < len; ++i) {
        cuts[i] = y[i] - medianSlope * x[i];
      }
      regression.slope = medianSlope;
      regression.intercept = median(cuts);
      regression.coefficients = [regression.intercept, regression.slope];
    }

    function predict(x, powers, coefficients) {
      let y = 0;
      for (let k = 0; k < powers.length; k++) {
        y += coefficients[k] * x ** powers[k];
      }
      return y;
    }

    /**
     * @ignore
     * @param tuple
     * @param powers
     * @returns
     */
    function calcCoefficients(tuple, powers) {
      const X = [];
      const Y = [];
      for (let i = 0; i < tuple.length; i++) {
        Y[i] = [tuple[i].y];
        X[i] = new Array(powers.length);
        for (let j = 0; j < powers.length; j++) {
          X[i][j] = tuple[i].x ** powers[j];
        }
      }
      return solve(X, Y).to1DArray();
    }

    /**
     * @ignore
     * @param x
     * @param y
     * @param degree
     * @returns
     */
    function getRandomTuples(x, y, degree) {
      const len = Math.floor(x.length / degree);
      const tuples = new Array(len);
      for (let i = 0; i < x.length; i++) {
        let pos = Math.floor(Math.random() * len);
        let counter = 0;
        while (counter < x.length) {
          if (!tuples[pos]) {
            tuples[pos] = [{
              x: x[i],
              y: y[i]
            }];
            break;
          } else if (tuples[pos].length < degree) {
            tuples[pos].push({
              x: x[i],
              y: y[i]
            });
            break;
          } else {
            counter++;
            pos = (pos + 1) % len;
          }
        }
        if (counter === x.length) {
          return tuples;
        }
      }
      return tuples;
    }

    function residualsMedian(residuals) {
      residuals.sort((a, b) => a.residual - b.residual);
      const l = residuals.length;
      const half = Math.floor(l / 2);
      return l % 2 === 0 ? residuals[half - 1] : residuals[half];
    }

    function robustPolynomial(regression, x, y, degree) {
      const powers = new Array(degree).fill(0).map((_, index) => index);
      const tuples = getRandomTuples(x, y, degree);
      let min;
      for (const tuple of tuples) {
        const coefficients = calcCoefficients(tuple, powers);
        const residuals = [];
        for (let j = 0; j < x.length; j++) {
          const residual = y[j] - predict(x[j], powers, coefficients);
          residuals[j] = {
            residual: residual * residual,
            coefficients
          };
        }
        const median = residualsMedian(residuals);
        if (!min || median.residual < min.residual) {
          min = median;
        }
      }
      regression.degree = degree;
      regression.powers = powers;
      regression.coefficients = min ? min.coefficients : [];
    }

    /**
     * @class RobustPolynomialRegression
     * @param x
     * @param y
     * @param degree - polynomial degree
     */
    class RobustPolynomialRegression extends BaseRegression {
      constructor(x, y, degree) {
        super();
        if (isAnyArray$1(x)) {
          checkArrayLength(x, y);
          robustPolynomial(this, x, y, degree);
        } else {
          const name = 'robustPolynomialRegression';
          const model = x;
          this.degree = model.degree;
          this.powers = model.powers;
          this.coefficients = model.coefficients;
          this.name = name;
        }
      }
      toJSON() {
        return {
          name: this.name,
          degree: this.degree,
          powers: this.powers,
          coefficients: this.coefficients
        };
      }
      _predict(x) {
        return predict(x, this.powers, this.coefficients);
      }
      /**
       * Display the formula
       * @param precision - precision for the numbers
       * @returns
       */
      toString(precision) {
        return this._toFormula(precision, false);
      }
      /**
       * Display the formula in LaTeX format
       * @param precision - precision for the numbers
       * @returns
       */
      toLaTeX(precision) {
        return this._toFormula(precision, true);
      }
      _toFormula(precision, isLaTeX) {
        let sup = '^';
        let closeSup = '';
        let times = ' * ';
        if (isLaTeX) {
          sup = '^{';
          closeSup = '}';
          times = '';
        }
        let fn = '';
        let str = '';
        const coefficients = this.coefficients;
        const powers = this.powers;
        for (let k = 0; k < coefficients.length; k++) {
          str = '';
          if (coefficients[k] !== 0) {
            if (powers[k] === 0) {
              str = maybeToPrecision(coefficients[k], precision);
            } else if (powers[k] === 1) {
              str = `${maybeToPrecision(coefficients[k], precision) + times}x`;
            } else {
              str = `${maybeToPrecision(coefficients[k], precision) + times}x${sup}${powers[k]}${closeSup}`;
            }
            if (coefficients[k] > 0 && k !== coefficients.length - 1) {
              str = ` + ${str}`;
            } else if (k !== coefficients.length - 1) {
              str = ` ${str}`;
            }
          }
          fn = str + fn;
        }
        if (fn.startsWith('+')) {
          fn = fn.slice(1);
        }
        return `f(x) = ${fn}`;
      }
      static load(json) {
        if (json.name !== 'robustPolynomialRegression') {
          throw new TypeError('not a RobustPolynomialRegression model');
        }
        return new RobustPolynomialRegression(json, undefined, undefined);
      }
    }

    const NLR = {
      PotentialRegression
    };

    exports.ExponentialRegression = ExponentialRegression;
    exports.KRR = KernelRidgeRegression;
    exports.KernelRidgeRegression = KernelRidgeRegression;
    exports.MultivariateLinearRegression = MultivariateLinearRegression;
    exports.NLR = NLR;
    exports.NonLinearRegression = NLR;
    exports.PolinomialFitting2D = PolynomialFitRegression2D;
    exports.PolynomialRegression = PolynomialRegression;
    exports.PowerRegression = PowerRegression;
    exports.RobustPolynomialRegression = RobustPolynomialRegression;
    exports.SLR = SimpleLinearRegression;
    exports.SimpleLinearRegression = SimpleLinearRegression;
    exports.TheilSenRegression = TheilSenRegression;

}));
//# sourceMappingURL=ml-regression.js.map
