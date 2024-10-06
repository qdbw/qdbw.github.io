import { existsSync, readFileSync } from "fs";
import jsonc from 'jsonc-parser';

import requestData from "./Data.js";
import Markdown from "#Utils/Markdown";
import Station from "#Structures/Station";
import Line from "#Structures/Line";
import { resolveStationString } from "#Utils/Stations";

const Data = requestData();

/**
 * 
 * @param {Line} line 
 */
function readStationsOnLine(line){
    console.info(`==> Reading stations on line ID ${line.GlobalId} `);

    let passedStationNames = [];
    line.Routes.forEach(route => {
        route.StationStrings.forEach((value,index) => {
            let {name, displayName, options} = resolveStationString(value);
            if(! Data.Stations.has(name)){
                let json, desc;
                if(existsSync(`data/Stations/${name}/Main.jsonc`)){
                    json = jsonc.parse(readFileSync(`data/Stations/${name}/Main.jsonc`).toString());
                }
                if(existsSync(`data/Stations/${name}/Desc.md`)){
                    desc = Markdown.parse(readFileSync(`data/Stations/${name}/Desc.md`).toString());
                }
                Data.Stations.set(name, new Station(name, json, desc));
            }

            let station = Data.Stations.get(name);

            station.addAlias(displayName);

            if(! passedStationNames.includes(name)){
                passedStationNames.push(name);
            }
        });
    });

    passedStationNames.forEach((name) => {
        let station = Data.Stations.get(name);

        if(!station){
            throw new Error('Cannot get station by name: '+name+' from Map.');
        }

        station.addLine(line);
    })
}

function ReadStation(){
    for(let [lineId,line] of Data.Lines){
        readStationsOnLine(line);
    }
}

export default ReadStation;