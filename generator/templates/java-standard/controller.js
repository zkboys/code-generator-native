module.exports = {
    // 模版名称
    // name: 'java',
    // 文件级别选项
    // options: ['condition', 'domain', 'mapper', 'mapper_xml', 'service'],
    // defaultOptions: ['condition', 'domain', 'mapper', 'mapper_xml', 'service'],
    // 字段级别选项
    // fieldOptions: ['domain'],
    // defaultFieldOptions: ['domain'],
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-web/src/main/java/com/{projectNameSlash}/controller/{moduleName}/{ModuleName}Controller.java',
    // 获取文件内容
    getContent: config => {
        const { moduleNames: mn, projectNameDot } = config;
        return `
package com.${projectNameDot}.controller.${mn.moduleName};

import com.${projectNameDot}.condition.${mn.moduleName}.${mn.ModuleName}Condition;
import com.${projectNameDot}.domain.${mn.moduleName}.${mn.ModuleName};
import com.${projectNameDot}.service.${mn.moduleName}.${mn.ModuleName}Service;
import com.suixingpay.ace.mybatis.base.GenericRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${mn.module_names}")
public class ${mn.ModuleName}Controller extends GenericRestController<${mn.ModuleName}, Long, ${mn.ModuleName}Condition> {

    @Autowired
    private ${mn.ModuleName}Service ${mn.moduleName}Service;

    @Override
    public ${mn.ModuleName}Service getService() {
        return ${mn.moduleName}Service;
    }

}
        `;
    },
};
