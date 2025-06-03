import { readFile, readdir, stat } from "fs/promises";
import { BUtil } from "./util.mjs";
import { join, basename, extname } from "path";
import { LineUtils } from "../line/main.mjs";
import { BusUtils } from "../bus/main.mjs";
import { BuildTools } from "./tool.mjs";

import { BusInfoContainer, LineInfoContainer, RouteInfoContainer, StopInfoContainer } from "./db/mod.mjs";

export class ModelInfoContainer {
    id = '';
    brand = '';
    size = {
        length: [],
        width: [],
        height: []
    };
    fuel = '';
    is_hybrid = false;
    hybrid_fuel_types = [];
    buses = [];
    constructor(id) {
        this.id = id;
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
    /**
     * @type {ModelInfoContainer[]}
     */
    models = [];
    /**
     * @type {StopInfoContainer[]}
     */
    stops = [];

    buses_stringlist = [];
    stops_stringlist = [];
    lines_stringlist = [];
    companies_stringlist = [];
    models_stringlist = [];

    config_company;
    config_line;
    config_main;
    config_model;

    data_dir = '';
    lines_data_stringlist = [];
    companies_data_stringlist = [];
    buses_data_stringlist = [];

    stop_reflect = {
        byId: {},
        byName: {}
    };

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
        await this.#collectModels();
        await this.#collectLines();
        await this.#collectStops();
        await this.#collectBusLineReflect();

        // console.log(this.lines.filter(v => v.name == "1")[0].routes[0]);
    }

    async #collectBusLineReflect() {
        this.buses.forEach((v) => {
            v.history_lines_stringlist.map(hl_name => {
                if (!hl_name) return;
                hl_name = String(hl_name);
                if (!this.lines_stringlist.includes(hl_name)) {
                    let hl_object = LineUtils.createUnknown(hl_name);
                    this.lines_stringlist.push(hl_name);
                    this.lines.push(hl_object);
                    v.history_lines.push(hl_object);
                    hl_object.history_buses.push(v);
                } else {
                    let hl_object;
                    for (let line of this.lines) {
                        if (line.name == hl_name) {
                            hl_object = line;
                            break;
                        }
                    }
                    if (!hl_object) {
                        throw new Error(`Unexpected undefined in bus query!`);
                    }
                    v.history_lines.push(hl_object);
                    hl_object.history_buses.push(v);
                }
            })
        });
        this.lines_stringlist.sort();
        console.log(this.lines_stringlist);

        this.buses.forEach((bus) => {
            let model = bus.model;
            let model_name = model.id;
            bus.history_lines.forEach(hl => {
                if (!hl.history_models_stringlist.includes(model_name)) {
                    hl.history_models_stringlist.push(model_name);
                }
            });
            let belong_string = bus.current.line_string, belong;
            for (let line of this.lines) {
                if (line.name === belong_string) {
                    belong = line;
                    break;
                }
            }
            if (belong) {
                bus.current.line = belong;
                belong.current_buses.push(bus);
                belong.current_buses_stringlist.push(bus.code);
            }
        });

