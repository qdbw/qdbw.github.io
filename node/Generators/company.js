import { readFileSync, writeFile, mkdir, readFile } from "fs";
import prettier from "prettier";

import Manager from "../Engines/Pug.js";
import requestData from "../Data/Data.js";

const Data = requestData();
let template = readFileSync('TEMPLATES/company.pug').toString();

Manager.set('CompanyTemplate',template);

function buildCompanyPages(){
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
        let result = Manager.render('CompanyTemplate',passVariants);
        prettier.format(result,{
            parser: "html"
        }).then(value => {
            mkdir(buildingPath,{recursive: true},()=>{
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
            });
        });
    }
}

export default buildCompanyPages;
