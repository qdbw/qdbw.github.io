const brandIdTable = {
  BFC: '北方',
  BJ: '北京汽车',
  BYD: '比亚迪',
  CA: '解放',
  CCQ: '安凯',
  CFC: '福莱西宝',
  CJ: '长江',
  CK: '比亚迪',
  DD: '黄海',
  DNC: '远程',
  EQ: '东风',
  FDG: '五洲龙',
  FSQ: '佛山飞驰',
  GTQ: '广通',
  HFF: '安凯',
  HFX: '星凯龙',
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

const fuelTable = {
  fuel: '汽油',
  diesel: '柴油',
  lng: '液化天然气',
  cng: '压缩天然气',
  electric: '电',
  mount: '电网',
}

const nameTable = {
  'Qingdao-QingdaoBus-QingdaoBus': ['青岛公交集团', '青岛公交集团'],
  'Qingdao-JiaoyunGroup-WenxinBus': ['青岛交运集团温馨巴士有限公司', '交运温馨巴士'],
  'Qingdao-JiaoyunGroup-JiaoyunTransportation': ['青岛交运集团', '交运集团'],
  'Qingdao-JiaoyunGroup-WestCoach': ['青岛交运集团西海岸温馨巴士有限公司', '交运西海岸'],
  'Qingdao-ChengyunHolding-ChengyunWestCoach': ['城运控股西海岸交通发展集团', '西海岸交发'],
  'Qingdao-ZhenqingBus-ZhenqingBus': ['青岛真情巴士集团有限公司', '真情巴士']
}

const CONTEXT = {
  value: undefined
};

const build_time = new Date();

function inferBrand(id) {
  if (!id) return '未知';
  let letters = id.toUpperCase(), i = 0;
  for (; i < letters.length; i++) {
    const code = letters.charCodeAt(i);
    if (!(code >= 65 && code <= 90)) {
      break;
    }
  }
  let brandId = letters.slice(0, i);
  return ({
    [brandId]: brandId,
    ...brandIdTable
  })[brandId];

}

function getGroupText(id) {
  return ({
    [id]: [id, id],
    ...nameTable
  })[id];
}

function getFuelText(id) {
  return ({
    [id]: id,
    ...fuelTable
  })[id];
}

function sumBuses(items) {
  // 提取并验证 short_name 中的编号
  const parsedItems = items
    .map(item => {
      const match = item.short_name.match(/^([A-Za-z]*)(\d{3,4})$/);
      return match ? { prefix: match[1] || '', number: parseInt(match[2]), original: item.short_name } : null;
    })
    .filter(item => item !== null);

  // 按前缀分组
  const groups = parsedItems.reduce((acc, item) => {
    if (!acc[item.prefix]) acc[item.prefix] = [];
    acc[item.prefix].push(item);
    return acc;
  }, {});

  // 处理每个分组并生成区间
  const result = [];
  for (const prefix in groups) {
    const items = groups[prefix].sort((a, b) => a.number - b.number);
    const ranges = [];
    let currentStart = items[0];
    let currentEnd = items[0];

    for (let i = 1; i < items.length; i++) {
      if (items[i].number === currentEnd.number + 1) {
        currentEnd = items[i];
      } else {
        ranges.push({ start: currentStart, end: currentEnd });
        currentStart = currentEnd = items[i];
      }
    }
    ranges.push({ start: currentStart, end: currentEnd });

    // 格式化区间为字符串
    const formattedRanges = ranges.map(range => {
      if (range.start === range.end) {
        return range.start.original;
      } else {
        const startNumStr = range.start.original.slice(range.start.prefix.length);
        const endNumStr = range.end.original.slice(range.end.prefix.length);
        return `${range.start.prefix}${startNumStr}-${endNumStr}`;
      }
    });

    result.push(...formattedRanges);
  }

  // 按前缀字典序排序（无前缀的排最前）
  return result.sort((a, b) => {
    const prefixA = a.match(/^[A-Za-z]*/)[0] || '';
    const prefixB = b.match(/^[A-Za-z]*/)[0] || '';
    if (!prefixA && prefixB) return -1;
    if (prefixA && !prefixB) return 1;
    return prefixA.localeCompare(prefixB);
  });
}

function getLineName(line_id){
  for(const line of CONTEXT.value.lines){
    if(line.name === line_id)
      return line.name_pretty;
  }
}

function _setContext(context){
  CONTEXT.value = context;
}

export const BuildTools = {
  inferBrand,
  getFuelText,
  getGroupText,
  build_time,
  sumBuses,
  getLineName,
  _setContext
}