import {ModalContent} from '@ra-lib/admin';
import {Button, Alert, Space} from 'antd';
import config from 'src/commons/config-hoc';

export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

export default config({
    modal: {
        title: '帮助文档',
        width: 1000,
        maskClosable: true,
    },
})(function(props) {
    const { onCancel } = props;

    return (
        <ModalContent
            fitHeight
            onCancel={onCancel}
            footer={<Button onClick={onCancel}>关闭</Button>}
        >
            <Space direction={'vertical'} style={{ width: '100%' }}>
                <Alert
                    type="success"
                    message="页面操作"
                    description={(
                        <ol>
                            <li>标签：{isMac ? '⌘' : 'ctrl'} + 鼠标左键，快速全选/取消标签；</li>
                            <li>「更新本地模版」：将工具中内置模版更新到本地，同名模版会被覆盖；</li>
                            <li>字段表格：通过方向键快，可以在input框之间速移动光标；回车光标跳入下一行</li>
                            <li>字段表格：最后一行input框内，回车或↓，会新增一行；</li>
                            <li>字段表格：{isMac ? '⌘' : 'ctrl'} + shift + backspace 快速删除当前行；</li>
                        </ol>
                    )}
                />

                <Alert
                    type="warning"
                    message="模版文件说明"
                    description={(
                        <div>
                            <ol>
                                <li>name: 列表名称，默认 folder/filename；</li>
                                <li>options: 文件选项，显示到页面文件后，供用户选择；</li>
                                <li>fieldOptions: 字段选项，显示到页面表格中，供用户选择；</li>
                                <li>targetPath: 默认生成目标文件的位置；相对命令启动目录开始编写，可以使用{'{module-name}'}等模块名进行占位；</li>
                                <li>
                                    <div>getContent: 获取文件内容函数；参数说明如下：</div>
                                    <ol>
                                        <li>file.options: 用户选择的文件选项；</li>
                                        <li>files: 用户生成的其他文件；</li>
                                        <li>
                                            <div>moduleNames: 模块各种命名；moduleNames.moduleName、moduleNames['module-name']等</div>
                                        </li>
                                        <li>
                                            fields: 字段配置信息，数组元素对象参数如下
                                            <ol>
                                                <li>name: 字段名</li>
                                                <li>__names: 字段的各种命名，用法同moduleNames，比如：__names.moduleName、__names.module_name等</li>
                                                <li>type: 数据库类型</li>
                                                <li>formType: 表单类型</li>
                                                <li>dataType: 后端数据类型</li>
                                                <li>isNullable: 是否可为空</li>
                                                <li>comment: 字段注释</li>
                                                <li>chinese: 字段中文名</li>
                                                <li>length: 字段长度</li>
                                                <li>fieldOptions: 字段选项</li>
                                                <li>validation: 字段校验</li>
                                            </ol>
                                        </li>
                                    </ol>
                                </li>
                            </ol>
                        </div>
                    )}
                />
            </Space>
        </ModalContent>
    );
});
