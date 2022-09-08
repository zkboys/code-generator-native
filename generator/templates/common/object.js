module.exports = {
    targetPath: '/src/object/{module_name}__{moduleChineseName}.json',
    // 每次插入时的内容
    getContent: config => {
        const { fields} = config;
        return `{
        ${fields.map(item => {
            return `"${item.__names.moduleName}": "${item.chinese}",`;
        }).join('\n        ')}
    }
        `;
    },
};
