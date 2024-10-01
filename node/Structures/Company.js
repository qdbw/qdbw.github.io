class Company {
    Id = '';
    Name = '';
    FullName = '';
    /**
     * @type {Map<string,Company>}
     */
    Subcompanies = new Map();

    Description = '';

    /**
     * 
     * @param {{Id:string, Name: string, FullName: string, Subcompanies: Map<string,Company>,Description: string}} param0 
     */
    constructor({Id,Name,FullName,Subcompanies,Description}){
        this.Id = Id;
        this.Name = Name;
        this.FullName = FullName;
        this.Subcompanies = Subcompanies ?? new Map();
        this.Description = Description;
    }
}

export default Company;