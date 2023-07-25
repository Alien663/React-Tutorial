import { Route, Routes } from 'react-router-dom'
import Main from './Main'
import Sample from './Sample'

import '../Style/App.css';

function App() {
  return (
    <Routes>
      <Route path='/sample' element={<Sample />}></Route>
      <Route path='/' element={ <Main /> } />
    </Routes>
  );
}

export default App;
