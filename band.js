// get the molecule at n1 * v1 + n2 * v2 + n3 * v3 (unit cell = n1, n2, n3)
// nn = [n1,n2,n3] is integers that define the unit cell
// vv = [v1,v2,v3] is lattice vectors 
function moveMol(atoms, nn, vv) {
    let movedAtoms = new Array(atoms.length);
    for (var iatom = 0; iatom < atoms.length; iatom++) {
        for (var idim = 0; idim < nn.length; idim++) {
            let vx = vv[0];
            let vy = vv[1];
            let vz = vv[2];
            let x = nn[0] * vx + atoms[iatom].x;
            let y = nn[0] * vy + atoms[iatom].y;
            let z = nn[0] * vz + atoms[iatom].z;
            movedAtoms.push(new atom(atoms[iatom].S, x, y, z));
        }
    }
    return movedAtoms;
}