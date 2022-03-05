import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Error404 } from 'src/components';
import Generator from 'src/pages/generator';
import s from './App.module.less';

function App() {
  return (
    <div className={s.root}>
      <BrowserRouter>
        <Routes>
          <Route path="/" strict element={<Generator />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
