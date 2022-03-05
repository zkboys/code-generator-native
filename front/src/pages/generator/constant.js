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
    { value: 'int', label: 'int' },
    { value: 'long', label: 'long' },
    { value: 'boolean', label: 'boolean' },
    { value: 'BigInteger', label: 'BigInteger' },
    { value: 'float', label: 'float' },
    { value: 'double', label: 'double' },
    { value: 'BigDecimal', label: 'BigDecimal' },
    { value: 'Date', label: 'Date' },
    { value: 'Time', label: 'Time' },
    { value: 'Timestamp', label: 'Timestamp' },
];

export const VALIDATE_OPTIONS = [
    { value: 'required', label: '必填' },
    { value: 'noSpace', label: '无空格' },
    { value: 'mobile', label: '手机号', pattern: /^1\d{10}$/ },
    { value: 'landLine', label: '座机号', pattern: /^([0-9]{3,4}-)?[0-9]{7,8}$/ },
    { value: 'email', label: '邮箱', pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/ },
    { value: 'cardNumber', label: '身份证号', pattern: /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/ },
    { value: 'qq', label: 'qq号', pattern: /^[1-9][0-9]{4,9}$/ },
    { value: 'ip', label: 'IP地址', pattern: /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/ },
    { value: 'port', label: '端口号', pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/ },
    { value: 'positiveInteger', label: '正整数', pattern: /^[1-9]\d*$/ },
    { value: 'numberWithTwoDecimal', label: '数字、保存两位小数', pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/ },
];