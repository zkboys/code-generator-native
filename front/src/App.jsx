import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {Error404} from 'src/components';
import Generator from 'src/pages/generator';
import s from './App.module.less';

// 设置语言
moment.locale('zh-cn');


function App() {
    return (
        <div className={s.root}>
            <ConfigProvider locale={zhCN}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" strict element={<Generator/>}/>
                        <Route path="*" element={<Error404/>}/>
                    </Routes>
                </BrowserRouter>
            </ConfigProvider>
        </div>
    );
}

export default App;
