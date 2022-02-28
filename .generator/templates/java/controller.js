module.exports = {
  // 文件级别选项
  options: ['11选中', '序号', '分页', '导入', '导出', '添加', '批量删除', '弹框编辑'],
  // 字段级别选项
  fieldOptions: ['表单', '表格', '条件'],
  // 生成文件的默认目标路径
  targetPath: '/src/com/boy/{module-name}/{ModuleName}Controller.java',
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
