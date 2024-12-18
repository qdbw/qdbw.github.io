function buildPhotoDatabase(photoJson){
    const db = {
        modelStringList: [],
        busStringList: [],
        data: photoJson,
        dataByBus: {},
        dataByLine: {}    
    };
    db.modelList = Object.keys(photoJson);
    for(let model of Object.keys(photoJson)){
        for(let [bus,data] of Object.entries(photoJson[model])){
            db.dataByBus[bus] = {
                model,
                data
            };
            for(let [year,yearObj] of Object.entries(data)){
                for(let [month,monthObj] of Object.entries(yearObj)){
                    for(let [day,dayArr] of Object.entries(monthObj)){
                        for(let line of dayArr){
                            if(!db.dataByLine[line]){
                                db.dataByLine[line] = {};
                            }
                            if(!db.dataByLine[line][model]){
                                db.dataByLine[line][model] = {};
                            }
                            if(!db.dataByLine[line][model][bus]){
                                db.dataByLine[line][model][bus] = {};
                            }
                            if(!db.dataByLine[line][model][bus][year]){
                                db.dataByLine[line][model][bus][year] = {};
                            }
                            if(!db.dataByLine[line][model][bus][year][month]){
                                db.dataByLine[line][model][bus][year][month] = [];
                            }
                            db.dataByLine[line][model][bus][year][month].push(day);
                        }
                    }
                }
            }
        }
    }
    return db;
}

export default buildPhotoDatabase;