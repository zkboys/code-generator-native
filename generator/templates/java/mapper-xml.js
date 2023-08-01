module.exports = {
    // 模版名称
    name: 'java/mapper/xml',
    // 生成文件的默认目标路径
    targetPath: '/{projectName}-core/src/main/resources/com/{projectNameSlash}/mapper/{moduleName}/{ModuleName}Mapper.xml',
    // 获取文件内容
    getContent: (config) => {
        const {moduleNames: mn, fields, tableNames, projectNameDot} = config;

        return `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.${projectNameDot}.mapper.${mn.moduleName}.${mn.ModuleName}Mapper">
    <resultMap id="result" type="com.${projectNameDot}.${mn.moduleName}.domain.${mn.ModuleName}">
        <id property="id" column="id" jdbcType="INTEGER"/>
        <result column="user_id" property="userId" jdbcType="VARCHAR"/>
        <result column="employee_no" property="employeeNo" jdbcType="VARCHAR"/>
        <result column="msg_title" property="msgTitle" jdbcType="VARCHAR"/>
        <result column="msg" property="msg" jdbcType="VARCHAR"/>
        <result column="send_status" property="sendStatus" jdbcType="CHAR"/>
        <result column="wx_msg_id" property="wxMsgId" jdbcType="VARCHAR"/>
        <result column="sys_id" property="sysId" jdbcType="VARCHAR"/>
        <result column="create_time" property="createTime" jdbcType="TIMESTAMP"/>
        <result column="update_time" property="updateTime" jdbcType="TIMESTAMP"/>
    </resultMap>
    <sql id="table">
        ${tableNames}
    </sql>
    <sql id="columns">
        ${fields.map((item, index, arr) => `${item.dbName},`).join('\n        ')}
    </sql>
    <insert id="add" parameterType="com.${projectNameDot}.${mn.moduleName}.domain.${mn.ModuleName}" useGeneratedKeys="true" keyProperty="id">
        insert into
        <include refid="table"/>
        <trim prefix="(" suffix=")" suffixOverrides=",">
            ${fields.map(item => `<if test="${item.__names.moduleName} != null and ${item.__names.moduleName} != ''">
                ${item.dbName},
            </if>`).join('\n            ')}
        </trim>
        values
        <trim prefix="(" suffix=")" suffixOverrides=",">
            ${fields.map(item => `<if test="${item.__names.moduleName} != null and ${item.__names.moduleName} != ''">
                #{${item.__names.moduleName},jdbcType=${item.type}},
            </if>`).join('\n            ')}
        </trim>
    </insert>
    <update id="updateById" parameterType="com.${projectNameDot}.${mn.moduleName}.domain.${mn.ModuleName}">
        update
        <include refid="table"/>
        <set>
            ${fields.map(item => `<if test="${item.__names.moduleName} != null and ${item.__names.moduleName} != ''">
                ${item.dbName} = #{${item.__names.moduleName},jdbcType=${item.type}},
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
            ${fields.map(item => `<if test="${item.__names.moduleName} != null and ${item.__names.moduleName} != ''">
                AND ${item.dbName} = #{${item.__names.moduleName}}
            </if>`).join('\n            ')}
        </where>
    </sql>
    <select id="count" parameterType="com.${projectNameDot}.${mn.moduleName}.condition.${mn.ModuleName}Condition" resultType="java.lang.Long">
        select count(*) from
        <include refid="table"/>
        <include refid="dynamicWhere"/>
    </select>
    <select id="find" parameterType="com.${projectNameDot}.${mn.moduleName}.condition.${mn.ModuleName}Condition" resultMap="result">
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
            ${fields.map((item) => `${item.dbName},`).join('\n        ')}
        </trim>
        values
        <foreach collection="list" item="item" index="index"
                    separator=",">
            <trim prefix="(" suffix=")" suffixOverrides=",">
                ${fields.map((item) => `#{item.${item.__names.moduleName},jdbcType=${item.type}},`).join('\n                ')}
            </trim>
        </foreach>
    </insert>

    <update id="batchUpdate">
        insert into
        <include refid="table"/>
        <trim prefix="(" suffix=")" suffixOverrides=",">
            ${fields.map((item) => `${item.dbName},`).join('\n        ')}
        </trim>
        values
        <foreach collection="list" item="item" index="index"
                    separator=",">
            <trim prefix="(" suffix=")" suffixOverrides=",">
            ${fields.map((item) => `#{item.${item.__names.moduleName},jdbcType=${item.type}},`).join('\n                ')}
            </trim>
        </foreach>
        on duplicate key update
        <trim suffixOverrides=",">
            ${fields.map((item) => `${item.dbName}=values(${item.dbName}),`).join('\n            ')}
        </trim>
    </update>
</mapper>
                
`;
    },
};
