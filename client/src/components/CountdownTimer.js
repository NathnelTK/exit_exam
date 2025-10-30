import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ examDate, title }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(examDate) - new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [examDate]);

  return (
    <div className="countdown-timer">
      <h2 className="countdown-title">{title}</h2>
      <div className="countdown-display">
        <div className="time-unit">
          <span className="time-value">{timeLeft.days}</span>
          <span className="time-label">Days</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="time-label">Hours</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="time-label">Minutes</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="time-label">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

