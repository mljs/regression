'use strict';

exports.maybeToPrecision = function maybeToPrecision(value, digits) {
    if (value < 0) {
        value = -1 * value;
        if (digits) {
            return '- ' + value.toPrecision(digits);
        } else {
            return '- ' + value.toString();
        }
    } else {
        if (digits) {
            return value.toPrecision(digits);
        } else {
            return value.toString();
        }
    }
};
