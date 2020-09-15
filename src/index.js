import React from 'react';
import ReactDOM from 'react-dom';
import AudioTape, { polyfills } from 'audiotape';
import './index.css';
import App from './App';


polyfills();


const params = {
  sampleRate: 48e3,
  chunkLength: .02,
  lookahead: 2,
  latency: .1,
  playbackSpeed: 1,
  scrubSpeed: 5,
};
const tape = new AudioTape(params);



ReactDOM.render(
  <React.StrictMode>
    <App tape={tape} />
  </React.StrictMode>,
  document.getElementById('root')
);
