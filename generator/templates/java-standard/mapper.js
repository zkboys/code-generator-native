module.exports = {
    // 模版名称
    name: 'java/mapper',
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-core/src/main/java/com/{projectNameSlash}/mapper/{moduleName}/{ModuleName}Mapper.java',
    // 获取文件内容
    getContent: (config) => {
        const {file, moduleNames: mn, projectNameDot} = config;
        const { options = [] } = file;

        // 返回false不生成文件
        if (!options.includes('mapper')) return false;

        return `
package com.${projectNameDot}.mapper.${mn.moduleName};

import com.${projectNameDot}.domain.${mn.moduleName}.${mn.ModuleName};
import com.suixingpay.ace.mybatis.base.GenericMapper;

import java.util.List;

public interface ${mn.ModuleName}Mapper extends GenericMapper<${mn.ModuleName}, Long> {

    void batchInsert(List<${mn.ModuleName}> list);

    void batchUpdate(List<${mn.ModuleName}> list);
}
        
`;
    },
};