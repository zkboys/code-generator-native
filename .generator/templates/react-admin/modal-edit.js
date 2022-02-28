module.exports = {
    // name: '弹框编辑页',
    options: ['添加', '修改', '详情'],
    fieldOptions: ['表单', '测试', '哈哈'],
    targetPath: '/front/src/pages/{module-name}/EditModal.jsx',
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
