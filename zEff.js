// This is the file to calculate zeff 
var toGroupValue= function(nl){
    // Asigns a value corresponding to orbital
    // take n and l as [n,l] input
    s=1;
    p=1;
    d=2;
    f=3;
    n = nl[0];
    l = nl[1];
    
    return parseFloat(n)*10+eval(l);
    }
