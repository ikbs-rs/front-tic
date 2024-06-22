import React, { useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import PodaciKupcaStep from './PodaciKupcaStep';
import './Kupovina.scss';
// import { useAuth } from '../authContext';
// import { useNavigate, useParams } from 'react-router-dom';

const Kupovina = ({ orderDetails, eventAttributes, eventData, userDetails }) => {
  const toast = useRef(null);
  // const navigate = useNavigate();
  // const { user } = useAuth();
  const initialized = useRef(false);

  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState({});
  const [isReservation, setIsReservation] = useState(false);

  // const { eventId } = useParams();

  // Initial state setup for form data
  const [formData, setFormData] = useState([]);

  // console.log("user=====================================:", user);

  useEffect(() => {
    
    if (!initialized.current) {
      const updatedOrderDetails = (orderDetails.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            firstName: userDetails.firstname,
            lastName: userDetails.lastname,
            reserveOnly: false,
            ptt: userDetails.postcode,
            city: userDetails.place,
            country: userDetails.country,
            phone: userDetails.tel,
            email: userDetails.mail,
            jmbg: userDetails.idnum,
            pib: userDetails.pib,
            address: userDetails.address,
            file: null,
            fileName: ''
          };
        } else {
          return {
            ...item,
            firstName: '',
            lastName: '',
            reserveOnly: false,
            ptt: '',
            city: '',
            country: '',
            phone: '',
            email: '',
            file: null,
            fileName: ''
          }
        }
      }));
      setFormData(updatedOrderDetails);

      initialized.current = true;
    }
  }, []);



  useEffect(() => {
    setActiveIndex(0);
  }, [orderDetails]);

  const stepComponents = 
    <PodaciKupcaStep 
      // onNext={handleNextStep} showNextButton={showNextButton} 
      eventAttributes={eventAttributes}
      eventData={eventData} orderDetails={orderDetails} 
      // activeIndex={activeIndex} onPrevious={handlePreviousStep}
      // stepData={stepData}
      // setStepData={setStepData}
      formData={formData}
      setFormData={setFormData}
      file={file}
      setFile={setFile}
      fileName={fileName}
      setFileName={setFileName}
      isReservation={isReservation}
      setIsReservation={setIsReservation} />;

  return (
    <div className="kupoina modern-kupovina">
      <Toast ref={toast} />
      <div className="step-content">
        {stepComponents}
      </div>
    </div>
  );
};

export default Kupovina;