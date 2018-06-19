// To evauluate probability density at 

function aoProb(x,y,z,AO){
    //probability density at xyz
    // of a particular AO
    let n1 = 1;
    let l1 = 0;
    let m1 = 0;
    let zeff = 25.0;
    let n2 = AO[0];
    let l2 = AO[1];
    let m2 = AO[2];
    let zeff2 = AO[3];
    let x2  = AO[4];
    let y2  = AO[5];
    let z2  = AO[6];
    // Center our ficticious orbital
    // at origin
    x2 -= x;
    y2 -= y;
    z2 -= z;
    // conversion to spherical 
    r = Math.pow(x2*x2 +y2*y2 +z2*z2, 0.5 );
    theta = Math.acos(z2 / r)//Math.atan(y2/x2);
    if (r ==0.0){
        theta = 0.0;
        }
    phi = Math.atan2(y2, x2); 
    // Calculate mooverlap
    let thisSij;
    if (zeff2[0][1] == 1.0){
        thisSij = mooverlap(n1,l1,m1,n2,l2,m2,zeff,zeff2[0][0],r,theta,phi);
    }
    else {
        thisSij = mooverlap(n1,l1,m1,n2,l2,m2,zeff,zeff2[0][0],r,theta,phi) * zeff2[0][1];
        thisSij += mooverlap(n1,l1,m1,n2,l2,m2,zeff,zeff2[1][0],r,theta,phi) * zeff2[1][1];
    }
    return thisSij;
}

// get  dimentions
// Center of Mass
// min max
function box(Mol){
    allAtoms = Mol.atoms;
    let Xt = 0.0 ;
    let Yt = 0.0 ;
    let Zt = 0.0 ;
    let Xmax = allAtoms[0].x;
    let Ymax = allAtoms[0].y;
    let Zmax = allAtoms[0].z;
    let Xmin = allAtoms[0].x;
    let Ymin = allAtoms[0].y;
    let Zmin = allAtoms[0].z;
    for (var j=0; j< allAtoms.length;j++){
        Xt += allAtoms[j].x;
        Yt += allAtoms[j].y;
        Zt += allAtoms[j].z;
        // Max 
        if (Xmax < allAtoms[j].x){
            Xmax  = allAtoms[j].x;
        }
        if (Ymax < allAtoms[j].y){
            Ymax  = allAtoms[j].y;
        }
        if (Zmax < allAtoms[j].z){
            Zmax  = allAtoms[j].z;
        }

        //Min
        if (Xmin > allAtoms[j].x){
            Xmin  = allAtoms[j].x;
        }
        if (Ymin > allAtoms[j].y){
            Ymin  = allAtoms[j].y;
        }
        if (Zmin > allAtoms[j].z){
            Zmin  = allAtoms[j].z;
        }

    }
    let Xm = Xt/ allAtoms.length;
    let Ym = Yt/ allAtoms.length;
    let Zm = Zt/ allAtoms.length;
    let f = 1.2;

    //find biggest atom
    let e = Mol.atoms[0].radius; 
    for (var i =1;i<Mol.atoms.length;i++){
        e = Math.max(e,  Mol.atoms[i].radius);
    }
    e *= 5;
    return [[Xm,Ym,Zm],[Xmax*f +e,Ymax*f + e,Zmax*f + e],[Xmin*f - e,Ymin*f - e,Zmin*f - e]];
}

// sample density of Nth MO of Molecule
async function sampleDensity(Mol,Nth,points =1400){
    var elem = document.getElementById("myBar");
    var prgwidth = 0.0;
    elem.style.backgroundColor = "#4CAF50";
    removeDensity();
    let Box = box(Mol);
    let scale = 1.0
    // find scale by doing a sample of 100 points
    let maxP = 0.0;
    for (var i=0; i<100; i++){
        // Center Coordinate
        let Xm = Box[0][0];
        let Ym = Box[0][1];
        let Zm = Box[0][2];
        MOs = Mol.MOs;
        AOs = Mol.AOs;
        // box dimension
        let lx = Box[1][0]- Box[2][0];
        let ly = Box[1][1]- Box[2][1];
        let lz = Box[1][2]- Box[2][2];
        // get a random point
        let xp = (Math.random()-0.5)*lx + Xm;
        let yp = (Math.random()-0.5)*ly + Ym;
        let zp = (Math.random()-0.5)*lz + Zm;
        let p = [];
        
        for (var k =0;k<AOs.length;k++){
            p.push(aoProb(xp,yp,zp,AOs[k][0]));
        }
        // Now calculate for a specific Nth MO
        P = 0.0 
        for (var k =0;k<MOs.length;k++){
            P += MOs[k][Nth] * p[k];
        }
        maxP = Math.max(Math.abs(P),maxP);
    }
    scale = 1.0/maxP
    // DO the real one
    i = 0;
    let trials = 0
    while (i<points){
        // Center Coordinate
        let Xm = Box[0][0];
        let Ym = Box[0][1];
        let Zm = Box[0][2];
        MOs = Mol.MOs;
        AOs = Mol.AOs;
        // box dimension
        let lx = Box[1][0]- Box[2][0];
        let ly = Box[1][1]- Box[2][1];
        let lz = Box[1][2]- Box[2][2];
        // get a random point
        let xp = (Math.random()-0.5)*lx*2.0 + Xm;
        let yp = (Math.random()-0.5)*ly*2.0 + Ym;
        let zp = (Math.random()-0.5)*lz*2.0 + Zm;
        let p = [];
        
        for (var k =0;k<AOs.length;k++){
            p.push(aoProb(xp,yp,zp,AOs[k][0]));
        }
        // Now calculate for a specific Nth MO
        P = 0.0 
        for (var k =0;k<MOs.length;k++){
            P += MOs[k][Nth] * p[k];
        }

        showDensity(xp -Xm,yp -Ym ,zp-Zm ,P*scale);
        if (P*scale>0.1){
            prgwidth += 100/points;
            elem.style.width = prgwidth + '%'
            await sleep(10);
            i += 1;    
        }
        if (trials%50 == 0){
            await sleep(20);
        }
        trials++
    }
    elem.style.backgroundColor = "#3498db";
}