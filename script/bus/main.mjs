import { mkdir, readFile, readdir, stat, writeFile } from "fs/promises";
import { basename, join } from "path";
import { compile } from "pug";
import { BusInfoContainer } from "../lib/db/mod.mjs";
import { BUtil } from "../lib/util.mjs";
import { BuildTools } from "../lib/tool.mjs";

export const BusUtils = {
    async createInfoFromConfig(name,config) {
        let info = new BusInfoContainer(name, config);
        return info;
        
    },
    async createInfoFromPath(name, data_path,is_yaml=false) {
        let content = (await readFile(data_path)).toString();
        let json = BUtil.JSON.safeParse(content);
        if(is_yaml){
            json = BUtil.yaml.parse(content);
        }
        if(json instanceof Error) {
            return new BusInfoContainer(name, undefined, data_path);
        }
        let result = new BusInfoContainer(name,json,data_path);
        return result;
    }
}

export class BusPageBuilder {
    data_dir;
    public_dir;
    constructor(data_dir,public_dir) {
        this.data_dir = data_dir;
        this.public_dir = public_dir;
    }

    #template_content;

    /**
     * @type {import("pug").compileTemplate}
     */
    #template_compiled;

    async build({name, path}={}) {
        // let path = join(this.data_dir,"bus",`${name}.json`);
        path = join(this.data_dir, "bus", path);
        let bus_info = await BusUtils.createInfoFromPath(name, path);
        let objs = {
            local: {
                bus: bus_info,
                tool: BuildTools
            }
        };
        let target_directory = join(this.public_dir,"bus");
        let target_path = join(target_directory,`${name}.html`);
        await mkdir(target_directory, {recursive: true});
        await writeFile(target_path, await this.toHtml(objs));
        console.log(`[LOG] Built ${name}`);
    }

    async buildFromObject(name, object) {
        let objs = {
            local: {
                bus: object,
                tool: BuildTools
            }
        };
        let target_directory = join(this.public_dir, "bus");
        let target_path = join(target_directory, `${name}.html`);
        await mkdir(target_directory, { recursive: true });
        await writeFile(target_path, await this.toHtml(objs));
        console.log(`[LOG] Built ${name}`);
    }

    async buildAll(){
        let path = join(this.data_dir,"bus");
        for(let object of (await readdir(path, { recursive: true}))){
            let status = await stat(join(path,object));
            if(status.isFile()){
                this.build({name: basename(object,".json"), path: object});
            }
        }
    }

    async buildSpecifiedList(buses) {
        await Promise.all([...buses].map(v => (async (v) => {
            console.log(`[LOG] Building ${v}`);
            await this.build({ name: basename(v, '.json'), path: v });
        })(v)));
    }

    async buildSpecifiedObjectList(buses) {
        await Promise.all([...buses].map(v => (async (v) => {
            console.log(`[LOG] Building ${v.code}`);
            await this.buildFromObject(v.code, v);
        })(v)));
    }

    async toHtml(objs){
        if(!this.#template_compiled){
            let template_content = (await readFile(join("template/bus.pug"))).toString();
            this.#template_content = template_content;
            this.#template_compiled = compile(this.#template_content, {
                basedir: 'template/',
                filename: 'template/bus.pug'
            });
        }

        return this.#template_compiled(objs);
    }
}