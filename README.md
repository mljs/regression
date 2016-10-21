# ml-regression

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][coveralls-image]][coveralls-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]

Regression algorithms

## Installation

`$ npm install ml-regression`

## Example

```js
const SLR = require('ml-regression').SLR;
let inputs = [80, 60, 10, 20, 30];
let outputs = [20, 40, 30, 50, 60];

let regression = new SLR(inputs, outputs);
regression.toString(3) === 'f(x) = - 0.265 * x + 50.6';
```

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-regression.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ml-regression
[travis-image]: https://img.shields.io/travis/mljs/regression/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/mljs/regression
[coveralls-image]: https://img.shields.io/coveralls/mljs/regression.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/mljs/regression
[david-image]: https://img.shields.io/david/mljs/regression.svg?style=flat-square
[david-url]: https://david-dm.org/mljs/regression
[download-image]: https://img.shields.io/npm/dm/ml-regression.svg?style=flat-square
[download-url]: https://npmjs.org/package/ml-regression
