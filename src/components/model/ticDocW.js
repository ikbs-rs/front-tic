import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import { translations } from "../../configs/translations";



export default function TicDocW(props) {
  console.log(props, "***************************************************************************************************")
  const objName = "tic_eventobj"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicEventobj = EmptyEntities[objName]
  emptyTicEventobj.event = props.ticEvent.id
  const iframeRef = useRef(null);
  const [key, setKey] = useState(0);

  const iframe = document.getElementById('myIframe');
  const iframeWindow = iframe?.contentWindow;
  const [iframeVariable, setIframeVariable] = useState(iframeWindow?.cartItems);
  

  /********************************************************************** */
  const remountComponent = () => {
    setKey(prevKey => prevKey + 1); // Promenimo ključ kako bi se komponenta ponovo montirala
  };

  const handleClickInsideIframe = () => {
    if (iframeRef.current?.contentWindow) {
      const buttonInsideIframe = iframeRef.current.contentWindow.document.querySelector('.p-button.p-component.p-button-raised.p-button-primary.checkout-button');
      if (buttonInsideIframe) {
        buttonInsideIframe.click();
      }
    }
  };

  const addMouseClickListener = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.addEventListener('click', handleMouseClick);
    }
  };

  useEffect(() => {
    const handleClick = (event) => {

      console.log('Kliknuto je na element unutar grid-a:', event.target);
      const iframes = document.querySelectorAll('.grid iframe');
      iframes.forEach((iframe) => {
        console.log('########### Iframe:', iframe);
      });
      const addMouseClickListener = () => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.addEventListener('click', handleMouseClick);
        }
      };
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);


  /****************** */
  const handleMouseClick = (event) => {
    console.log(event.srcElement, 'Mouse clicked inside iframe:', event.target.id || "NESTO DRUGO", "=======================", iframeRef.current?.getAttribute('src'));
    setIframeVariable(iframeWindow?.cartItems)
    addMouseClickListener();
    console.log(iframeVariable, '############################################################')
  };


  useEffect(() => {
    const addMouseClickListener = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.addEventListener('click', handleMouseClick);
      }
    };

    addMouseClickListener();

    // return () => {
    //   removeMouseClickListener();
    // };
  }, [iframeRef.current]);

  /********************************************************* */

  let i = 0
  const handleCancelClick = () => {
    props.handleDialogClose(false);
  };

  const handleTaskComplete = (data) => {
    props.onTaskComplete(data);
  };

  const removeUserMenu = () => {
    if (iframeRef.current?.contentDocument) {
      const userMenuDiv = iframeRef.current.contentDocument.querySelector('.user-menu');
      if (userMenuDiv) {
        userMenuDiv.remove();
      } else {
        setTimeout(() => {
          removeUserMenu(); // Ponovo pokreni proveru i uklanjanje nakon 3 sekunde
        }, 1000); // Timeout od 3 sekunde
      }
    }
  };


  const handleIframeLoad = () => {
    removeUserMenu();
  };

  return (
    <div key={key}>
      <div class="grid grid-nogutter">
        <div class="col-6">
          {props.eventTip == "SAL" && (
            <div className="grid">
              <div className="col-12">
                {/* <div className="card"> */}
                <iframe
                  id="myIframe"
                  ref={iframeRef}
                  src={`https://82.117.213.106/sal/buy/card/event/${props.ticEvent.id}`}
                  onLoad={handleIframeLoad}
                  title="Sal iframe"
                  width="100%"
                  height="600px"
                  frameBorder="0"
                // scrolling="no"
                ></iframe>
                {/* </div> */}
              </div>

            </div>
          )}
          {props.eventTip == "WEB" && (
            <div className="grid">
              <div className="col-12">
                <div className="card">
                  <iframe
                    src={`https://dev.ticketline.rs/2023/08/22/sezonska-ulaznica-fk-napredak-2023-2024-vaucer/${props.ticEvent.id}/?parent=ADM`}
                    title="Sal iframe"
                    width="100%"
                    height="760px"
                    frameBorder="0"
                  // scrolling="no"
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
        <div class="col-6">
          <div class="grid">
            <div className="col-4">
              <Button label="Simuliraj klik" onClick={handleClickInsideIframe} />
            </div>
            <div className="col-4">
              <Button label="Ponovo učitaj iframe" onClick={remountComponent} />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex card-container">
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={() => handleTaskComplete(false)} text raised />
      </div> */}
      {/* <div className="card"> */}

      {/* </div> */}
    </div>
  );
}
