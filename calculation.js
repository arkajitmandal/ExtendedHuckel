
importScripts("./Lib/numeric-1.2.6.js")

// sorting
var sorting = function(E, S){
    var N = E.length ; 
    var Ef = new Array(N);
    var Sf = new Array(N);
    for (var k = 0; k<N;k++){
        Sf[k] = new Array(N);
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


// Rotation Matrix
var Rot = function(theta){
    var cs = Math.cos(theta);
    var sn = Math.sin(theta);
    var Mat = [[cs,sn],[-sn,cs]];
    return Mat
}
// Givens Matrix
var Rij = function(k,l,theta,N){
    var Mat = new Array(N) 
    for (var i = 0; i<N;i++){
        Mat[i] = new Array(N) 
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
    if (Math.abs(denom) <= 1E-15){
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
            if (Math.abs(maxMij) < Math.abs(Mij[i][j])){
                maxMij = Math.abs(Mij[i][j]);
                maxIJ  = [i,j];
            } 
        }
    }
    return [maxIJ,maxMij]
}
// Unitary Rotation UT x H x U
var unitary  = function(U,H,sym=true){
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
    //console.log(Mat);
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
            Mat[i][j] =  0 ;
            for (var k = 0; k<N;k++){
                Mat[i][j] = Mat[i][j] + A[i][k] * B[k][j] ; 
            }
        }
    }
    return Mat;
}

var Hij1 = function(Hij, theta,i,j){
    let N = Hij.length;
    let c = Math.cos(theta);
    let s = Math.sin(theta);
    let c2 = c * c ; 
    let s2 = s * s ; 
    //var Ans = new Array(N).fill(Array(N).fill(0)); 
    let Aki =  new Array(N).fill(0);
    let Akj =  new Array(N).fill(0);
    // Aii
    let Aii = c2 * Hij[i][i] - 2 * c * s * Hij[i][j] + s2 * Hij[j][j];
    let Ajj = s2 * Hij[i][i] + 2 * c * s * Hij[i][j] + c2 * Hij[j][j];
    // 0  to i
    for (var k=0; k<N; k++){
        Aki[k] =  c * Hij[i][k] - s * Hij[j][k] ;
        //Ans[i][k] =  Ans[k][i] ; 
        Akj[k] =  s * Hij[i][k] + c * Hij[j][k] ;
        //Ans[j][k] =  Ans[k][j] ; 
    }
    // Modify Hij
    Hij[i][i] = Aii;
    Hij[j][j] = Ajj;
    Hij[i][j] = 0;
    Hij[j][i] = 0;
    // 0  to i
    for (var k=0; k<N; k++){
        if (k!==i && k!==j){
            Hij[i][k] = Aki[k];
            Hij[k][i] = Aki[k];
            Hij[j][k] = Akj[k];
            Hij[k][j] = Akj[k];
        }
    }
    return Hij;
 }

 var Sij1 =  function(Sij, theta,i,j){
    let N = Sij.length;
    let c = Math.cos(theta);
    let s = Math.sin(theta);
    let Ski =  new Array(N).fill(0);
    let Skj =  new Array(N).fill(0);
    for (var k=0; k<N; k++){
        Ski[k] = c * Sij[k][i] - s * Sij[k][j];
        Skj[k] = s * Sij[k][i] + c * Sij[k][j];
    }
    for (var k=0; k<N; k++){
        Sij[k][i] =  Ski[k] ;
        Sij[k][j] =  Skj[k] ;
    }
    return Sij;
}

