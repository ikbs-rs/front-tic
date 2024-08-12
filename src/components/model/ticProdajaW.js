import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import './index.css';
import { translations } from "../../configs/translations";

import { TicDocService } from "../../service/model/TicDocService";
import TicTranssL from './ticTranssL';
import TicTranss1L from './ticTranssL';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import TicEventProdajaL from './ticEventProdajaL';
import TicDocsuidProdajaL from "./ticDocsuidProdajaL";

const TicProdajaW = forwardRef((props, ref) => {
  // console.log(props, "######2222222222222222222222222222222222222222222222222222222222222222")
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const iframeRef = useRef(null);
  const [key, setKey] = useState(0);
  const [ticDoc, setTicDoc] = useState(props.ticDoc);
  const [ticDocId, setTicDocId] = useState(props.ticDoc?.id);

  let [iframeKey, setIframeKey] = useState(Math.random());
  let [ticTransactionsKey, setTicTransactionsKey] = useState(0);
  let [ticTransactionsKey1, setTicTransactionsKey1] = useState(0);
  const toast = useRef(null);

  const [ddChannellItem, setDdChannellItem] = useState({});
  const [ddChannellItems, setDdChannellItems] = useState([{}]);
  const [channellItem, setChannellItem] = useState({});
  const [channellItems, setChannellItems] = useState([{}]);
  const [ticEvent, setTicEvent] = useState(props.ticEvent);
  const [ticEventProdajaLVisible, setTicEventProdajaLVisible] = useState(false);
  const [showMyComponent, setShowMyComponent] = useState(true);
  let [refresh, setRefresh] = useState(0);
  let [uidKey, setUidKey] = useState(0);


  /************************************************************************************ */
  useImperativeHandle(ref, () => ({
    handleClickInsideIframe,
    remountComponent,
    remountStavke
  }));

  const remountStavke = () => {
    setTicTransactionsKey(++ticTransactionsKey);
    setTicTransactionsKey1(++ticTransactionsKey1);
  }
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
      //console.log('Div inside iframe clicked');
    };

    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
    }

    const originalConsoleLog = console.log;
    console.log = function (message) {
      originalConsoleLog.apply(console, arguments);

      if (message && typeof message === 'string' && message.includes('iframe log')) {
        //console.log('Presretnuta poruka iz iframe:', message);
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
      try {
        if (props?.channells) {
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
        const ticDocService = new TicDocService();
        let data = await ticDocService.getTicDoc(ticDocId);
        if (ticDocId != -1) {
          const cmnParService = new cmnParService()
          let dataPar = await cmnParService.getPar(data.usr);
          data.cpar = dataPar.code
          data.npar = dataPar.text
          // console.log(data, "5555555555555555555555555555555555555555555555555555555555555555555")
          setTicDoc(data);
        }
        // }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [ticDocId, ticDoc]);


  const remountComponent = () => {
    //console.log(props.ticEvent, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", ticDoc)
    setKey(prevKey => prevKey + 1); // Promenimo ključ kako bi se komponenta ponovo montirala
    setUidKey(0)
  };

  const handleClickInsideIframe = () => {
    if (iframeRef.current?.contentWindow) {
      const buttonInsideIframe = iframeRef.current.contentWindow.document.querySelector('#kupiBtn');
      // if (buttonInsideIframe) {
      // buttonInsideIframe.click();
      // props.toggleIframeExpansion()
      setUidKey(1)
      // }
    }
  };

  useEffect(() => {
    const handleClick = (event) => {

      //console.log('Kliknuto je na element unutar grid-a:', event.target);
      const iframes = document.querySelectorAll('.grid iframe');
      iframes.forEach((iframe) => {
        //console.log('########### Iframe:', iframe);
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
    //console.log('TicTranssL montirana ili osvežena sa key:', ticTransactionsKey);
    return () => {
      //console.log('TicTranssL demontirana');
    }
  }, []);

  /****************** */
  const handleMouseClick = (event) => {

    const newDocId = iframeRef.current.contentWindow.document.querySelector('#docId')?.value;
    setTicDocId(newDocId);
    if (event.target.id == 'reserveBtn') {
      //console.log(event.srcElement, 'Mouse clicked inside iframe:', event.target.id || "NESTO DRUGO", "======================= ##########################  DocId inside iframe:", iframeRef.current.contentWindow.document.querySelector('#docId').value)
      if (newDocId != ticDocId) {
        setTicDocId(newDocId);
      }
      setTicTransactionsKey(++ticTransactionsKey);
      setTicTransactionsKey1(++ticTransactionsKey1);
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

  /********************************************************* *
   *        BRISANJE ELEMENATA UNUTAR IFRAME                 * 
  /********************************************************* */
  let i = 0


  const removeUserMenu = async () => {
    if (iframeRef.current?.contentDocument) {
      const userMenuDiv = iframeRef.current.contentDocument.querySelector('.p-card-body');
      // const userMenuDiv = iframeRef.current.contentDocument.querySelector('.user-menu');
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
    for (let attempt = 0; attempt < 20; attempt++) {
      if (iframeRef.current?.contentDocument) {
        // const cartSectionDiv = iframeRef.current.contentDocument.querySelector('.cart-section');
        const cartSectionDiv = iframeRef.current.contentDocument.querySelector('.p-card.p-component');
        if (cartSectionDiv) {
          // cartSectionDiv.style.display = 'none'; // TO DO
        } else {
          // setTimeout(() => {
            removeCartSection();
          // }, 3000);
        }
      }
    }
  };

  /****************************************************************************************** */

  const handleIframeLoad = async () => {

    await removeUserMenu()
    // await removeCartSection()
//TO DO - MARE da obrise delove
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const iframeConsole = iframe.contentWindow.console;
      if (iframeConsole) {
        const originalIframeConsoleLog = iframeConsole.log;
        iframeConsole.log = function (message) {
          originalIframeConsoleLog.apply(iframeConsole, arguments);
          // Vaš kod za presretanje poruke iz iframe-a ovde totalQuantity===========================
          if (message && typeof message === 'string' && ((message.includes('******GLOBAL CART********') || (message.includes('====OSVEZI STAVKE BLAGAJNE====')) || (message.includes('totalQuantity======================'))))) {
            setTicTransactionsKey(++ticTransactionsKey);
            setTicTransactionsKey1(++ticTransactionsKey1);
            //console.log("######################## Radim rezervaciju za dokument ####################################");
          }
          // //console.log('Presretnuta poruka iz iframe:', message);
        };
      }
    }
  };

  /******************************************************************************** 
   * 
  ******************************************************************************** */
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
    //console.log(rowData.event, "#############################handleFirstColumnClick##################################", ticEvent.id)
    if (ticEvent.id != rowData.event) {
      let _ticEvent = { ...ticEvent }
      _ticEvent.id = rowData.event
      _ticEvent.code = rowData.cevent
      _ticEvent.text = rowData.nevent
      setTicEvent({ ..._ticEvent })
      setIframeKey(++iframeKey)
    }
    // alert(`Kliknuo ${rowData.event} ** ${ticEvent.id}`);
  };

  const handleAction = (rowData) => {
    console.log(rowData, "******************************EEEEEEEEEEEEEEEE**************************************")
    setTicDoc(rowData)
    setRefresh(++refresh)
  }
  const handleRefresh = () => {
    // setRefreshKey(++refreshKey);
    setRefresh(++refresh)
  };


  return (
    <div key={key}>
      <div className="card " style={{ height: "805px" }}>
        <div className="grid grid-nogutter">
          {(uidKey == '0' && !props.expandStavke) && (
            <div className={props.expandIframe ? "col-12" : "col-7"}>
              <div className="grid">
                <div className="col-12">
                  <iframe key={iframeKey}
                    id="myIframe"
                    ref={iframeRef}
                    src={`https://82.117.213.106/sal/buy/card/event/${ticEvent?.id}/${props.ticDoc?.id}?par1=BACKOFFICE&channel=${props.channell?.id}`}
                    onLoad={handleIframeLoad}
                    title="Sal iframe"
                    width="100%"
                    height="730px"
                    frameBorder="0"
                  // scrolling="no"
                  ></iframe>
                </div>
              </div>
            </div>
          )}
          {(!props.expandIframe && uidKey == '1') && (
            <div className="col-5 fixed-height" style={{ height:790}}>
              <div className="grid" >
                <div className="col-12 fixed-height" style={{ height:790}}>
                  <TicDocsuidProdajaL
                    key={ticTransactionsKey}
                    ticDoc={ticDoc}
                    propsParent={props}
                    handleFirstColumnClick={handleFirstColumnClick}
                    handleAction={handleAction}
                    handleRefresh={handleRefresh}
                  />
                </div>
              </div>
            </div>

          )}
          {(!props.expandIframe && uidKey == '1') && (
            <div className={props.expandStavke ? "col-12" : "col-7"}>
              <div className="grid " >
                <div className="col-12">
                  <TicTranssL
                    key={ticTransactionsKey1}
                    ticDoc={ticDoc}
                    propsParent={props}
                    handleFirstColumnClick={handleFirstColumnClick}
                    handleAction={handleAction}
                    mapa={0}
                  />
                  {/* <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} /> */}
                </div>

              </div>
            </div>
          )}
          {(!props.expandIframe && uidKey != '1') && (
            <div className={props.expandStavke ? "col-12" : "col-5"}>
              <div className="grid " >
                <div className="col-12">
                  <TicTranss1L
                    key={ticTransactionsKey1}
                    ticDoc={ticDoc}
                    propsParent={props}
                    handleFirstColumnClick={handleFirstColumnClick}
                    handleAction={handleAction}
                    mapa={1}
                  />
                  {/* <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} /> */}
                </div>

              </div>
            </div>
          )}          
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
    </div >
  );
})

export default TicProdajaW;
