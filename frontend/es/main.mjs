import { BDTQuerier } from "./query.mjs";

let querier = await BDTQuerier.createQuerier();

globalThis.querier = querier;

if(document.getElementById("BUS_SEARCH_INPUT")){
    let input = document.getElementById('BUS_SEARCH_INPUT');
    let trigger = document.getElementById('BUS_SEARCH_ID');
    let result_container = document.getElementById('BUS_SEARCH_RESULTS');
    let result_tip = document.getElementById('BUS_SEARCH_TIP');

    const ev = () => {
        let value = input.value;
        let results = querier.queryBus(value);
        result_container.innerHTML = results.slice(0,50).map(v => `<a href="/public/bus/${v}">${v}</a>`).join('');
        if(results.length > 50){
            result_tip.innerHTML = `发现超过50条结果，请尝试精确查询对象。`;
        } else {
            result_tip.innerHTML = '';
        }
    }

    trigger.onclick = ev;
    input.onkeydown = (e) => e.key == 'Enter' ? ev() : void 0;
}

if(document.getElementById("LINE_SEARCH_INPUT")){
    let input = document.getElementById('LINE_SEARCH_INPUT');
    let trigger = document.getElementById('LINE_SEARCH_ID');
    let result_container = document.getElementById('LINE_SEARCH_RESULTS');
    let result_tip = document.getElementById('LINE_SEARCH_TIP');

    const ev = () => {
        let value = input.value;
        let results = querier.queryLine(value);
        result_container.innerHTML = results.slice(0,50).map(v => `<a href="/public/line/${v}">${v}</a>`).join('');
        if(results.length > 50){
            result_tip.innerHTML = `发现超过50条结果，请尝试精确查询对象。`;
        } else {
            result_tip.innerHTML = '';
        }
    }

    trigger.onclick = ev;
    input.onkeydown = (e) => e.key == 'Enter' ? ev() : void 0;
}

if(document.getElementById("STOP_SEARCH_INPUT")){
    let input = document.getElementById('STOP_SEARCH_INPUT');
    let trigger = document.getElementById('STOP_SEARCH_ID');
    let result_container = document.getElementById('STOP_SEARCH_RESULTS');
    let result_tip = document.getElementById('STOP_SEARCH_TIP');

    const ev = () => {
        let value = input.value;
        let results = querier.queryStop(value);
        result_container.innerHTML = results.slice(0,50).map(v => `<a href="/public/stop/${v}">${v}</a>`).join('');
        if(results.length > 50){
            result_tip.innerHTML = `发现超过50条结果，请尝试精确查询对象。`;
        } else {
            result_tip.innerHTML = '';
        }
    }

    trigger.onclick = ev;
    input.onkeydown = (e) => e.key == 'Enter' ? ev() : void 0;
}