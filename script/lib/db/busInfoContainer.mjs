import { ModelInfoContainer } from "../db.mjs";
import { BuildTools } from "../tool.mjs";
import { LineInfoContainer } from "./lineInfoContainer.mjs";

export class BusInfoContainer {
    code = '';
    code_number = 0;
    current_code = '';
    short_name = '';
    group = '';
    /**
     * @type {ModelInfoContainer}
     */
    model;
    model_string = '';
    shift_records = [];
    status = {
        retired: false,
        retire_pending: false,
        normal: true,
    };
    status_string = '';
    current = {
        /**
         * @type {LineInfoContainer}
         */
        line: undefined,
        line_string: '',
    };
    time = {
        on: '未知',
        off: '仍在运营'
    };
    /**
     * @type {LineInfoContainer[]}
     */
    history_lines = [];
    history_lines_stringlist = [];
    data_path = '';

    constructor(name, config, data_path) {
        this.code = name;
        this.code_number = Number(name.replace(/[A-z]+/, ''));
        this.current_code = config.current_code ?? config.current_id ?? this.code;
        this.model_string = config.model;
        this.model_detail = {};
        this.shift_records = [...config.shift_records ?? config.history ?? []];
        this.current.line_string = config.status?.line ?? config.status?.current?.line;
        this.status.retired = !!config.status?.retired;
        this.status.retire_pending = !!config.status?.retire_pending;
        this.status.normal = !config.status?.retired && !config.status?.retire_pending;
        this.status_string = this.status.normal ? '营运' : this.status.retired ? '报废' : this.status.retire_pending ? '停驶' : '状态未知';
        if (this.status.retired || this.status.retire_pending) {
            this.time.off = '未知';
        }
        this.shift_records.forEach(v => {
            if (v.from == '@NEW') {
                this.time.on = v.date;
                v.from_string = '新车';
            } else if (v.from == '@STANDBY') {
                v.from_string = '机动';
            } else {
                v.from_string = String(v.from);
            }
            if (v.to == '@OFFLINE') {
                this.time.off = v.date;
                v.to_string = '下线';
            } else if (v.to == '@STANDBY') {
                v.to_string = '机动';
            } else {
                v.to_string = String(v.to);
            }
        });
        this.shift_records.forEach(v => {
            let h_line_from = String(v.from), h_line_to = String(v.to);
            if (!this.history_lines_stringlist.includes(v.from_string) && !h_line_from.startsWith('@') && h_line_from != 'unknown') {
                this.history_lines_stringlist.push(v.from_string);
            }
            if (!this.history_lines_stringlist.includes(v.to_string) && !h_line_to.startsWith('@') && h_line_to != 'unknown') {
                this.history_lines_stringlist.push(v.to_string);
            }
        });
        if(this.shift_records.length != 0) {
            let last_record = this.shift_records[this.shift_records.length - 1];
            if(!last_record.to.startsWith('@')){
                this.current.line_string = last_record.to_string;
            }
        }
        if(this.status.retire_pending || this.status.retired) {
            this.history_lines_stringlist.push(this.current.line_string);
            this.current.line_string = undefined;
            this.current.line = undefined;
        }
        this.data_path = data_path;
        let last_indentifier_index = this.code.lastIndexOf('-');
        let second_indentifier_index = this.code.replace(/.*\-/,'').indexOf('-');
        this.short_name = this.code.slice(last_indentifier_index+1);
        this.group = this.code.slice(second_indentifier_index+1,last_indentifier_index);
    }
}