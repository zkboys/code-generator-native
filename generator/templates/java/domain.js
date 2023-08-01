module.exports = {
    // 模版名称
    name: 'java/domain',
    // 字段级别选项
    fieldOptions: ['domain'],
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-data/src/main/java/com/{projectNameSlash}/{moduleName}/domain/{ModuleName}.java',
    // 获取文件内容
    getContent: (config) => {
        const { moduleNames: mn, fields, projectNameDot } = config;

        const ignore = ['id', 'updatedAt', 'createdAt', 'isDeleted'];
        const domainFields = fields.filter(item => item.fieldOptions.includes('domain') && !ignore.includes(item.__names.moduleName));

        return `
package com.${projectNameDot}.${mn.moduleName}.domain;

import com.suixingpay.ace.mybatis.base.BaseDomain;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@ToString(callSuper = true)
public class ${mn.ModuleName} extends BaseDomain<Long> {

    private static final long serialVersionUID = 1;

    ${domainFields.map(item => `@ApiModelProperty("${item.chinese}")
    private ${item.dataType || 'String'} ${item.__names.moduleName};`).join('\n\n    ')}
}
`;
    },
};