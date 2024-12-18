import Company from "#Structures/Company";
import Line from "#Structures/Line";
import Station from "#Structures/Station";

import buildPhotoDatabase from "./Photo.js";
import { readFileSync } from "fs";

/**
 * @type {Map<string,Line>}
 */
const Lines = new Map();
/**
 * @type {Map<string,Station>}
 */
const Stations = new Map();
/**
 * @type {Map<string,Company>}
 */
const Companies = new Map();

let Photo = {};

function requestData(){
    let photoJson = JSON.parse(readFileSync('BASIC.photo.json').toString());
    Photo = buildPhotoDatabase(photoJson);
    Object.freeze(Photo);
    return {
        Lines,
        Stations,
        Companies,
        Photo
    }
}

export default requestData;

export {
    Lines,
    Stations,
    Companies,
    Photo
}