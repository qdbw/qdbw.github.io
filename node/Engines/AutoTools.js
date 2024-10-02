const brandIdTable = {
    BJ: '北汽福田',
    BYD: '比亚迪',
    CA: '解放',
    CFC: '福莱西宝',
    DD: '黄海',
    DNC: '吉利远程',
    EQ: '东风',
    FDG: '五洲龙',
    FSQ: '飞驰',
    HFF: '安凯',
    JK: '豪沃',
    JLY: '金陵',
    JNP: '青年',
    JS: '亚星',
    KLQ: '海格',
    LCK: '中通',
    SDL: '沂星',
    SK: '上海',
    SWB: '申沃',
    TEG: '中国中车',
    WD: '奇瑞万达',
    WG: '扬子江',
    XML: '金旅',
    YBL: '亚星',
    YCK: '中大',
    YZL: '亚星扬子',
    YS: '常隆',
    ZK: '宇通'
}

function inferBrand(id){
    let brandId = id.split('6')[0];
    return ({
        [brandId]: brandId,
        ...brandIdTable
    })[brandId];

}

const AutoTools = {
    inferBrand
};

export default AutoTools;