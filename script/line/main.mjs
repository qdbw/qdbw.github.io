import { LineInfoContainer, RouteInfoContainer } from "../lib/db.mjs";
import { BUtil } from "../lib/util.mjs";
import { readFile, mkdir, writeFile } from "fs/promises";
import { basename, join } from "path";
import { compile } from "pug";
import { BuildTools } from "../lib/tool.mjs";

export const LineUtils = {
    generateHistoryLineName(current_line_name, history_tag) {
        return `H~${current_line_name}@${history_tag}`;
    },
    /**
     * 
     * @param {LineInfoContainer} current_line 
     */
    async assignHistoryLine(current_line) {
        let tasks = [];
        for (let history_tag of current_line.histories_stringlist) {
            tasks.push((async () => {
                let history_data_dir = join(current_line.data_path, 'Histories', history_tag);
                let history_line_name = LineUtils.generateHistoryLineName(current_line.name, history_tag);
                let history_line = await LineUtils.createInfoFromPath(history_line_name, history_data_dir, true, history_tag, current_line);
                current_line.histories[current_line.histories_stringlist.indexOf(history_tag)] = history_line;
            })());
        }
        await Promise.all(tasks);
    },
    /**
     * 
     * @param {LineInfoContainer} current_line 
     */
    async assignRoute(current_line) {
        let tasks = [];
        for (let route_tag of current_line.routes_stringlist) {
            tasks.push((async () => {
                let route_data_path = join(current_line.data_path, `Route.${route_tag}.jsonc`);
                let route_data = BUtil.JSON.safeParse((await readFile(route_data_path)).toString());
                current_line.routes[current_line.routes_stringlist.indexOf(route_tag)] = new RouteInfoContainer(route_tag, route_data);
            })());
        }
        await Promise.all(tasks);
    },
    async createInfoFromPath(name, data_path, ...rest) {
        let content = (await readFile(join(data_path, 'Main.jsonc'))).toString();
        let json = BUtil.JSON.safeParse(content);
        if (json instanceof Error) {
            return new LineInfoContainer(name, undefined, data_path);
        }
        let result = new LineInfoContainer(name, json, data_path, ...rest);
        await Promise.all([
            LineUtils.assignHistoryLine(result),
            LineUtils.assignRoute(result)
        ]);
        return result;
    }
}

export class LinePageBuilder {
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

    async build({ name, path } = {}) {
        path = join(this.data_dir, "line", path);
        let line_info = await LineUtils.createInfoFromPath(name, path);
        await this.buildFromObject(name, line_info);
    }

    async buildFromObject(name, object) {
        let objs = {
            local: {
                line: object,
                tool: BuildTools
            }
        };
        let target_directory = join(this.public_dir, "line");
        let target_path = join(target_directory, `${name}.html`);
        await mkdir(target_directory, { recursive: true });
        await writeFile(target_path, await this.toHtml(objs));
        console.log(`[LOG] Built ${name}`);
    }

    async buildSpecifiedList(lines) {
        await Promise.all([...lines].map(v => (async (v) => {
            console.log(`[LOG] Building ${v}`);
            await this.build({ name: basename(v), path: v });
        })(v)));
    }

    async buildSpecifiedObjectList(lines) {
        await Promise.all([...lines].map(v => (async (v) => {
            console.log(`[LOG] Building line_${v.name}`);
            await this.buildFromObject(v.name, v);
        })(v)));
    }

    async toHtml(objs) {
        if (!this.#template_compiled) {
            let template_content = (await readFile(join("template/line.pug"))).toString();
            this.#template_content = template_content;
            this.#template_compiled = compile(this.#template_content, {
                basedir: 'template/',
                filename: 'template/line.pug'
            });
        }

        return this.#template_compiled(objs);
    }
}