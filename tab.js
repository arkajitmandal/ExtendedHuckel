function thisTab(i){
    for(var k=0;k<4;k++){
        document.getElementById("button"+String(k+1)).className = "inactiveButton";
        document.getElementById("tab"+String(k+1)).style.display="none";
    }
    document.getElementById("button"+String(i)).className = "activeButton";
    document.getElementById("tab"+String(i)).style.display="grid";
}

function resultType(inp=false){
    if (inp==false){var typeResult =  document.getElementById("resultType").value;}
    else {typeResult = inp}
    
    if (typeResult=="V"){
        document.getElementById("energyResults").style.display="none";
        document.getElementById("moType").style.display="block";
        document.getElementById("orbitalResult").style.display="block";
        molNo();
    }
    else {
        document.getElementById("orbitalResult").style.display="none";
        document.getElementById("energyResults").style.display="block";
        document.getElementById("moType").style.display="none";
    }

}

function molNo(){
    let N = mol.MOs.length;
    for (var i = 0; i < N ; i++) {
        document.getElementById("MOans" + String(i)).style.display = "none";
    }
    var activeMO = document.getElementById("moNum").value;
    document.getElementById("MOans" + activeMO).style.display = "block";
}


function moList(){
    let ans = "";
    let N = mol.MOs.length;
    var occ = occupy(mol);
    for (var i = 0; i < N ; i++) {
        var ith = i;
        var el = "";
        let select = ""
        var homolumo = "";
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
            homolumo = "(HOMO)";
            select = "selected"
        }
        // LUMO
        else if (occ[ith]==0 && occ[ith-1]==2 ){
            homolumo = "(LUMO)";
        }
        // SOMO
        else if (occ[ith]==1){
            homolumo = "(SOMO)";
            select = "selected"
        }
        
        ans += "<option value='" + String(i) +"' " + select + "> MO " + String(i) + "&nbsp;" + el + "&nbsp;" + homolumo + "</option>"
    }
    //console.log(ans)
    document.getElementById("moNum").innerHTML = ans;
}


function noKey(a) {
    control.noKeys = a;
    //console.log(control.noKeys);
}