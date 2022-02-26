module.exports = {
    // 模版名称
    name: '列表页',
    // 生成文件的默认目标路径
    targetPath: (config, util) => {
        const { moduleName } = config;
        const { path, projectRootPath } = util;

        return path.join(projectRootPath, 'front', 'src', 'pages', moduleName, 'index.jsx');
    },
    // 获取文件内容
    getContent: config => {
        return `
import React from 'react';

export default function Index(props) {

    return (
        <div>好的啊</div>
    )
}        
        `;
    },
};
