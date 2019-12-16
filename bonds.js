// Mulliken population analysis

// charge
function getCharge(mol){
    let charge = new Array(mol.atoms.length).fill(0);
    for (var iatom=0;iatom<charge.length;iatom++){
        //for each atom
        let icharge = 0
        for (iAO=0;iAO<mol.N;iAO++){
            if (mol.AOs[iAO][1]==iatom){
            // for all atomic orbitals
                for (iMO=0;iMO<mol.N;iMO++){
                    if (mol.econfig[iMO]>0){
                        icharge += mol.econfig[iMO] * Math.pow(mol.MOs[iAO][iMO],2)
                    }
                }
            }
        }
        charge[iatom] = mol.atoms[iatom].valenceElectrons - icharge;
    }
    mol.charge = charge;
    return charge
}