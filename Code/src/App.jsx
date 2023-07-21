import { Route, Routes } from 'react-router-dom'
import './App.css';

import Timer from './components/Timer';
import Sample from './components/Sample'
import Parent from './components/Parent';
import Counter from './components/Counter';
import FakeCallAPI from './components/FakeCallAPI';
import Counter_hook from './components/Counter_hook';
import Counter_class from './components/Counter_class';
import Main from './components/Main'


function App() {
  return (
    <Routes>
      <Route path='/timer' element={<Timer />}></Route>
      <Route path='/sample' element={<Sample />}></Route>
      <Route path='/Parent' element={<Parent />}></Route>
      <Route path='/counter' element={<Counter />}></Route>
      <Route path='/counter/hook' element={<Counter_hook />}></Route>
      <Route path='/counter/class' element={<Counter_class />}></Route>
      <Route path='/apisample' element={<FakeCallAPI />}></Route>
      <Route path='/' element={ <Main /> }></Route>
    </Routes>
  )
}

export default App;
