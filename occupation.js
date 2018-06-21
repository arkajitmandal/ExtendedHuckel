function occupy(mol,pE = 0.1){
    let totalElectron = mol.totalElectron;
    let E = mol.Eig;
    let econfig = new Array(E.length);
    while (totalElectron>0){
        //find the lowest
        let L =  getLUMO(econfig);
        let S = getSOMO(econfig);
        if (L!=false){

        }
        else if (S !=false){
            
        }
        else {
            return false;
        }
    }
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