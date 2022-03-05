import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Error404 } from 'src/components';
import Dashboard from 'src/pages/Dashboard';
import s from './App.module.less';

function App() {
  return (
    <div className={s.root}>
      <BrowserRouter>
        <Routes>
          <Route path="/" strict element={<Dashboard />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
