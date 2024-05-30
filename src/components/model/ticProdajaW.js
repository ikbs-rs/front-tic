import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import { translations } from "../../configs/translations";

import { TicDocService } from "../../service/model/TicDocService";
import { TabView, TabPanel } from 'primereact/tabview';
import TicTransactionsL from './ticTransactionsL';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import TicEventProdajaL from './ticEventProdajaL';


export default function TicProdajaW(props) {
  console.log(props, "* props * ######  ****************@@@@@@@@@@@@@@@@@@@@@@@*****************************TicProdajaW**")
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const iframeRef = useRef(null);
  const [key, setKey] = useState(0);
  const [ticDoc, setTicDoc] = useState(props.ticDoc);
  const [ticDocId, setTicDocId] = useState(props.ticDoc?.id);

  const [expandIframe, setExpandIframe] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  let [iframeKey, setIframeKey] = useState(Math.random());
  let [ticTransactionsKey, setTicTransactionsKey] = useState(0);
  const toast = useRef(null);

  const [ddChannellItem, setDdChannellItem] = useState({});
  const [ddChannellItems, setDdChannellItems] = useState([{}]);
  const [channellItem, setChannellItem] = useState({});
  const [channellItems, setChannellItems] = useState([{}]);
  const [ticEvent, setTicEvent] = useState(props.ticEvent);
  const [ticEventProdajaLVisible, setTicEventProdajaLVisible] = useState(false);
  const [showMyComponent, setShowMyComponent] = useState(true);

 

  /************************************************************************************ */
  useEffect(() => {
    const iframe = iframeRef.current;

    const handleIframeLoad = () => {
      if (iframe && iframe.contentWindow) {
        const iframeDocument = iframe.contentWindow.document;

        const targetDiv = iframeDocument.querySelector('.leaflet-pane .leaflet-overlay-pane');
        if (targetDiv) {
          targetDiv.style.display = 'none'; // Ako želite da div bude skriven
          targetDiv.addEventListener('click', handleDivClick);
        }
      }
    };

    const handleDivClick = () => {
      console.log('Div inside iframe clicked');
    };

    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
    }

    const originalConsoleLog = console.log;
    console.log = function (message) {
      originalConsoleLog.apply(console, arguments);

      if (message && typeof message === 'string' && message.includes('iframe log')) {
        console.log('Presretnuta poruka iz iframe:', message);
      }
    };

    // Čišćenje kada se komponenta demontira
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  /************************************************************************************ */

  useEffect(() => {
    async function fetchData() {
      console.log("#00##################BMVBMV#####################", props.channells)
      try {
        if (props?.channells) {
          console.log("#01##################BMVBMV#####################", props.channells)
          setChannellItems(props.channells)
          setChannellItem(props.channell)

          const dataDD = props.channells.map(({ text, id }) => ({ name: text, code: id }));
          setDdChannellItems(dataDD);
          setDdChannellItem(dataDD.find((item) => item.code === props.channell?.id) || null);
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.channell]);

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        // if (i < 2) {
        console.log(ticDocId, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ticDocId@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        const ticDocService = new TicDocService();
        const data = await ticDocService.getTicDoc(ticDocId);
        if (ticDocId != -1) {
          setTicDoc(data);
        }
        // }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [ticDocId]);


  /********************************************************************** */
  const toggleIframeExpansion = () => {
    setExpandIframe(!expandIframe); // Toggle the state
  };

  const remountComponent = () => {
    console.log(props.ticEvent, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", ticDoc)
    setKey(prevKey => prevKey + 1); // Promenimo ključ kako bi se komponenta ponovo montirala
  };

  const handleClickInsideIframe = () => {
    if (iframeRef.current?.contentWindow) {
      const buttonInsideIframe = iframeRef.current.contentWindow.document.querySelector('#kupiBtn');
      if (buttonInsideIframe) {
        buttonInsideIframe.click();
        props.toggleIframeExpansion()
      }
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
  useEffect(() => {
    console.log('TicTransactionsL montirana ili osvežena sa key:', ticTransactionsKey);
    return () => {
      console.log('TicTransactionsL demontirana');
    }
  }, []);

  /****************** */
  const handleMouseClick = (event) => {

    const newDocId = iframeRef.current.contentWindow.document.querySelector('#docId')?.value;
    setTicDocId(newDocId);
    if (event.target.id == 'reserveBtn') {
      console.log(event.srcElement, 'Mouse clicked inside iframe:', event.target.id || "NESTO DRUGO",
        "======================= ##########################  DocId inside iframe:", iframeRef.current.contentWindow.document.querySelector('#docId').value)
      if (newDocId != ticDocId) {
        setTicDocId(newDocId);
      }
      setTicTransactionsKey(++ticTransactionsKey);
    }
    // addMouseClickListener();
  };


  useEffect(() => {
    const addMouseClickListener = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.addEventListener('click', handleMouseClick);
      }
    };

    addMouseClickListener();

  }, [iframeRef.current]);

  /********************************************************* */

  let i = 0


  const removeUserMenu = async () => {
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
  const removeCartSection = async () => {
    for (let attempt = 0; attempt < 10; attempt++) {
      if (iframeRef.current?.contentDocument) {
        const cartSectionDiv = iframeRef.current.contentDocument.querySelector('.cart-section');
        if (cartSectionDiv) {
          // cartSectionDiv.style.display = 'none'; // TO DO
        } else {
          setTimeout(() => {
            removeCartSection(); // Retry hiding the section after a short delay
          }, 3000); // Timeout of 3 seconds to retry
        }
      }
    }
  };


  const handleIframeLoad = async () => {

    await removeUserMenu()
    await removeCartSection()

    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const iframeConsole = iframe.contentWindow.console;
      if (iframeConsole) {
        const originalIframeConsoleLog = iframeConsole.log;
        iframeConsole.log = function (message) {
          originalIframeConsoleLog.apply(iframeConsole, arguments);
          // Vaš kod za presretanje poruke iz iframe-a ovde
          if (message && typeof message === 'string' && message.includes('rezervaciju')) {
            setTicTransactionsKey(++ticTransactionsKey);
            console.log("######################## Radim rezervaciju za dokument ####################################");
          }
          // console.log('Presretnuta poruka iz iframe:', message);
        };
      }
    }
  };


  function HeaderBtn() {
    return (
      <div className="card">
        <div className="flex card-container">
          <div className="flex flex-wrap gap-1" >
            <Button label={translations[selectedLanguage].Kupi} onClick={handleClickInsideIframe} icon="pi pi-cog" raised />
          </div>
          <div className="flex flex-wrap gap-1" raised>
            <Button label={translations[selectedLanguage].UcitajMapu} onClick={remountComponent} raised />
          </div>
        </div>
      </div>
    );
  };

  /******************************************************************************** 
   * 
  ******************************************************************************** */
  const handleEventProdajaClick = async (e, destination) => {
    try {
      setTicEventProdajaLDialog();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch ticArt data',
        life: 3000
      });
    }
  };

  const setTicEventProdajaLDialog = (destination) => {
    setTicEventProdajaLVisible(true);
  };
  /******************************************************************************** 
   * 
  ******************************************************************************** */
  const Tab2Header = (options) => {
    return (
      <>
        <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
          <Button icon={expandIframe ? "pi pi-angle-double-left" : "pi pi-angle-double-right"} onClick={toggleIframeExpansion}
            severity="warning"
          />
        </div>
      </>
    )
  };

  function NavigateTemplate({ activeIndex, setActiveIndex, totalTabs }) {
    return (
      <div className="flex justify-content-between mt-2">
        <Button
          label="Back"
          icon="pi pi-chevron-left"
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          className="p-button-text"
          disabled={activeIndex === 0}
        />
        <Button
          label="Next"
          icon="pi pi-chevron-right"
          iconPos="right"
          onClick={() => setActiveIndex(Math.min(totalTabs - 1, activeIndex + 1))}
          className="p-button-text"
          disabled={activeIndex === totalTabs - 1}
        />
      </div>
    );
  }
  const handleTicEventProdajaLDialogClose = (newObj) => {
    setTicEvent(newObj);
    ticEvent.id = newObj.id;
    ticEvent.text = newObj.text;
    ticEvent.code = newObj.code;
    setTicEvent({ ...ticEvent })
    setTicEventProdajaLVisible(false);
    setKey(prevKey => prevKey + 1);
  };

  const handleFirstColumnClick = (rowData) => {
    console.log(rowData.event, "#############################handleFirstColumnClick##################################", ticEvent.id)
    if (ticEvent.id != rowData.event) {
      let _ticEvent = { ...ticEvent }
      _ticEvent.id = rowData.event
      _ticEvent.code = rowData.cevent
      _ticEvent.text = rowData.nevent
      setTicEvent({ ..._ticEvent })
    }
    // alert(`Kliknuo ${rowData.event} ** ${ticEvent.id}`);
  };

  const handleAction = (rowData) => {
    console.log(rowData, "********************************************************************")
    setTicDoc(rowData)
  }

  return (
    <div key={key}>
      <div className="card" >
        {/* <div className="grid">
          <div className="col-1">
            <Tab2Header />
          </div>
        </div> */}
        {/* <div style={{ maxWidth: "95%" }}> */}
        <div className="grid grid-nogutter">
          <div className={props.expandIframe ? "col-12" : "col-7"}> {/* IFRAME */}
            <div className="grid">
              <div className="col-12">
                <iframe key={iframeKey}
                  id="myIframe"
                  ref={iframeRef}
                  src={`https://82.117.213.106/sal/buy/card/event/${ticEvent?.id}/${props.ticDoc?.id}?par1=BACKOFFICE&channel=${props.channell?.id}`}
                  onLoad={handleIframeLoad}
                  title="Sal iframe"
                  width="100%"
                  height="600px"
                  frameBorder="0"
                // scrolling="no"
                ></iframe>
              </div>
            </div>
          </div>
          {!props.expandIframe && (
            <div className="col-5">
              <div className="grid">
                <div className="col-12">

                  <HeaderBtn />

                    <TicTransactionsL
                      key={ticTransactionsKey}
                      ticDoc={ticDoc}
                      propsParent={props}
                      handleFirstColumnClick={handleFirstColumnClick}
                      handleAction={handleAction}
                    />
                    {/* <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} /> */}
                  </div>

              </div>
            </div>
          )}
        </div>

        {/* </div> */}
      </div>
      {/* <div className="card">
        <div>
          <div className="fieldH flex align-items-center px-3"><b>
            <label htmlFor="cevent" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Izaberite_event}</label>
          </b>
            <div className="p-inputgroup flex-1">
              <InputText id="cevent" value={ticEvent.id} />
            </div>
            <div className="p-inputgroup flex-1">
              <InputText id="cdoc" value={props.ticDoc?.id} />
            </div>
            <div className="p-inputgroup flex-1">
              <InputText id="cdoc" value={props.channell?.id} />
            </div>            
          </div>
        </div>
      </div > */}
      <Dialog
        header={translations[selectedLanguage].EventList}
        visible={ticEventProdajaLVisible}
        style={{ width: '90%', height: '1400px' }}
        onHide={() => {
          setTicEventProdajaLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {ticEventProdajaLVisible &&
          <TicEventProdajaL
            parameter={'inputTextValue'}
            ticEvent={props.ticEvent}
            ticDoc={props.ticDoc}
            onTaskComplete={handleTicEventProdajaLDialogClose}
            setTicEventProdajaLVisible={setTicEventProdajaLVisible}
            dialog={true}
            lookUp={true}
          />}
      </Dialog>
    </div >
  );
}
