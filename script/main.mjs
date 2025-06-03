import { compileFile } from "pug";
import { BusPageBuilder } from "./bus/main.mjs";
import { Database } from "./lib/db.mjs";
import { LinePageBuilder } from "./line/main.mjs";
import { writeFile } from "fs/promises";
import { StopPageBuilder } from "./stop/main.mjs";
import { BuildTools } from "./lib/tool.mjs";
import { ModelPageBuilder } from "./model/main.mjs";

let database = new Database("data");

await database.doInitialization();

// process.exit();

let busPageBuilder = new BusPageBuilder("data", "frontend/public");
let linePageBuilder = new LinePageBuilder("data", "frontend/public");
let stopPageBuilder = new StopPageBuilder("data", "frontend/public");
let modelPageBuilder = new ModelPageBuilder("data", "frontend/public");

let options = {
    buildpage: true,
    buildbus: true,
    buildmodel: true,
    buildstop: true
};
if (process.env.QDBFLAG) {
    let _opt = process.env.QDBFLAG.split(" ");
    _opt.forEach(v => {
        switch (v) {
            case "PAGE":
                options.buildpage = true;
                break;
            case "!PAGE":
                options.buildpage = false;
                break;
            case "BUS":
                options.buildbus = true;
                break;
            case "!BUS":
                options.buildbus = false;
                break;
            case "MODEL":
                options.buildmodel = true;
                break;
            case "!MODEL":
                options.buildmodel = false;
                break;
            case "STOP":
                options.buildstop = true;
                break;
            case "!STOP":
                options.buildstop = false;
                break;
        }
    });
}

if (options.buildpage)
    await linePageBuilder.buildSpecifiedObjectList(database.lines);
if (options.buildbus)
    await busPageBuilder.buildSpecifiedObjectList(database.buses);
if (options.buildmodel)
    await modelPageBuilder.buildSpecifiedObjectList(database.models);
if (options.buildstop)
    await stopPageBuilder.buildSpecifiedObjectList(database.stops);

await writeFile("frontend/404.html", compileFile("template/404.pug")({ local: { tool: BuildTools } }));
await writeFile("frontend/index.html", compileFile("template/index.pug")({ local: { tool: BuildTools } }));

// build bdt_manifest.json
let bdt_manifest = {
    buses: [],
    lines: [],
    models: [],
    stops: []
};

bdt_manifest.buses = database.buses.map(v => [v.code, v.current_code, v.short_name, v.group, BuildTools.getGroupText(v.group)]);
bdt_manifest.lines = database.lines.map(v => [v.name, v.name_pretty]);
bdt_manifest.models = database.models_stringlist.map(v => String(v));
bdt_manifest.stops = database.stops.map(v => [v.id, v.name, v.form_names]);

await writeFile("frontend/bdt_manifest.json", JSON.stringify(bdt_manifest));