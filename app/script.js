import React, { useState, useMemo, useEffect } from 'react';
import { render } from 'react-dom';

const App = () => {
  const [status, setStatus] = useState('off');
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // UseMemo do zapewnienia, że formatTime jest wywoływana tylko w przypadku zmiany time
  const formattedTime = useMemo(() => formatTime(time), [time]);

  useEffect(() => {
    if (time === 0 && status !== 'off') {
      playBell();
      // Zerowanie czasu i zmiana statusu
      if (status === 'work') {
        setStatus('rest');
        setTime(20); // 20 sekund dla odpoczynku
      } else if (status === 'rest') {
        setStatus('work');
        setTime(1200); //  20 minut dla pracy
      }
    }
  }, [time, status]);

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, [timer]);

  const startTimer = () => {
    setTime(1200); //  20 minut na start
    setStatus('work');
    setTimer(
      setInterval(() => {
        setTime((time) => time - 1);
      }, 1000) // Odliczanie co 1 sekundę
    );
  };

  const stopTimer = () => {
    clearInterval(timer);
    setStatus('off');
    setTime(0);
  };

  const closeApp = () => {
    window.close();
  };

  const playBell = () => {
    const bell = new Audio('./sounds/bell.wav');
    bell.play();
  };

  return (
    <div>
      <h1>Protect your eyes</h1>
      {status === 'off' && (
        <div>
          <p>
            According to optometrists in order to save your eyes, you should
            follow the 20/20/20. It means you should to rest your eyes every 20
            minutes for 20 seconds by looking more than 20 feet away.
          </p>
          <p>
            This app will help you track your time and inform you when it's time
            to rest.
          </p>
        </div>
      )}
      {status === 'work' && <img src='./images/work.png' />}
      {status === 'rest' && <img src='./images/rest.png' />}
      {status !== 'off' && <div className='timer'>{formattedTime}</div>}
      {status === 'off' && (
        <button className='btn' onClick={startTimer}>
          Start
        </button>
      )}
      {status !== 'off' && (
        <button className='btn' onClick={stopTimer}>
          Stop
        </button>
      )}
      <button className='btn btn-close' onClick={closeApp}>
        X
      </button>
    </div>
  );
};

render(<App />, document.querySelector('#app'));
