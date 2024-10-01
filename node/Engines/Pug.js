import pug from 'pug';
import tools from './ToolFunctions.js';

const Manager = {
    /**
     * @type {Map<string,Function>}
     */
    map: new Map(),
    set(id,pugContent){
        if(!this.map.has(id)){
            this.map.set(id,pug.compile(pugContent,{
                basedir: 'TEMPLATES'
            }));
        }
    },
    get(id){
        return this.map.get(id);
    },
    render(id,obj){
        return this.map.get(id)({
            ...tools,
            ...obj,
        });
    }
}

export default Manager;
