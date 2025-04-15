import { readFile, writeFile } from "fs/promises";

function range(from,to){
    to ??= from = 0, from;
    let result = [];
    for(;from<to;from++){
        result.push(from);
    }
    return result
}

const source_num = 170;
const end_num = 184;


const source = `data/bus/DD/DD100-DD199/DD${String(source_num).padStart(3,'0')}.json`;
const targets = [ ...range(source_num+1,end_num+1).map(v => `data/bus/DD/DD100-DD199/DD${String(v).padStart(3,'0')}.json`)];

let source_content = (await readFile(source)).toString();

await Promise.all(targets.map(v => (async()=>{
    await writeFile(v,source_content);
})()))