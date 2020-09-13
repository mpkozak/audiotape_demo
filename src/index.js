import React from 'react';
import ReactDOM from 'react-dom';
import AudioTape, { polyfills } from 'audiotape';
import './index.css';
import App from './components/App';
import audiofiles from './audio';


polyfills();


const params = {
  sampleRate: 48e3,
  chunkLength: .02,
  lookahead: 2,
  latency: .1,
  playbackSpeed: 1,
  scrubSpeed: 10,
};
const tape = new AudioTape(audiofiles, params);



ReactDOM.render(
  <React.StrictMode>
    <App tape={tape} />
  </React.StrictMode>,
  document.getElementById('root')
);
