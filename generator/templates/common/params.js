module.exports = {
    targetPath: '/src/params/{module_name}__{moduleChineseName}.txt',
    // 每次插入时的内容
    getContent: config => {
        const { fields } = config;
        return `
        ${fields.map(item => `${item.__names.moduleName},string,false,,${item.chinese},`).join('\n')}
        `;
    },
};
