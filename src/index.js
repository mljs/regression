import { PotentialRegression } from "./regression/potential-regression";

export {
  SimpleLinearRegression,
  SimpleLinearRegression as SLR,
} from "ml-regression-simple-linear";
export { PolynomialRegression } from "ml-regression-polynomial";
export { ExponentialRegression } from "ml-regression-exponential";
export { PowerRegression } from "ml-regression-power";
export { default as MultivariateLinearRegression } from "ml-regression-multivariate-linear";
const NLR = {
  PotentialRegression,
};
export { NLR, NLR as NonLinearRegression };

export {
  KernelRidgeRegression,
  KernelRidgeRegression as KRR,
} from "./regression/kernel-ridge-regression";
export { PolynomialFitRegression2D as PolinomialFitting2D } from "./regression/poly-fit-regression2d";

// robust regressions
export { TheilSenRegression } from "ml-regression-theil-sen";
export { RobustPolynomialRegression } from "ml-regression-robust-polynomial";
