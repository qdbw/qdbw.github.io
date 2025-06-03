export class RouteInfoContainer {
    name = '';
    roads_stringlist = [];
    stops_stringlist = [];
    distance = 0;
    distance_string = '';
    time_details = {
        first: '',
        last: ''
    };
    data = [{ road_name: [] }];
    data_stringobject = [{ road_name: ['stop'] }];
    constructor(name, config) {
        config ??= {};
        this.name = name;
        this.distance = +config.Distance;
        this.distance_string = `${config.Distance}千米`;
        this.time_details.first = config.Times?.[0];
        this.time_details.last = config.Times?.[config.Times?.length - 1];
        config?.Route?.forEach(v => v[Object.keys(v)[0]] ??= []);
        this.data_stringobject = config?.Route ?? [];
        this.roads_stringlist = this.data_stringobject.map(v => Object.keys(v)[0]).flat(Infinity);
        this.stops_stringlist = this.data_stringobject.map(v => (Object.values(v))).flat(Infinity);
    }
}