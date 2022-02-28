module.exports = {
  options: ['添加', '修改', '详情'],
  fieldOptions: ['表单', '测试', '哈哈'],
  targetPath: '/src/com/boy/{module-name}/{ModuleName}Service.java',
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
