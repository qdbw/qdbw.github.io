import { readFileSync, writeFile, mkdir, readFile } from "fs";
import prettier from "prettier";

import Manager from "../Engines/Pug.js";
import requestData from "../Data/Data.js";
import getData from "../../nodejs/data.js";

const Data = requestData();
let data = getData();
let templateOld = readFileSync('TEMPLATES/station.pug').toString();
let template = readFileSync('TEMPLATES/station2.pug').toString();
let modelDescriptionMap = new Map();

Manager.set('StationTemplate',templateOld);
Manager.set('StationTemplate2',template);

function getModelData(typeName) {
    if (modelDescriptionMap.has(typeName)) {
        return modelDescriptionMap.get(typeName);
    }
    let json;
    try {
        json = readFileSync(`data/model/${typeName}.json`).toString();
        json = JSON.parse(json);
    } catch(e) {
        json = {};
    }
    modelDescriptionMap.set(typeName, json);
    return json;
}

function getLineData(lineName) {
    return data.lines.get(lineName);
}

/**
 * 
 * @param {object} basicConf 
 * @param {Map<string,object>} stops 
 * @returns 
 */
function buildStationPages(basicConf){
    let results = {};
    // for (let [target,targetData] of data.stops) {
    //     let dataSourcePath = `data/stop/${target}.json`, buildingPath = `stations/${target}/`;
    //     let $ = {
    //         htmlFileDepth: 2,
    //         hmtlPath: buildingPath
    //     };
    //     let Json;
    //     try {
    //         Json = JSON.parse(readFileSync(dataSourcePath).toString());
    //     } catch(e) {
    //         if(!basicConf.Options.includes("IgnoreNoDataOfStations")){
    //             console.warn(`[WARNING] Cannot read data of bus station ${target} in ${dataSourcePath}, use default building of ${buildingPath}!`);
    //         }
    //         results[target] = -2;
    //         Json = {};
    //     }
    //     let result = Manager.render('StationTemplate', {
    //         ...basicConf,
    //         ...Json,
    //         ...targetData,
    //         globalData: data,
    //         Data,
    //         getModelData,
    //         getLineData,
    //         $
    //     });
    //     results[target] = 1;
    //     if(Json.IS_WORKING || Json.IsStillWorking){
    //         results[target] = 2;
    //     }

    //     mkdir(buildingPath,{recursive: true},()=>{
    //         writeFile(buildingPath+'index.html', result, (e) => { if (e) throw e });
    //     })
    // }
    for(let [name,station] of Data.Stations){
        let buildingPath = `stations/${station.GlobalId}/`;
        let $ = {
            htmlFileDepth: 2,
            hmtlPath: buildingPath
        };
        let passVariants = {
            ...basicConf,
            Current: station,
            Data,
            getModelData,
            getLineData,
            $
        };
        results[name] = 1;
        let result = Manager.render('StationTemplate2',passVariants);
        prettier.format(result,{
            parser: "html"
        }).then(value => {
            mkdir(buildingPath,{recursive: true},(err)=>{
                if(err) throw err;
                readFile(buildingPath+'index.html',(err,raw)=>{
                    if(err || raw.toString() !== value){
                        writeFile(buildingPath + 'index.html', value, (e) => {
                            if (e) throw e;
                            else {
                                console.log(`:: Generated ${buildingPath}index.html`);
                            }
                        });
                    } else {
                        console.info(`:: Generated ${buildingPath}index.html same with previous build.`);
                    }
                })
                // writeFile(buildingPath+'index.html', value, (e) => { if (e) throw e });
            });
        });
    }
    return results;
}

export default buildStationPages;
