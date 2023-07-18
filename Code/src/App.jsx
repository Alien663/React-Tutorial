import { Route, Routes } from 'react-router-dom'
import './App.css';

import Sample from './components/Sample'
import Main from './components/Main'

function App() {
  return (
    <Routes>
      <Route path='/sample' element={<Sample />}></Route>
      <Route path='/' element={ <Main /> }></Route>
    </Routes>
  )
}

export default App;
