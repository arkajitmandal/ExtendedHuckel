
//the functions in this file are ordered roughly as the functions in the mathematica file, and are named accordingly. 

function em(m1,m2){

    var a = 0;
    var b = 0;
    if (m1 == 0){
        a = 1;
    }
    else {
        a = sign(m1);
    }
    if (m2 == 0){
        b = 1;
    }
    else {
        b = sign(m2);
    }

    return a*b;
}

function sign(x){
    if (x > 0){
        return 1;
    }
    else if (x< 0){
        return -1;
    }
    else {
        return 0;
    }
}
function clm(l1,l2,L,m1,m2,M){
    var result = 0;
    if(L >= M){
        result = Math.pow((-1),((m1+Math.abs(m1)+m2+Math.abs(m2)+M+Math.abs(M))/(2)))
        *KroneckerDelta(M, m1 + m2)*Math.pow(1/((2*l1 + 1)
        *(2*l2 + 1)*binomial(l1 + l2 + L + 1, l1 - l2 + L)
        *binomial(l1 + l2 + L + 1, l2 - l1 + L)*binomial(2*l1, l1 + m1)
        *binomial(2*l2, l2 + m2))*(Math.pow((2*L + 1),2)
        *binomial(l1 + l2 + L + 1, l1 + l2 - L)*binomial(2*L, L + M)),1/2)
        *sumOfFunction(Math.max(0, (l1 - m1 - (L - M)), (l2 + m2 - (L + M))),Math.min((l1 - m1),
         (l2 + m2), (l1 + l2 - L)),function(t){return Math.pow(-1,t)*binomial(l1 + l2 - L, t)
        *binomial(L - M, l1 - m1 - t)*binomial(L + M, l2 + m2 - t)});
    }
    else {
        result = 0;
    }
    return result;

}
function tlm(a, l1, m1, l2, m2,theta,phi){

    var y1 = Math.abs(m1);
    var y2 = Math.abs(m2);
    var result = 0;

    if (y1==y2 && (em(m1,m2))==(-1)){
        return 0;
    }
    else {
        result = 2/((1 + KroneckerDelta(a,0))*(Math.pow(((1 + KroneckerDelta(m1, 0))*(1 + KroneckerDelta(m2, 0))),1/2)))*doubleSumTlm(a, l1, m1, l2, m2,theta,phi);
    }

    return result;
}

function doubleSumTlm(a, l1, m1, l2, m2,theta,phi){
    console.log("function has been calleeeed");
    var sum = 0;
    var y1 = Math.abs(m1);
    var y2 = Math.abs(m2);
    for (var i = -1; i <= 1; i=i+2){

        for(var L = Math.abs(l1-l2); L <= (l1+l2); L=L+2){

            if (L < i*y1 + y2) {

                sum = sum + 0;
            }
            else {

                sum = sum + (Math.pow(em(m1,0),KroneckerDelta(i, em(m1, m2)))*
                clm(l1, l2, L, i*y1, y2, i*y1 + y2)*clm(l1, l2, L, a, -a, 0)*
                Math.pow(((2*Math.PI)/(2*L+1))*((1 + KroneckerDelta(em(m1, m2)*Math.abs(i*y1 + y2), 0))),1/2)
                *slm(L, em(m1, m2)*Math.abs(i*y1 + y2), theta, phi));


            }



        }

    }
    return sum;

}
function KroneckerDelta(i,j){
    if(i==j){
        return 1;
    }
    else{
        return 0;
    }
}


function slm(l1, m1,theta,phi){

    if (Math.abs(m1)> l1){
        return 0;
    }
    else {
        if (m1 >= 0) {
            return plm(l1, Math.abs(m1), theta)*(1)/(Math.pow(Math.PI*(1 + KroneckerDelta(m1, 0)),1/2))*Math.cos(Math.abs(m1)*phi);
        }
        else {
            return  plm(l1, Math.abs(m1), theta)*(1)/(Math.pow(Math.PI*(1 + KroneckerDelta(m1, 0)),1/2))*Math.sin(Math.abs(m1)*phi);
        }
    }

}

function plm(l,a,theta){
    var result = 0;
    var sum = 0;

    sum = sumOfFunction (0,(l-a-((1-(Math.pow(-1,l-a)))/2))/(2), function(k){
        if (l - a - 2*k == 0 && Math.cos(theta) == 0){
            return Math.pow(-1,k)*binomial(a + k, k)*binomial(2*l - 2*k, l - k)*binomial(l - k, l - a - 2*k);
        }
        else {
            return Math.pow(-1,k)*binomial(a + k, k)*binomial(2*l - 2*k, l - k)*binomial(l - k, l - a - 2*k)*Math.pow(Math.cos(theta),l-a-2*k);
        }
    });
    if(Math.sin(theta) == 0 && a == 0){
        result = Math.pow(-1,a)/(Math.pow(2,l))*(Math.pow((2*l+1)/(2*binomial(l,a)*binomial(l+a,a)),1/2))*sum;
    }
    else {
        result = Math.pow(-1,a)*(Math.pow(Math.sin(theta),a))/(Math.pow(2,l))*(Math.pow((2*l+1)/(2*binomial(l,a)*binomial(l+a,a)),1/2))*sum;

    }
    return result;
}

