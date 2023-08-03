const _condition = require('./_condition.js');
const _domain = require('./_domain.js');
const _mapper = require('./_mapper.js');
const _mapper_xml = require('./_mapper-xml.js');
const _service = require('./_service.js');

module.exports = {
    // 模版名称
    name: 'java增删改查',
    // 文件级别选项
    options: ['condition', 'domain', 'mapper', 'mapper_xml', 'service'],
    defaultOptions: ['condition', 'domain', 'mapper', 'mapper_xml', 'service'],
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-web/src/main/java/com/{projectNameSlash}/controller/{moduleName}/{ModuleName}Controller.java',
    extraFiles: [
        _condition,
        _domain,
        _mapper,
        _mapper_xml,
        _service,
    ],
    // 获取文件内容
    getContent: config => {
        const { moduleNames: mn, projectNameDot } = config;
        return `
package com.${projectNameDot}.controller.${mn.moduleName};

import com.${projectNameDot}.${mn.moduleName}.condition.${mn.ModuleName}Condition;
import com.${projectNameDot}.${mn.moduleName}.domain.${mn.ModuleName};
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
