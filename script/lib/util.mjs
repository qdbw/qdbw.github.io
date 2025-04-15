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
    }
}