var diag = function(Hij, convergence = 1E-7,bar={'start':20,'end':90},sort=true){
    Hij = numeric.clone(Hij);
    var N = Hij.length; 
    var Ei = new Array(N);
    var e0 =  Math.abs(convergence / N)
    // initial vector
    var Sij = new Array(N);
    for (var i = 0; i<N;i++){
        Sij[i] = new Array(N) 
    }
    // Sij is Identity Matrix
    for (var i = 0; i<N;i++){
        for (var j = 0; j<N;j++){
            Sij[i][j] = (i===j)*1.0;
        }
    }
    // initial error
    var Vab = getAij(Hij); 
    postMessage({'msg':'Diagonalizing... (22% )','prg':22});
    var minV = Vab[1];
    var levelMax = Math.log(Math.abs(Vab[1])/Math.abs(e0));
    var iter = 1;
    //  jacobi iterations
    while (Math.abs(Vab[1]) >= Math.abs(e0)){
        if (Math.abs(Vab[1]) < Math.abs(minV) ){
            minV = Vab[1];
            var level = Math.log(Math.abs(Vab[1])/Math.abs(e0));
            var prg = (bar.end) - (level/levelMax) * (bar.end-bar.start) ;
            //var prgd = 100 - (level/levelMax) * 100.0
            iter += 1
            postMessage({'msg':'Diagonalizing... ('+ String(Math.round(prg)) + '% )','prg':prg});
        }
        // block index to be rotated
        var i =  Vab[0][0];
        var j =  Vab[0][1];
        // get theta
        var psi = getTheta(Hij[i][i], Hij[j][j], Hij[i][j]); 

        Hij = Hij1(Hij,psi,i,j);
        // Update vectors

        Sij = Sij1(Sij,psi,i,j);
        // update error 
        Vab = getAij(Hij); 
    }
    for (var i = 0; i<N;i++){
        Ei[i] = Hij[i][i]; 
    }
    if (sort){
        return sorting(Ei , Sij)
    } else { return [Ei , Sij] }
}


//https://www.jstor.org/stable/2949370?seq=1#metadata_info_tab_contents
// square root 
var sqMat= function(Mat,convergence=1E-7,bar={'start':0,'end':20}){
    let N = Mat.length;
    Mat = numeric.clone(Mat);
    bar.end = bar.end * 0.98;
    // diagonalize Sij
    let Si = diag(Mat, convergence,bar,false)
    let Qd = Si[1]; // Unitary matrix that diagonalizes Si
    let Sii = Si[0];
    // initialize sqrt matrix in eigenrepresentation
    let Sd = new Array(N);
    for (var i = 0; i<N;i++){
        Sd[i] = new Array(N).fill(0);
    }
    // sqrt matrix in eigenrepresentation
    for (var i = 0; i<N;i++){
        Sd[i][i] = Math.sqrt(Sii[i]);
    }
    let D = numeric.dot( Qd , Sd);
    return D;
}


function genDiag(Hij,Sij, convergence=1E-7,bar={'start':0,'end':90}){
    Hij = numeric.clone(Hij);
    Sij = numeric.clone(Sij);
    // progress bar
    bar.end = bar.end/2;
    // finding sqrt of overlap
    let S05 = sqMat(Sij,convergence,bar);
    // inverse of S05
    let S05inv = numeric.inv(S05);
    // transpose
    let S05Tinv = numeric.transpose(S05inv);
    // obtaining matrix for diagonalization
    let Hij2 = numeric.dot(numeric.dot( S05inv, Hij),S05Tinv);
    bar.start = bar.end+bar.start;
    bar.end = bar.end*2;
    let Ans = diag(Hij2, convergence, bar, true);
    console.log(JSON.stringify(Hij2))
    let Ei = Ans[0];
    // eigenvectors
    let Uij =  numeric.dot(S05Tinv,Ans[1]);
    return [Ei,Uij]
}



// Webworker Based diagonalization
function main(mol){
    console.log("started main code")
    //console.log(invSxH);
    postMessage({'msg':'Starting Diagonalization','prg':10});
    // Final Diagonalization
    let Out = genDiag(mol.Hij,mol.Sij, 1E-9, {'start':10,'end':95});
    postMessage({'msg':'Diagonalization Done','prg':98});
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