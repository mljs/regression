require(["../../../../scripts/datamining/statistics/models/regression/multiple-linear-regression","datamining/math/matrix"], function(MLR,Matrix) {
    
    module("Multiple linear regression");
    test( "Multiple linear regression 1", function() {
        var target = new MLR(1,true);
        var inputs = Matrix.columnVector([80,60,10,20,30]);
        var outputs = [20,40,30,50,60];
        
        var error = target.regress(inputs, outputs);
        var slope = target.coefficients[0];
        var intercept = target.coefficients[1];

        var r = target.coefficientOfDetermination(inputs, outputs);
        
        var str = target.toString();
        
        floatEqual( slope, -0.264706, 1e-5, "Slope" );
        floatEqual( intercept, 50.588235, 1e-5, "Intercept" );
        floatEqual( error, 761.764705, 1e-5, "Error" );
        
        floatEqual( r, 0.23823529, 1e-6, "r2" );
        
        equal(str, "y(x0) = -0.2647058824*x0 + 50.5882352941", "to string without parameter");
    });
        
    test( "Multiple linear regression 2", function() {
        var target = new MLR(2, false);
        var inputs = new Matrix([[80,1],[60,1],[10,1],[20,1],[30,1]]);
        var outputs = [20,40,30,50,60];
        
        var error = target.regress(inputs, outputs);
        
        var slope = target.coefficients[0];
        var intercept = target.coefficients[1];
        
        var r = target.coefficientOfDetermination(inputs, outputs);
        
        var str = target.toString(5);
        
        floatEqual( slope, -0.264706, 1e-5, "Slope" );
        floatEqual( intercept, 50.588235, 1e-5, "Intercept" );
        floatEqual( error, 761.764705, 1e-5, "Error" );
        
        floatEqual( r, 0.23823529, 1e-6, "r2" );
        
        equal(str, "y(x0, x1) = -0.26471*x0 + 50.58824*x1", "to string with 5 decimals");  
    });
    
    test( "Multiple linear regression 3", function() {
        var target = new MLR(2, true);
    
        var inputs = new Matrix([[1,1],[0,1],[1,0],[0,0]]);
        var outputs = [1,1,1,1];
        
        var error = target.regress(inputs, outputs);
        
        var a = target.coefficients[0];
        var b = target.coefficients[1];
        var c = target.coefficients[2];
        
        var r = target.coefficientOfDetermination(inputs, outputs);
        
        floatEqual( a, 0, 1e-6,"a = 0" );
        floatEqual( b, 0, 1e-6, "b = 0" );
        floatEqual( c, 1, 1e-6, "c = 1" );
        floatEqual( error, 0, 1e-6, "error = 0" );
        
        equal( r, 1, "r2 = 1" );
    });

    test( "Multiple linear regression 4", function() {
        var count = 1000;
        var inputs = Matrix.empty(count,2);
        var outputs = new Array(count);
        
        for(var i = 0; i < count; i++) {
            var x = i+1;
            var y = 2 * (i+1) - 1;
            inputs.setRow(i,[x,y]);
            outputs[i] = 4 * x - y + 3;
        }
        
        var target = new MLR(2, true);
        var error = target.regress(inputs, outputs);
        
        equal( target.coefficients.length, 3, "Target 1 coefficients length is 3" );
        ok(target.hasIntercept(),"Target 1 has intercept");
        floatEqual(error, 0, 1e-10, "Error is 0");

        target = new MLR(2, false);
        error = target.regress(inputs, outputs);
        
        equal( target.coefficients.length, 2, "Target 2 coefficients length is 2" );
        ok(!target.hasIntercept(),"Target 2 has no intercept");
        floatEqual(error, 0, 1e-10, "Error is 0");
    });
    
    test( "Multiple linear regression 5", function() {
    
        var target = new MLR(2,false);
        
        var inputs = new Matrix([[0,0],[0,0],[0,0],[0,0],[0,0]]);
        var outputs = [20,40,30,50,60];
        
        var error = target.regress(inputs, outputs);
        
        var slope = target.coefficients[0];
        var intercept = target.coefficients[1];
        
        floatEqual( slope, 0, 1e-5, "Slope" );
        floatEqual( intercept, 0, 1e-5, "Intercept" );
        equal( error, 9000, "Error" );
        
        var r = target.coefficientOfDetermination(inputs, outputs);
        floatEqual( r, -8, 1e-6, "Intercept" );
        
        var str = target.toString();
        equal(str, "y(x0, x1) = 0*x0 + 0*x1", "to string without parameter");  
    });
});