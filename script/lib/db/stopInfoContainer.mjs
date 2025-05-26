export class StopInfoContainer {
    id = '';
    name = '';
    name_pretty = '';
    form_names = [];
    passbys = [];
    passby_lines = [];
    constructor(name, config) {
        this.name = name;
        this.id = config?.id ?? config?.Id ?? name;
        this.name_pretty = config?.pretty_name ?? config?.TitleHtml ?? name;
    }
}