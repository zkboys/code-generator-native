module.exports = {
    // 模版名称
    // name: 'java/mapper',
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-core/src/main/java/com/{projectNameSlash}/mapper/{packageName}/{ModuleName}Mapper.java',
    // 获取文件内容
    getContent: (config) => {
        const {moduleNames: mn, projectNameDot, tables, moment, packageName} = config;
        const table = tables[0] || {};
        const tableName = table.value;
        const tableLabel = table.comment || table.value;

        return `
package com.${projectNameDot}.mapper.${packageName};

import com.${projectNameDot}.${packageName}.domain.${mn.ModuleName};
import com.suixingpay.ace.mybatis.base.GenericMapper;

import java.util.List;

/**
 * ${tableLabel}(${tableName})
 *
 * @author @ra-lib/gen
 * @date ${moment().format('YYYY-MM-DD HH:mm:ss')}
 */
public interface ${mn.ModuleName}Mapper extends GenericMapper<${mn.ModuleName}, Long> {

    void batchInsert(List<${mn.ModuleName}> list);

    void batchUpdate(List<${mn.ModuleName}> list);
}
        
`;
    },
};
