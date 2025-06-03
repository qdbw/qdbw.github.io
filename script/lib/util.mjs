import { parse as jsonc_parse } from "jsonc-parser";
import { parse as yaml_parse } from "yaml";

export const BUtil = {
    JSON: {
        /**
         * @type {typeof jsonc_parse}
         */
        safeParse(...args) {
            try {
                return jsonc_parse(...args);
            } catch (e) {
                console.error(e);
                return e;
            }
        }
    },
    yaml: {
        parse: yaml_parse
    },
    /**
     * 对年.月格式的键进行日期排序
     * @param {Object} obj - 包含年.月格式键的对象
     * @param {Object} [options] - 配置选项
     * @param {boolean} [options.ascending=true] - 是否按升序排列（默认 true: 早到晚）
     * @param {boolean} [options.mutate=false] - 是否修改原对象（默认 false: 返回新对象）
     * @returns {Object} - 根据 mutate 参数返回原对象或新对象
     */
    sortDateObject(obj, { ascending = true, mutate = false } = {}) {
        const sortedKeys = Object.keys(obj).sort((a, b) => {
            const [yearA, monthA] = a.split(".").map(Number);
            const [yearB, monthB] = b.split(".").map(Number);
            const dateA = new Date(yearA, monthA - 1);
            const dateB = new Date(yearB, monthB - 1);
            return ascending ? dateA - dateB : dateB - dateA;
        });

        if (mutate) {
            // 清空原对象并按顺序重新赋值
            Object.keys(obj).forEach(key => delete obj[key]);
            sortedKeys.forEach(key => {
                obj[key] = obj[key]; // 从原型链获取原始值（如果存在）
            });
            return obj;
        } else {
            // 返回新对象
            return sortedKeys.reduce((acc, key) => {
                acc[key] = obj[key];
                return acc;
            }, {});
        }
    }
}