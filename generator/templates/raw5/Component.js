module.exports = {
    targetPath: '/src/components/{module-name}/index.jsx',
    // 此模版附带关联文件，语法与模版相同，
    // 但是 options, defaultOptions, fieldOptions, defaultFieldOptions无效
    extraFiles: [
        {
            name: '样式文件',
            targetPath: '{parentPath}/style.module.less',
            getContent: config => {
                return `.root {
    width: 100%;
}`;
            },
        },
        {
            name: '组件入口文件',
            targetPath: '{__parentPath}/index.js',
            // 第一次插入，文件不存在时，获取完整的文件内容结构
            getFullContent: config => {
                return `// 此注释用于标记代码生成器插入代码位置，请勿删除！`;
            },
            // 每次插入时的内容
            getContent: config => {
                const { fields, moduleNames: mn } = config;
                return `export {default as ${mn.ModuleName}} from './${mn['module-name']}';`;
            },
        },
    ],

    getContent: config => {
        const { fields, moduleNames: mn } = config;
        return `
import React from 'react';
import PropTypes from 'prop-types';        
import s from './style.module.less';
        
function ${mn.ModuleName}(props){

    return (
        <div className={s.root}>
            ${mn.ModuleName}组件
        </div>
    );
}

${mn.ModuleName}.PropTypes = {
    ${fields.map(item => {
            const { name, chinese } = item;
            return `// ${chinese}
    ${name}: PropTypes.any,`;
        }).join('\n    ')}
}

${mn.ModuleName}.defaultProps = {
    ${fields.map(item => {
            const { name, chinese, defaultValue } = item;
            return `// ${chinese}
    ${name}: ${JSON.stringify(defaultValue)},`;
        }).join('\n    ')}
}

export default ${mn.ModuleName};        
        `;
    },
};
