import { readFile, writeFile } from "fs/promises";

function range(from,to){
    to ??= from = 0, from;
    let result = [];
    for(;from<to;from++){
        result.push(from);
    }
    return result
}

const type = 'BS';
const data_type = 'yaml';
const source_num = 583
const end_num = 597
let start_num
start_num ??= source_num+1;

let pad_count = 3;
if(type == 'BS' || type == 'CY') {
    pad_count = 4;
}

const source = `data/bus/${type||'_plain'}/${type}${String(Math.floor(source_num / 100)).padStart(pad_count-2,'0')}00-${type}${String(Math.floor(source_num / 100)).padStart(pad_count-2,'0')}99/${type}${String(source_num).padStart(pad_count,'0')}.${data_type}`;
const targets = [ ...range(start_num,end_num+1).map(v => `data/bus/${type||'_plain'}/${type}${String(Math.floor(v / 100)).padStart(pad_count-2,'0')}00-${type}${String(Math.floor(v / 100)).padStart(pad_count-2,'0')}99/${type}${String(v).padStart(pad_count,'0')}.${data_type}`)];

let source_content = (await readFile(source)).toString();

await Promise.all(targets.map(v => (async()=>{
    await writeFile(v,source_content);
})()))
