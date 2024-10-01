import { CTimeRecord } from "#Structures/FileStat";
import { StationLineRoute } from "#Structures/Station";
import { buildStationAndRoadReflect } from "#Utils/Stations";
import requestData from "../Data/Data.js";

const Data = requestData();

class Line {
    GlobalId = '';
    Name = '';
    Introduction = ''; // HTML
    Tags = [''];
    Companies = [''];
    TicketOptions = [''];
    IsHistoryLine = false;
    /**
     * @type {LineModel[]}
     */
    Models = [];
    /**
     * @type {LineRoute[]}
     */
    Routes = [];
    /**
     * @type {FromTo[]}
     */
    FromTo = [];

    /**
     * @type {CTimeRecord[]}
     */
    FileTimeRecords = [];

    /** 
     * @type {Map<string,Line>}
    */
    Histories = new Map;

    constructor(id,lineJson,models,routes,histories,filePaths,introduction = '',isHistory = false){
        this.GlobalId = id;
        this.Name = lineJson.Name;

        this.Tags = Array.from(lineJson.Tags ?? lineJson.TAGS ?? []);
        this.Companies = Array.from(lineJson.Companies ?? lineJson.COMPANIES ?? []);
        this.TicketOptions = Array.from(lineJson.TicketOptions ?? lineJson.Tickets ?? lineJson.TICKETS ?? []);
        this.Introduction = introduction;

        for(let [name,json] of Object.entries(models)){
            this.Models.push(new LineModel(name,json));
        }
        for(let [name,json] of Object.entries(routes)){
            this.Routes.push(new LineRoute(name,json,this));
        }
        for(let arr of lineJson.FromTo ?? lineJson.FROM_TO ?? []){
            this.FromTo.push(new FromTo(arr));
        }
        for(let tracker of filePaths){
            this.FileTimeRecords.push(new CTimeRecord(tracker));
        }
        if(!isHistory && histories){
            for(let [historyId,value] of Object.entries(histories) ){
                let historyGlobalId = id+'@'+historyId;
                let {
                    mainJson,
                    models,
                    routes,
                    histories,
                    trackList,
                    intro
                } = value;
                let historyLine = new Line(historyGlobalId,mainJson,models,routes,histories,trackList,intro,true);
                this.Histories.set(historyGlobalId, historyLine);
                Data.Lines.set(historyGlobalId,historyLine);
            }
        }
        this.IsHistoryLine = isHistory;
    }
}

class LineModel {
    ModelName = '';
    FuelType = '';
    constructor(name,json){
        this.ModelName = name;
        this.FuelType = json.FuelType ?? '';
    }
}

class FromTo {
    /**
     * @type {'NORMAL' | 'LOOP'}
     */
    type = 'NORMAL';
    stops = [''];

    constructor(fromToJson){
        if(fromToJson.length === 3){
            this.type = 'LOOP';
        } else {
            this.type = 'NORMAL';
        }
        this.stops = Array.from(fromToJson);
    }
}

class LineRoute {
    Name = '';
    Distance = 0;
    Times = [''];
    /**
     * @type {('Fixed'|'Interval')[]}
     */
    TimeOptions = [];
    /**
     * @type {StationLineRoute[]}
     */
    Stations = [];
    Roads = [];

    StationStrings = [''];
    RoadStrings = [''];

    Reflect = {};

    lineRef;

    /**
     * 
     * @param {string} name 
     * @param {object} json 
     * @param {Line} lineRef 
     */
    constructor(name,json,lineRef){
        this.Name = name;
        this.Distance = json.Distance ?? json.DISTANCE ?? 0;
        this.Times = Array.from(json.Times ?? json.TIMES ?? json.TIME ?? []);
        this.TimeOptions = Array.from(json.TimeOptions ?? json.Options ?? []);
        if(json.Route){
            this.RoadStrings = [];
            this.StationStrings = [];
            for(let routeObj of json.Route){
                let [key,value] = Object.entries(routeObj)[0];
                this.RoadStrings.push(key+' '+value.length);
                this.StationStrings.push(...value);
            }
            this.Reflect = json.Route;
        } else {
            console.warn(`[Structures/Line][LineRoute.constructor] Data of ${lineRef.GlobalId}/${name} uses Outdated route format. Reformatting...`);
            this.StationStrings = Array.from(json.Stations);
            this.RoadStrings = Array.from(json.Roads);
            this.Reflect = buildStationAndRoadReflect(this.StationStrings,this.RoadStrings);
        }

        this.lineRef = lineRef;
    }
}

export default Line;

export {
    Line,
    LineModel,
    FromTo,
    LineRoute
}