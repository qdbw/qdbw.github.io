import { BDTQuerier } from "./query.mjs";

let querier = await BDTQuerier.createQuerier();

globalThis.querier = querier;

const MORETHAN_50 = `发现可能超过50条结果，请尝试精确查询对象。`;

let build_time_div = document.querySelector('.s-build-time');
build_time_div && (build_time_div.textContent = "上次构建：" + new Date(build_time_div.textContent));

if (document.getElementById("BUS_SEARCH_INPUT")) {
    let input = document.getElementById('BUS_SEARCH_INPUT');
    let trigger = document.getElementById('BUS_SEARCH_ID');
    let result_container = document.getElementById('BUS_SEARCH_RESULTS');
    let result_tip = document.getElementById('BUS_SEARCH_TIP');

    const ev = () => {
        let value = input.value;
        let [results, much] = querier.queryBus(value);
        result_container.innerHTML = results.map(v => `<a class="bdt-s-bus-button" href="/public/bus/${v[0]}"><b>${v[2]}</b><small>${v[4][1]}</small></a>`).join('');
        if (much) {
            result_tip.innerHTML = MORETHAN_50;
        } else {
            result_tip.innerHTML = '';
        }
    }

    trigger.onclick = ev;
    input.onkeydown = (e) => e.key == 'Enter' ? ev() : void 0;
}

if (document.getElementById("LINE_SEARCH_INPUT")) {
    let input = document.getElementById('LINE_SEARCH_INPUT');
    let trigger = document.getElementById('LINE_SEARCH_ID');
    let result_container = document.getElementById('LINE_SEARCH_RESULTS');
    let result_tip = document.getElementById('LINE_SEARCH_TIP');

    const ev = () => {
        let value = input.value;
        let [results, much] = querier.queryLine(value);
        result_container.innerHTML = results.map(v => `<a href="/public/line/${v[0]}">${v[1]}</a>`).join('');
        if (much) {
            result_tip.innerHTML = MORETHAN_50;
        } else {
            result_tip.innerHTML = '';
        }
    }

    trigger.onclick = ev;
    input.onkeydown = (e) => e.key == 'Enter' ? ev() : void 0;
}

if (document.getElementById("STOP_SEARCH_INPUT")) {
    let input = document.getElementById('STOP_SEARCH_INPUT');
    let trigger = document.getElementById('STOP_SEARCH_ID');
    let result_container = document.getElementById('STOP_SEARCH_RESULTS');
    let result_tip = document.getElementById('STOP_SEARCH_TIP');

    const ev = () => {
        let value = input.value;
        let [results, much] = querier.queryStop(value);
        result_container.innerHTML = results.slice(0, 50).map(v => `<a href="/public/stop/${v[0]}">${v[1]}</a>`).join('');
        if (much) {
            result_tip.innerHTML = MORETHAN_50;
        } else {
            result_tip.innerHTML = '';
        }
    }

    trigger.onclick = ev;
    input.onkeydown = (e) => e.key == 'Enter' ? ev() : void 0;
}

if (document.getElementById("MODEL_SEARCH_INPUT")) {
    let input = document.getElementById('MODEL_SEARCH_INPUT');
    let trigger = document.getElementById('MODEL_SEARCH_ID');
    let result_container = document.getElementById('MODEL_SEARCH_RESULTS');
    let result_tip = document.getElementById('MODEL_SEARCH_TIP');

    const ev = () => {
        let value = input.value;
        let [results, much] = querier.queryModel(value);
        result_container.innerHTML = results.slice(0, 50).map(v => `<a href="/public/model/${v}">${v}</a>`).join('');
        if (much) {
            result_tip.innerHTML = MORETHAN_50;
        } else {
            result_tip.innerHTML = '';
        }
    }

    trigger.onclick = ev;
    input.onkeydown = (e) => e.key == 'Enter' ? ev() : void 0;
}