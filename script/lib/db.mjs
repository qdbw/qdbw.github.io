import { readFile, readdir, stat } from "fs/promises";
import { BUtil } from "./util.mjs";
import { join, basename } from "path";
import { LineUtils } from "../line/main.mjs";
import { BusUtils } from "../bus/main.mjs";

export class LineInfoContainer {
    name = '';
    name_pretty = '';
    from;
    from_string = '';
    from_detail = {
        first: '',
        last: '',
        is_fixed_time: false,
        times_optionalstringlist: []
    }
    to;
    to_string = '';
    to_detail = {
        first: '',
        last: '',
        is_fixed_time: false,
        times_optionalstringlist: []
    }
    companies = [];
    companies_stringlist = [];
    current_models = [];
    current_models_stringlist = [];
    history_models = [];
    history_models_stringlist = [];
    current_buses = [];
    current_buses_stringlist = [];
    is_responsive = false;
    is_ticket_stepping = false;
    is_manual_tickting = false;
    /**
     * @type {RouteInfoContainer[]}
     */
    routes = [];
    routes_stringlist = [];
    /**
     * @type {LineInfoContainer[]}
     */
    histories = [];
    histories_stringlist = [];
    is_history = false;
    history_tag;
    current_reference;

    data_path = '';

    constructor(name, config, data_path, is_history = false, history_tag, current_reference) {
        config ??= {};
        this.name = name;
        this.name_pretty = config.PrettyName ?? config.Name ?? name;
        this.from;
        this.from_string = config.From ?? config.FromTo?.[0]?.[0];
        this.to;
        this.to_string = config.To ?? config.FromTo?.[0]?.[1];
        this.companies;
        this.companies_stringlist = [...config.Companies ?? []];
        this.current_models = config.Models ? Object.keys(config.Models) : [];
        this.current_models_stringlist = config.Models ? Object.keys(config.Models) : [];
        this.is_responsive = config.Responsive ?? config.TicketOptions?.Responsive;
        this.is_ticket_stepping = config.TicketOptions?.Stepping;
        this.is_manual_tickting = config?.TicketOptions?.Manual;
        this.routes;
        this.routes_stringlist = [...config.Routes ?? []];
        this.histories;
        this.histories_stringlist = [...config.Histories ?? []];
        this.data_path = data_path;
        this.is_history = is_history;
        this.history_tag = history_tag;
        this.current_reference = current_reference;
    }
}

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
        this.data_stringobject = config?.Route ?? [];
        this.roads_stringlist = this.data_stringobject.map(v => Object.keys(v)[0]).flat(Infinity);
        this.stops_stringlist = this.data_stringobject.map(v => Object.values(v)).flat(Infinity);
    }
}

export class BusInfoContainer {
    code = '';
    model;
    model_string = '';
    shift_records = [];
    status = {
        retired: false,
        retire_pending: false,
        normal: true,
    };
    status_string = '';
    current = {
        line: undefined,
        line_string: '',
    };
    time = {
        on: '未知',
        off: '仍在运营'
    };
    history_lines = [];
    history_lines_stringlist = [];
    data_path = '';

    constructor(name, config, data_path) {
        this.code = name;
        this.model = config.model;
        this.model_detail = {};
        this.shift_records = [...config.shift_records ?? config.history ?? []];
        this.current.line_string = config.status?.current?.line;
        this.status.retired = !!config.status?.retired;
        this.status.retire_pending = !!config.status?.retire_pending;
        this.status.normal = !config.status?.retired && !config.status?.retire_pending;
        this.status_string = this.status.normal ? '营运' : this.status.retired ? '报废' : this.status.retire_pending ? '停驶' : '状态未知';
        if (this.status.retired || this.status.retire_pending) {
            this.time.off = '未知';
        }
        this.shift_records.forEach(v => {
            if (v.from == '@NEW') {
                this.time.on = v.date;
                v.from = '新车';
            }
            if (v.to == '@OFFLINE') {
                this.time.off = v.date;
                v.to = '下线';
            }
        });
        this.current.line ??= this.shift_records.length && this.shift_records[this.shift_records.length - 1].to;
        this.data_path = data_path;
    }
}

export class ModelInfoContainer {
    id = '';
    brand = '';
    size= {
        length: [],
        width: [],
        height: []
    };
    fuel = '';
    is_hybrid = false;
    hybrid_fuel_types = [];
    constructor(id){
        this.id = id;
    }
}

