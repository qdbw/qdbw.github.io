import { existsSync, readFileSync } from "fs";
import jsonc from 'jsonc-parser';

import Configurations from "../Configuration.js";
import Markdown from "#Utils/Markdown";
import requestData from "./Data.js";
import Line from "#Structures/Line";

const { Lines } = requestData();

function reads(lineDataRoot){
    let mainJson = jsonc.parse(readFileSync(`${lineDataRoot}/Main.jsonc`).toString());
    // let models = mainJson.Models; // @TODO
    let models = jsonc.parse(readFileSync(`${lineDataRoot}/Models.jsonc`).toString());
    let routes = {};
    mainJson.Routes.forEach(v => {
        routes[v] =
            jsonc.parse(readFileSync(`${lineDataRoot}/Route.${v}.jsonc`).toString());
    });
    let histories = mainJson.Histories ?? [];
    let trackList = ['Main.jsonc','Models.jsonc',...mainJson.Routes.map(v => 'Route.'+v+'.jsonc'),'Thanks.jsonc'].map(v => lineDataRoot+'/'+v);
    let intro = '';
    if(existsSync(`${lineDataRoot}/Desc.md`)){
        intro = Markdown.parse(readFileSync(`${lineDataRoot}/Desc.md`).toString());
    }
    if(!models){
        console.warn(`[Data/ReadLine] detected undefined model at (${mainJson.Name})/Models.jsonc`);
        models = mainJson.Models ?? {};
    }
    return {
        mainJson,
        models,
        routes,
        histories,
        trackList,
        intro
    }
}

function ReadLine() {
    // lines
    let lineTargets = Configurations.Line.All;
    for (let target of lineTargets) {
        if(existsSync(`data/Lines/${target}/Main.jsonc`)){
            // Use new codes
            let lineDataRoot = `data/Lines/${target}`;
            let {
                mainJson,
                models,
                routes,
                histories,
                trackList,
                intro
            } = reads(lineDataRoot);
            
            if(histories.length > 0){
                let _histories = {};
                for(let historyId of histories){
                    _histories[historyId] = reads(lineDataRoot+'/Histories/'+historyId);
                }
                histories = _histories;
            } else {
                histories = undefined;
            }

            let line = new Line(target,mainJson,models,routes,histories,trackList,intro);

            Lines.set(target,line);
        } else {
            console.warn(`[Data/ReadLine] Cannot read data of ${target}: No such file: data/lines/${target}/Main.jsonc`);
        }
    }

    let lineArray = Array.from(Lines.values());

    Configurations.Line.RecentUpdates.push(...lineArray.sort((a, b) => {
        let newestOfA = new Date('1970-1-1'),newestOfB = new Date('1970-1-1');
        for(let v of Object.values(a.FileTimeRecords)){
            if(v.changeTime > newestOfA) newestOfA = v.changeTime;
        }
        for(let v of Object.values(b.FileTimeRecords)){
            if(v.changeTime > newestOfB) newestOfB = v.changeTime;
        }
        return newestOfA > newestOfB ? -1 : 1
    }).splice(0, Configurations.Main.RecentUpdateCount));
}

export default ReadLine;