var model; 
var renderer,densityscene,camera; 
var atomX,atomY,atomZ,atomRad;
var mol, Eig, MOs;
function init() {  
  var canv = document.getElementsByTagName("canvas")[0];
  var w = canv.clientWidth;
  var h = canv.clientHeight;
  var GlobalJob;

try{  renderer = new THREE.WebGLRenderer({canvas:canv}); }
catch(err){
document.getElementById('allcontgrolss').innerHTML='';
document.getElementById('allcontgrols').innerHTML='';
document.getElementById('CanDivEl').innerHTML="<h2>Your Browser Does not support this application. We recommend firefox (latest) from a PC</h2>"}
  renderer.setSize( w, h );
  renderer.setClearColor(new THREE.Color(0x34495e), 1);

   scene = new THREE.Scene();

   camera = new THREE.PerspectiveCamera(
      15,     // Field of view
      w / h,  // Aspect ratio
      0.1,    // Near
      10000   // Far
  );
  
  // Camera looks toward negative z with y up
  camera.position.set( 5, 5, 100 );
  
  var control = new THREE.OrbitControls(camera,canv);
  var light = new THREE.AmbientLight( 0x513030); // soft white light
  scene.add( light );
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 3, 1).normalize();
  scene.add(directionalLight);
  var directionalLight2 = new THREE.DirectionalLight(0x939393);
  directionalLight2.position.set(-1, 0, 0).normalize();
  scene.add(directionalLight2);
  var directionalLight3 = new THREE.DirectionalLight(0x939393);
  directionalLight3.position.set(0, -1, 0).normalize();
  scene.add(directionalLight3);
  //axes = new THREE.AxisHelper( 10 );
  //axes.position.set(-7.5,-7.5,-7.5)
  //scene.add( axes );
  var clock = new THREE.Clock();
  var render = function() {
    var dt = clock.getDelta();
    control.update(dt);
    renderer.render(scene,camera);
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}
  
window.onload = init;
//window.onresize = init;


var sphere=[];
var density = [];
function showatom(a,b,c,d,col = 0xcd3333){

    var material = new THREE.MeshLambertMaterial( { color: col, side: THREE.DoubleSide} );
    sphere.push( new THREE.Mesh(new THREE.SphereGeometry(d, 20, 20), material ));
    
    
    sphere[sphere.length-1].overdraw = true;
    sphere[sphere.length-1].position.set( a , b, c  );
    scene.add(sphere[sphere.length-1]);
    //render();
    }
function removeAtoms(){
    for (var i=0;i<sphere.length;i=i+1){
        scene.remove(sphere[i]);
    }
    sphere = [];
}


    function render() {
        renderer.render(scene, camera);
    }
    

function showatoms(){
    removeAtoms();
    removeDensity();
    let A = 1.889725989;
    var xyzText = document.getElementById("xyzText").value;
    xyzData = xyzText.split("\n");
    let X ,Y ,Z;
    [X,Y,Z] = CenterOfMass(xyzData);
    
    for (var i =0;  i<xyzData.length;i++){
        let xyz = xyzData[i].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        let cs = colorSize(xyz[0]);
        let rad = getRadius(xyz[0],atomRadius);
        //console.log((parseFloat(xyz[1])-X)*A);
        showatom((parseFloat(xyz[1])-X)*A,(parseFloat(xyz[2])-Y)*A,(parseFloat(xyz[3])-Z)*A,rad*1.2,cs);
    }
}

function CenterOfMass(xyzData){
    let X = 0.0;
    let Y = 0.0;
    let Z = 0.0;
    for (var i =0;  i<xyzData.length;i++){
        let xyz = xyzData[i].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        
        X+= parseFloat(xyz[1]);
        Y+= parseFloat(xyz[2]);
        Z+= parseFloat(xyz[3]);

    }
    X = X/xyzData.length;
    Y = Y/xyzData.length;
    Z = Z/xyzData.length;
    return [X,Y,Z]
}

