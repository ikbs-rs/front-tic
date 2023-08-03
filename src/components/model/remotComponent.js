import React, { useState, useEffect } from 'react';

const RemoteComponent = () => {
  const [componentData, setComponentData] = useState(null);

  useEffect(() => {
    // Funkcija za učitavanje udaljene komponente
    const loadRemoteComponent = async () => {
      const url = 'http://ws10.ems.local:8353/?endpoint=parend&sl=sr_cyr';
      const response = await fetch(url);


      if (response.ok) {
        // Pretvaranje odgovora u JavaScript kod i izvršavanje komponente
        const componentCode = await response.text();
        console.log(componentCode, "*******************------------------", response)        
        const componentFunc = new Function(componentCode);
        componentFunc();
      } else {
        console.error('Failed to load remote component.');
      }
    };

    loadRemoteComponent();
  }, []);

  return (
    <div>
      {componentData ? (
        /* Prikazivanje podataka koje ste dobili */
        <div>
          <p>{componentData.someData}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default RemoteComponent;
