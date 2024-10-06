import requestData from "../Data/Data.js";
import AutoTools from "./AutoTools.js";

const Data = requestData();

const modelDescriptionMap = new Map;
const wrappedText = new Map;

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
    if(wrappedText.has(stationName)){
        return wrappedText.get(stationName);
    }
    let result = (()=>{
        if (stationName.length < 6) {
            return stationName;
        }
        if (stationName.length == 6) {
            if ( stationName.indexOf('路') > 0 && stationName.indexOf('路') < 3) {
                let c = stationName.indexOf('路') + 1;
                return stationName.slice(0, c) + '<br>' + stationName.slice(c)
            } else {
                return stationName.slice(0, 3) + '<br>' + stationName.slice(3)
            }
        }
        if(stationName.indexOf('(') > 0 && stationName.indexOf('(') < 7){
            console.log(`DETECTED QUOTE ON TEXT(${stationName})`);
            let c = stationName.indexOf('(');
            return stationName.slice(0,c) + '<br>' + stationName.slice(c);
        }
        let zhan = stationName.indexOf('站');
        let lu = stationName.indexOf('路');
        if (zhan > 0 && zhan != stationName.length - 1) {
            return stationName.slice(0, zhan) + '<br>' + stationName.slice(zhan)
        }
        if (lu > 0 && lu < stationName.length - 1) {
            return stationName.slice(0, ++lu) + '<br>' + stationName.slice(lu)
        }
        let c = Math.floor(stationName.length / 2);
        return stationName.slice(0, c) + '<br>' + stationName.slice(c)
    })();
    wrappedText.set(stationName,result);
    return result;
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
    makeComfortWrap,
    AutoTools
}

export default tools;