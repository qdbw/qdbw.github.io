import { readFile } from "fs/promises";
import { writeFile } from "fs";

import Manager from "../Engines/Pug.js";
import Configurations from "../Configuration.js";
import requestData from "../Data/Data.js";

let indexTemplate = (await readFile('TEMPLATES/index.company.pug')).toString();

Manager.set('IndexComTemplate',indexTemplate);

const Data = requestData();

function buildIndexCompanyPage(){
    let $ = {
        htmlFileDepth: 1
    };
    let passVariants = {
        Data,
        Profile: Configurations,
        $
    }

    let result = Manager.render('IndexComTemplate',passVariants);

    writeFile(`companies/index.html`, result, (e) => { if (e) throw e });
}

export default buildIndexCompanyPage;