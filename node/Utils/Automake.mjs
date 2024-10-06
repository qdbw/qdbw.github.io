import { readFile, mkdir, writeFile } from "fs/promises";
import prettier from 'prettier';

import Manager from "../Engines/Pug.js";

async function make(templateName,variants,buildingPath){
    let result = Manager.render(templateName, variants);
    result = await prettier.format(result, {
        parser: "html"
    });
    await mkdir(buildingPath,{recursive: true});
    let previous_build = (await readFile(buildingPath+'index.html')).toString();
    if(previous_build === result){
        return {
            status: 'success',
            file: 'skipped',
            reason: 'sameWithPrevious'
        }
    };
    await writeFile(buildingPath + 'index.html', result);
    return {
        status: 'success',
        file: 'wrote',
        reason: ''
    }
}

export {
    make
};