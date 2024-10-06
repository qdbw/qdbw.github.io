import { Line, LineRoute } from "#Structures/Line";
import { resolveStationString } from "#Utils/Stations";

class Station {
    GlobalId = '';
    Name = '';
    DisplayName = '';
    /**
     * @type {Map<string,StationLine>}
     */
    Lines = new Map();
    Alias = [''];
    Roads = [''];
    Description = '';
    TitleHtml = '';

    constructor(Name, json = {}, Description = ''){
        this.Name = Name;
        this.DisplayName = json.Name ?? json.Station ?? Name;
        this.Alias = [];
        this.Roads = [];
        this.TitleHtml = json.TitleHtml;
        this.Description = Description;
        this.GlobalId = json.Id ?? Name;
    }

    /**
     * 
     * @param {Line} line 
     */
    addLine(line){
        this.Lines.set(line.GlobalId,new StationLine(line,this));
    }

    /**
     * 
     * @param {string} road 
     */
    addRoad(road){
        if(!this.Roads.includes(road)){
            this.Roads.push(road);
        }
    }

    /**
     * 
     * @param {string} alias 
     */
    addAlias(alias){
        if(!this.Alias.includes(alias) && alias != this.Name){
            this.Alias.push(alias);
        }
    }
}

class StationLine {
    Line;
    /**
     * @type {Map<string,StationLineRoute>}
     */
    Routes = new Map();

    /**
     * @type {Station}
     */
    StationRef;

    /**
     * 
     * @param {Line} line 
     * @param {Station} stationRef
     */
    constructor(line,stationRef){
        this.Line = line;
        this.StationRef = stationRef;

        for(let route of line.Routes){
            let resolvedes = route.StationStrings.map(v => resolveStationString(v));
            for(let {name} of resolvedes){
                if(name === stationRef.Name){
                    this.Routes.set(route.Name,new StationLineRoute(route,this));
                    break;
                }
            }
        }
    }
}

class StationLineRoute {
    Index = 0;
    DisplayName = '';

    /**
     * @type {StationLine}
     */
    LineRef;
    Route;

    /**
     * 
     * @param {LineRoute} route 
     * @param {StationLine} lineRef 
     */
    constructor(route,lineRef){
        this.LineRef = lineRef;
        this.Route = route;
        // for(let [i,v] of route.StationStrings.entries()){
        //     let resolved = resolveStationString(v);
        //     if(resolved.name === lineRef.StationRef.Name){
        //         this.Index = i;
        //         this.DisplayName = resolved.displayName;
        //         break;
        //     }
        // }

        let i = 0;
        for(let obj of Object.values(route.Reflect)){
            let [roadName,stations] = Object.entries(obj)[0];
            for(let {name,displayName} of stations.map((v) => resolveStationString(v))){
                i++;
                if(name === lineRef.StationRef.Name){
                    lineRef.StationRef.addRoad(roadName);
                    this.Index = i;
                    this.DisplayName = displayName ?? lineRef.StationRef.DisplayName;
                    break;
                }
            }
        }
    }
}

export default Station;

export {
    Station,
    StationLine,
    StationLineRoute
}