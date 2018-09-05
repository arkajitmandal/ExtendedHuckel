//Orthonormalize All AOs
function gramSmidth(mol){
    //needs a projection operator !!
    let Sij = mol.Sij;
    let AOs = mol.AOs;
    let N = AOs.length;
    let orthoAOs = new Array(N);
    let AO = new Array(N);
    for (var i = 0; i < N; i++) {
        orthoAOs[i] = new Array(N);
        AO[i] = new Array(N);
    }
    // Identity AO
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            if (i!==j){
                AO[i][j] = 0.0;
            }
            else {
                AO[i][j] = 1.0;
            }
        }

    }

    // ith vector
    // https://en.wikipedia.org/wiki/Gram%E2%80%93Schmidt_process
    for (var i = 0; i < N; i++) {
        let uk = numeric.transpose(AO)[i];
        for (var j = 0; j< i; j++){
            let proj = projection(orthoAOs[j], uk, Sij);
            for (var l = 0; l< N; l++){
                uk[l] = uk[l] - proj[l]; 
                }
            }
        // Normalize
        let C = 0.0;
        for (var j = 0; j < N; j++){
            for (var k = 0; k < N; k++){
                C = C+ uk[j]*uk[k]*Sij[j][k];
            }
        }
        C= Math.sqrt(C);
        for (var j = 0; j < N; j++){
            uk[j] = uk[j]/C; 
        }
        orthoAOs[i] = uk ;
    }
    orthoAOs = numeric.transpose(orthoAOs);
    mol.orthoAOs= orthoAOs;
    return orthoAOs;
}

// Projection operator used in gram smidth!!!
// (<A|B>/<A|A>) * |A>
function projection(A,B,Sij){
    let N = A.length;    
    // <A|B> 
    let AB = 0.0;
    // <A|A> 
    let AA = 0.0;
    for (var i = 0; i < N; i++){
        for (var j = 0; j < N; j++){
            AB = AB + A[i]*B[j]*Sij[i][j]
            AA = AA + A[i]*A[j]*Sij[i][j]
        }
    }
    let C = AB/AA;
    let proj = new Array(N)
    for (var i = 0; i < N; i++){
       proj[i] = A[i]*C; 
    }
    return proj;
}
// Construct Hamiltonian in Orthogonal Basis
function orthoHij(mol){
    let Hij = mol.Hij;
    let gsAO = mol.orthoAOs;
    let N = mol.N;
    let oHij = new Array(N);
    for (var i = 0; i < N; i++) {
        oHij[i] = new Array(N);
    }

    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            oHij[j][i] =0.0
            for (var m = 0; m < N; m++) {
                for (var n = 0; n < N; n++) {
                    oHij[j][i] += Hij[n][m] * gsAO[m][i] * gsAO[n][j];
                }
            }
        }
    }
    mol.orthoHij = oHij;
    return oHij;
}
// Ortho MO to MO
function atomicMO(orthoMO,orthoAO){
    
}