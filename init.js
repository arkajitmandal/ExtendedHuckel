function zoom(){
    var scale = 'scale(1)';
    document.body.style.webkitTransform =  scale;    // Chrome, Opera, Safari
     document.body.style.msTransform =   scale;       // IE 9
     document.body.style.transform = scale;     // General
    };

function onLoad(){
    //zoom();
    fileReader();
}

