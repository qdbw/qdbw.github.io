import { readFileSync, statSync, existsSync, read } from "fs";
import basicConf from "./config.js";
import QDB from "./struct/mod.js";
import Protocol from "./protocol.js";

/**
 * @type {Map<string,object>}
 */
let lines = new Map;
/**
 * @type {Map<string,{data:QDB.Bus.Station}>}
 */
let stops = new Map;
/**
 * @type {Map<string,object>}
 */
let models = new Map;

let recentUpdateCount = basicConf.Variants.RecentUpdateCount ?? 10;
let recentUpdates = [];

function init(basicConf) {
    // lines
    let lineTargets = basicConf.LINES.map(v => v.toString());
    for (let target of lineTargets) {
        let dataSourcePath = `data/line/${target}.json`;

        let isExists = existsSync(dataSourcePath);

        let rawjson = {};
        let json = {};
        let status = 'SUCCESS';

        if (isExists) {
            rawjson = JSON.parse(readFileSync(dataSourcePath).toString());
            let stat = statSync(dataSourcePath);
            json = rawjson;
            json.changeTime = stat.ctime;
            json.changeTimeString = stat.ctime.toLocaleString();
            json.createTime = stat.birthtime;
            json.createTimeString = stat.birthtime.toLocaleString();
        } else {
            console.warn(`[data] existSync("${dataSourcePath}") returns false. Skip data reading of ${dataSourcePath}.`);
            status = 'FAILURE';
        }

        let lineDataInstance = new QDB.Bus.Line;

        lineDataInstance.status = status;
        lineDataInstance.number = target;

        json.status = status;
        json.data = lineDataInstance;

        lineDataInstance.JSON_DATA = json;

        lines.set(target, json);

        Protocol.makeCompatible(json);

        // get stops
        if (json.Routes) {
            for (let [k, v] of Object.entries(json.Routes)) {
                let stopList = v.Stations;
                v.Roads = Protocol.parseRoadAliases(v.Roads);
                let roadList = v.Roads ?? [];
                let roadStopIndex = [];
                roadList.forEach(v => {
                    let [name, count] = v.split(" ");
                    for (let i = 0; i < count; i++) {
                        roadStopIndex.push(name);
                    }
                });

                let routeDataInstance = lineDataInstance.createBusRouteInstance();
                v.data = routeDataInstance;

                for (let [i, stopName] of Object.entries(stopList)) {
                    i = parseInt(i);
                    let busStop = new QDB.Bus.Stop(stopName);
                    if (basicConf.IgnoreStops.includes(busStop.name)) {
                        continue;
                    }
                    stops.hasNotThenSet(busStop.name, {
                        data: new QDB.Bus.Station(busStop.name)
                    });
                    
                    let dataInstance = stops.get(busStop.name).data;
                    let passedRoutesInstance = dataInstance.createPassedRoutesFromStop(busStop,routeDataInstance);

                    passedRoutesInstance.index = i + 1;
                    passedRoutesInstance.line = target;
                    passedRoutesInstance.type = k;

                    dataInstance.addRoad(roadStopIndex[i]);

                    if (busStop.hasAliasName()) {
                        dataInstance.aliases.add(busStop.aliasName);
                    }
                    if (!dataInstance.passedRoutes[target]) {
                        dataInstance.passedRoutes[target] = [];
                    }
                    dataInstance.passedRoutes[target].push(passedRoutesInstance);
                    routeDataInstance.passedStations.push(passedRoutesInstance);
                };
            }
        }
    }

    let lineArray = Array.from(lines.values().filter(v=>v.NUMBER));

    recentUpdates.push(...lineArray.sort((a, b) => {
        let atime = a.changeTime;
        let btime = b.changeTime;
        return atime > btime ? -1 : 1
    }).splice(0, recentUpdateCount));

    basicConf.STOPS = Array.from(stops.keys()).sort();
}

function getData() {
    return {
        lines,
        stops,
        models,
        recentUpdates
    }
}

export default getData;

export {
    getData,
    init
}