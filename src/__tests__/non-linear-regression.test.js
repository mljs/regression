import { NLR } from "..";

describe("Non-linear regression", () => {
  describe("Should give the correct parameters ", () => {
    it("Potential regression", () => {
      let x = [0.2, 0.4, 0.6, 0.8, 1.0];
      let y = [0.196, 0.785, 1.7665, 3.1405, 4.9075];
      let result = new NLR.PotentialRegression(x, y, 2, {
        computeQuality: true,
      });
      expect(result.A).toBeCloseTo(4.9073, 10e-5);
      expect(result.M).toBe(2);
      const score = result.score(x, y);
      expect(score.r2).toBeGreaterThan(0.8);
      expect(score.chi2).toBeLessThan(0.1);
      expect(score.rmsd).toBeLessThan(0.01);
      expect(result.toString(4)).toBe("f(x) = 4.907 * x^2");
      expect(result.toLaTeX(4)).toBe("f(x) = 4.907x^{2}");
    });
  });

  describe("Load and export model ", () => {
    it("Potential regression", () => {
      let regression = NLR.PotentialRegression.load({
        name: "potentialRegression",
        A: 1,
        M: -1,
      });
      expect(regression.A).toBe(1);
      expect(regression.M).toBe(-1);
      expect(regression.toLaTeX()).toBe("f(x) = \\frac{1}{x^{1}}");

      let model = regression.toJSON();
      expect(model.name).toBe("potentialRegression");
      expect(model.A).toBe(1);
      expect(model.M).toBe(-1);
    });
  });
});
