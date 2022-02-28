module.exports = {
    name: '列表页',
    targetPath: (config, util) => {
        const { moduleName } = config;
        const { path, projectRootPath } = util;

        return path.join(projectRootPath, 'front', 'src', 'pages', moduleName, 'index.jsx');
    },
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
