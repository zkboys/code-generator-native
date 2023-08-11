module.exports = {
    // 模版名称
    // name: 'java/service',
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-service/src/main/java/com/{projectNameSlash}/service/{moduleName}/{ModuleName}Service.java',
    // 获取文件内容
    getContent: (config) => {
        const {moduleNames: mn, projectNameDot, tables, moment} = config;
        const table = tables[0] || {};
        const tableName = table.value;
        const tableLabel = table.comment || table.value;
        return `
package com.${projectNameDot}.service.${mn.moduleName};

import com.${projectNameDot}.mapper.${mn.moduleName}.${mn.ModuleName}Mapper;
import com.${projectNameDot}.${mn.moduleName}.domain.${mn.ModuleName};
import com.suixingpay.ace.mybatis.base.AbstractService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ${tableLabel}(${tableName})
 *
 * @author @ra-lib/gen
 * @date ${moment().format('YYYY-MM-DD HH:mm:ss')}
 */
@Service
@Slf4j
public class ${mn.ModuleName}Service implements AbstractService<${mn.ModuleName}, Long> {

    @Autowired
    private ${mn.ModuleName}Mapper ${mn.moduleName}Mapper;

    @Override
    public ${mn.ModuleName}Mapper getMapper() {
        return ${mn.moduleName}Mapper;
    }

    public void batchInsert(List<${mn.ModuleName}> list) {
        getMapper().batchInsert(list);
    }

    public void batchUpdate(List<${mn.ModuleName}> list) {
        getMapper().batchUpdate(list);
    }

    public void batchDelete(List<Long> list) {
        getMapper().deleteBatchIds(list);
    }

}
        
`;
    },
};
