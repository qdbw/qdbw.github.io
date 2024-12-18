import "../node/Data/Init.js";
import buildIndexPage from "../node/Generators/index.js";
import buildIndexLinePage from "../node/Generators/index.line.js";
import buildIndexStationPage from "../node/Generators/index.station.js";
import buildIndexCompanyPage from "../node/Generators/index.company.js";
import buildLinePages from "../node/Generators/line.js";
import buildStationPages from "../node/Generators/station.js";
import buildCompanyPages from "../node/Generators/company.js";

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