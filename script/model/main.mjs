import { readFile, mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { compile } from "pug";
import { BuildTools } from "../lib/tool.mjs";

export class ModelPageBuilder {
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
                model: object,
                tool: BuildTools
            }
        };
        let target_directory = join(this.public_dir, "model");
        let target_path = join(target_directory, `${object.id}.html`);
        await mkdir(target_directory, { recursive: true });
        await writeFile(target_path, await this.toHtml(objs));
        console.log(`[LOG] Built model_${object.id}`);
    }

    async buildSpecifiedObjectList(models) {
        await Promise.all([...models].map(v => (async (v) => {
            console.log(`[LOG] Building model_${v.id}`);
            await this.buildFromObject(v);
        })(v)));
    }

    async toHtml(objs) {
        if (!this.#template_compiled) {
            let template_content = (await readFile(join("template/model.pug"))).toString();
            this.#template_content = template_content;
            this.#template_compiled = compile(this.#template_content, {
                basedir: 'template/',
                filename: 'template/model.pug'
            });
        }

        return this.#template_compiled(objs);
    }
}