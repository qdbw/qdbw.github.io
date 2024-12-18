import {
    readFileSync,
} from "fs";

import Manager from "../Engines/Pug.js";
import requestData from "../Data/Data.js";
import { make } from "#Utils/Automake";

let template = readFileSync('TEMPLATES/line.pug').toString();
const TEMPLATE_NAME = '@line.js/1';

Manager.set(TEMPLATE_NAME, template);

const Data = requestData();

function buildLinePages(basicConf) {
    let results = {};
    let promises = [];
    for (let [number, line] of Data.Lines) {
        let buildingPath = `lines/${number}/`;
        let $ = {
            htmlFileDepth: 2,
            hmtlPath: buildingPath
        };
        let passVariants = {
            // ...basicConf,
            Current: line,
            Data,
            $
        }
        results[number] = 1;
        if (line.IS_WORKING ?? line.IsStillWorking) {
            results[number] = 2;
        }
        promises.push(make(TEMPLATE_NAME,passVariants, buildingPath));
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
`[Generators/Line] All tasks are completed.
                    Total: ${value.length}
                    Success: ${success.length}
                    Failed: ${failed.length}
                    Same with previous build: ${same.length}`
        );
    })
    return results;
}

export default buildLinePages;