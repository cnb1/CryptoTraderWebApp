import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import MenuBar from './components/MenuBar';

function App() {

  return (
      <Router>
          <MenuBar />
      </Router>
  )

}

export default App;
