import { LineInfoContainer, RouteInfoContainer } from "../lib/db.mjs";
import { BUtil } from "../lib/util.mjs";
import { readFile, readdir, stat, mkdir, writeFile } from "fs/promises";
import { basename, join } from "path";
import { compile } from "pug";

export class StopPageBuilder {
    data_dir;
    public_dir;
    constructor(data_dir, public_dir) {
        this.data_dir = data_dir;
        this.public_dir = public_dir;
    }

    #template_content;

    /**
     * @type {import("pug").compileTemplate}
     */
    #template_compiled;

    async buildFromObject(object) {
        let objs = {
            local: {
                stop: object
            }
        };
        let target_directory = join(this.public_dir, "stop");
        let target_path = join(target_directory, `${object.id}.html`);
        await mkdir(target_directory, { recursive: true });
        await writeFile(target_path, await this.toHtml(objs));
        console.log(`[LOG] Built stop_${object.name}`);
    }

    async buildSpecifiedObjectList(stops) {
        await Promise.all([...stops].map(v => (async (v) => {
            console.log(`[LOG] Building stop_${v.name}`);
            await this.buildFromObject(v);
        })(v)));
    }

    async toHtml(objs) {
        if (!this.#template_compiled) {
            let template_content = (await readFile(join("template/stop.pug"))).toString();
            this.#template_content = template_content;
            this.#template_compiled = compile(this.#template_content, {
                basedir: 'template/',
                filename: 'template/stop.pug'
            });
        }

        return this.#template_compiled(objs);
    }
}