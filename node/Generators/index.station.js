import {
    readFile
} from "fs/promises";
import {
    writeFile,
    mkdir
} from "fs";

import Manager from "../Engines/Pug.js";
import Configurations from "../Configuration.js";
import requestData from "../Data/Data.js";
import Station from "#Structures/Station";

const LETTER_COUNT_ON_SINGLE_PAGE = 50;

let indexTemplate = (await readFile('TEMPLATES/index.station.pug')).toString();

Manager.set('IndexStationTemplate', indexTemplate);

const Data = requestData();

function buildIndexStationPage(variants) {
    /**
     * @type {Map<string,Station[]>}
     */
    let filteredMap = new Map;
    for (let [name, station] of Data.Stations) {
        if (!filteredMap.has(name[0])) {
            filteredMap.set(name[0], []);
        }

        filteredMap.get(name[0]).push(station);
    }
    let $ = {
        htmlFileDepth: 2,
        isAllStations: true,
        pageCount: Math.ceil(Array.from(filteredMap.keys()).length / LETTER_COUNT_ON_SINGLE_PAGE)
    };
    let passVariants = {
        ...variants,
        Data,
        Current: filteredMap,
        Profile: Configurations,
        $
    }

    buildPageView(variants,filteredMap);

    let result = Manager.render('IndexStationTemplate', passVariants);

    mkdir(`stations/_all/`, () => {
        writeFile(`stations/_all/index.html`, result, (e) => {
            if (e) throw e
        });
    });
}

function buildPageView(variants,filteredMap) {
    let letterCount = filteredMap.size;
    let viewPageCount = Math.ceil(letterCount / LETTER_COUNT_ON_SINGLE_PAGE);
    let entriedArray = Array.from(filteredMap.entries());
    for (let i = 1; i <= viewPageCount; i++) {
        let $ = {
            htmlFileDepth: 2,
            pageIndex: i,
            isIndex: false,
            isAllStations: false,
            pageCount: viewPageCount
        }
        let passVariants = {
            ...variants,
            Data,
            Current: new Map(entriedArray.slice((i - 1) * LETTER_COUNT_ON_SINGLE_PAGE, i * LETTER_COUNT_ON_SINGLE_PAGE)),
            $
        };
        let result = Manager.render('IndexStationTemplate', passVariants);
        mkdir(`stations/_page${i}/`, () => {
            writeFile(`stations/_page${i}/index.html`, result, (e) => {
                if (e) throw e
            });
        });
        if (i === 1) {
            let $$ = {
                ...$,
                htmlFileDepth: 1,
                isIndex: true,
            }
            let variants = {
                ...passVariants,
                $: $$
            }
            let indexResult = Manager.render('IndexStationTemplate', variants);
            writeFile(`stations/index.html`, indexResult, (e) => {
                if (e) throw e
            });
        }
    }
}

export default buildIndexStationPage;