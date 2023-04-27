import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      console.log('ding');
    }
  }, [timeLeft]);

  return (
    <div>
      <p>Time remaining: {timeLeft} seconds</p>
    </div>
  );
};

export default Timer;