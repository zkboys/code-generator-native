export const FORM_ELEMENT_OPTIONS = [
    { value: 'input', label: '输入框' },
    { value: 'hidden', label: '隐藏框' },
    { value: 'number', label: '数字框' },
    { value: 'textarea', label: '文本框' },
    { value: 'password', label: '密码框' },
    { value: 'mobile', label: '手机输入框' },
    { value: 'email', label: '邮箱输入框' },
    { value: 'select', label: '下拉框' },
    { value: 'select-tree', label: '下拉树' },
    { value: 'checkbox', label: '复选框' },
    { value: 'checkbox-group', label: '复选框组' },
    { value: 'radio', label: '单选框' },
    { value: 'radio-group', label: '单选框组' },
    { value: 'radio-button', label: '单选按钮组' },
    { value: 'switch', label: '切换按钮' },
    { value: 'date', label: '日期选择框' },
    { value: 'time', label: '时间选择框' },
    { value: 'moth', label: '月份选择框' },
    { value: 'date-time', label: '日期+时间选择框' },
    { value: 'date-range', label: '日期区间选择框' },
    { value: 'cascader', label: '级联下拉框' },
    { value: 'transfer', label: '穿梭框' },
];
export const FIELD_EDIT_TYPES = {
    input: 'input',
    select: 'select',
    tags: 'tags',
};

// 后端数据类型，以java为准，如果后端是其他类型，编写模板时，基于java再次转换
export const DATA_TYPE_OPTIONS = [
    { value: 'String', label: 'String' },
    { value: 'Timestamp', label: 'Timestamp' },
];
