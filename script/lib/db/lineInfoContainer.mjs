import { BusInfoContainer } from "./busInfoContainer.mjs";

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
    /**
     * @type {BusInfoContainer[]}
     */
    history_buses = [];
    history_buses_stringlist = [];
    /**
     * @type {BusInfoContainer[]}
     */
    current_buses = [];
    current_buses_stringlist = [];
    is_responsive = false;
    is_ticket_stepping = false;
    is_manual_tickting = false;
    /**
     * @type {import("./routeInfoContaier.mjs").RouteInfoContainer[]}
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
    bus_shift_records = { in: {}, out: {} };
    bus_shift_records_by_date = {};

    data_path = '';

    constructor(name, config, data_path, is_history = false, history_tag, current_reference) {
        config ??= {};
        this.name = name;
        this.name_pretty = config.pretty_name ?? config.PrettyName ?? config.Name ?? name;
        this.from;
        this.from_string = config.from ?? config.From ?? config.FromTo?.[0]?.[0];
        this.to;
        this.to_string = config.to ?? config.To ?? config.FromTo?.[0]?.[1];
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