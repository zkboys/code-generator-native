module.exports = {
    targetPath: '/src/options/{module-name}.js',
    getContent: config => {
        const { fields } = config;
        return `
export default [
    ${fields.map(item => `{value: '${item.name}': label: '${item.chinese}'},`).join('\n    ')}
]        
        `;
    },
};
