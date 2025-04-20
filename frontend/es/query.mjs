export class BDTQuerier {
    manifest = {
        buses: [],
        lines: [],
        models: [],
        stops: []
    };
    constructor(manifest){
        this.manifest = manifest;
    }

    static async createQuerier(){
        try {
            let content = await (await fetch("/bdt_manifest.json")).text();
            let json = JSON.parse(content);
            return new BDTQuerier(json);
        } catch(e) {
            throw new Error("Cannot fetch manifest or manifest is in wrong format.");
        }
    }

    queryBus(string){
        let result = [];
        string = string.toLowerCase();
        for(let v of this.manifest.buses){
            if(v[0].toLowerCase().includes(string)){
                result.push(v);
            } else if (v[1].toLowerCase().includes(string)){
                result.push(v);
            }
            if(result.length >= 50){
                break;
            }
        }
        return result;
    }

    queryLine(string){
        string = string.toUpperCase();
        let result = [];
        for(let v of this.manifest.lines){
            if(!v.startsWith('H~') && v.toUpperCase().includes(string)){
                result.push(v);
            }
            if(result.length >= 50){
                break;
            }
        }
        return result;
    }

    queryModel(string){
        string = string.toUpperCase();
        let result = [];
        this.manifest.models.forEach(v => {
            if(v.toUpperCase().includes(string)){
                result.push(v);
            }
        })
        return result;
    }

    queryStop(string){
        string = string.toLowerCase();
        let result = [];
        for(let v of this.manifest.stops){
            if(v.flat(Infinity).map(v => v.toLowerCase()).some(e => e.includes(string))){
                result.push([v[0],v[1]]);
            }
            if(result.length >= 50){
                break;
            }
        }
        return result;
    }
}