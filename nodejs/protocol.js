import basicConf from "./config.js";

class Protocol {
    static makeCompatible(json){
        if(!json.Tags){
            json.Tags = json.TAGS ?? [];
        }

        if((!json.Models) && json.MODELS) {
            json.Models = json.MODELS;
        }

        // do fallback
        if ((!json.Routes) && json.LINES) {
            json.Routes = json.LINES;
            for (let obj of Object.values(json.Routes)) {
                if (!obj.Stations) {
                    obj.Stations = obj.STOPS ?? [];
                }
                if (!obj.Roads) {
                    obj.Roads = obj.ROADS ?? [];
                }
            }
        }

        // do fallback
        if (json.Routes) {
            for (let [k, v] of Object.entries(json.Routes)) {
                let distance = v.Distance ?? v.DISTANCE ?? v.distance ?? 10;
                v.Distance = distance;

                let time = v.Times ?? v.TIME ?? [];
                v.Times = time;

                let timeOptions = v.TimeOptions ?? [];
                v.TimeOptions = timeOptions;

                let companies = v.Companies ?? v.COMPANIES ?? [];
                v.Companies = companies;
            }
        }
    }

    static getRoadAndStationEntries(routeJson){

    }

    static parseRoadAliases(roads) {
        if (!roads || !Array.isArray(roads)) {
            return [];
        }
        return roads.map(v => {
            let [roadName, passedCount, ...options] = v.split(" ");
            roadName = Object.keys(basicConf?.Aliases?.Roads ?? {})?.includes(roadName) ? basicConf.Aliases.Roads[roadName] : roadName;
            return [roadName, passedCount, ...options].join(" ");
        });
    }
}

export default Protocol;