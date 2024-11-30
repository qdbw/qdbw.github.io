document.addEventListener('DOMContentLoaded',()=>{
    function makeComfortWrap(stationName) {
        let result = (()=>{
            if (stationName.length < 6) {
                return stationName;
            }
            if (stationName.length == 6) {
                if ( stationName.indexOf('路') > 0 && stationName.indexOf('路') < 3) {
                    let c = stationName.indexOf('路') + 1;
                    return stationName.slice(0, c) + '<br>' + stationName.slice(c)
                } else {
                    return stationName.slice(0, 3) + '<br>' + stationName.slice(3)
                }
            }
            if(stationName.indexOf('(') > 0 && stationName.indexOf('(') < 7){
                console.log(`DETECTED QUOTE ON TEXT(${stationName})`);
                let c = stationName.indexOf('(');
                return stationName.slice(0,c) + '<br>' + stationName.slice(c);
            }
            let zhan = stationName.indexOf('站');
            let lu = stationName.indexOf('路');
            if (zhan > 0 && zhan != stationName.length - 1) {
                return stationName.slice(0, zhan) + '<br>' + stationName.slice(zhan)
            }
            if (lu > 0 && lu < stationName.length - 1) {
                return stationName.slice(0, ++lu) + '<br>' + stationName.slice(lu)
            }
            let c = Math.floor(stationName.length / 2);
            return stationName.slice(0, c) + '<br>' + stationName.slice(c)
        })();
        return result;
    }
    window.mountStationList = ()=>{
        let globalId = document.body.getAttribute('name');
        document.querySelectorAll('.qdbw-line .--list-root>div[name]').forEach(v=>{
            let routeName = v.getAttribute('name');
            fetch(`/data/Lines/${globalId}/Route.${routeName}.jsonc`).then((response)=>{
                response.text().then((value)=>{
                    let details = v.querySelector('details');
                    let stationList = details.querySelector('div.stationList>ul.list-root');
                    let json = JSON.parse(value);
                    stationList.innerHTML = '';
                    let i = 1;
                    json.Route.forEach(data=>{
                        let [name,stations] = Object.entries(data)[0];
                        stationList.innerHTML += `<li data-road=${name}><ul>${stations.map(v=>`<li><a class='h-link' data-index=${i++} href="/stations/${v}/">${makeComfortWrap(v)}</a></li>`).join('')}</ul></li>`;
                    });
                });
            });
        });
    }
    if(document.body.hasAttribute('name')){
        mountStationList();
    }
});