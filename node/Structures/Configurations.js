import Company from '#Structures/Company';
import Line from '#Structures/Line';

class GlobalLine {
    All = [''];

    LegacyBuilds = [];

    /**
     * @type { Line[] }
     */
    RecentUpdates = [];

    constructor(lineJson){
        this.All = Array.from(lineJson.All).flat(Infinity).map(v => v.toString());
        this.LegacyBuilds = Array.from(lineJson.LegacyBuilds).flat().map(v => v.toString());
    }
}

class GlobalCompany {
    All = [''];

    /**
     * @type {string,Company}
     */
    Regs = new Map;

    constructor(companyJson){
        this.All = Array.from(companyJson.All).flat().map(v => v.toString());
    }
}

export {
    GlobalLine,
    GlobalCompany
}