import React from 'react';
import ReactDOM from 'react-dom';
import AudioTape, { polyfills } from 'audiotape';
import './index.css';
import App from './App';


polyfills();
const tape = new AudioTape();


ReactDOM.render(
  <React.StrictMode>
    <App tape={tape} />
  </React.StrictMode>,
  document.getElementById('root')
);
