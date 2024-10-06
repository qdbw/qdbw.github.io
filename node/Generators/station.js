import { readFileSync } from "fs";

import Manager from "../Engines/Pug.js";
import requestData from "../Data/Data.js";
import { make } from "#Utils/Automake";

const Data = requestData();
let template = readFileSync('TEMPLATES/station2.pug').toString();
const TEMPLATE_NAME = '@station.js/1';

Manager.set(TEMPLATE_NAME,template);

/**
 * 
 * @param {object} basicConf 
 * @param {Map<string,object>} stops 
 * @returns 
 */
function buildStationPages(basicConf){
    let results = {};
    let promises = [];
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
            $
        };
        results[name] = 1;
        promises.push(make(TEMPLATE_NAME, passVariants, buildingPath));
    }
    Promise.all(promises).then((value) => {
        let success = [], failed = [];
        let same = [];
        value.forEach(v => {
            switch(v.status){
                case 'success':
                    success.push(v)
                    break;
                case 'failed':
                    failed.push(v)
                    break;
            }
            switch(v.file){
                case 'skipped': {
                        if(v.reason === 'sameWithPrevious'){
                            same.push(v)
                        }
                    };
                    break;
            }
        });
        console.log(
`[Generators/Station] All tasks are completed.
                       Total: ${value.length}
                       Success: ${success.length}
                       Failed: ${failed.length}
                       Same with previous build: ${same.length}`
        );
    })
    return results;
}

// async function make(text,buildingPath){
//     let result = await prettier.format(text,{
//         parser: "html"
//     });
//     await mkdir(buildingPath,{recursive: true});
//     let previous_build = (await readFile(buildingPath+'index.html')).toString();
//     if(previous_build === result){
//         return {
//             status: 'success',
//             file: 'skipped',
//             reason: 'sameWithPrevious'
//         }
//     };
//     await writeFile(buildingPath + 'index.html', result);
//     return {
//         status: 'success',
//         file: 'wrote',
//         reason: ''
//     }
// }

export default buildStationPages;
