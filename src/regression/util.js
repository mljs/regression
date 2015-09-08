'use strict';

exports.maybeToPrecision = function maybeToPrecision(value, digits) {
    if (digits) return value.toPrecision(digits);
    else return value.toString();
};
