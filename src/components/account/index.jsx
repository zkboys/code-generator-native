import React from 'react';
import PropTypes from 'prop-types';        
import s from './style.module.less';
        
function Account(props){

    return (
        <div className={s.root}>
            Account组件
        </div>
    );
}

Account.PropTypes = {
    // 创建于
    createdAt: PropTypes.any,
    // 身份证件
    id: PropTypes.any,
    // 密码
    password: PropTypes.any,
    // 更新于
    updatedAt: PropTypes.any,
    // 关联的用户id
    userId: PropTypes.any,
    // 用户名
    username: PropTypes.any,
}

Account.defaultProps = {
    // 创建于
    createdAt: null,
    // 身份证件
    id: null,
    // 密码
    password: null,
    // 更新于
    updatedAt: null,
    // 关联的用户id
    userId: null,
    // 用户名
    username: null,
}

export default Account;