module.exports = {
    // 模版名称
    // name: 'java/domain',
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-data/src/main/java/com/{projectNameSlash}/{moduleName}/domain/{ModuleName}.java',
    // 字段级别选项
    fieldOptions: ['domain'],
    defaultFieldOptions: ['domain'],
    // 获取文件内容
    getContent: (config) => {
        const {NULL_LINE, moduleNames: mn, fields, projectNameDot, javaPackages, tables, moment} = config;

        const table = tables[0] || {};
        const tableName = table.value;
        const tableLabel = table.comment || table.value;

        const ignores = [
            'id',
            'creater',
            'updater',
            'createdDate',
            'lastUpdated',
            'version',
        ];
        const domainFields = fields.filter(item => item.fieldOptions.includes('domain') && !ignores.includes(item.__names.moduleName));

        const hasIsRequired = domainFields.some(item => !item.isNullable);
        const hasLength = domainFields.some(item => item.length);

        return `
package com.${projectNameDot}.${mn.moduleName}.domain;

import com.suixingpay.ace.mybatis.base.BaseDomain;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.Accessors;
${hasLength ? 'import org.hibernate.validator.constraints.Length;' : NULL_LINE}
${hasIsRequired ? 'import javax.validation.constraints.NotNull;' : NULL_LINE}

${javaPackages}

/**
 * ${tableLabel}(${tableName})
 *
 * @author @ra-lib/gen
 * @date ${moment().format('YYYY-MM-DD HH:mm:ss')}
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@ToString(callSuper = true)
@ApiModel("${mn.chineseName}")
public class ${mn.ModuleName} extends BaseDomain<Long> {

    private static final long serialVersionUID = 1;

    ${domainFields.map(item => `@ApiModelProperty("${item.chinese}")
    ${!item.isNullable ? `@NotNull(message = "${item.chinese}不能为空")` : NULL_LINE}
    ${item.length ? `@Length(max=${item.length}, message = "${item.chinese}长度不能大于${item.length}")` : NULL_LINE}
    private ${item.dataType || 'String'} ${item.__names.moduleName};`).join('\n\n    ')}
}
`;
    },
};
