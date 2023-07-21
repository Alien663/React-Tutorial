import { Route, Routes } from 'react-router-dom'
import './App.css';

import Timer from './components/Timer';
import Sample from './components/Sample'
import Parent from './components/Parent';
import Counter from './components/Counter';
import FakeCallAPI from './components/FakeCallAPI';
import QAQ from './components/Test';
import Main from './components/Main'


function App() {
  return (
    <Routes>
      <Route path='/timer' element={<Timer />}></Route>
      <Route path='/sample' element={<Sample />}></Route>
      <Route path='/Parent' element={<Parent />}></Route>
      <Route path='/Counter' element={<Counter />}></Route>
      <Route path='/apisample' element={<FakeCallAPI />}></Route>
      <Route path='/test' element={<QAQ />}></Route>
      <Route path='/' element={ <Main /> }></Route>
    </Routes>
  )
}

export default App;
