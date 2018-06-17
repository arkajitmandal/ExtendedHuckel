// To evauluate probability density at 

function aoProb(x,y,z,AO){
    //probability density at xyz
    // of a particular AO
    let n1 = 1.0;
    let l1 = 0.0;
    let z1 = 0.0;
    let zeff = 5.0;
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
        thisSij = mooverlap(n1,l1,m1,n2,l2,m2,zeff1[0][0],zeff2[0][0],r,theta,phi);
    }
    else {
        thisSij = mooverlap(n1,l1,m1,n2,l2,m2,zeff,zeff2[0][0],r,theta,phi) * zeff2[0][1];
        thisSij += mooverlap(n1,l1,m1,n2,l2,m2,zeff,zeff2[1][0],r,theta,phi) * zeff2[1][1];
    }
    return thisSij;
}