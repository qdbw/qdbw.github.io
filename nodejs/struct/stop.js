class Stop {
    name;
    aliasName;
    options;
    constructor(string){
        let option = '';
        [this.name,this.aliasName,option] = string.split(" ");
        this.options = option?.split(',') ?? [];
    }

    hasAliasName(){
        return this.aliasName && this.aliasName!='_';
    }

    hasOption(key){
        return this.options.includes(key);
    }
}

export default Stop;