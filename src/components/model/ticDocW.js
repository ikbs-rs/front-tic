import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import { translations } from "../../configs/translations";

/********************************** */
import { TicDocService } from "../../service/model/TicDocService";
/********************************** */
import { TabView, TabPanel } from 'primereact/tabview';
import { Avatar } from 'primereact/avatar';
import TicTransactionsL from './ticTransactionsL';
import DateFunction from "../../utilities/DateFunction"
import { Toast } from "primereact/toast";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import TicEventProdajaL from './ticEventProdajaL';
import env from '../../configs/env';


export default function TicDocW(props) {
  console.log(props, "******************@@@@@@@@@@@@@@@@@@@@@@@*******************************", props.ticDoc)
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const iframeRef = useRef(null);
  const [key, setKey] = useState(0);
  const [ticDoc, setTicDokument] = useState(props.ticDoc);
  const [ticDocId, setTicDokumentId] = useState(props.ticDoc?.id);

  const iframe = document.getElementById('myIframe');
  const iframeWindow = iframe?.contentWindow;
  const [iframeVariable, setIframeVariable] = useState(iframeWindow?.cartItems);
  const [expandIframe, setExpandIframe] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  let [iframeKey, setIframeKey] = useState(Math.random());
  let [ticTransactionsKey, setTicTransactionsKey] = useState(0);
  let [ticTransactionsKey1, setTicTransactionsKey1] = useState(1000);
  const toast = useRef(null);

  const [ddChannellItem, setDdChannellItem] = useState({});
  const [ddChannellItems, setDdChannellItems] = useState([{}]);
  const [channellItem, setChannellItem] = useState({});
  const [channellItems, setChannellItems] = useState([{}]);
  const [ticEvent, setTicEvent] = useState(props.ticEvent);
  const [ticEventProdajaLVisible, setTicEventProdajaLVisible] = useState(false);
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [salUrl, setSalUrl] = useState(`${env.DOMEN}/sal/buy/card/event/${ticEvent?.id||props.ticEvent?.id}/${props.ticDoc?.id}?par1=BACKOFFICE&channel=${props.channell?.id}`);

  /************************************************************************************ */
  useEffect(() => {
    async function fetchData() {
      try {
        setSalUrl(`${env.DOMEN}/sal/buy/card/event/${ticEvent?.id||props.ticEvent?.id}/${props.ticDoc?.id}?par1=BACKOFFICE&channel=${props.channell?.id}`)
        // console.log(salUrl, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.channell.id, props.ticDoc?.id, ticEvent?.id, props.ticEvent?.id]);

  useEffect(() => {
    const iframe = iframeRef.current;

    const handleIframeLoad = () => {
      if (iframe && iframe.contentWindow) {
        const iframeDocument = iframe.contentWindow.document;

        // Dodavanje listener-a na div unutar iframe-a
        const targetDiv = iframeDocument.querySelector('.leaflet-pane .leaflet-overlay-pane');
        if (targetDiv) {
          targetDiv.style.display = 'none'; // Ako želite da div bude skriven
          targetDiv.addEventListener('click', handleDivClick);
        }
      }
    };

    const handleDivClick = () => {
      console.log('Div inside iframe clicked');
      // Vaš kod za obradu klika ovde
    };

    // Dodavanje load event listener-a na iframe
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
    }

    // Čišćenje event listener-a kada se komponenta demontira
    // return () => {
    //   if (iframe) {
    //     iframe.removeEventListener('load', handleIframeLoad);
    //   }
    // };
    // }, [iframeKey]); // Dodavanje iframeKey kao zavisnosti za ponovno pokretanje kada se promeni
    // useEffect(() => {
    // Presretanje console.log u glavnoj stranici
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
        const data = await ticDocService.getTicDocP(ticDocId);
        // const data = await ticDocService.getTicDoc(ticDocId);
        if (ticDocId != -1) {
          setTicDokument(data);
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
      }
    }
  };

  // const addMouseClickListener = () => {
  //   if (iframeRef.current?.contentWindow) {
  //     iframeRef.current.contentWindow.addEventListener('click', handleMouseClick);
  //   }
  // };

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
    setTicDokumentId(newDocId);
    if (event.target.id == 'reserveBtn') {
      console.log(event.srcElement, 'Mouse clicked inside iframe:', event.target.id || "NESTO DRUGO",
        "======================= ##########################  DocId inside iframe:", iframeRef.current.contentWindow.document.querySelector('#docId').value)
      if (newDocId != ticDocId) {
        setTicDokumentId(newDocId);
      }
      setTicTransactionsKey((prev) => prev +1);
      setTicTransactionsKey1((prev) => prev +1);
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

    // return () => {
    //   removeMouseClickListener();
    // };
  }, [iframeRef.current]);

  /********************************************************* */

  let i = 0
  // const handleCancelClick = () => {
  //   props.handleDialogClose(false);
  // };

  // const handleTaskComplete = (data) => {
  //   props.onTaskComplete(data);
  // };

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
          cartSectionDiv.style.display = 'none'; // Hide the section instead of removing it
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
            setTicTransactionsKey((prev) => prev +1);
      setTicTransactionsKey1((prev) => prev +1);
            console.log("######################## Radim rezervaciju za dokument ####################################");
          }
          // console.log('Presretnuta poruka iz iframe:', message);
        };
      }
    }
  };

  // const handleDivClick = () => {
  //   console.log('Div inside iframe clicked');
  //   // Vaš kod za obradu klika ovde
  // };

  /******************************************************************************** 
   * 
  ******************************************************************************** */

  const onInputChange = (e, type, name, a) => {
    let val = ''
    if (type === "options") {
      val = (e.target && e.target.value && e.target.value.code) || '';
      if (name == "channell") {
        setDdChannellItem(e.value);
        const foundItem = channellItems.find((item) => item.id === val);
        setChannellItem(foundItem || null);
        ++iframeKey
        setIframeKey(++iframeKey)
        // } else {
        //     setDropdownItem(e.value);
      }

    } else {
      val = (e.target && e.target.value) || '';
      let _ticEvent = { ...ticEvent };
      _ticEvent[`${name}`] = val;
      _ticEvent.cevent = val
      // if (name === `textx`) _ticEvent[`text`] = val;
      ticEvent(_ticEvent);
    }
  };
  /******************************************************************************** 
   * 
  ******************************************************************************** */
  function HeaderBtn() {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1" >
          <Button label="Simuliraj klik" onClick={handleClickInsideIframe} icon="pi pi-cog" raised />
        </div>
        <div className="flex flex-wrap gap-1" raised>
          <Button label="Ponovo učitaj iframe" onClick={remountComponent} raised />
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
  const tab1HeaderTemplate = (options) => {
    return (
      <>
        <div className="fieldH flex align-items-center"><b>
          <label htmlFor="myDropdown" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Izaberite_kanal}</label>
        </b>
          <Dropdown id="channell"
            value={ddChannellItem}
            options={ddChannellItems}
            onChange={(e) => onInputChange(e, "options", 'channell')}
            optionLabel="name"
            placeholder="Select One"

          />
        </div>
        <div className="fieldH flex align-items-center px-3"><b>
          <label htmlFor="cevent" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Izaberite_event}</label>
        </b>
          <div className="p-inputgroup flex-1">
            <InputText id="cevent" autoFocus value={ticEvent.code}
              onChange={(e) => onInputChange(e, 'text', 'cevent')}
            />
            <Button icon="pi pi-search" onClick={(e) => handleEventProdajaClick(e)} className="p-button" />
          </div>
          <InputText id="nevent" value={ticEvent.text}
          // onChange={(e) => onInputChange(e, 'text', 'nevent')}
          />
        </div>
        {/* <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}> 
          <Button icon={expandIframe ? "pi pi-angle-double-left" : "pi pi-angle-double-right"} onClick={toggleIframeExpansion} severity="warning" />
        </div> */}
      </>
    )
  };

  const tab2HeaderTemplate = (options) => {
    return (
      <>
        <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}> {/* onClick={options.onClick}>*/}
          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" className="mx-2" /> */}
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

  return (
    <div key={key}>
      <div className="card">
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel header="Избор седишта">


            <div className="grid grid-nogutter">
              <div className={expandIframe ? "col-12" : "col-6"}> {/* IFRAME */}
                {props.eventTip == "SAL" && (
                  <div className="grid">
                    <div className="col-12">
                      <iframe key={iframeKey}
                        id="myIframe"
                        ref={iframeRef}
                        src={salUrl}
                        // src={`${env.DOMEN}/sal/buy/card/event/${ticEvent?.id}/${props.ticDoc?.id}?par1=BACKOFFICE&channel=${props.channell?.id}`}                        
                        onLoad={handleIframeLoad}
                        title="Sal iframe"
                        width="100%"
                        height="600px"
                        frameBorder="0"
                      // scrolling="no"
                      ></iframe>
                    </div>
                  </div>
                )}
                {props.eventTip == "WEB" && (
                  <div className="grid">
                    <div className="col-12">
                      <div className="card">
                        <iframe
                          src={`https://dev.ticketline.rs/2023/08/22/sezonska-ulaznica-fk-napredak-2023-2024-vaucer/${ticEvent.id}/?parent=ADM`}
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
              {!expandIframe && (
                <div className="col-6"> {/* TABELA*/}
                  <div className="grid">
                    <div className="col-12">
                      <div className="card">
                        <HeaderBtn />
                        <TicTransactionsL
                          key={ticTransactionsKey1}
                          ticDoc={ticDoc}
                          propsParent={props}
                          handleFirstColumnClick={handleFirstColumnClick}
                        />
                        <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </TabPanel>
          <TabPanel
            // headerTemplate={tab1HeaderTemplate}
            header="Header II"
            headerClassName="flex align-items-center"
          >
            <div className="grid grid-nogutter">
              <div className="col-6"> {/* TABELA */}
                {/****************************************************************************************************************** */}
                <div className="col-12">
                  <div className="card">
                    <TicTransactionsL
                      key={ticTransactionsKey}
                      ticDoc={ticDoc}
                      propsParent={props}
                      handleFirstColumnClick={handleFirstColumnClick}
                    />
                    <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} />
                  </div>
                </div>
                {/****************************************************************************************************************** */}
              </div>
            </div>
          </TabPanel>
          <TabPanel
            // headerTemplate={tab1HeaderTemplate}
            header="Header III"
            headerClassName="flex align-items-center"
          >
            <b className="m-0">
              Element III
            </b>
            <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} />
          </TabPanel>
          <TabPanel
            headerTemplate={tab1HeaderTemplate}
            header="Header IV"
            headerClassName="flex align-items-center"
            style={{ backgroundColor: '#95e397' }}
          >
            <b className="m-0">
              Element IV
            </b>
            <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} />
          </TabPanel>
          <TabPanel
            headerTemplate={tab2HeaderTemplate}
            header="Header V"
            headerClassName="flex align-items-center"
          >
            <b className="m-0">
              Element V
            </b>
          </TabPanel>
        </TabView>
        <div className="fieldH flex align-items-center px-3"><b>
          <label htmlFor="cevent" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Izaberite_event}</label>
        </b>
          <div className="p-inputgroup flex-1">
            <InputText id="cevent" value={ticEvent.id} />
          </div>
          <div className="p-inputgroup flex-1">
            <InputText id="cdoc" value={props.ticDoc?.id} />
          </div>
        </div>
      </div>
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
    </div>
  );
}
