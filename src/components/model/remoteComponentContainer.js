import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Token from '../../utilities/Token';
import { Button } from "primereact/button";
import { translations } from "../../configs/translations";

const RemoteComponentContainer = ({ remoteUrl, queryParams, onTaskComplete }) => {
  //console.log(remoteUrl, "***********RemoteComponentContainer**********", queryParams)
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const [isLoading, setLoading] = useState(true);
  const [receivedData, setReceivedData] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        Authorization: tokenLocal.token
      };

      try {
        const response = await axios.get(remoteUrl, { params: { headers, queryParams } });
        setReceivedData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [remoteUrl, queryParams]);

  // Slušanje poruka iz iFrame-a
  useEffect(() => {
    const handleMessageFromIframe = (event) => {
      // Provera da li poruka dolazi iz očekivanog izvora
      if (event.origin === 'http://ws10.ems.local:8353') {
        // Provera tipa poruke
        if (event.data.type === 'dataFromIframe') {
          const receivedData = event.data.data;
          console.log("Podaci primljeni iz iFrame-a:", receivedData);
        }
      }
    };

    // Dodavanje event slušača prilikom montiranja komponente
    window.addEventListener('message', handleMessageFromIframe);

    // Uklanjanje event slušača prilikom demontiranja komponente
    return () => {
      window.removeEventListener('message', handleMessageFromIframe);
    };
  }, []);

  const handleTaskComplete = (data) => {
    onTaskComplete(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const sendToIframe = () => {
    const iframe = document.getElementById('CmnFrame');

    // Provera da li je iframe već učitan
    if (iframe && iframe.contentWindow) {
      const message = { type: 'dataUpdate', data: queryParams };
      iframe.contentWindow.postMessage(message, 'http://ws10.ems.local:8353');
    }
  };

  // Definišite funkciju koju želite pozvati iz udaljenog dokumenta
  // // function handleDataFromIframe(data) {
  //   console.log("Podaci primljeni iz iFrame-a:********************************wwwwww**************************************", data);
  // }


  return (
    <div>
      {/* Render receivedData or other UI as needed */}
      {/* For example, you might render a button to trigger the task completion */}
      <div className="flex card-container">
        <Button onClick={() => handleTaskComplete(receivedData)} label={translations[selectedLanguage].Links} text raised icon="pi pi-table" />
      </div>
      <iframe 
        id="CmnFrame"
        src={remoteUrl}
        width="100%"
        height="900px"
        title="Remote Component"
        frameBorder="0"
        onLoad={() => {
          setIframeLoaded(true);// Postavljanje flaga kada se iFrame učita
          sendToIframe(); // Slanje poruke prilikom učitavanja
        }}
      ></iframe>
    </div>
  );
};

export default RemoteComponentContainer;