import { readFileSync } from "node:fs";
import getStringFmt from "./stringFormats.js";
import buildPhotoDatabase from "./photo.js";
import Configurations from "../node/Configuration.js";

let basicConf = JSON.parse(readFileSync("BASIC.json").toString());

basicConf.LINES = Configurations.Line.LegacyBuilds;

let photoJson = JSON.parse(readFileSync('BASIC.photo.json').toString());

basicConf.OBJECT_LINE_NAME = function (key) {
    return {
        key,
        'DOWN': '下行',
        'UP': '上行',
        'AREA': '区间',
        'ROUND': '环行',
        'Uplink': '上行',
        'Downlink': '下行',
        'LoopLine': '环行',
    }
};

basicConf.FT_ARRAY_TO_STRING = function (FROM_TO,variant) {
    let TAG_START = ' ', TAG_END = ' ';
    switch(variant) {
        case 'SMALL':
            TAG_START = '<small>';
            TAG_END = '<small>';
            break;
        case 'SYMBOL':
            TAG_START = '<span class="--stretch">';
            TAG_END = '</span>';
            break;
        default: 
            break;
    }
    if (FROM_TO.length === 1) {
        if (FROM_TO[0].length === 2) {
            return `${FROM_TO[0][0]}${TAG_START}⇌${TAG_END}${FROM_TO[0][1]}`
        } else if (FROM_TO[0].length === 3) {
            if (FROM_TO[0][0] === FROM_TO[0][2]) {
                return `${FROM_TO[0][0]}${TAG_START}⇌${TAG_END}${FROM_TO[0][1]}`
            }
            return `${FROM_TO[0][0]}${TAG_START}&rarr;${TAG_END}${FROM_TO[0][1]}${TAG_START}&rarr;${TAG_END}${FROM_TO[0][2]}`
        }
    }
}

basicConf.FT_ARRAY_IS_LOOP = function (FROM_TO) {
    if (FROM_TO.length === 1) {
        if (FROM_TO[0].length === 2) {
            return false
        } else if (FROM_TO[0].length === 3) {
            return true
        }
    }
}

basicConf.StringFormats = getStringFmt(basicConf);

basicConf.Photo = buildPhotoDatabase(photoJson);

export default basicConf;