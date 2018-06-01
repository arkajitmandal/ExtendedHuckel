function testFunction(n){
    var a = (sumOfFunction(0,n,function(m){return(m)}));
    console.log(a);
}

//function A is a function of n and p
function A(n,p){
    
    var a = (factorial(n)*Math.pow(Math.E,-p)/(Math.pow(p,n+1))*(sumOfFunction(0,n,function(m){return (Math.pow(p,m)/factorial(m))})));
    return a;

}
//function B is a function of n and p
function B(n,p){

    //two conditions, wether or not p is zero makes a difference in the result.
    if (p = 0){
        return (Math.pow(-1,n+1)*(A(n,-p)-A(n,p)));
    }
    else {

        return(((1)/(1+n))*(1+Math.pow(-1,n)));

    }
}

function F()




function factorial(num){
    if (num < 0){
        return -1;
    }

    else if (num = 0){
        return 1;
    }
    else {

        return (num * factorial(num -1));
    }
}

//function that performs sigma notation sums, takes in start and end and an anonymous function as input;
function sumOfFunction(start, end, sigmaFunction){
    var sum = 0;
    

    console.log(sigmaFunction);
    for (var i = start; i <= end; i++){
        sum += (sigmaFunction(i));
    }
    return sum;
}