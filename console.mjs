import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { parse, stringify} from "yaml";

function getObjectFilePath(location, company, subcompany, id) {
    let prefix = String(id).replace(/[0-9]*/g, '');
    let result = `${location}/${company}/${subcompany}/`;
    if (prefix != '') {
        result += `${prefix}/`;
    }
    let num_id = Number(String(id).replace(prefix, ''));
    let p_from = Math.floor(num_id / 100);
    result += `${prefix}${p_from}00-${prefix}${p_from}99/${location}-${company}-${subcompany}-${id}.yaml`;
    return result;
}

let operation = process.argv[2];

console.log("Operation:", operation);

let location = process.argv[3];

let company = process.argv[4];

let subcompany = process.argv[5];

let first_selector = process.argv[6];

let objectives = [];

let operation_detail_begin = 0;

switch (first_selector) {
    case 'single':
        // node console.mjs *opr *loc *com *subcom single *id ***
        objectives = [process.argv[7]];
        operation_detail_begin = 8;
        break;
    case 'from':
        // node console.mjs *opr *loc *com *subcom from *id_start to *id_end ***
        if (process.argv[8] != 'to') {
            throw new Error(`SyntaxError: to not found at process.argv[6]!`);
        }
        let prefix = String(process.argv[7]).replace(/[0-9]*/g, '');
        let prefix_to = String(process.argv[9]).replace(/[0-9]*/g, '');
        if (prefix != prefix_to) {
            throw new Error(`ValueError: prefix not match! From prefix: ${prefix}; To prefix: ${prefix_to}`);
        }
        operation_detail_begin = 10;
        let from = Number(String(process.argv[7]).replace(prefix, ''));
        let to = Number(String(process.argv[9]).replace(prefix, ''));
        for (let i = from; i <= to; i++) {
            objectives.push(`${prefix}${i}`);
        }
}

// console.log(`ObjectivePrefix:`, `${location}/${company}/${subcompany}`);
// console.log(`Objectives:`, objectives);

let objective_bypath = objectives.map(v => 'data/bus/' + getObjectFilePath(location, company, subcompany, v));

// console.log(`Objectives really:`, objective_bypath);

objective_bypath.forEach(v => {
    mkdirSync(dirname(v), {recursive: true});
    if(!existsSync(v)){
        writeFileSync(v,'');
    }
});

if(operation === 'modify') {
    let modify_type = process.argv[operation_detail_begin];
    if(modify_type === 'model'){
        let model_type = process.argv[operation_detail_begin+1];
        objective_bypath.forEach(v => {
            let raw_content = readFileSync(v).toString();
            let yaml_content = parse(raw_content);
            yaml_content.model = model_type;
            writeFileSync(v, stringify(yaml_content));
        });
    }
    else if(modify_type === 'history'){
        let date = process.argv[operation_detail_begin+1];
        let from = process.argv[operation_detail_begin+2];
        let to = process.argv[operation_detail_begin+3];
        console.log(`MODIFY History: From ${from} to ${to} in ${date}`);
        objective_bypath.forEach(v => {
            let raw_content = readFileSync(v).toString();
            let yaml_content = parse(raw_content);
            if(yaml_content.history) yaml_content.history = undefined;
            yaml_content.shift_records ??= [];
            for(let record of yaml_content.shift_records){
                if(record.date === date && record.from === from && record.to === to){
                    return;
                }
            }
            yaml_content.shift_records.push({
                date, from, to
            });
            yaml_content.shift_records.sort((a,b) => {
                let [ya,ma,da] = a.split('.');
                let [yb,mb,db] = b.split('.');
                // Compare by year, month, day (with optional MM and DD)
                ya = Number(ya);
                yb = Number(yb);
                if (ya !== yb) return ya - yb;
                ma = Number(ma || 0);
                mb = Number(mb || 0);
                if (ma !== mb) return ma - mb;
                da = Number(da || 0);
                db = Number(db || 0);
                return da - db;
            });
            writeFileSync(v, stringify(yaml_content));
        });
    }
}