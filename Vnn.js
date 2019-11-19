// Compute Nuclear repulsion
var Vnn = function(atoms){
    var Natoms =  atoms.length;
    var Enn    = 0;
    for (var i = 0; i < Natoms; i++){
        for (var j = i + 1; j < Natoms; j++){
            var distx2 = Math.pow((atoms[i].x - atoms[j].x),2);
            var disty2 = Math.pow((atoms[i].y - atoms[j].y),2);
            var distz2 = Math.pow((atoms[i].z - atoms[j].z),2);
            var dist = Math.pow( distx2 + disty2 + distz2 , 0.5)
            Enn = Enn + (atoms[i].Z) * (atoms[j].Z) / dist
        }
    }
    return Enn;
}