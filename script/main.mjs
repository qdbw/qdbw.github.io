import { compileFile } from "pug";
import { BusPageBuilder } from "./bus/main.mjs";
import { Database } from "./lib/db.mjs";
import { LinePageBuilder } from "./line/main.mjs";
import { writeFile } from "fs/promises";
import { StopPageBuilder } from "./stop/main.mjs";

let database = new Database("data");

await database.doInitialization();

let busPageBuilder = new BusPageBuilder("data","frontend/public");
let linePageBuilder = new LinePageBuilder("data","frontend/public");
let stopPageBuilder = new StopPageBuilder("data","frontend/public");

await linePageBuilder.buildSpecifiedObjectList(database.lines);
await busPageBuilder.buildSpecifiedList(database.buses_data_stringlist);
await stopPageBuilder.buildSpecifiedObjectList(database.stops);

await writeFile("frontend/404.html",compileFile("template/404.pug")());
await writeFile("frontend/index.html",compileFile("template/index.pug")());

// build bdt_manifest.json
let bdt_manifest = {
    buses: [],
    lines: [],
    models: [],
    stops: []
};

bdt_manifest.buses = database.buses_stringlist.map(v => String(v));
bdt_manifest.lines = database.lines_stringlist.map(v => String(v));
bdt_manifest.models; // **TODO** need impl
bdt_manifest.stops = database.stops.map(v => [v.name,v.form_names]);

await writeFile("frontend/bdt_manifest.json",JSON.stringify(bdt_manifest));