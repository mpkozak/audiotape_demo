import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import './App.css';
import { audioFiles } from './_audio';



function usePlayhead(getPlayhead = null) {
  const [playhead, setPlayhead] = useState(0);
  const rafRef = useRef(null);

  const rafCb = useCallback(() => {
    setPlayhead(getPlayhead());
    rafRef.current = requestAnimationFrame(rafCb);
  }, [getPlayhead, setPlayhead, rafRef]);

  useEffect(() => {
    const raf = rafRef.current;
    if (!raf) {
      rafRef.current = requestAnimationFrame(rafCb);
    };
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [rafRef, rafCb]);

  return playhead;
};



function Counters({ getPlayhead = null } = {}) {
  const playhead = usePlayhead(getPlayhead);

  const lz = (val, len = 2) => (('0').repeat(len) + val).slice(-len);

  const secondsToHMSmS = (s = 0) => {
    let srcSeconds = s;
    const hours = Math.floor(srcSeconds / 3600);
    srcSeconds -= (hours * 3600);
    const minutes = Math.floor(srcSeconds / 60);
    srcSeconds -= (minutes * 60);
    const seconds = Math.floor(srcSeconds);
    srcSeconds -= seconds;
    const milliseconds = Math.round(srcSeconds * 1000);
    const out = `${lz(hours)}:${lz(minutes)}:${lz(seconds)}.${lz(milliseconds, 3)}`
    return out;
  };

  const secondsToFeet = (s = 0, ips = 7.5) => {
    const inches = s * ips;
    const feet = inches / 12;
    const str = lz(feet.toFixed(1), 7);
    return str;
  };

  return (
    <div className="Counters">
      <h2 className="Counters__counter">
        {secondsToHMSmS(playhead)}
      </h2>
      <h2 className="Counters__counter">
        {secondsToFeet(playhead)}
      </h2>
    </div>
  );
};



function Transport({
  play = null,
  stop = null,
  rev = null,
  ff = null,
  rew = null
} = {}) {
  return (
    <div className="Transport">
      <button className="Transport__button" onClick={stop}>
        <span aria-label="stop" role="img">⏸</span>
      </button>
      <button className="Transport__button" onClick={rev}>
        <span aria-label="reverse" role="img">◀️</span>
      </button>
      <button className="Transport__button" onClick={play}>
        <span aria-label="play" role="img">▶️</span>
      </button>
      <button className="Transport__button" onClick={rew}>
        <span aria-label="rewind" role="img">⏪</span>
      </button>
      <button className="Transport__button" onClick={ff}>
        <span aria-label="fast-forward" role="img">⏩</span>
      </button>
    </div>
  );
};



function Speed({ setPlaybackSpeed = null } = {}) {
  const [speed, setSpeed] = useState(0);

  const parseSpeed = speed => {
    return Math.round(
      (1 + ((speed < 0) ? (speed / 50) : (speed / 25))) * 100
    ) / 100;
  };

  useEffect(() => {
    if (setPlaybackSpeed) {
      const tapeSpeed = parseSpeed(speed);
      setPlaybackSpeed(tapeSpeed);
    };
  }, [setPlaybackSpeed, speed]);

  const handleChangeSpeed = useCallback((e) => {
    setSpeed(+e.target.value);
  }, [setSpeed]);

  return (
    <form className="slider">
      <input
        className="slider__input"
        type="range"
        min={-25}
        max={25}
        step={1}
        value={speed}
        onChange={handleChangeSpeed}
      />
      <h2>{parseSpeed(speed).toFixed(2)}<span>x</span></h2>
    </form>
  );
};



function Volume({ setTapeVolume = null } = {}) {
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (setTapeVolume) {
      setTapeVolume(volume);
    };
  }, [setTapeVolume, volume]);

  const handleChangeVolume = useCallback((e) => {
    setVolume(+e.target.value);
  }, [setVolume]);

  return (
    <form className="slider">
      <input
        className="slider__input"
        type="range"
        min={0}
        max={2}
        step={.1}
        value={volume}
        onChange={handleChangeVolume}
      />
      <h2>{(volume * 100).toFixed(0)}<span>%</span></h2>
    </form>
  );
};



export default function App({ tape = {} } = {}) {
  const [loadProgress, setLoadProgress] = useState(-1);

  const load = useCallback(() => {
    if (loadProgress < 0) {
      setLoadProgress(0);
      tape.activate();
      tape.load(audioFiles, setLoadProgress);
    };
  }, [tape, loadProgress, setLoadProgress]);

  const getPlayhead = useCallback(() => tape.playhead, [tape]);

  return (
    <div className="App">
      {(loadProgress < 1) && (
        <div className="App__loading" onClick={load}>
          {loadProgress < 0
            ? <h1>click</h1>
            : <h3>Loading Audio... {(loadProgress * 100).toFixed(0)}%</h3>
          }
        </div>
      )}
      <Counters getPlayhead={getPlayhead} />
      <Transport
        play={tape.play}
        stop={tape.stop}
        rev={tape.rev}
        ff={tape.ff}
        rew={tape.rew}
      />
      <Speed setPlaybackSpeed={tape.setPlaybackSpeed} />
      <Volume setTapeVolume={tape.setVolume} />
    </div>
  );
};
