import Line from "#Structures/Line";

class Company {
    Id = '';
    Name = '';
    FullName = '';
    TitleHtml;
    /**
     * @type {Map<string,Company>}
     */
    Subcompanies = new Map();

    /**
     * line ids
     * @type {Line[]}
     */
    Lines = [];

    /**
     * @type {Company?}
     */
    root;

    Description = '';

    /**
     * 
     * @param {{Id:string, Name: string, FullName: string, Subcompanies: Map<string,Company>,Description: string, TitleHtml: string?}} param0 
     * @param {Company?} root
     */
    constructor({Id,Name,FullName,Subcompanies,Description,TitleHtml},root){
        this.Id = Id;
        this.Name = Name;
        this.FullName = FullName;
        this.Subcompanies = Subcompanies ?? new Map();
        this.Description = Description;
        this.TitleHtml = TitleHtml;
        this.root = root;

        for(let [k,v] of this.Subcompanies){
            v.root = this;
        }
    }
}

export default Company;