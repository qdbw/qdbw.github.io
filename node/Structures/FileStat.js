import { statSync, existsSync } from "fs";
import { basename } from "path";

class CTimeRecord {
    fileName;
    filePath;
    changeTime;
    createTime;

    changeTimeString;
    createTimeString;

    constructor(filePath){
        if(!existsSync(filePath)){
            throw new Error('The directory or file '+filePath+' does not exist!');
        }
        let stat = statSync(filePath);

        this.fileName = basename(filePath);
        this.filePath = filePath;
        
        this.changeTime = stat.ctime;
        this.createTime = stat.birthtime;

        this.changeTimeString = stat.ctime.toLocaleString();
        this.createTimeString = stat.birthtime.toLocaleString();
    }
}

export {
    CTimeRecord
}