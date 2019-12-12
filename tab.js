function thisTab(i){
    for(var k=0;k<4;k++){
        document.getElementById("button"+String(k+1)).className = "inactiveButton";
        document.getElementById("tab"+String(k+1)).style.display="none";
    }
    document.getElementById("button"+String(i)).className = "activeButton";
    document.getElementById("tab"+String(i)).style.display="grid";
}