export class StopInfoContainer {
    id = '';
    name = '';
    name_pretty = '';
    form_names = [];
    passbys = [];
    passby_lines = [];
    constructor(name, config) {
        this.name = name;
        this.id = config?.id ?? config?.Id ?? name;
        this.name_pretty = config?.pretty_name ?? config?.TitleHtml ?? name;
    }
}

export class Database {
    /**
     * @type {BusInfoContainer[]}
     */
    buses = [];
    companies = [];
    /**
     * @type {LineInfoContainer[]}
     */
    lines = [];
    models = [];
    /**
     * @type {StopInfoContainer[]}
     */
    stops = [];

    buses_stringlist = [];
    stops_stringlist = [];
    lines_stringlist = [];
    companies_stringlist = [];

    config_company;
    config_line;
    config_main;
    config_model;

    data_dir = '';
    lines_data_stringlist = [];
    companies_data_stringlist = [];
    buses_data_stringlist = [];

    constructor(data_dir) {
        this.data_dir = data_dir;
    }

    async doInitialization() {
        let config_path = 'config';
        let config_line = BUtil.JSON.safeParse((await readFile(join(config_path, 'Line.jsonc'))).toString());
        let config_main = BUtil.JSON.safeParse((await readFile(join(config_path, 'Main.jsonc'))).toString());
        let config_company = BUtil.JSON.safeParse((await readFile(join(config_path, 'Company.jsonc'))).toString());
        let config_model = BUtil.JSON.safeParse((await readFile(join(config_path, 'Model.jsonc'))).toString());
        this.config_company = config_company;
        this.config_line = config_line;
        this.config_main = config_main;
        this.config_model = config_model;

        await this.#collectBuses();
        await this.#collectLines();
        await this.#collectStops();
    }

    async #collectLines() {
        let path = join(this.data_dir, "line");
        for (let object of (await readdir(path, { recursive: true }))) {
            let status = await stat(join(path, object));
            if (!status.isDirectory() || object.includes('Histories')) {
                continue;
            }
            let sub = await readdir(join(path, object));
            if (!sub.includes('Main.jsonc')) {
                continue;
            }
            let obj = await LineUtils.createInfoFromPath(basename(object), join(path, object));
            this.lines_data_stringlist.push(object);
            this.lines_stringlist.push(basename(object));
            this.lines.push(obj);
            if (obj.histories.length != 0) {
                for (let history of obj.histories) {
                    this.lines_data_stringlist.push(join(object, 'Histories', history.history_tag));
                    this.lines_stringlist.push(basename(history.name));
                    this.lines.push(history);
                }
            }
        }
    }

    async #collectBuses() {
        let path = join(this.data_dir, "bus");
        for (let object of (await readdir(path, { recursive: true }))) {
            let status = await stat(join(path, object));
            if (status.isFile()) {
                let obj = await BusUtils.createInfoFromPath(basename(object,".json"), join(path, object));
                this.buses_data_stringlist.push(object);
                this.buses_stringlist.push(basename(object, ".json"));
                this.buses.push(obj);
            }
        }
    }

    async #collectStops() {
        // collect information
        this.lines.forEach(async v => {
            for (let route of v.routes) {
                let stops_real = route.stops_stringlist.map(v => v.split(" "));
                for (let [stop] of stops_real) {
                    if (!this.stops_stringlist.includes(stop)) {
                        this.stops_stringlist.push(stop);
                    }
                }

            }
        });
        console.log(this.stops_stringlist);
        await Promise.all(this.stops_stringlist.map((stop,index) => (async()=>{
            let config;
            try {
                config = BUtil.JSON.safeParse((await readFile(join(this.data_dir, "stop", stop, "Main.jsonc"))).toString());
            } catch (e) {
                config = {};
            }
            this.stops[index] = new StopInfoContainer(stop, config);
        })()));

        // merge route to stop
        this.lines.forEach(v => {
            for (let route of v.routes) {
                let stops_real = route.stops_stringlist.map(v => v.split(" "));
                for (let [stop, stop_form_name] of stops_real) {
                    let index = this.stops_stringlist.indexOf(stop);
                    console.log(stop, index, 'F');
                    let stop_obj = this.stops[index];
                    if (stop_form_name && !stop_obj.form_names.includes(stop_form_name)) {
                        stop_obj.form_names.push(stop_form_name);
                    }
                    if (!stop_obj.passby_lines.includes(v)) {
                        stop_obj.passbys.push({
                            line: v
                        });
                        stop_obj.passby_lines.push(v);
                    }
                }

            }
        });
    }

    async #collectModels(){
        this.buses
    }
}