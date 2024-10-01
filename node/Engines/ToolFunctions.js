import requestData from "../Data/Data.js";

const Data = requestData();

const modelDescriptionMap = new Map;

function getModelData(typeName) {
    if (modelDescriptionMap.has(typeName)) {
        return modelDescriptionMap.get(typeName);
    }
    let json;
    try {
        json = readFileSync(`data/model/${typeName}.json`).toString();
        json = JSON.parse(json);
    } catch (e) {
        json = {};
    }
    modelDescriptionMap.set(typeName, json);
    return json;
}

/**
 * 
 * @param {string} stationName 
 * @returns {string}
 */
function makeComfortWrap(stationName) {
    if (stationName.length < 6) {
        return stationName;
    }
    if (stationName.length == 6) {
        if (stationName.indexOf('路') < 3 && stationName.indexOf('路') > 0) {
            let c = stationName.indexOf('路') + 1;
            return stationName.slice(0, c) + '<br>' + stationName.slice(c)
        } else {
            return stationName.slice(0, 3) + '<br>' + stationName.slice(3)
        }
    }
    let zhan = stationName.indexOf('站');
    let lu = stationName.indexOf('路');
    if (zhan > 0 && zhan != stationName.length - 1) {
        return stationName.slice(0, zhan) + '<br>' + stationName.slice(zhan)
    }
    if (lu > 0 && lu != stationName.length - 1) {
        return stationName.slice(0, ++lu) + '<br>' + stationName.slice(lu)
    }
    let c = Math.floor(stationName.length / 2);
    return stationName.slice(0, c) + '<br>' + stationName.slice(c)
}

/**
 * 
 * @param {string} companyString 
 */
function resolveCompany(companyString) {
    if (Data.Companies.has(companyString)) {
        return Data.Companies.get(companyString).Name;
    }
    return companyString;
}

const tools = {
    getModelData,
    resolveCompany,
    makeComfortWrap
}

export default tools;