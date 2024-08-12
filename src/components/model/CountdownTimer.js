import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const target = moment(targetDate, 'YYYYMMDDHHmmss').toDate();
    const difference = +target - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor(difference / 1000 / 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div>
      {timeLeft.minutes !== undefined && timeLeft.seconds !== undefined ? (
        <>
        <span>Preostalo vreme: </span>
        <span><b>
          {timeLeft.minutes}:{timeLeft.seconds.toString().padStart(2, '0')}
          </b>
        </span>
        </>        
      ) : (
        <span>Vreme Vam je isteklo!</span>
      )}
    </div>
  );
};

export default CountdownTimer;
