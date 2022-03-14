module.exports = {
    targetPath: '/src/options/index.js',
    // 第一次插入，文件不存在时，获取完整的文件内容结构
    getFullContent: config => {
        return `
export default {
    // 此注释用于标记代码生成器插入代码位置，请勿删除！
}       
        `;
    },
    // 每次插入时的内容
    getContent: config => {
        const { fields, moduleNames: mn } = config;
        return `    ${mn.moduleName}: [
        ${fields.map(item => `{value: '${item.name}', label: '${item.chinese}'},`).join('\n        ')}
    ],
        `;
    },
};
