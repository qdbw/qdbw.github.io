class BusLine {
    status = '';
    number = '';
    JSON_DATA;
    constructor(){}

    createBusRouteInstance(){
        let instance = new BusLine.classes.BusRoute;
        instance.mainRef = this;
        instance.status = this.status;
        instance.number = this.number;
        return instance;
    }

    static classes = {
        BusRoute: class {
            status = '';
            number = '';
            /**
             * @type {BusStation}
             */
            passedStations = [];
            mainRef;
            constructor(){}
        }
    }
}

export default BusLine;