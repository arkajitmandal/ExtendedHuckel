
importScripts("./Lib/numeric-1.2.6.js")

// Rotation Matrix
var Rot = function(theta){
    var Mat = [[Math.cos(theta),Math.sin(theta)],[-Math.sin(theta),Math.cos(theta)]];
    return Mat
}
// Givens Matrix
var Rij = function(k,l,theta,N){
    var Mat = Array(N) 
    for (var i = 0; i<N;i++){
        Mat[i] = Array(N) 
    }
    // Identity Matrix
    for (var i = 0; i<N;i++){
        for (var j = 0; j<N;j++){
            Mat[i][j] = (i===j)*1.0;
        }
    }
    var Rotij = Rot(theta);

    // Put Rotation part in i, j
    Mat[k][k] = Rotij[0][0] // 11
    Mat[l][l] = Rotij[1][1] // 22
    Mat[k][l] = Rotij[0][1] // 12
    Mat[l][k] = Rotij[1][0] // 21
    return Mat
}

// get angle
var getTheta = function(aii,ajj,aij){
    var  th = 0.0 
    var denom = (ajj - aii);
    if (Math.abs(denom) <= 1E-12){
        th = Math.PI/4.0
    }
    else {
        th = 0.5 * Math.atan(2.0 * aij / (ajj - aii) ) 
    }
    return th 
}
// get max off-diagonal value from Upper Diagonal
var getAij = function(Mij){
    var N = Mij.length;
    var maxMij = 0.0 ;
    var maxIJ  = [0,1];
    for (var i = 0; i<N;i++){
        for (var j = i+1; j<N;j++){ 
            if (Math.abs(maxMij) <= Math.abs(Mij[i][j])){
                maxMij = Math.abs(Mij[i][j]);
                maxIJ  = [i,j];
            } 
        }
    }
    return [maxIJ,maxMij]
}
// Unitary Rotation UT x H x U
var unitary  = function(U,H){
    var N = U.length;
    // empty NxN matrix
    var Mat = Array(N) 
    for (var i = 0; i<N;i++){
        Mat[i] = Array(N) 
    }
    // compute element
    for (var i = 0; i<N;i++){
        for (var j = 0; j<N;j++){
            Mat[i][j] =  0 
            for (var k = 0; k<N;k++){
                for (var l = 0; l<N;l++){
                    Mat[i][j] = Mat[i][j] + U[k][i] * H[k][l] * U[l][j];
                }
            }
        }
    }
    return Mat;
}

// Matrix Multiplication
var AxB = function(A,B){
    var N = A.length;
    // empty NxN matrix
    var Mat = Array(N) 
    for (var i = 0; i<N;i++){
        Mat[i] = Array(N) 
    }
    for (var i = 0; i<N;i++){
        for (var j = 0; j<N;j++){
            Mat[i][j] =  0 
            for (var k = 0; k<N;k++){
                Mat[i][j] = Mat[i][j] + A[i][k] * B[k][j] ; 
            }
        }
    }
    return Mat;
}

var diag = function(Hij, convergence = 1E-7){
    var N = Hij.length; 
    var Ei = Array(N);
    var e0 =  Math.abs(convergence / N)
    // initial vector
    var Sij = Array(N);
    for (var i = 0; i<N;i++){
        Sij[i] = Array(N) 
    }
    // Sij is Identity Matrix
    for (var i = 0; i<N;i++){
        for (var j = 0; j<N;j++){
            Sij[i][j] = (i===j)*1.0;
        }
    }
    // initial error
    var Vab = getAij(Hij); 
    //  jacobi iterations
    while (Math.abs(Vab[1]) >= Math.abs(e0)){
        // block index to be rotated
        var i =  Vab[0][0];
        var j =  Vab[0][1];
        // get theta
        var psi = getTheta(Hij[i][i], Hij[j][j], Hij[i][j]); 
        // Givens matrix
        var Gij =  Rij(i,j,psi,N);
        // rotate Hamiltonian using Givens
        Hij = unitary(Gij,Hij); 
        // Update vectors
        Sij = AxB(Sij,Gij); 
        // update error 
        Vab = getAij(Hij); 
    }
    for (var i = 0; i<N;i++){
        Ei[i] = Hij[i][i]; 
    }
    return sorting(Ei , Sij) 
}


var sorting = function(E, S){
    var N = E.length ; 
    var Ef = Array(N);
    var Sf = Array(N);
    for (var k = 0; k<N;k++){
        Sf[k] = Array(N);
    }
    for (var i = 0; i<N;i++){
        var minID = 0;
        var minE  = E[0];
        for (var j = 0; j<E.length;j++){
            if (E[j] < minE){
                minID = j ; 
                minE = E[minID];
            }
        }
        Ef[i] = E.splice(minID,1);
        for (var k = 0; k<N;k++){
            Sf[k][i]  = S[k][minID];
            S[k].splice(minID,1);
        }
    }
    return [Ef,Sf]
}



// Webworker Based diagonalization
function main(mol){
    console.log("started main code")
    postMessage({'msg':'Computing S<sup>-1</sup>','prg':4});
    // S-1 calculation
    let invSij = numeric.inv(mol.Sij);
    // S-1 x H
    postMessage({'msg':'Obtained H x S<sup>-1</sup>','prg':15});
    let invSxH =  numeric.dot(invSij,mol.Hij);
    postMessage({'msg':'Starting Diagonalization','prg':20});
    // Final Diagonalization
    let Out = diag(invSxH,1E-7);
    postMessage({'msg':'Diagonalization Done','prg':93});
    let E = Out[0];
    let Psi = Out[1];
    //console.log(E);
    // Save global variables
    mol.Eig = numeric.clone(E);
    mol.MOs = numeric.clone(Psi);
    postMessage({'msg':'All computations done','mol':mol,'cmd':'done'});
}


onmessage = function(e) {
    //console.log('received ' + e.data);
    let msg = e.data;
    if (msg.cmd == "Start"){
        main(msg.mol);
    }
}