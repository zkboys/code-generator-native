# 基于模版的代码生成器

node v12.22.6 以上

## 特性

1. 本地服务，直接生成文件到项目中；
2. 本地模版，可修改、可扩展；
3. 模版可以提供选项，增加灵活性；
4. 基于数据库表获取字段，表可多选；
5. 基于sql语句获取字段，支持常见查询、关联查询语句等；
6. 基于数据库表批量生成文件；
7. 页面提供各种快捷键，提高操作效率；
8. 自动补全中英文；

## 使用

```bash
# 全局安装
$ npm i @ra-lib/gen -g --registry=https://registry.npmmirror.com

# 每次使用
$ cd your-project
$ gen
# 启动成功后，会自动打开浏览器，命令启动目录下会生成generator目录，用于存放模版、配置等信息
```

## 页面操作

1. sql语句：`⌘`或`ctrl` + `enter`，进行解析提交；
2. 标签：`⌘`或`ctrl` + `鼠标左键`，快速全选/取消标签；
3. 「更新本地模版」：将工具中内置模版更新到本地，同名模版会被覆盖；
4. 字段表格：通过方向键快，可以在input框之间速移动光标；回车光标跳入下一行
5. 字段表格：最后一行input框内，`回车`或`↓`，会新增一行；
6. 字段表格：`⌘`或`ctrl` + `shift` + `backspace` 快速删除当前行；
7. 字段表格：`⌘`或`ctrl` + `Enter` 自动补全「字段」、「中文名」、「表单类型」、「校验规则」等；
8. 字段表格：`⌘`或`ctrl` + `鼠标左键` 快速全选/取消当前行所有文件标签；
9. 字段表格：`⌘`或`ctrl` + `shift`+ `鼠标左键` 快速全选/取消当前列所有标签；

## 模版说明

1. name: 列表名称，默认 folder/filename；
2. options: 文件选项，显示到页面文件后，供用户选择；
3. defaultOptions: 默认选中的文件选项；
4. fieldOptions: 字段选项，显示到页面表格中，供用户选择；
5. defaultFieldOptions: 默认选中的字段选项；
6. targetPath: 默认生成目标文件的位置；相对命令启动目录开始编写，可以使用{'{module-name}'}等模块名进行占位；
7. getContent: 获取文件内容函数；返回false，将忽略此文件，不生成；
8. extraFiles: 其他模版，此配置可以使当前模板生成为复合模版，成多个文件；
9. `_`开头为隐藏模版，生成页面不可见；

### getContent函数参数

1. file.options: 用户选择的文件选项；
2. files: 用户生成的其他文件；
3. moduleNames: 模块各种命名；moduleNames.moduleName、moduleNames['module-name']等
4. sql: 用于解析的sql语句
5. fields: 字段配置信息：
6. javaPackages: java需要引用的包；
7. projectName: 项目名称，取自`gen`脚本运行的目录名，比如 `my-project`；
8. projectNameSlash: 下划线形式项目名，比如`my/project`；
9. projectNameDot: 点形式项目名，比如`my.project`；
10. tableNames: 数据库表名称；

### fields字段信息

1. name: 字段名
2. dbName: 数据库原始字段名
3. tableName: 表名
4. __names: 字段的各种命名，用法同moduleNames，比如：__names.moduleName、__names.module_name等
5. type: 数据库类型
6. formType: 表单类型
7. dataType: 后端数据类型（java）
8. isNullable: 是否可为空
9. comment: 字段注释
10. chinese: 字段中文名
11. length: 字段长度
12. fieldOptions: 字段选项
13. validation: 字段校验



