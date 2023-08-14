module.exports = {
    // 模版名称
    // name: 'java/condition',
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-data/src/main/java/com/{projectNameSlash}/{packageName}/condition/{ModuleName}Condition.java',
    // 获取文件内容 标准
    getContent: (config) => {
        const {moduleNames: mn, projectNameDot, tables, moment, packageName} = config;
        const table = tables[0] || {};
        const tableName = table.value;
        const tableLabel = table.comment || table.value;

        return `
package com.${projectNameDot}.${packageName}.condition;

import com.${projectNameDot}.${packageName}.domain.${mn.ModuleName};
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * ${tableLabel}(${tableName})
 *
 * @author @ra-lib/gen
 * @date ${moment().format('YYYY-MM-DD HH:mm:ss')}
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class ${mn.ModuleName}Condition extends ${mn.ModuleName} {

    private static final long serialVersionUID = 1;

}
`;
    },
};
