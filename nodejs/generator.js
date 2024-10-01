import "./hack.js";

import basicConf from "./config.js";
// import generateStop from "./generators/stop.js";
// import generateIndex from "./generators/index.js";
import buildIndexPage from "../node/Generators/index.js";
import buildIndexLinePage from "../node/Generators/index.line.js";
import buildIndexStationPage from "../node/Generators/index.station.js";
import buildLinePages from "../node/Generators/line.js";
import buildStationPages from "../node/Generators/station.js";
import buildCompanyPages from "../node/Generators/company.js";
import { init } from "./data.js";
import "../node/Data/Init.js";

async function App(){
    let results = {};
    init(basicConf);
    // results.lines = generateLine(basicConf,stops);
    results.lines = buildLinePages(basicConf);
    // results.stops = generateStop(basicConf,stops);
    results.stops = buildStationPages(basicConf);

    buildCompanyPages();
    // generateIndex({
    //     ...basicConf,
    //     results
    // });

    buildIndexPage({
        ...basicConf,
        results
    });

    buildIndexLinePage({
        ...basicConf,
        results
    });

    buildIndexStationPage({
        results
    });
}

App();