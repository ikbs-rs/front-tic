import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";


const CountdownTimer = (props) => {

  const [showDialog, setShowDialog] = useState(false);

  const calculateTimeLeft = () => {
    const target = moment(props.targetDate, 'YYYYMMDDHHmmss').toDate();
    const difference = +target - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft =  {
        minutes: Math.floor(difference / 1000 / 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft=null;
    }
    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
      if (!time||time==null) {
        clearInterval(timer);
        setShowDialog(true);        
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [props.targetDate]);

  const handleConfirm = async () => {
    setShowDialog(false); // Zatvori dijalog
    props.handleSetActiveIndex(0); // Postavi vrednost kroz prosleđenu funkciju
  };
  
  const footerContent = (
    <div>
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={handleConfirm}
        autoFocus
      />
    </div>
  );  

  return (
    <>
      <div>
        {timeLeft ? (
          <>
            <span>Преостало време: </span>
            <span>
              <b>
                {timeLeft.minutes}:{timeLeft.seconds.toString().padStart(2, '0')}
              </b>
            </span>
          </>
        ) : (
          <span>Време је истекло!</span>
        )}
      </div>
      <Dialog
        header="Обавештење"
        visible={showDialog}
        style={{ width: "50vw" }}
        breakpoints={{ "200px": "75vw", "200px": "100vw" }}
        onHide={() => setShowDialog(false)}
        footer={footerContent}
      >
        <p className="m-0">
          Време предвиђено за куповину је истекло, покушајте поново.
        </p>
      </Dialog>      
    </>
  );
};

export default CountdownTimer;
