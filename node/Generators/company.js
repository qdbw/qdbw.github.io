import { readFileSync } from "fs";

import Manager from "../Engines/Pug.js";
import requestData from "../Data/Data.js";
import { make } from "#Utils/Automake";

const Data = requestData();
let template = readFileSync('TEMPLATES/company.pug').toString();
const TEMPLATE_NAME = '@company.js/1';

Manager.set(TEMPLATE_NAME,template);

function buildCompanyPages(){
    let promises = [];
    for(let [name,company] of Data.Companies){
        let buildingPath = `companies/${name}/`;
        let $ = {
            htmlFileDepth: 2 + [...name].filter(v => v == '/').length,
            hmtlPath: buildingPath
        };
        let passVariants = {
            Current: company,
            Data,
            $
        };
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
`[Generators/Company] All tasks are completed.
                       Total: ${value.length}
                       Success: ${success.length}
                       Failed: ${failed.length}
                       Same with previous build: ${same.length}`
        );
    })
}

export default buildCompanyPages;
