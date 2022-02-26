import { useState, useEffect } from 'react';
import { PageContent } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { OptionsTag, FieldTable } from 'src/components';
import s from './style.less';

export default config({
    path: '/home',
    title: '首页',
})(function Home(props) {
    // 如果其他页面作为首页，直接重定向，config中不要设置title，否则tab页中会多个首页
    // return <Redirect to="/users"/>;
    const [value, setValue] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [fieldOptions, setFieldOptions] = useState(['条件', '表格']);


    useEffect(() => {
        setTimeout(() => {
            setFieldOptions(['表格选中', '表格序号', '分页', '导入', '导出', '添加', '批量删除', '弹框编辑']);
        }, 5000);
    }, []);

    console.log(dataSource);

    return (
        <PageContent className={s.root}>
            <h1>首页</h1>
            <OptionsTag
                options={['表格选中', '表格序号', '分页', '导入', '导出', '添加', '批量删除', '弹框编辑']}
                value={value}
                onChange={setValue}
            />
            <FieldTable
                dataSource={dataSource}
                onChange={setDataSource}
                options={fieldOptions}
            />
        </PageContent>
    );
});