async function Calculate(){
    GlobalJob = 0;
    var waitTime = 100;
    var elem = document.getElementById("myBar");
    elem.style.backgroundColor = "#4CAF50";
    var prgwidth = 1;
    let A = 1.889725989;
    showatoms();
    var xyzText = document.getElementById("xyzText").value;
    xyzData = xyzText.split("\n");
    // get all atoms
    var allAtoms = []
    for (var i =0;  i<xyzData.length;i++){
        let xyz = xyzData[i].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        allAtoms.push(new atom(xyz[0],parseFloat(xyz[1])*A,parseFloat(xyz[2])*A,parseFloat(xyz[3])*A));
    }
    prgwidth = 20;
    elem.style.width = prgwidth + '%'
    await sleep(waitTime)
    
    // make molecule
    mol = new molecule(allAtoms);
    prgwidth = 50;
    elem.style.width = prgwidth + '%'
    await sleep(waitTime)
    // Diagonalization part write here
    var here = 1; // ask diagonalization or do it here
    if (here == 1){
        // S-1 calculation
        let invSij = numeric.inv(mol.Sij);
        prgwidth = 65;
        elem.style.width = prgwidth + '%'
        await sleep(waitTime)
        // S-1 x H
        let invSxH =  numeric.dot(invSij,mol.Hij);
        var prgwidth = 70;
        elem.style.width = prgwidth + '%'
        await sleep(waitTime)
        // Final Diagonalization
        let diag = numeric.eig(invSxH);
        let E = diag.lambda.x;
        let psi = diag.E;
        Result = [E,psi]
        }
    // Correct Diagonalization;
    if (here == 2){
        // orthonormalization by Gram Smidth
        mol.orthoAOs = gramSmidth(mol);
        prgwidth = 65;
        elem.style.width = prgwidth + '%';
        await sleep(waitTime)
        // construct the Hij in orthogonal Basis
        mol.orthoHij = orthoHij(mol);
        prgwidth = 70;
        elem.style.width = prgwidth + '%';
        await sleep(waitTime)
        // diagonalization
        let diag = numeric.eig(mol.orthoHij);
        let E = diag.lambda.x;
        let psi = diag.E;
        prgwidth = 85;
        elem.style.width = prgwidth + '%';
        await sleep(waitTime)
        // sort
        Result = sortEigPsi(E,psi.x);
        sortE = numeric.clone(Result[0]);
        sortPsi = numeric.clone(Result[1]);
        prgwidth = 87;
        elem.style.width = prgwidth + '%';
        await sleep(waitTime)
        // rotate MO to AO basis
        mol.Eig = numeric.clone(sortE);
        mol.MOs = numeric.clone(atomicMO(sortPsi,mol.orthoAO));
        }
    else {
        Result =  Diagonalization(mol.Hij,mol.Sij);   
        }
    prgwidth = 100;
    //console.log(Result);
    // Organize the result
    if (here !== 2){
        var E = new Array();
        var Psi = new Array();
        E = Result[0];
        Psi = Result[1];
        // Save global variables
        
        [sortE,sortPsi]= sortEigPsi(E,Psi.x);
        // Save global variables
        mol.Eig = numeric.clone(sortE);
        mol.MOs = numeric.clone(sortPsi);
    }
    // Show results
    elem.style.width = prgwidth + '%';
    document.getElementById("energy").style.display = "block";
    document.getElementById("Answers").style.display = "block";

    // Construct Answer Element
    let ansEl = "<ul>"
    let totalEl = mol.totalElectrons; 
    var occ ; // occupency 
    occ = occupy(mol);
    for (var ith=0;ith<mol.Eig.length;ith++){
        let  homolumo = "";
        let el = "";
        // Filled
        if (occ[ith]==2){
            el = "&uarr;&darr;&nbsp;";
        } 
        // singly filled
        else if (occ[ith]==1){
            el = "&uarr;&nbsp;&nbsp;";
        }
        // HOMO  
        if (occ[ith]==2 && occ[ith+1]==0 ){
            homolumo = "&nbsp;&nbsp;HOMO";
        }
        // LUMO
        else if (occ[ith]==0 && occ[ith-1]==2 ){
            homolumo = "&nbsp;&nbsp;LUMO";
        }
        // SOMO
        else if (occ[ith]==1){
            homolumo = "&nbsp;&nbsp;SOMO";
        }


        ansEl +="<li><a href=\"#\"> "+ el +"&nbsp;<b style=\"color:red\" onclick = 'sampleDensity(mol,"+ 
                ith.toString()+ ")'>Show &Psi;</b>&nbsp;&nbsp;&nbsp;&nbsp;" +  mol.Eig[ith].toString() 
                +  homolumo+ " </a> </li>";
    }
    ansEl +=  "</ul>"

    document.getElementById("Answers").innerHTML = ansEl;
    elem.style.backgroundColor = "#3498db";
}

function colorSize(S){
    if (S === "H"){
        //grey
        return 0xbdc3c7
    }
    else if (S === "He"){
        // dark grey
        return 0x7f8c8d
    }
    else if (S === "Li"){
        // Yellow
        return 0xf1c40f
    }
    else if (S === "Be"){
        //Orange-Yeollowish
        return 0xf39c12
    }
    else if (S === "B"){
        //Orange Reddish
        return 0xd35400
    }
    else if (S === "C"){
        // Very Dark Blue
        return 0x2c3e50
    }
    else if (S === "O"){
        // Red
        return 0xe74c3c
    }
    else if (S === "N"){
        // Blue
        return 0x0fbcf9
    }
    else if (S === "F"){
        // Green
        return 0x2ecc71
    }
    else if (S === "Ne"){
        // Ujala Blue
        return 0x3867d6
    }
    else if (S === "Na"){
        // Sea Grean
        return 0xbcbba
    }
    else if (S === "Mg"){
        // red
        return 0xE91E63
    }
    else if (S === "Al"){
        // Grey
        return 0x9E9E9E
    }
    else if (S === "Si"){
        // dark black
        return 0x3d3d3d
    }
    else if (S === "P"){
        // pink
        return 0xffcccc
    }
    else if (S === "S"){
        // high yeollow
        return 0xfff200
    }
    else if (S === "Cl"){
        // light violet
        return 0xc56cf0
    }
    else if (S === "Ar"){
        // light light blue
        return 0x7efff5
    }
    else {
    return 0xcd3333
    
    }
}



function showDensity(x,y,z,P){
    if (Math.abs(P)>0.1){
        if (P < 0.0 ){
            //col = 0x4cd137;
            col = 0x00CDFF;
        }
        else {
            //col = 0xe74c3c;
            col = 0xCF000F;
        }

        var material = new THREE.MeshLambertMaterial( { color: col, side: THREE.DoubleSide,transparent: true, opacity: Math.abs(P)} );
        density.push( new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 5), material ));
        density[density.length-1].overdraw = true;
        density[density.length-1].position.set( x , y, z  );
        scene.add(density[density.length-1]);
    }
}


function removeDensity(){
    for (var i=0;i<density.length;i=i+1){
        scene.remove(density[i]);
    }
    density = [];
}

