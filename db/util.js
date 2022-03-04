function getInfoByComment(name, comment = '') {
    const cs = comment.trim().split(' ');
    let chinese = '';
    if (cs && cs.length) {
        chinese = cs[0];
    }

    // TODO 其他信息，比如枚举 等
    return {
        chinese: chinese || name,
        // options
    };
}

function getFormTypeByChinese(chinese, defaultType) {
    if (!chinese) return defaultType;

    const typeMap = [
        ['邮箱', 'email'],
        ['电话', 'mobile'],
        ['手机号', 'mobile'],
        ['生日', 'date'],
        ['日期', 'date'],
        ['时间', 'date-time'],
    ];

    const record = typeMap.find(([name]) => chinese.includes(name));
    if (record) return record[1];

    return defaultType;
}

module.exports = {
    getInfoByComment,
    getFormTypeByChinese,
};
