import {
    Marked
} from "marked";
import markedFootnote from "marked-footnote";

class Markdown {
    static #marked = new Marked()
        .use(markedFootnote({
            description: '注解'
        }));
    /**
     * 
     * @param {string} text 
     */
    static parse(text) {
        return this.#marked.parse(text);
    }
}

export default Markdown;