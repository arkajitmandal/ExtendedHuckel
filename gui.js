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
  //try{showatoms();}
  //catch(err){}
}
  
window.onload = init;
//window.onresize = init;


var sphere=[];
var density = [];
var surfaces = [];
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
    removeSurface();
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

function updateProgress(prc){
    document.getElementById("progress").style.width = String(prc) + "%";
}

function status(msg){
    document.getElementById("status").innerHTML = "<i>"+msg+"</i>";
}

function stop(){
    try {worker.terminate();} catch (error) {  }
    try {owork1.terminate();} catch (error) {  }
    try {owork2.terminate();} catch (error) {  }
    //document.getElementById("stop").style.display = "none";
    document.getElementById("progressbar").className = "meternot";
    status("Job Cancelled!");
}

async function Calculate(){
    try{worker.terminate();}catch(err){console.log("Starting calculation")}
    document.getElementById("progressbar").className = "meter";
    GlobalJob = 0;
    var waitTime = 100;
    let A = 1.889725989; // Convering to Atomic Units
    showatoms(); 
    var xyzText = document.getElementById("xyzText").value;
    xyzData = xyzText.split("\n");
    // get all atoms
    var allAtoms = []
    for (var i =0;  i<xyzData.length;i++){
        let xyz = xyzData[i].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        allAtoms.push(new atom(xyz[0],parseFloat(xyz[1])*A,parseFloat(xyz[2])*A,parseFloat(xyz[3])*A));
    }
    updateProgress(2);
    await sleep(waitTime);
    
    // make molecule
    let charge = 0;
    try {
        charge = parseInt(document.getElementById("moleculeCharge").value);
    } catch (error) {
        
    }
    mol = new molecule(allAtoms,charge);
    updateProgress(3);

    //worker.postMessage({"cmd":"Start","mol":mol,"conv":conv})

    await sleep(waitTime)
    // Diagonalization part write here
    // Native Diagonalization;
    if (!(window.Worker)){
        stop();
        status("Please install a modern browser!");
        }
    // webworker diagonalization
    else {
        // Webworker
        var oldmsg = "";
        worker = new Worker('calculation.js');
        worker.postMessage({"cmd":"Start","mol":mol});
        worker.onmessage = function (event) {
            let msg =  event.data;
            if (msg.prg !==undefined){
                updateProgress(msg.prg);
                if (msg.msg !==undefined){status(msg.msg);oldmsg=msg.msg;}
                else{status(oldmsg);}
            } 
            if (msg.cmd === 'done'){
                updateProgress(100);
                document.getElementById("progressbar").className = "meterdone";
                mol = msg.mol;
                worker.terminate();
                // Show results
                thisTab(2);
                // Construct Answer Element
                var ansEl =    formatAnsE(mol);
                document.getElementById("energyResults").innerHTML = ansEl;
                ansEl = formatAnsV(mol);
                document.getElementById("orbitalResult").innerHTML = ansEl;
                molNo();
                moList();
                document.getElementById("resultType").value = "E";
                resultType();
            }
        }
    }
    //
    //document.getElementById("progressbar").className = "meterdone"
    //console.log(Result);



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
    else if (S === "Cd"){
        // light yellow
        return 0xf1c40f
    }
    else if (S === "Se"){
        // light yellow
        return 0xf39c12
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



function removeSurface(){
    for (var i=0;i<surfaces.length;i=i+1){
        scene.remove(surfaces[i]);
    }
    surfaces = [];
}


function addTriangle(v1,v2,v3,boundMid,col){
    let Xm = boundMid[0];
    let Ym = boundMid[1];
    let Zm = boundMid[2];
    var geom = new THREE.Geometry();
    var v1 = new THREE.Vector3(v1[0]-Xm,v1[1]-Ym,v1[2]-Zm);
    var v2 = new THREE.Vector3(v2[0]-Xm,v2[1]-Ym,v2[2]-Zm);
    var v3 = new THREE.Vector3(v3[0]-Xm,v3[1]-Ym,v3[2]-Zm);
    var triangle = new THREE.Triangle(v1, v2, v3);
    var normal = triangle.normal();
    geom.vertices.push(triangle.a);
    geom.vertices.push(triangle.b);
    geom.vertices.push(triangle.c);
   
    var matType = document.getElementById("moStyle").value;
    if (matType=="transparent"){
        var material = new THREE.MeshLambertMaterial( { color: col, side: THREE.DoubleSide,transparent: true, opacity: 0.6} );
    }
    if (matType=="solid") {
        var material = new THREE.MeshLambertMaterial( { color: col, side: THREE.DoubleSide} );
    } 
    if (matType=="mesh") {
        var material = new THREE.MeshBasicMaterial({color: col, wireframe: true} );
    } 
    
    geom.faces.push(new THREE.Face3(0, 1, 2, normal));
    var mesh = new THREE.Mesh(geom,material);
    scene.add(mesh);
    surfaces.push(mesh);
}

function showSurface(points,cells,boundMid,col){

    for (var i =0; i<cells.length; i++){
        var corner = cells[i];
        addTriangle(points[corner[0]],points[corner[1]],points[corner[2]],boundMid,col);
    }
    return 0;
}

function generateOrbitals(Nth,mol,iso= -0.001,res=10){
    removeSurface();
    let bound = box(mol);
    //console.log(bound);
    let Dat1 = marchingCubes([res,res,res],
        function(x,y,z) {
          return moProb(mol,Nth,x,y,z) - iso;
        }, [bound[2],bound[1]]);
    //console.log(Dat);
    showSurface(Dat1.positions,Dat1.cells,bound[0],0x00CDFF);
    let Dat2 = marchingCubes([res,res,res],
        function(x,y,z) {
          return moProb(mol,Nth,x,y,z) + iso;
        }, [bound[2],bound[1]]);
    showSurface(Dat2.positions,Dat2.cells,bound[0],0xCF000F);
}

function generateOrbitalsWorker(Nth,mol,iso= 0.002){
    var resQuality = document.getElementById("resolution").value;
    var res = 12;
    if (resQuality=="low"){res = 15}
    if (resQuality=="medium"){res = 20}
    if (resQuality=="high"){res = 30}
    if (resQuality=="veryhigh"){res = 50}

    updateProgress(0);
    document.getElementById("progressbar").className = "meter";
    removeSurface();
    let bound = box(mol);
    //console.log(bound);
    var oldmsg = "Creating Surfaces..."
    owork1= new Worker('marchingWorker.js');
    owork1.postMessage({"cmd":"Start","mol":mol,'Nth':Nth,'iso':iso,'res':res,'bound':bound});
    var prg1 = 0;
    var prg2 = 0;
    var donwork = 0;
    owork1.onmessage = function (event) {
        let msg =  event.data;
        if (msg.prg !==undefined){
            prg1 = msg.prg;
            updateProgress(prg1+prg2);
            if (msg.msg !==undefined){status(msg.msg);oldmsg=msg.msg;}
            else{status(oldmsg);}
        } 
        if (msg.cmd == 'done'){
            let Dat = msg.Dat;
            showSurface(Dat.positions,Dat.cells,bound[0],0x00CDFF);
            owork1.terminate();
            donwork +=1;
            if (donwork==2){updateProgress(100);status("done!");document.getElementById("progressbar").className = "meterdone";}
        }
    }

    owork2= new Worker('marchingWorker.js');
    owork2.postMessage({"cmd":"Start","mol":mol,'Nth':Nth,'iso':-iso,'res':res,'bound':bound});
    owork2.onmessage = function (event) {
        let msg =  event.data;
        if (msg.prg !==undefined){
            prg2 = msg.prg;
            updateProgress(prg1+prg2);
            if (msg.msg !==undefined){status(msg.msg);oldmsg=msg.msg;}
            else{status(oldmsg);}
        } 
        if (msg.cmd == 'done'){
            let Dat = msg.Dat;
            showSurface(Dat.positions,Dat.cells,bound[0],0xCF000F);
            owork2.terminate();
            donwork +=1;
            if (donwork==2){updateProgress(100);status("done!");document.getElementById("progressbar").className = "meterdone";}
        }
    }
    
}




function formatAnsE(mol) {
    let ansEl = "<ul>"
    let totalEl = mol.totalElectrons; 
    var occ ; // occupency 
    occ = occupy(mol);
    for (var ith=0;ith<mol.Eig.length;ith++){
        let  homolumo = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        let el = "&nbsp;&nbsp;&nbsp;";
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
        // set Vnn = 0.0 
        //mol.Vnn = 0.0 ;
        var EiStrLen = 8;
        var EiStr = (mol.Eig[ith]).toString().substring(0, EiStrLen) ;
        trail = parseInt(EiStrLen-EiStr.length)
        if (EiStr.length<EiStrLen){
            for (var k=0;k<trail;k++){
                EiStr += "&nbsp;"
            }
        }
        var iso = document.getElementById("isovalue").value;
        var showMO = "<b class='red' onclick = 'generateOrbitalsWorker("+ ith.toString()+ ",mol,iso="+ iso + ")'>&nbsp;&nbsp;Show MO</b>";
        ansEl +="<li>"+ el + "&nbsp;&nbsp;&nbsp;&nbsp;" + EiStr +  homolumo+ showMO +"</li>";
        //ansEl +="<li><a href=\"#\"> "+ el +"&nbsp;<b style=\"color:red\" onclick = 'generateOrbitalsWorker("+ 
        //ith.toString()+ ",mol,iso= 0.004,res=15)'>Show &Psi;</b>&nbsp;&nbsp;&nbsp;&nbsp;" +  (mol.Eig[ith]).toString() 
        //+  homolumo+ " </a> </li>";
        
    }
    ansEl +=  "</ul>"
    return ansEl;
}



function formatAnsV(mol) {
    var MOs = mol.MOs;
    var N = mol.MOs.length;
    let ansEl = "";
    var iso = document.getElementById("isovalue").value;
    for (var i=0;i<N;i++){
        var showMO = "<b class='red' onclick = 'generateOrbitalsWorker("+ i.toString()+ ",mol,iso= "+ iso +")'>(Show)</b>&nbsp;&nbsp;";
        ansEl += "<ul id='MOans" + String(i)+ "'>"
        // ith MO
        var ci = String(decimals(MOs[0][i],8)) ;
        var ciLen = 8;
        var ciStr = (ci.substring(0, ciLen));
        var trail = parseInt(ciLen-ci.length)
        if (ciStr.length<ciLen){
            for (var k=0;k<trail;k++){
                ciStr += "&nbsp;"
            }
        }
        //var AOstr = "&Phi;<sub></sub>";
        ansEl += "<li> &Psi;<sub>" + String(i) + "</sub>" + showMO;//+ ciStr +  "</li>";
        var count =0;
        for (var ia=0;ia<N;ia++){
            var space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            if (count==0){space = ""}
            var ci = String(decimals(MOs[ia][i],8)) ;
            if (ci !=="0"){
                var ciLen = 8;
                var ciStr = (ci.substring(0, ciLen));
                var trail = parseInt(ciLen-ci.length)
                if (ciStr.length<ciLen){
                    for (var k=0;k<trail;k++){
                        ciStr += "&nbsp;"
                    }
                }
                var atomSym = mol.atoms[mol.AOs[ia][1]].S;
                var atomNum = String(mol.AOs[ia][1]+1) ; 
                var aoNum =  String(mol.AOs[ia][0][0]);
                var aoSymN = mol.AOs[ia][0][1];
                var aoSyms = ["s","p","d","f"];
                var aoSym  = aoSyms[aoSymN];
                var mSym = "";
                if (aoSym=="p"){ 
                    let xyz = ["y","z","x"]
                    mSym = String(xyz[mol.AOs[ia][0][2]+1]); 
                }
                if (aoSym=="d"){ 
                    let xyz = ["xy","xz","z2","yz","x2-y2"]
                    mSym = String(xyz[mol.AOs[ia][0][2]+2]); 
                }
                var AOstr = "&Phi;<sub>" + aoNum + aoSym + mSym +"</sub>(" + atomNum + atomSym + ")";
                ansEl += space +  " = " + ciStr +" " + AOstr + "</li><li>";
                count++
            }
        }
        ansEl += "</li></ul>"
    }
    return ansEl;
}


function decimals(n,points=8){
    var val =  parseInt(n * Math.pow(10,points+1))/Math.pow(10,points+1);
    if (Math.abs(val)<Math.pow(10,-points)){return "0"}
    else {return String(val);}
}