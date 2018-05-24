class atom {
    
    constructor(Symbol, EnergyLevel){
        this.Symbol = Symbol;
        this.EnergyLevel = EnergyLevel;
    }

   
}

    function createAndPrint(){
            hydrogen = new atom("h", ["1s"]);
            console.log(hydrogen.Symbol);
            console.log(hydrogen.EnergyLevel);

    }