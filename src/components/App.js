import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import './App.css';





function usePlayhead(getPlayhead) {
  const rafRef = useRef(null);
  const [playhead, setPlayhead] = useState(0);

  const cb = useCallback(async () => {
    setPlayhead(getPlayhead());
    rafRef.current = requestAnimationFrame(cb);
  }, [getPlayhead, setPlayhead, rafRef]);

  useEffect(() => {
    const raf = rafRef.current;
    if (!raf) {
      rafRef.current = requestAnimationFrame(cb);
    };
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [rafRef, cb]);

  return playhead;
};





export default function App({ tape } = {}) {
  const playhead = usePlayhead(tape.getPlayhead);

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
    <div className="App">
      <div className="Transport">
        <button className="Transport__button disabled" onClick={null}>
          <span aria-label="record" role="img">⏺</span>
        </button>
        <button className="Transport__button" onClick={tape.play}>
          <span aria-label="play" role="img">▶️</span>
        </button>
        <button className="Transport__button" onClick={tape.stop}>
          <span aria-label="stop" role="img">⏸</span>
        </button>
        <button className="Transport__button"
          onMouseDown={tape.rew_start}
          onMouseUp={tape.rew_stop}
        >
          <span aria-label="rewind" role="img">⏪</span>
        </button>
        <button className="Transport__button"
          onMouseDown={tape.ff_start}
          onMouseUp={tape.ff_stop}
        >
          <span aria-label="fast-forward" role="img">⏩</span>
        </button>
      </div>
      <div className="Counters">
        <h4 className="Counters__counter">
          <span>{secondsToHMSmS(playhead)}</span>
        </h4>
        <h4 className="Counters__counter">
          <span>{secondsToFeet(playhead)}</span>
        </h4>
      </div>
    </div>
  );
};
