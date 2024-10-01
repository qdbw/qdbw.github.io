import jsonc from 'jsonc-parser';
import { readFileSync } from 'fs';
import { join } from 'path';

import { GlobalCompany, GlobalLine } from './Structures/Configurations.js';

const CONFIGURATION_ROOT = 'data';

let mainProfile = jsonc.parse(readFileSync(join(CONFIGURATION_ROOT, 'Main.jsonc')).toString());
let companyProfile = jsonc.parse(readFileSync(join(CONFIGURATION_ROOT, 'Company.jsonc')).toString());
let lineProfile = jsonc.parse(readFileSync(join(CONFIGURATION_ROOT, 'Line.jsonc')).toString());

let Line = new GlobalLine(lineProfile);
let Company = new GlobalCompany(companyProfile);

const Configurations = {
    Main: mainProfile,
    Company,
    Line
}

export default Configurations;