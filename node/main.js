import "./Data/Init.js";
import buildIndexPage from "./Generators/index.js";
import buildIndexLinePage from "./Generators/index.line.js";
import buildIndexStationPage from "./Generators/index.station.js";
import buildIndexCompanyPage from "./Generators/index.company.js";
import buildLinePages from "./Generators/line.js";
import buildStationPages from "./Generators/station.js";
import buildCompanyPages from "./Generators/company.js";

async function App(){
    let results = {};
    results.lines = buildLinePages();
    results.stops = buildStationPages();

    buildCompanyPages();
    buildIndexCompanyPage();

    buildIndexPage({
        results
    });

    buildIndexLinePage({
        results
    });

    buildIndexStationPage({
        results
    });
}

App();