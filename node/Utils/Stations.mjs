/**
 * 
 * @param {string} stationString 
 */
function resolveStationString(stationString) {
    let [name, displayName, option] = stationString.split(" ");
    let options = [''];
    if (displayName === undefined || displayName === '_') {
        displayName = name;
    }
    if (option != undefined) {
        options = option.split(',');
    }
    return {
        name,
        displayName,
        options
    };
}

/**
 * 
 * @param {string[]} stations 
 * @param {string[]} roads 
 */
function buildStationAndRoadReflect(stations, roads) {
    let Route = [];
    let N = 0;
    for (let road of roads) {
        let i = {};
        let [name, count] = road.split(" ");
        count = parseInt(count);
        i[name] = [...stations.slice(N, N + count)];
        N += count;
        Route.push(i);
    }
    return Route;
}


export {
    resolveStationString,
    buildStationAndRoadReflect
};