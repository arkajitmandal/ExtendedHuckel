function occupy(mol,pE = 0.02){
    let totalElectron = mol.totalElectrons;
    let E = mol.Eig;
    let econfig = new Array(E.length).fill(0);
    while (totalElectron>0){
        //find the lowest
        let L =  getLUMO(econfig);
        let S = getSOMO(econfig);
        // easiest case
        if (L!==false && S===false){
            econfig[L] += 1
            totalElectron -=1
        }
        // 1 0 type of case, considering pairing energy
        else if (L!==false && S!==false){
            // if pairing is costlier
            if ((E[L] - E[S]) < pE ){
                econfig[S] += 1
                totalElectron -=1
            }
            // if pairing is simpler
            else {
                econfig[S] += 1
                totalElectron -=1
            }
        }
        else if (L===false && S!==false){
            econfig[S] += 1
            totalElectron -=1
        }
        else {
            return false;
        }
    }
    mol.econfig = econfig;
    return econfig;
}
//get LUMO
function getLUMO(econfig){
    for (var i=0;i<econfig.length;i++){
        if (econfig[i]==0){
            return i;
        }
    }
    return false;
}

//get SOMO
function getSOMO(econfig){
    for (var i=0;i<econfig.length;i++){
        if (econfig[i]==1){
            return i;
        }
    }
    return false;
}