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
        console.log("[QUERIER] requested bus quering <" + string + ">");
        let result = [];
        string = string.toLowerCase();
        this.manifest.buses.forEach(v => {
            if(v.toLowerCase().includes(string)){
                result.push(v);
            }
        })
        return result;
    }

    queryLine(string){
        let result = [];
        this.manifest.lines.forEach(v => {
            if(!v.startsWith('H~') && v.includes(string)){
                result.push(v);
            }
        })
        return result;
    }

    queryModel(string){
        let result = [];
        this.manifest.models.forEach(v => {
            if(v.includes(string)){
                result.push(v);
            }
        })
        return result;
    }

    queryStop(string){
        let result = [];
        this.manifest.stops.forEach(v => {
            if(v[0].includes(string)){
                result.push(v[0]);
            } else if (v[1].some(e => e?.includes(string))){
                result.push(v[0]);
            }
        })
        return result;
    }
}