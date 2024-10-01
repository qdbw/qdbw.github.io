import Manager from "../Engines/Pug.js";
import { readFile } from "fs/promises";
import { writeFile } from "fs";

import getData from "../../nodejs/data.js";
import requestData from "../Data/Data.js";
import Configurations from "../Configuration.js";

let indexTemplate = (await readFile('TEMPLATES/index.pug')).toString();

Manager.set('IndexTemplate',indexTemplate);

const Data = requestData();
let datas = getData();

function buildIndexPage(variants){
    let $ = {
        htmlFileDepth: 0
    };
    let passVariants = {
        ...variants,
        Data,
        Profile: Configurations,
        data: datas,
        globalData: datas,
        $
    }

    let result = Manager.render('IndexTemplate',passVariants);

    writeFile(`index.html`, result, (e) => { if (e) throw e });
}

export default buildIndexPage;