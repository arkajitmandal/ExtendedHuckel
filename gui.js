var model; 
var renderer,scene,camera; 
var atomX,atomY,atomZ,atomRad;
var mol, Eig, MOs;
function init() {  
  var canv = document.getElementsByTagName("canvas")[0];
  var w = canv.clientWidth;
  var h = canv.clientHeight;

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
  axes = new THREE.AxisHelper( 10 );
  axes.position.set(-7.5,-7.5,-7.5)
  scene.add( axes );
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
window.onresize = init;


var sphere=[];

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
        scene.remove(sphere[i]);}
    }


    function render() {
        renderer.render(scene, camera);
    }
    

function showatoms(){
    removeAtoms();
    var xyzText = document.getElementById("xyzText").value;
    xyzData = xyzText.split("\n");
    let X ,Y ,Z;
    [X,Y,Z] = CenterOfMass(xyzData);
    for (var i =0;  i<xyzData.length;i++){
        let xyz = xyzData[i].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        let cs = colorSize(xyz[0]);
        let rad = getRadius(xyz[0],atomRadius);
        showatom(xyz[1]-X,xyz[2]-Y,xyz[3]-Z,rad*1.2,cs);
    }
}

function CenterOfMass(xyzData){
    let X = 0.0;
    let Y = 0.0;
    let Z = 0.0;
    for (var i =0;  i<xyzData.length;i++){
        let xyz = xyzData[i].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        X+= xyz[1];
        Y+= xyz[2];
        Z+= xyz[3];
    }
    X = X/xyzData.length;
    Y = Y/xyzData.length;
    Z = Y/xyzData.length;
    return [X,Y,Z]
}

function Calculate(){
    var xyzText = document.getElementById("xyzText").value;
    xyzData = xyzText.split("\n");
    // get all atoms
    var allAtoms = []
    for (var i =0;  i<xyzData.length;i++){
        let xyz = xyzData[i].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        allAtoms.push(new atom(xyz[0],xyz[1],xyz[2],xyz[3]));
    }
    // make molecule
    mol = new molecule(allAtoms);
    Result = Diagonalization(mol.Hij,mol.Sij);
    console.log(Result[0]);
}

function colorSize(S){
    if (S === "H"){
        return 0xbdc3c7
    }
    else if (S === "He"){
        return 0x7f8c8d
    }
    else if (S === "Li"){
        return 0xf1c40f
    }
    else if (S === "Be"){
        return 0xf39c12
    }
    else if (S === "B"){
        return 0xd35400
    }
    else if (S === "C"){
        return 0x2c3e50
    }
    else if (S === "O"){
        return 0xe74c3c
    }
    else {
    return 0xcd3333
    }
}