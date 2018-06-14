var model; 
var renderer,scene,camera; 
var atomX,atomY,atomZ,atomRad;

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

function atom(a,b,c,d,col = 0xcd3333){

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
    for (var i =0;  i<xyzData.length;i++){
        let xyz = xyzData[i].split(" ")
        atom(xyz[1],xyz[2],xyz[3],1.0)
    }
}