//Usage calZeff(1,"1s",["1s1","2s2"]);

// This is the file to calculate zeff 
var toGroupValue= function(nl){
    // Asigns a value corresponding to orbital
    // take n and l as [n,l] input
    s=1;
    p=1;
    d=2;
    f=3;
    n = nl[0];
    l = nl[1];
    
    return parseFloat(n)*10+eval(l);
    }

var getEffective =function(nle,nl){
    n=parseFloat(nle[0]);
    l=nle[1];
    e=parseFloat(nle.slice(2,nle.length));
        
    groupValO=toGroupValue(nl);
    groupVal=toGroupValue(nle);
        
    //End correction 
    corr=0
    if (nl === nle.slice(0,2) && n==1){
        corr =0.30;
        }
        
    if (nl === nle.slice(0,2) && n!=1) {
        corr= 0.35;
        }
        
    //If it is a Upper Group interaction
            
    if (groupValO<groupVal){return 0;}
    //If it is a Same Group interaction
    if (groupVal === groupValO){
        //If n=1
        if (n==1){
        //console.log("Added: 0.30*"+e+"-"+corr);
        return e*0.30 -corr;
        }
        //If n!=1
        else {
            //console.log("Added: 0.35*"+e+"-"+corr);
            return e*0.35 -corr;
                }
        }
        
        //If it is a Prev Group interaction
        // For s and p
        //console.log(nle[0]+" "+nl[0])
        if ((nl[1] == "s" || nl[1] == "p" )&& (nl[0]-nle[0])==1){
        // when 0.85
        // console.log("Added: 0.85*"+e);
            return e*0.85
                
        }
        //For d and f     
            else{ 
                if ( groupVal<groupValO){
                    //console.log("Added: 1*"+e);
                    return 1*e;
                    
                }
            }
    }
// Calculation of Sigma 
var calSigma = function(selOrb,eConf){
sigma=0
for (var i =0 ; i <eConf.length ; i=i+1){
	thisOne=getEffective(eConf[i],selOrb);
	sigma=sigma+thisOne; 
	}
return sigma;
}

var calZeff= function(p,selOrb,eConf){
    return p- calSigma(selOrb,eConf);
    
    }