function overlap(n1, l1, n2, l2, a1, s, s1, r){
    var p = (r*(s+s1))/(2);
    var t = (s-s1)/(s+s1);
    var n = (Math.pow(p*(1 + t),n1 + 1/2)*Math.pow(p*(1 - t),n2 + 1/2))/(Math.pow(factorial(2*n1)*factorial(2*n2),1/2));
    var a11 = 0;
    var a12 = 0;
    if (Number.isInteger(l1 + a1) && (l1 + a1)%2 == 0){
        a11 = -a1;
    }
    else {
        a11 = -a1 +1;
    }
    if (Number.isInteger(l2 + a1) && (l2 + a1)%2 == 0){
        a12 = a1;
    }
    else {
        a12 = a1 +1;
    }
    return Math.pow((-1),(a1 + l2))*n*tripleSumOverlap( n1, l1, n2, l2, a1, s, s1, r, p, t, n, a11 ,a12);
}

//this is to be looked over, not sure of my understanding of mathematica "sum" function.
function tripleSumOverlap( n1, l1, n2, l2, a1, s, s1, r, p, t, n, a11 ,a12){
    var sum = 0;
    var start1 = a12;
    var end1 = l2;
    var start2 = a11;
    var end2 = l1;
    for(var beta = start1;  beta <= end1 ;beta = beta +2){
        for(var alpha = start2; alpha <= end2 ;alpha = alpha +2){
            
                //the sum is done over beta first, then alpha
            sum = sum +(G(alpha, beta, l1, a1, l2)*sumOfFunction(0,alpha+beta, function(q){return F(q,a1+alpha,beta-a1)*sumOfFunction(0,(n1 + n2 -alpha-beta),function(m){return A(-m + n1 + n2 + q - alpha - beta, p)*B(m + q, p*t)*F(m, n1 - alpha, n2 - beta)})}));

        }
    }
    return sum;
}
function mooverlap(n1, l1, m1, n2, l2, m2, s, s1, r, theta, phi){
   return sumOfFunction(0, Math.min(l1, l2),function(a1){return tlm(a1, l1, m1, l2, m2, theta, phi)*
        overlap(n1, l1, n2, l2, a1, s, s1, r)});
}

//function A is a function of n and p
function A(n,p){
    
    var a = (((factorial(n)*Math.pow(Math.E,-p))/(Math.pow(p,n+1)))*(sumOfFunction(0,n,function(k){return (Math.pow(p,k)/factorial(k))})));
    return a;

}

function N(n,nd,p,t){

    result = (Math.pow(p(1+t),n+1/2)*Math.pow(p(1-t),nd+1/2))/(Math.pow(factorial(2*n)*factorial(2*nd),1/2));
    return result;

}
//function B is a function of n and p
function B(n,p){

    //two conditions, wether or not p is zero makes a difference in the result.
    if(p ==0){
        return ((Math.pow(-1,n))+1)/(n+1);
    }
    else {
        return (Math.pow(-1,n+1))*(A(n,-p))-(A(n,p));
    }
}

function F(m,n1,n2){
    min = (1/2)*((m-n1)+Math.abs(m-n1));
    max = Math.min(m,n2);
    return sumOfFunction(min,max,function(s){ return Math.pow(-1,s)*binomial(n1, m-s)*binomial(n2,s)});
}
//function G, takes in a_,b_, l1_,a1_,l2_ as parameters and returns the result.
function G(a,b, l1,a1,l2){
        var sum = 0;

        for(i = 0; i <= a1; i++){
            sum = sum + Math.pow(-1,i)*binomial(a1,i)*D(a+(2*a1)-(2*i),l1,a1);
            console.log(D(a+(2*a1)-(2*i),l1,a1),D(b,l2,a1))
        }
        console.log(D(b,l2,a1)*sum);
        return D(b,l2,a1)*sum;
    }

    

function min(x,y){
    if (x>y){
        return y;
    }
    else {
        return x;
    }
}

function D(b,l1,a1){
    var firstFraction = (Math.pow(-1,(l1-b)/(2)))/(Math.pow(2,l1));
    var secondFraction = ((2*l1 + 1))/(2);
    var thirdFraction =  (binomial(l1+a1,l1))/(binomial(l1,a1));
    var fourthPart = binomial(l1,((l1-b)/2))*binomial(l1+b,b-a1);
    var result = firstFraction*(Math.pow(secondFraction*thirdFraction,1/2))*fourthPart;
    return result;
}




function Q(p,t,n,nd,q){
    result = sumOfFunction(0,(n+nd),function(m){return F(m,n,nd)*A(n+nd-m+q,p)*B(m+q,p*t)})
    return result;
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

function binomial(n, k) {
    if (k<0){
        return 0;
    }
    if ((typeof n !== 'number') || (typeof k !== 'number')) 
 return false; 
   var coeff = 1;
   for (var x = n-k+1; x <= n; x++) coeff *= x;
   for (x = 1; x <= k; x++) coeff /= x;
   return coeff;
}
function factorial(num)
{
    if (num === 0)
      { return 1; }
    else
      { return num * factorial( num - 1 ); }
}
