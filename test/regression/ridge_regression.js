/**
 * Created by acastillo on 10/6/15.
 */

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

var model = ridgeRegression.learn(Xs,Ys,{"kernelType":"polynomial","kernelParams":{"degree":2,"bias":1}});

//console.log(model);
var X = new Matrix(nSteps*nSteps,2);
var x = new Matrix(nSteps,nSteps);
var y = new Matrix(nSteps,nSteps);
var z = new Matrix(nSteps,nSteps);
var dx = 1/(nSteps-1);

for(i=0;i<nSteps;i++){
    for(j=0;j<nSteps;j++){
        X[i+j*nSteps][0]=-0.5+i*dx;
        X[i+j*nSteps][1]=-0.5+j*dx;

        x[i][j]=X[i+j*nSteps][0];
        y[i][j]=X[i+j*nSteps][1];
    }
}

var Y = ridgeRegression.predict(X,model);
var xstring = "",ystring="",zstring="";

for(i=0;i<nSteps;i++){
    for(j=0;j<nSteps;j++){
        z[i][j]=Y[i+j*nSteps][0];
    }
    for(j=0;j<nSteps-1;j++){
        xstring+=x[i][j]+",";
        ystring+=y[i][j]+",";
        zstring+=z[i][j]+",";
    }
    xstring+=x[i][j]+";";
    ystring+=y[i][j]+";";
    zstring+=z[i][j]+";";
}
console.log("X=["+xstring+"];");
console.log("Y=["+ystring+"];");
console.log("Z=["+zstring+"];");
console.log("contour(X,Y,Z,20);");



