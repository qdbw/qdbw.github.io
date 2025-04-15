import { readFile, writeFile } from "fs/promises";

function range(from,to){
    to ??= from = 0, from;
    let result = [];
    for(;from<to;from++){
        result.push(from);
    }
    return result
}

const type = 'KT';
const data_type = 'yaml';
const source_num = 101;
const end_num = 126;
let start_num;
start_num ??= source_num+1;

const source = `data/bus/${type}/${type}${Math.floor(source_num / 100)}00-${type}${Math.floor(source_num / 100)}99/${type}${String(source_num).padStart(3,'0')}.${data_type}`;
const targets = [ ...range(start_num,end_num+1).map(v => `data/bus/${type}/${type}${Math.floor(v / 100)}00-${type}${Math.floor(v / 100)}99/${type}${String(v).padStart(3,'0')}.${data_type}`)];

let source_content = (await readFile(source)).toString();

await Promise.all(targets.map(v => (async()=>{
    await writeFile(v,source_content);
})()))
