export class BDTQuerier {
    manifest = {
        buses: [],
        lines: [],
        models: [],
        stops: []
    };
    constructor(manifest) {
        this.manifest = manifest;
    }

    static async createQuerier() {
        try {
            let content = await (await fetch("/bdt_manifest.json")).text();
            let json = JSON.parse(content);
            return new BDTQuerier(json);
        } catch (e) {
            throw new Error("Cannot fetch manifest or manifest is in wrong format.");
        }
    }

    queryBus(string) {
        let result = [];
        string = string.toLowerCase();
        let much = false;
        for (let v of this.manifest.buses) {
            if (v[0].toLowerCase().includes(string)) {
                result.push(v);
            } else if (v[1].toLowerCase().includes(string)) {
                result.push(v);
            }
            if (result.length >= 50) {
                much = true;
                break;
            }
        }
        return [result, much];
    }

    queryLine(string) {
        string = string.toUpperCase();
        let result = [];
        let much = false;
        for (let [v, vp] of this.manifest.lines) {
            if (!vp.startsWith('H~') && v.toUpperCase().includes(string) || !vp.startsWith('H~') && v.toUpperCase().includes(string)) {
                result.push([v,vp]);
            }
            if (result.length >= 50) {
                much = true;
                break;
            }
        }
        return [result, much];
    }

    queryModel(string) {
        string = string.toUpperCase();
        let result = [];
        let much = false;
        for (let v of this.manifest.models) {
            if (v.toUpperCase().includes(string)) {
                result.push(v);
            }
            if (result.length >= 50) {
                much = true;
                break;
            }
        }
        return [result, much];
    }

    queryStop(string) {
        string = string.toLowerCase();
        let result = [];
        let much = false;
        for (let v of this.manifest.stops) {
            if (v.flat(Infinity).map(v => v.toLowerCase()).some(e => e.includes(string))) {
                result.push([v[0], v[1]]);
            }
            if (result.length >= 50) {
                much = true;
                break;
            }
        }
        return [result, much];
    }
}