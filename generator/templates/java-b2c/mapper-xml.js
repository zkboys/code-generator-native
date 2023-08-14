module.exports = {
    // 模版名称
    // name: 'java/mapper/xml',
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-core/src/main/resources/com/{projectNameSlash}/mapper/{packageName}/{ModuleName}Mapper.xml',
    // 获取文件内容
    getContent: (config) => {
        const {NULL_LINE, moduleNames: mn, fields, tableNames, projectNameDot, packageName} = config;

        const noIdFields = fields.filter(item => item.dbName !== 'id');
        const primaryKeyField = fields.find(item => item.isPrimaryKey);
        const isCreateItem = item => ['createTime', 'createDate'].includes(item.__names.moduleName);
        const isUpdateItem = item => ['updateTime', 'updateDate'].includes(item.__names.moduleName);

        return `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.${projectNameDot}.mapper.${packageName}.${mn.ModuleName}Mapper">
    <resultMap id="result" type="com.${projectNameDot}.${packageName}.domain.${mn.ModuleName}">
        ${primaryKeyField ? `<id property="${primaryKeyField.__names.moduleName}" column="${primaryKeyField.dbName}" jdbcType="${primaryKeyField.jdbcType}"/>` : NULL_LINE}
        ${noIdFields.map(item => `<result column="${item.dbName}" property="${item.__names.moduleName}" jdbcType="${item.jdbcType}"/>`).join('\n        ')}
    </resultMap>
    <sql id="table">
        ${tableNames}
    </sql>
    <sql id="columns">
        ${fields.map((item, index, arr) => `${item.dbName}${index === arr.length - 1 ? '' : ','}`).join('\n        ')}
    </sql>
    <insert id="add" parameterType="com.${projectNameDot}.${packageName}.domain.${mn.ModuleName}" useGeneratedKeys="true" keyProperty="id">
        insert into
        <include refid="table"/>
        <trim prefix="(" suffix=")" suffixOverrides=",">
            ${noIdFields.map(item => isCreateItem(item) ? `${item.dbName},` : `<if test="${item.__names.moduleName} != null and ${item.__names.moduleName} != ''">
                ${item.dbName},
            </if>`).join('\n            ')}
        </trim>
        values
        <trim prefix="(" suffix=")" suffixOverrides=",">
            ${noIdFields.map(item => isCreateItem(item) ? `NOW(),` : `<if test="${item.__names.moduleName} != null and ${item.__names.moduleName} != ''">
                #{${item.__names.moduleName},jdbcType=${item.jdbcType}},
            </if>`).join('\n            ')}
        </trim>
    </insert>
    <update id="updateById" parameterType="com.${projectNameDot}.${packageName}.domain.${mn.ModuleName}">
        update
        <include refid="table"/>
        <set>
            ${noIdFields.filter(item => !isCreateItem(item)).map(item => isUpdateItem(item) ? `${item.dbName} = NOW(),` : `<if test="${item.__names.moduleName} != null and ${item.__names.moduleName} != ''">
                ${item.dbName} = #{${item.__names.moduleName},jdbcType=${item.jdbcType}},
            </if>`).join('\n            ')}
        </set>
        where id = #{id}
    </update>
    <delete id="deleteById">
        DELETE FROM
        <include refid="table"/>
        WHERE id = #{id}
    </delete>
    <delete id="deleteBatchIds">
        DELETE FROM
        <include refid="table"/>
        WHERE id in
        <foreach collection="pkList" item="i" open="(" separator="," close=")">
            #{i}
        </foreach>
    </delete>
    <select id="findOneById" resultMap="result">
        SELECT
        <include refid="columns"/>
        FROM
        <include refid="table"/>
        WHERE id = #{id}
    </select>
    <select id="findAll" resultMap="result">
        SELECT
        <include refid="columns"/>
        FROM
        <include refid="table"/>
    </select>
    <sql id="dynamicWhere">
        <where>
            ${noIdFields.map(item => `<if test="${item.__names.moduleName} != null and ${item.__names.moduleName} != ''">
                AND ${item.dbName} = #{${item.__names.moduleName}}
            </if>`).join('\n            ')}
        </where>
    </sql>
    <select id="count" parameterType="com.${projectNameDot}.${packageName}.condition.${mn.ModuleName}Condition" resultType="java.lang.Long">
        select count(*) from
        <include refid="table"/>
        <include refid="dynamicWhere"/>
    </select>
    <select id="find" parameterType="com.${projectNameDot}.${packageName}.condition.${mn.ModuleName}Condition" resultMap="result">
        select
        <include refid="columns"/>
        from
        <include refid="table"/>
        <include refid="dynamicWhere"/>
    </select>

    <insert id="batchInsert" useGeneratedKeys="true" keyProperty="id">
        insert into
        <include refid="table"/>
        <trim prefix="(" suffix=")" suffixOverrides=",">
            ${noIdFields.map((item) => `${item.dbName},`).join('\n            ')}
        </trim>
        values
        <foreach collection="list" item="item" index="index" separator=",">
            <trim prefix="(" suffix=")" suffixOverrides=",">
                ${noIdFields.map((item) => isCreateItem(item) ? `NOW(),` : `#{item.${item.__names.moduleName},jdbcType=${item.jdbcType}},`).join('\n                ')}
            </trim>
        </foreach>
    </insert>

    <update id="batchUpdate">
        insert into
        <include refid="table"/>
        <trim prefix="(" suffix=")" suffixOverrides=",">
            ${fields.map((item) => `${item.dbName},`).join('\n            ')}
        </trim>
        values
        <foreach collection="list" item="item" index="index" separator=",">
            <trim prefix="(" suffix=")" suffixOverrides=",">
                ${fields.map((item) => `#{item.${item.__names.moduleName},jdbcType=${item.jdbcType}},`).join('\n                ')}
            </trim>
        </foreach>
        on duplicate key update
        <trim suffixOverrides=",">
            ${noIdFields.map((item) => `${item.dbName}=values(${item.dbName}),`).join('\n            ')}
        </trim>
    </update>
</mapper>
                
`;
    },
};
