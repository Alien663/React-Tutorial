import React from "react";
import logo from '../logo.svg';

const Main = () => {
    return <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p> Edit
        <code>src/App.js</code>
        and save to reload.
      </p>
      <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
      <a className="App-link" href="/sample" rel="noopener noreferrer">Sample</a>
      <a className="App-link" href="/timer" rel="noopener noreferrer">Timer</a>
      <a className="App-link" href="/parent" rel="noopener noreferrer">parent</a>
      <a className="App-link" href="/counter" rel="noopener noreferrer">Counter</a>
      <a className="App-link" href="/apisample" rel="noopener noreferrer">Call API</a>
    </header>
  </div>
}

export default Main