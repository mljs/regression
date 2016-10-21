'use strict';

class BaseRegression {
    predict(x) {
        var y2;
        if (Array.isArray(x)) {
            y2 = new Array(x.length);
            for (var i = 0; i < x.length; i++) {
                y2[i] = this._predict(x[i]);
            }
        } else if (Number.isFinite(x)) {
            y2 = this._predict(x);
        } else {
            throw new TypeError('x must be a number or array');
        }
        return y2;
    }

    _predict() {
        throw new Error('_compute not implemented');
    }

    train() {
        //Do nothing for this package
    }

    toString() {
        return '';
    }

    toLaTeX() {
        return '';
    }

    /**
     * Return the correlation coefficient of determination (r) and chi-square.
     * @param {Array<number>} x
     * @param {Array<number>} y
     * @return {object}
     */
    modelQuality(x, y) {
        let n = x.length;
        var y2 = new Array(n);
        for (let i = 0; i < n; i++) {
            y2[i] = this._predict(x[i]);
        }
        var xSum = 0;
        var ySum = 0;
        var chi2 = 0;
        var rmsd = 0;
        var xSquared = 0;
        var ySquared = 0;
        var xY = 0;

        for (let i = 0; i < n; i++) {
            xSum += y2[i];
            ySum += y[i];
            xSquared += y2[i] * y2[i];
            ySquared += y[i] * y[i];
            xY += y2[i] * y[i];
            if (y[i] !== 0) {
                chi2 += (y[i] - y2[i]) * (y[i] - y2[i]) / y[i];
            }
            rmsd = (y[i] - y2[i]) * (y[i] - y2[i]);
        }

        var r = (n * xY - xSum * ySum) / Math.sqrt((n * xSquared - xSum * xSum) * (n * ySquared - ySum * ySum));

        return {
            r: r,
            r2: r * r,
            chi2: chi2,
            rmsd: rmsd * rmsd / n
        };
    }

}

module.exports = BaseRegression;
