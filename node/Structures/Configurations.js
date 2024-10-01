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
        this.All = Array.from(lineJson.All).flat().map(v => v.toString());
        this.LegacyBuilds = Array.from(lineJson.LegacyBuilds).flat().map(v => v.toString());
    }
}

class GlobalCompany {
    All = [''];

    /**
     * @type {string,Company}
     */
    #Companies = new Map;

    constructor(companyJson){
        this.All = Array.from(companyJson.All).flat().map(v => v.toString());
    }

    /**
     * 
     * @param {string} name 
     * @param {Company} company 
     */
    setCompany(name,company){
        this.#Companies.set(name,company);
    }

    getCompany(name){
        return this.#Companies.get(name);
    }
}

export {
    GlobalLine,
    GlobalCompany
}