import { readFile, writeFile } from "fs/promises";

function range(from,to){
    to ??= from = 0, from;
    let result = [];
    for(;from<to;from++){
        result.push(from);
    }
    return result
}

const source_num = 2195;
const end_num = 2212;
let start_num;
start_num ??= source_num+1;

const source = `data/bus/DD/DD${Math.floor(source_num / 100)}00-DD${Math.floor(source_num / 100)}99/DD${String(source_num).padStart(3,'0')}.json`;
const targets = [ ...range(start_num,end_num+1).map(v => `data/bus/DD/DD${Math.floor(v / 100)}00-DD${Math.floor(v / 100)}99/DD${String(v).padStart(3,'0')}.json`)];

let source_content = (await readFile(source)).toString();

await Promise.all(targets.map(v => (async()=>{
    await writeFile(v,source_content);
})()))
