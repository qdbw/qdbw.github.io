import { existsSync, readFileSync } from "fs";
import jsonc from 'jsonc-parser';
import { marked } from "marked";

import Configurations from "../Configuration.js";
import requestData from "./Data.js";
import Company from "#Structures/Company";

const { Companies } = requestData();

function createCompany(company,profilePath){
    let Id = company;
    let Name = company, FullName = company;
    let Subcompanies = new Map;
    let Description = '';
    if(existsSync(`${profilePath}/Desc.md`)){
        Description = marked.parse(readFileSync(`${profilePath}/Desc.md`).toString());
    }
    if(!existsSync(`${profilePath}/Main.jsonc`)){
        console.warn(`Profile for company ${company} does not exist!`);
    } else {
        let profile = jsonc.parse(readFileSync(`${profilePath}/Main.jsonc`).toString());
        if(Array.isArray(profile.Subcompanies) &&profile.Subcompanies?.length>0){
            for(let subcompany of profile.Subcompanies){
                Subcompanies.set(subcompany,createCompany(`${company}/${subcompany}`,`${profilePath}/Subcompanies/${subcompany}`));
            }
        }
        Name = profile.Name ?? company;
        FullName = profile.FullName ?? Name;
        Id = profile.Id ?? company;
    }
    Companies.set(Id,new Company({
        Name,
        FullName,
        Subcompanies,
        Description,
        Id
    }));
    return Companies.get(Id);
}

function ReadCompany(){
    for(let company of Configurations.Company.All){
        let mainProfilePath = `data/Companies/${company}`;
        createCompany(company,mainProfilePath);
    }
}

export default ReadCompany;