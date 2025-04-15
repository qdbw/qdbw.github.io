import { parse as jsonc_parse } from "jsonc-parser";

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
    }
}