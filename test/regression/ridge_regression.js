/**
 * Created by acastillo on 10/6/15.
 */
'use strict';

var Matrix = require("ml-matrix");
var ridgeRegression = require("../..").KernelRidgeRegression;

var nSamples = 10;
var nVars = 2;
var nSteps = 10, i, j;

var Xs = Matrix.random(nSamples,nVars);
Xs.sub(0.5);
var Ys = Matrix.zeros(nSamples,1);
for(i=0;i<nSamples;i++){
    Ys[i][0] = Xs[i][0]*Xs[i][0]+2*Xs[i][0]*Xs[i][1]+Xs[i][1]*Xs[i][1];
}

/*var model = ridgeRegression.learn(Xs,Ys,{"kernelType":"gaussian","lambda":0.001,"kernelParams":{"w":0.1}});
console.log(model);
var Y = ridgeRegression.predict(Xs,model);
for(i=0;i< Y.length;i++){
    console.log(Y[i][0]+" "+Ys[i][0]);
    //Y[i][0].should.be.approximately(Ys[i][0], 1e-1);
}*/

describe('Kernel ridge regression', function () {
    it('Polynomial kernel should overfit the pattern', function () {
        var model = ridgeRegression.learn(Xs,Ys,{"kernelType":"polynomial","lambda":0.0001,"kernelParams":{"degree":2,"bias":1}});
        var Y = ridgeRegression.predict(Xs,model);

        for(i=0;i< Y.length;i++){
            Y[i][0].should.be.approximately(Ys[i][0], 5e-3);
        }
    });
    it('Gaussian kernel should overfit the pattern', function () {
        var model = ridgeRegression.learn(Xs,Ys,{"kernelType":"gaussian","lambda":0.0001,"kernelParams":{"w":0.1}});
        var Y = ridgeRegression.predict(Xs,model);
        for(i=0;i< Y.length;i++){
            Y[i][0].should.be.approximately(Ys[i][0], 5e-3);
        }
    });
});



