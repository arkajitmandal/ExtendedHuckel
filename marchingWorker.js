importScripts("./Lib/marchingcubes.js");
importScripts("wavefunction.js");
importScripts("MO.js");


function getSurfaceMesh(Nth,mol,bound,iso= -0.001,res=10){
    let Dat = marchingCubes([res,res,res],
        function(x,y,z) {
      return moProb(mol,Nth,x,y,z) - iso;
        }, [bound[2],bound[1]]);
    postMessage({'msg':'orbital computed','Dat':Dat,'cmd':'done'});
}



onmessage = function(e) {
    //console.log('received ' + e.data);
    let msg = e.data;
    if (msg.cmd == "Start"){
        getSurfaceMesh(msg.Nth,msg.mol,msg.bound,msg.iso,msg.res);
    }
}

