const SPAN = () => document.createElement('span');
const UL = () => document.createElement('ul');
const LI = () => document.createElement('li');
/**
 * 
 * @param {string} v 
 * @returns {HTMLElement}
 */
let createElement = (v) => document.createElement(v);

function lineProcess(LineNumber, Json) {
    let str = `<div data-mark="lines">`;
    let LineJson = Json.LINE;
    Object.keys(LineJson).forEach(lineName => {
        let currentLineJson = LineJson[lineName];
        let lineNameText = ({
            lineName,
            'DOWN': '下行',
            'UP': '上行',
            'AREA': '区间',
        })[lineName];
        str += `<details> <summary> <b>${lineNameText}</b>`;

        let releaseTimes = currentLineJson.TIME;
        if (releaseTimes) {
            if (releaseTimes.length === 2) {
                str += `首班: <span>${releaseTimes[0]}</span> 末班: <span>${releaseTimes[1]}</span>`;
            } else {
                str += `发车时间:`;
                releaseTimes.forEach(v => str += ' ' + v);
            }
        }

        str += '</summary> <ul>';

        let stops = currentLineJson.STOP;

        stops?.forEach(v=>{
            let stop = v.split(' ');
            if(stop.length === 1){
                str += `<li><a href="../stops/${stop[0]}.html">${stop[0]}</a></li>`;
            } else if (stop.length === 2){
                str += `<li><a href="../stops/${stop[0]}.html">${stop[1]}</a></li>`;
            }
        });

        str += '</ul> </details>';
    });

    str += '</div>';
    document.querySelector('main').innerHTML += str;
}

document.addEventListener('DOMContentLoaded', async () => {
    let lineNumber = document.querySelector('body').getAttribute('number');
    let json = JSON.parse(await (await fetch(`../data/line/${lineNumber}.json`)).text());
});