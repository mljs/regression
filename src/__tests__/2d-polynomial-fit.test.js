import { PolinomialFitting2D as Polyfit } from "..";

describe("2D polinomial fit", () => {
  const X = new Array(21);
  const y = new Array(21);
  for (let i = 0; i < 21; ++i) {
    X[i] = [i, i + 10];
    y[i] = i + 20;
  }

  const pf = new Polyfit(X, y, {
    order: 2,
  });

  it("Training coefficients", () => {
    const estimatedCoefficients = [
      1.5587e1, 3.8873e-1, 5.2582e-3, 4.8498e-1, 2.1127e-3, -7.3709e-3,
    ];
    for (let i = 0; i < estimatedCoefficients.length; ++i) {
      expect(pf.coefficients.get(i, 0)).toBeCloseTo(
        estimatedCoefficients[i],
        1e-2,
      );
    }
  });

  it("Prediction", () => {
    let test = new Array(11);
    let val = 0.5;
    for (let i = 0; i < 11; ++i) {
      test[i] = [val, val + 10];
      val++;
    }

    let y = pf.predict(test);

    let j = 0;
    for (let i = 20.5; i < 30.5; i++, j++) {
      expect(y[j]).toBeCloseTo(i, 1e-2);
    }
  });

  it("Other function test", () => {
    let testValues = [
      15.041667, 9.375, 5.041667, 2.041667, 0.375, 0.041667, 1.041667, 3.375,
      7.041667, 12.041667,
    ];

    let len = 21;

    let X = new Array(len);
    let val = 5.0;
    let y = new Array(len);
    for (let i = 0; i < len; ++i, val += 0.5) {
      X[i] = [val, val];
      y[i] = val * val + val * val;
    }

    let polyFit = new Polyfit(X, y, {
      order: 2,
    });

    let test = 10;
    let x1 = -4.75;
    let x2 = 4.75;
    let X1 = new Array(test);
    for (let i = 0; i < test; ++i) {
      X1[i] = [x1, x2];
      x1++;
      x2--;
    }

    let predict = polyFit.predict(X1);
    for (let i = 0; i < testValues.length; ++i) {
      expect(predict[i]).toBeCloseTo(testValues[i], 1e-2);
    }
  });
  it("must throw error", () => {
    const X = new Array(5);
    const y = new Array(5);
    for (let i = 0; i < 5; ++i) {
      X[i] = [i, i + 10];
      y[i] = i + 20;
    }

    expect(() => {
      const polyfit = new Polyfit(X, y, {
        order: 4,
      });
      return polyfit;
    }).toThrow("Insufficient number of points to create regression model.");
  });
});
