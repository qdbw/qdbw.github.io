class Route {
    allStationsRaw = [];
    allRoadsRaw = [];
    allStations = [];
    allRoads = [];
    constructor(routeJson){
        this.allStationsRaw.push(...routeJson?.Stations ?? []);
        this.allRoadsRaw.push(...routeJson?.Roads ?? []);
    }
}

export default Route;