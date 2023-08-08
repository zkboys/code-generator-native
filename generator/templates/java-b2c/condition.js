module.exports = {
    // 模版名称
    // name: 'java/condition',
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-data/src/main/java/com/{projectNameSlash}/{moduleName}/condition/{ModuleName}Condition.java',
    // 获取文件内容 标准
    getContent: (config) => {
        const {moduleNames: mn, projectNameDot} = config;

        return `
package com.${projectNameDot}.${mn.moduleName}.condition;

import com.${projectNameDot}.${mn.moduleName}.domain.${mn.ModuleName};
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class ${mn.ModuleName}Condition extends ${mn.ModuleName} {

    private static final long serialVersionUID = 1;

}
`;
    },
};
