'use strict';

const regression = require('..');

describe('test that re-exports are OK', () => {
    it('should export functions', () => {
        regression.SimpleLinearRegression.should.be.a.Function();
        regression.PolynomialRegression.should.be.a.Function();
        regression.ExponentialRegression.should.be.a.Function();
        regression.PowerRegression.should.be.a.Function();
        regression.MultivariateLinearRegression.should.be.a.Function();
        regression.TheilSenRegression.should.be.a.Function();
        regression.RobustPolynomialRegression.should.be.a.Function();
    });
});
