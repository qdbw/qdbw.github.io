import {
    writeFile,
    mkdir,
    readFileSync,
    readFile
} from "fs";
import prettier from 'prettier';

import Manager from "../Engines/Pug.js";
import requestData from "../Data/Data.js";
import getData from "../../nodejs/data.js";

let template = readFileSync('TEMPLATES/line.pug').toString();

Manager.set('LineTemplate', template);

const Data = requestData();
let data = getData();

function renderAndWrite(buildingPath,passVariants){
    let result = Manager.render('LineTemplate', passVariants);
    prettier.format(result, {
        parser: "html"
    }).then(value => {
        mkdir(buildingPath, {
            recursive: true
        }, () => {
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

function buildLinePages(basicConf) {

    let results = {};
    for (let [target, json] of data.lines) {
        if (Data.Lines.has(target)) continue;
        if (json.status === 'FAILURE') {
            continue;
        }
        let buildingPath = `lines/${target}/`;
        let $ = {
            htmlFileDepth: 2,
            hmtlPath: buildingPath
        };
        let passVariants = {
            ...basicConf,
            ...json,
            globalData: data,
            Data,
            $
        }
        results[target] = 1;
        if (json.IS_WORKING ?? json.IsStillWorking) {
            results[target] = 2;
        }
        let result = Manager.render('LineTemplate', passVariants);
        mkdir(buildingPath, {
            recursive: true
        }, () => {
            writeFile(buildingPath + 'index.html', result, (e) => {
                if (e) throw e;
                else {
                    console.log(`:: Generated legacy page ${buildingPath}index.html`);
                }
            });
        })
    }
    for (let [number, line] of Data.Lines) {
        let buildingPath = `lines/${number}/`;
        let $ = {
            htmlFileDepth: 2,
            hmtlPath: buildingPath
        };
        let passVariants = {
            ...basicConf,
            ...data.lines.get(number), // old compatible
            Current: line,
            globalData: data,
            Data,
            $
        }
        results[number] = 1;
        if (line.IS_WORKING ?? line.IsStillWorking) {
            results[number] = 2;
        }
        console.log(`:: Generating page for line ID(${number})`);
        renderAndWrite(buildingPath,passVariants);
    }
    return results;
}

export default buildLinePages;