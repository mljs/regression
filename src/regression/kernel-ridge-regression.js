'use strict';

const Matrix = require('ml-matrix');
const Kernel = require('ml-kernel');

const defaultOptions = {
    lambda: 0.1,
    kernelType: 'gaussian',
    kernelOptions: {}
};

// Implements the Kernel ridge regression algorithm.
// http://www.ics.uci.edu/~welling/classnotes/papers_class/Kernel-Ridge.pdf
class KernelRidgeRegression {
    constructor(inputs, outputs, options) {
        if (inputs === true) { // reloading model
            this.alpha = outputs.alpha;
            this.inputs = outputs.inputs;
            this.kernelType = outputs.kernelType;
            this.kernelOptions = outputs.kernelOptions;
            this.kernel = new Kernel(outputs.kernelType, outputs.kernelOptions);
        } else {
            options = Object.assign({}, defaultOptions, options);

            const kernelFunction = new Kernel(options.kernelType, options.kernelOptions);
            const K = kernelFunction.compute(inputs);
            const n = inputs.length;
            K.add(Matrix.eye(n, n).mul(options.lambda));

            this.alpha = K.solve(outputs);
            this.inputs = inputs;
            this.kernelType = options.kernelType;
            this.kernelOptions = options.kernelOptions;
            this.kernel = kernelFunction;
        }
    }

    predict(newInputs) {
        console.log('new inputs', newInputs);
        console.log('alpha', this.alpha);
        var kernelized = this.kernel.compute(newInputs);
        console.log('kernelized', kernelized);
        return this.kernel.compute(newInputs).mmul(this.alpha);
    }

    toJSON() {
        return {
            name: 'kernelRidgeRegression',
            alpha: this.alpha,
            inputs: this.inputs,
            kernelType: this.kernelType,
            kernelOptions: this.kernelOptions
        };
    }

    static load(json) {
        if (json.name !== 'kernelRidgeRegression') {
            throw new TypeError('not a KRR model');
        }
        return new KernelRidgeRegression(true, json);
    }
}

module.exports = KernelRidgeRegression;
