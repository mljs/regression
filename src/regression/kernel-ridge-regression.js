'use strict';

const matrixLib = require('ml-matrix');
const Matrix = matrixLib.Matrix;
const solve = matrixLib.solve;
const Kernel = require('ml-kernel');

const BaseRegression = require('./base-regression');

const defaultOptions = {
    lambda: 0.1,
    kernelType: 'gaussian',
    kernelOptions: {},
    computeCoefficient: false
};

// Implements the Kernel ridge regression algorithm.
// http://www.ics.uci.edu/~welling/classnotes/papers_class/Kernel-Ridge.pdf
class KernelRidgeRegression extends BaseRegression {
    constructor(inputs, outputs, options) {
        super();
        if (inputs === true) { // reloading model
            this.alpha = outputs.alpha;
            this.inputs = outputs.inputs;
            this.kernelType = outputs.kernelType;
            this.kernelOptions = outputs.kernelOptions;
            this.kernel = new Kernel(outputs.kernelType, outputs.kernelOptions);

            if (outputs.quality) {
                this.quality = outputs.quality;
            }
        } else {
            options = Object.assign({}, defaultOptions, options);

            const kernelFunction = new Kernel(options.kernelType, options.kernelOptions);
            const K = kernelFunction.compute(inputs);
            const n = inputs.length;
            K.add(Matrix.eye(n, n).mul(options.lambda));

            this.alpha = solve(K, outputs);
            this.inputs = inputs;
            this.kernelType = options.kernelType;
            this.kernelOptions = options.kernelOptions;
            this.kernel = kernelFunction;

            if (options.computeQuality) {
                this.quality = this.modelQuality(inputs, outputs);
            }
        }
    }

    _predict(newInputs) {
        return this.kernel.compute([newInputs], this.inputs).mmul(this.alpha)[0];
    }

    toJSON() {
        var out = {
            name: 'kernelRidgeRegression',
            alpha: this.alpha,
            inputs: this.inputs,
            kernelType: this.kernelType,
            kernelOptions: this.kernelOptions
        };
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    static load(json) {
        if (json.name !== 'kernelRidgeRegression') {
            throw new TypeError('not a KRR model');
        }
        return new KernelRidgeRegression(true, json);
    }
}

module.exports = KernelRidgeRegression;
