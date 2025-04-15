const brandIdTable = {
    BFC: '北方',
    BJ: '北京汽车',
    BYD: '比亚迪',
    CA: '解放',
    CCQ: '安凯',
    CFC: '福莱西宝',
    CK: '比亚迪',
    DD: '黄海',
    DNC: '远程',
    EQ: '东风',
    FDG: '五洲龙',
    FSQ: '佛山飞驰',
    GTQ: '广通',
    HFF: '安凯',
    HK: '合客',
    JK: '豪沃',
    JLY: '金陵',
    JNP: '青年',
    JS: '亚星',
    KLQ: '苏州金龙(海格)',
    LCK: '聊城客车(中通)',
    QMJ: '美锦',
    QTK: '爱维客',
    SDL: '沂星',
    SHC: '浦江',
    SLK: '申龙',
    SK: '上海',
    SWB: '申沃/沃尔沃',
    SXC: '万象',
    TEG: '中国中车/南车时代',
    WD: '万达',
    WG: '扬子江',
    XML: '厦门金旅',
    XMQ: '厦门金龙',
    XQ: '太湖',
    XW: '西沃',
    YBL: '亚星',
    YCK: '中大',
    YTK: '烟台客车(舒驰)',
    YS: '常隆',
    YZL: '扬子旅行车',
    YZK: '扬子',
    ZGT: '友谊',
    ZK: '宇通',
}

function inferBrand(id){
    let letters = id.toUpperCase(), i = 0;
    for(;i<letters.length;i++){
        const code = letters.charCodeAt(i);
        if(!(code >= 65 && code <= 90)){
            break;
        }
    }
    let brandId = letters.slice(0,i+1);
    return ({
        [brandId]: brandId,
        ...brandIdTable
    })[brandId];

}

export const BuildTools = {
    inferBrand
}