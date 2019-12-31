// get the molecule at n1 * v1 + n2 * v2 + n3 * v3 (unit cell = n1, n2, n3)
// nn = [n1,n2,n3] is integers that define the unit cell
// vv = [v1,v2,v3] is lattice vectors v1 = [vx, vy, vz]
function moveMol(atoms, nn, vv) {
    let movedAtoms = new Array(atoms.length);
    for (var iatom = 0; iatom < atoms.length; iatom++) {
        for (var idim = 0; idim < nn.length; idim++) {
            let v1 = vv[0];
            let v2 = vv[1];
            let v3 = vv[2];
            let x = nn[idim] * ( v1[0]  + atoms[iatom].x;
            let y = nn[idim] * vy + atoms[iatom].y;
            let z = nn[idim] * vz + atoms[iatom].z;
            movedAtoms.push(new atom(atoms[iatom].S, x, y, z));
        }
    }
    return movedAtoms;
}

// Sij(k) = Σ exp(i k Rn) S(r-Rn)

function bandSij( k, mol, vv, n = 2) {
    let dim = vv.length ;
    // 1D case 
    if (dim == 1) {
        for (let nx = -n; nx <= n + 1; nx++ ) {
            let nn = [nx, 0, 0];
            pass

        }
    }
}