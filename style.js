function setCanvas(){
    var h1 = document.getElementById('viewer').offsetHeight;
    var w1 = document.getElementById('viewer').offsetWidth;
    console.log(w1)
    document.querySelector('canvas').offsetWidth = w1;
    document.querySelector('canvas').style.width =document.getElementById('viewer').offsetWidth;
    };