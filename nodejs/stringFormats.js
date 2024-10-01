const getStringFmt = (basicConf) => ({
    uriDecoder: {
        decodeCompany: function(companyUri) {
            let strings = companyUri.split("/",3);
            let [root, sub, num] = strings.map(v => v.toString());
            if(basicConf?.Companies[root]) {
                root = basicConf.Companies[root];
                if(root?.Subs?.[sub]){
                    sub = root.Subs[sub];
                    if(sub?.Subs?.[num]) {
                        num = sub.Subs[num];
                    }
                }
            }
            return [root?.Name ?? root,sub?.Name ?? sub,num?.Name ?? num];
        },
        decodeStation: function(stationUri) {
            let strings = stationUri.split("/",3);
            return strings;
        }
    }
});

export default getStringFmt;