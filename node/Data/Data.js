import Company from "#Structures/Company";
import Line from "#Structures/Line";
import Station from "#Structures/Station";

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

function requestData(){
    return {
        Lines,
        Stations,
        Companies
    }
}

export default requestData;

export {
    Lines,
    Stations,
    Companies
}