        this.lines.forEach(v => {
            v.bus_shift_records = LineUtils.generateShiftRecords(v);
            v.bus_shift_records_by_date = LineUtils.sortShiftRecordByDate(v.bus_shift_records);
        });
    }

    async #collectLines() {
        let path = join(this.data_dir, "line");
        for (let object of (await readdir(path, { recursive: true }))) {
            let status = await stat(join(path, object));
            if (!status.isDirectory() || object.includes('Histories')) {
                continue;
            }
            let sub = await readdir(join(path, object));
            if (!sub.includes('Main.jsonc') && !sub.includes('Main.yaml')) {
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
                let obj_basename;
                let is_yaml = false;
                if (object.endsWith(".json")) {
                    obj_basename = basename(object, ".json");
                } else if (object.endsWith(".yaml")) {
                    obj_basename = basename(object, ".yaml");
                    is_yaml = true;
                } else {
                    obj_basename = basename(object, ".jsonc");
                }
                let obj = await BusUtils.createInfoFromPath(obj_basename, join(path, object), is_yaml);
                this.buses_data_stringlist.push(object);
                this.buses_stringlist.push(obj_basename);
                this.buses.push(obj);
            }
        }
        this.buses.sort((a, b) => a.code.replace('' + a.code_number, '') == b.code.replace('' + b.code_number, '') ? a.code_number > b.code_number ? 1 : -1 : a.code.replace('' + a.code_number, '') > b.code.replace('' + b.code_number, '') ? 1 : -1);
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
        // console.log(this.stops_stringlist);
        await Promise.all(this.stops_stringlist.map((stop, index) => (async () => {
            let config;
            try {
                config = BUtil.JSON.safeParse((await readFile(join(this.data_dir, "stop", stop, "Main.jsonc"))).toString());
            } catch (e) {
                config = {};
            }
            this.stops[index] = new StopInfoContainer(stop, config);
        })()));

        // build reflect
        this.stops.forEach(v => {
            this.stop_reflect.byId[v.id] = v;
            this.stop_reflect.byName[v.name] = v;
        });

        // merge route to stop
        this.lines.forEach(v => {
            for (let route of v.routes) {
                // passby lines
                let stops_real = route.stops_stringlist.map(v => v.split(" "));
                for (let [stop, stop_form_name] of stops_real) {
                    let index = this.stops_stringlist.indexOf(stop);
                    // console.log(stop, index, 'F');
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

                // mount object pointer
                route.data = [];
                for (let route_raw_data of route.data_stringobject) {
                    for (let [road, stops] of Object.entries(route_raw_data)) {
                        let stop_objects = stops.map(v => {
                            v = v.split(" ")[0];
                            if (this.stop_reflect.byId[v]) return this.stop_reflect.byId[v];
                            if (this.stop_reflect.byName[v]) return this.stop_reflect.byName[v];
                            throw new Error(`Unexpected Error while mounting object pointer.`);
                        });
                        let result = {
                            [road]: stop_objects
                        };
                        route.data.push(result);
                    }
                }
            }
        });

    }

    async #collectModels() {
        this.buses.forEach(v => {
            if (!this.models_stringlist.includes(v.model_string)) {
                this.models_stringlist.push(v.model_string);
                this.models.push(new ModelInfoContainer(v.model_string));
            }

            let index = this.models_stringlist.indexOf(v.model_string);
            this.models[index].buses.push(v);
            v.model = this.models[index];
        });

        let existing_model_infos = {};
        let model_data_dir = join(this.data_dir, 'model');

        for (let obj of await readdir(model_data_dir, { recursive: true })) {
            let status = await stat(join(model_data_dir, obj));
            if (status.isFile() && extname(obj) == '.yaml') {
                let obj_path = join(model_data_dir, obj);
                let content = (await readFile(obj_path)).toString();
                let config = BUtil.yaml.parse(content);
                existing_model_infos[config.model] = config;
            }
        }

        // console.log(existing_model_infos);

        this.models_stringlist.forEach((model_string, index) => {
            if (existing_model_infos[model_string]) {
                let obj_ref = this.models[index];
                let existing = existing_model_infos[model_string];
                obj_ref.brand = existing.brand;
                obj_ref.fuel = existing.fuel;
                obj_ref.hybrid_fuel_types = existing.hybrid_fuel_types ?? [];
                obj_ref.is_hybrid = existing.is_hybrid ?? false;
                if (existing.size) {
                    obj_ref.size = existing.size;
                }
            } else {
                let obj_ref = this.models[index];
                obj_ref.brand = BuildTools.inferBrand(model_string);
                // obj_ref.fuel = '未知';
                // obj_ref.hybrid_fuel_types = existing.hybrid_fuel_types ?? [];
                // obj_ref.is_hybrid = existing.is_hybrid ?? false;
                // if(existing.size){
                //     obj_ref.size = existing.size;
                // }
            }
        });
    }
}