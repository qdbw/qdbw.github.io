import Stop from "./stop.js";

class Station {
    /**
     * @type {Station.classes.PassedRoutes[]}
     */
    passedRoutes = {};
    description = '';
    location = '';
    aliases = new Set;
    roads = [];
    constructor(name = ''){
        this.name = name;
    }

    addRoad(road) {
        if ((!road) || this.roads.includes(road)) {
            return
        }
        this.roads.push(road);
    }

    createPassedRoutesDataInstance () {
        let instance = new Station.classes.PassedRoutes(this.name);
        instance.mainRef = this;
        return instance;
    }

    /**
     * 
     * @param {Stop} stop 
     */
    createPassedRoutesFromStop(stop,route) {
        if(route === undefined){
            throw new Error('Passed undefined as a Route!',stop,route);
        }
        let instance = new Station.classes.PassedRoutes(this.name);
        instance.mainRef = this;
        instance.alias = stop.aliasName;
        instance.routeRef = route;
        instance.option.hasAlias = stop.hasAliasName();
        instance.option.skipThis = stop.hasOption('skipThis');
        return instance;
    }

    static classes = {
        PassedRoutes: class {
            line = 999;
            type = 'CUSTOM';
            index = 0;
            alias = '';
            routeRef = undefined;
            option = {
                skipThis: false,
                hasAlias: false
            }
            constructor(name = ''){
                this.name = name;
            }
        }
    }
}

export default Station;