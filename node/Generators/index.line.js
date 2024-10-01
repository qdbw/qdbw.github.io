import { readFile } from "fs/promises";
import { writeFile } from "fs";

import Manager from "../Engines/Pug.js";
import Configurations from "../Configuration.js";
import getData from "../../nodejs/data.js";
import requestData from "../Data/Data.js";

let indexTemplate = (await readFile('TEMPLATES/index.line.pug')).toString();

Manager.set('IndexLineTemplate',indexTemplate);

const Data = requestData();
let datas = getData();

function buildIndexLinePage(variants){
    let $ = {
        htmlFileDepth: 1
    };
    let passVariants = {
        ...variants,
        data: datas,
        Data,
        Profile: Configurations,
        globalData: datas,
        $
    }

    let result = Manager.render('IndexLineTemplate',passVariants);

    writeFile(`lines/index.html`, result, (e) => { if (e) throw e });
}

export default buildIndexLinePage;