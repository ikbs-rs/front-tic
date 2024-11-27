import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { TicEventattsService } from '../../service/model/TicEventattsService';
import './index.css';
import { translations } from "../../configs/translations";
import { TicDocpaymentService } from "../../service/model/TicDocpaymentService";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { TicDocService } from "../../service/model/TicDocService";
import { CmnParService } from "../../service/model/cmn/CmnParService";
import TicTranssL from './ticTranssL';
import TicTranss1L from './ticTranssL';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import TicEventProdajaL from './ticEventProdajaL';
import TicDocsuidProdajaL from "./ticDocsuidProdajaL";
import { Button } from 'primereact/button';
import TicDocsprintgrpL from './ticDocsprintgrpL'
import TicProdajaPlacanje from "./ticProdajaPlacanje";
import { Toast } from 'primereact/toast';
import DateFunction from '../../utilities/DateFunction';
import env from '../../configs/env';
import moment from "moment";

const TicProdajaW = forwardRef((props, ref) => {
  // console.log(props, "######2222222222222222222222222222222222222222222222222222222222222222")
  const objName = "tic_docpayment"
  const emptyTicDocpayment = EmptyEntities[objName]
  emptyTicDocpayment.doc = props.ticDoc.id
  emptyTicDocpayment.status = 1
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const iframeRef = useRef(null);
  const [key, setKey] = useState(0);
  const [ticDoc, setTicDoc] = useState(props.ticDoc?.id ? props.ticDoc : ticDoc);
  const [ticDocId, setTicDocId] = useState(props.ticDoc?.id);
  const [ticDocpayment, setTicDocpayment] = useState(emptyTicDocpayment);
  const [submitted, setSubmitted] = useState(false);
  const [zbirzbirniiznos, setZbirniiznos] = useState(null);

  let [iframeKey, setIframeKey] = useState(1000000);
  let [ticTransactionsKey, setTicTransactionsKey] = useState(1);
  let [ticTransactionsKey2, setTicTransactionsKey2] = useState(1000);
  let [ticTransactionsKey1, setTicTransactionsKey1] = useState(10000);
  let [ticTransactionsKey11, setTicTransactionsKey11] = useState(100000);
  const toast = useRef(null);

  const [ddChannellItem, setDdChannellItem] = useState({});
  const [ddChannellItems, setDdChannellItems] = useState([{}]);
  const [channellItem, setChannellItem] = useState({});
  const [channellItems, setChannellItems] = useState([{}]);
  const [ticEvent, setTicEvent] = useState(props.ticEvent);
  const [ticEventProdajaLVisible, setTicEventProdajaLVisible] = useState(false);
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [urlIframe, setUrlIframe] = useState(null);
  let [refresh, setRefresh] = useState(0);
  let [uidKey, setUidKey] = useState(0);
  const placanjeRef = useRef();
  const docsuidRef = useRef();
  const [paying, setPaying] = useState(0);
  const [reservationStatus, setReservationStatus] = useState(0);

  useEffect(() => {
    async function fetchData() {
        try {
            if (ticDoc.reservation == 1) {
                const endDate = moment(ticDoc.endtm, 'YYYYMMDDHHmmss'); 
                const now = moment(); 
            
                if (endDate.isAfter(now)) { 
                    setReservationStatus(1);
                }
            }
        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }
    fetchData();
}, [ticDoc]);


  /************************************************************************************ */
  useImperativeHandle(ref, () => ({
    handleClickInsideIframe,
    remountComponent,
    remountStavke
  }));

  const handleDocuidSubbmit = () => {
    if (docsuidRef.current) {
      return docsuidRef.current.setDocsuidSubmitted()
    }
  };
  const remountStavke = () => {
    setTicTransactionsKey((prev) => prev + 1);
    setTicTransactionsKey2((prev) => prev + 1);
    setTicTransactionsKey1((prev) => prev + 1);
    setTicTransactionsKey11((prev) => prev + 1);
  }
  useEffect(() => {
    const iframe = iframeRef.current;

    // const handleIframeLoad = () => {
    //   if (iframe && iframe.contentWindow) {
    //     const iframeDocument = iframe.contentWindow.document;

    //     const targetDiv = iframeDocument.querySelector('.leaflet-pane .leaflet-overlay-pane');
    //     if (targetDiv) {
    //       targetDiv.style.display = 'none'; // Ako želite da div bude skriven
    //       targetDiv.addEventListener('click', handleDivClick);
    //     }
    //   }
    // };

    const handleDivClick = () => {
      //console.log('Div inside iframe clicked');
    };

    // if (iframe) {
    //   iframe.addEventListener('load', handleIframeLoad);
    // }

    const originalConsoleLog = console.log;
    // console.log = function (message) {
    //   originalConsoleLog.apply(console, arguments);

    //   if (message && typeof message === 'string' && message.includes('iframe log')) {
    //     //console.log('Presretnuta poruka iz iframe:', message);
    //   }
    // };

    // Čišćenje kada se komponenta demontira
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);
  /************************************************************************************ */

  useEffect(() => {
    async function fetchData() {
      setUrlIframe(`${env.DOMEN}/sal/buy/card/event/${ticEvent?.id}/${props.ticDoc?.id}?par1=BACKOFFICE&channel=${props.channell?.id}`)
    }
    fetchData();
  }, [ticEvent?.id, props.ticDoc?.id, props.channell?.id]);
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
        const ticDocService = new TicDocService();
        const data = await ticDocService.getDocZbirniiznosP(props.ticDoc?.id);

        setZbirniiznos(data.iznos)
        const _ticDocpayment = { ...ticDocpayment }
        _ticDocpayment.amount = data.iznos
        setTicDocpayment({ ..._ticDocpayment })
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.ticDoc?.id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const ticDocService = new TicDocService();
        // let data = await ticDocService.getTicDoc(ticDocId);
        let data = await ticDocService.getTicDocP(ticDocId);
        if (data?.usr) {
          const cmnParService = new CmnParService()
          let dataPar = await cmnParService.getCmnParP(data.usr);
          data.cpar = dataPar.code
          data.npar = dataPar.text
          setTicDoc(data);
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);


  const remountComponent = () => {
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
      if (newDocId != ticDocId) {
        setTicDocId(newDocId);
      }
      setTicTransactionsKey((prev) => prev + 1);
      setTicTransactionsKey2((prev) => prev + 1);
      setTicTransactionsKey1((prev) => prev + 1);
      setTicTransactionsKey11((prev) => prev + 1);
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

    // await removeUserMenu()
    // await removeCartSection()
    //TO DO - MARE da obrise delove
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const iframeConsole = iframe.contentWindow.console;
      if (iframeConsole) {
        const originalIframeConsoleLog = iframeConsole.log;
        iframeConsole.log = function (message) {
          // originalIframeConsoleLog.apply(iframeConsole, arguments);
          if (message && typeof message === 'string' && ((message.includes('******GLOBAL CART********') || (message.includes('====OSVEZI STAVKE BLAGAJNE====')) || (message.includes('totalQuantity======================'))))) {
            setTicTransactionsKey((prev) => prev + 1);
            setTicTransactionsKey2((prev) => prev + 1);
            setTicTransactionsKey1((prev) => prev + 1);
            setTicTransactionsKey11((prev) => prev + 1);
          }
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
    setTicDoc(rowData)
    props.handleActionTab(rowData)
    setRefresh(++refresh)
  }
  const handleRefresh = () => {
    // setRefresh(prev => prev + 1)
    // props.handleDelivery()
    setTicTransactionsKey((prev) => prev + 1);
    setTicTransactionsKey1((prev) => prev + 1);
    setTicTransactionsKey11((prev) => prev + 1);
  };
  const handleAllRefresh = () => {
    // setRefresh(prev => prev + 1)
    setTicTransactionsKey((prev) => prev + 1);
    setTicTransactionsKey2((prev) => prev + 1);
    setTicTransactionsKey1((prev) => prev + 1);
    setTicTransactionsKey11((prev) => prev + 1);
  };

  const handDocsprintgrpClose = (newObj) => {

  }

  const handleBackClic = (e) => {
    setUidKey(--uidKey)
  }

  const handleNextClic = (e, key) => {
    if (handleDocuidSubbmit() || key < 1) {
      
      setUidKey(++uidKey)
    }
  }

  const handlePlacanjetip = async (value) => {
    const _ticDocpayment = { ...ticDocpayment }
    _ticDocpayment.paymenttp = value
    setTicDocpayment({ ..._ticDocpayment })
    setTicTransactionsKey1((prev) => prev + 1);
    setTicTransactionsKey11((prev) => prev + 1);
  }

  const handleUpdatePaymentTicDoc = async (newObj, previousValue) => {
    try {
      const _ticDoc = newObj
      //   const ticDocService = new TicDocService();
      //await ticDocService.putTicDoc(newObj);
    } catch (err) {
      setTicDoc(previousValue)
      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
  }
  /********************************************************************************/
  const handleEndTicDoc = async (e) => {
    try {
      // const _ticDoc = newObj
      // console.log(e, "handleEndTicDoc 0005555555555555555555555555555555555555555555555555555555555")
      // const previousValue = ticDoc.status;
      // let _ticDoc = { ...ticDoc }
      // _ticDoc.status = 4
      // setTicDoc(_ticDoc)
      // await handleUpdateCancelTicDoc(_ticDoc, previousValue)
      // remountStavke();
      props.setActiveIndex(0)
    } catch (err) {
      // setTicDoc(previousValue)
      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
  }
  const handleCancelSales = async (e) => {
    try {
      const _ticDoc = { ...ticDoc }
      // console.log(e, "handleEndTicDoc 0005555555555555555555555555555555555555555555555555555555555")
      const previousValue = ticDoc.status;
      _ticDoc.status = 4
      setTicDoc(_ticDoc)
      await handleUpdateCancelTicDoc(_ticDoc, previousValue)
      // remountStavke();
      props.setActiveIndex(0)
    } catch (err) {
      // setTicDoc(previousValue)
      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
  }

  const handleUpdateCancelTicDoc = async (newObj, previousValue) => {
    const _ticDoc = newObj
    try {
      // console.log(newObj, "handleUpdateTicDoc 0005555555555555555555555555555555555555555555555555555555555", previousValue)
      const ticDocService = new TicDocService();
      await ticDocService.setCancelTicDoc(newObj);
    } catch (err) {
      _ticDoc.status = previousValue
      setTicDoc(_ticDoc)

      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
  }

  const handleRezTicDoc = async () => {
    console.log("00.0 REZ_HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    const ticEventattsService = new TicEventattsService()
    const eventAtt = await ticEventattsService.getEventAttsDD(ticEvent?.id, props.channell?.id, '07.01.');

    const vremeRezervacije = DateFunction.currDatetimePlusHours(eventAtt?.text)
    const previousValue = { ...ticDoc }
    let _ticDoc = { ...ticDoc }
    // const endTm = DateFunction.toDatetime(_ticDoc.endtm) + vremeRezervacije
    _ticDoc.endtm = vremeRezervacije
    console.log("00.1 REZ_HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", _ticDoc.endtm)

    _ticDoc.reservation = 1
    _ticDoc.status = 1
    try {
      const ticDocService = new TicDocService();
      await ticDocService.setReservation(_ticDoc);
      setTicDoc(_ticDoc)
      setUidKey(prev => prev + 1)
      // props.handleRezervaciju(true)
      props.handleTabZaglavlje(_ticDoc)
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Rezervacija izvrsena', life: 2000 });
    } catch (err) {
      setTicDoc(previousValue)
      // setCheckedRezervacija(previousValue);

      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
    // console.log("00.1 REZ_REZ_REZ_REZ_REZ_REZ_REZ_REZ_REZ_REZ_REZ_REZ_")

  };

  /********************************************************************************/
  const handlePayTicDoc = async () => {
    try {
      // console.log("PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_")
      const userId = localStorage.getItem('userId')
      setSubmitted(true);
      const ticDocService = new TicDocService();
      // const dataDoc = await ticDocService.getTicDoc(props.ticDoc.id);
      const dataDoc = await ticDocService.getTicDocP(props.ticDoc?.id ? props.ticDoc.id : ticDoc?.id);
      if (dataDoc?.id) {
        setTicDoc(dataDoc)
      }
      const _ticDocpayment = { ...ticDocpayment }
      _ticDocpayment.doc = props.ticDoc.id;
      _ticDocpayment.paymenttp = dataDoc.paymenttp;
      _ticDocpayment.total = placanjeRef.current.zaUplatu;
      _ticDocpayment.usr = userId
      _ticDocpayment.tm = DateFunction.currDatetime()
      const ticDocpaymentService = new TicDocpaymentService();

      if (placanjeRef.current) {
        if (placanjeRef.current.izborMesovito) {
          // console.log("00.1 PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_")
          if (placanjeRef.current.preostalo > 0) {
            toast.current.show({
              severity: "error",
              summary: "Greška",
              detail: "Mora biti ceo iznos za uplatu!",
              life: 3000,
            });
            return;  // Prekinuti izvršenje funkcije
          }
          const newArray = []
          if (placanjeRef.current.kes > 0) {
            const kesPayment = { ..._ticDocpayment };
            kesPayment.amount = placanjeRef.current.kes
            kesPayment.paymenttp = placanjeRef.current.kesTp
            newArray.push(kesPayment)
          }
          if (placanjeRef.current.kartica > 0) {
            const karticaPayment = { ..._ticDocpayment };
            karticaPayment.amount = placanjeRef.current.kartica
            karticaPayment.paymenttp = placanjeRef.current.karticaTp
            newArray.push(karticaPayment)
          }
          if (placanjeRef.current.cek > 0) {
            const cekPayment = { ..._ticDocpayment };
            cekPayment.amount = placanjeRef.current.cek
            cekPayment.paymenttp = placanjeRef.current.cekTp
            newArray.push(cekPayment)
          }
          const data = await ticDocpaymentService.postTicDocpayments(newArray);
        } else {
          _ticDocpayment.amount = placanjeRef.current.zaUplatu
          // console.log("01 PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_", _ticDocpayment)
          const data = await ticDocpaymentService.postTicDocpayment(_ticDocpayment);
        }

        // const dataIznos = await ticDocService.getDocZbirniiznos(props.ticDoc?.id);
        // const _ticDocpayment = {...ticDocpayment}
        // ticDocpayment.amount = dataIznos.iznos
        // setTicDocpayment({..._ticDocpayment})

        // ticDocpayment.id = data
        const _ticDoc = { ...ticDoc }
        _ticDoc.status = 2
        _ticDoc.statuspayment = 1
        setPaying(prev => prev + 1);
        setTicDoc(_ticDoc)
        props.handleTabZaglavlje(_ticDoc)
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Placanje izvrseno', life: 1500 });
        setUidKey(++uidKey)
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "TicDocpayment ",
        detail: `${err}`,
        life: 1000,
      });
    }
  };

  return (
    <div key={key}>
      <Toast ref={toast} />
      <div className="card " style={{ height: "805px" }}>
        <div className="grid grid-nogutter">
          {/*****************************************************
PRVI RED
*****************************************************/}
          <div className="col-5">
            <div className="grid grid-nogutter">
              {(uidKey <= 2 || ticDoc.status == 2) && (
                <div className="col-3">
                  <Button label={translations[selectedLanguage].Back}
                    severity="success" raised style={{ width: '100%' }}
                    onClick={(e) => handleBackClic(e)}
                    disabled={uidKey === 0 || ((ticDoc.statuspayment == 1||reservationStatus==1) && uidKey === 1)}
                  />
                </div>
              )}
              {(uidKey == 3 && ticDoc.status != 2) && (
                <div className="col-3">
                  <Button label={translations[selectedLanguage].Back}
                    severity="success" raised style={{ width: '100%' }}
                    onClick={(e) => handleBackClic(e)}
                  />
                </div>
              )}
              {((uidKey != 2 && uidKey <= 2) || (ticDoc.status == 2 && uidKey <= 2)) && (
                <div className="col-3">
                  <Button label={translations[selectedLanguage].Next}
                    severity="success" raised style={{ width: '100%' }}
                    onClick={(e) => handleNextClic(e, uidKey)}
                    disabled={uidKey === 3||uidKey === 2&&(ticDoc.statuspayment == 1||reservationStatus==1) }
                  />

                </div>
              )}
              {(uidKey == 2 && ticDoc.status != 2) && (
                  <div className="col-3">
                    <Button label={translations[selectedLanguage].Payment}
                      severity="warning" raised style={{ width: '100%' }}
                      onClick={(e) => handlePayTicDoc(e)}
                      disabled={uidKey === 3}
                    />

                  </div>
                )}
                {(uidKey == 2 && ticDoc.status != 2 && reservationStatus!=1) && (                  
                  <div className="col-3">
                    <Button label={translations[selectedLanguage].Rezervacija}
                      severity="secondary" raised style={{ width: '100%' }}
                      onClick={(e) => handleRezTicDoc(e)}
                      disabled={uidKey === 3}
                    />

                  </div>
              )}
              {((uidKey == 3 && ticDoc.status != 2) || reservationStatus==1) && (
                <>
                  <div className="col-3">
                    <Button label={translations[selectedLanguage].ZavrsiKupovinu}
                      severity="warning" raised style={{ width: '100%' }}
                      onClick={(e) => handleEndTicDoc(e)}
                    />

                  </div>
                  <div className="col-3">
                    <Button label={translations[selectedLanguage].OdustaniOdKupovine}
                      severity="danger" raised style={{ width: '100%' }}
                      onClick={(e) => handleCancelSales(e)}
                    />

                  </div>
                </>
              )}
              {(uidKey == 3 && ticDoc.status == 2) && (
                <>
                  <div className="col-3">
                    <Button label={translations[selectedLanguage].ZavrsiKupovinu}
                      severity="warning" raised style={{ width: '100%' }}
                      onClick={(e) => handleEndTicDoc(e)}
                    />

                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-7">
          </div>
          {/*****************************************************
KRAJ PRVOG REDA
*****************************************************/}

          {/*****************************************************
DRUGI RED
*****************************************************/}
          {(uidKey === 0 && !props.expandStavke) && (
            <div className={props.expandIframe ? "col-12" : "col-7"} style={{ position: "relative" }}>
              <div className="grid">
                <div className="col-12">
                  <iframe
                    key={iframeKey}
                    id="myIframe"
                    ref={iframeRef}
                    src={urlIframe}
                    onLoad={handleIframeLoad}
                    title="Sal iframe"
                    width="100%"
                    height="730px"
                    frameBorder="0"
                    style={{
                      pointerEvents: props.someCondition ? "none" : "auto", // Dinamički onemogućava klikove
                      opacity: props.someCondition ? 0.7 : 1 // Vizuelni efekat
                    }}
                  ></iframe>
                  {/* Overlay sloj za blokiranje interakcije */}
                  {props.someCondition && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(255, 255, 255, 0.5)", // Providni sloj
                        zIndex: 10 // Postavi iznad iframe-a
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          )}


          {(!props.expandIframe && uidKey == 1) && (
            <div className="col-3 fixed-height" style={{ height: 760 }}>
              <div className="grid" >
                <div className="col-12 fixed-height" style={{ height: 760 }}>
                  <TicDocsuidProdajaL
                    key={ticTransactionsKey}
                    ref={docsuidRef}
                    ticDoc={ticDoc}
                    propsParent={props}
                    handleFirstColumnClick={handleFirstColumnClick}
                    handleAction={handleAction}
                    setRefresh={handleRefresh}
                    handleDelivery={props.handleDelivery}
                    handleAllRefresh={handleAllRefresh}
                  />
                </div>
              </div>
            </div>

          )}
          {(!props.expandIframe && uidKey == 2) && (
            <div className="col-3 fixed-height" style={{ height: 760 }}>
              <div className="grid" >
                <div className="col-12 fixed-height" style={{ height: 760 }}>
                  <TicProdajaPlacanje
                    key={ticTransactionsKey2}
                    ticDoc={ticDoc}
                    propsParent={props}
                    handleFirstColumnClick={handleFirstColumnClick}
                    handleAction={handleAction}
                    setRefresh={handleRefresh}
                    handleAllRefresh={handleAllRefresh}
                    handlePlacanjetip={handlePlacanjetip}
                    ref={placanjeRef}
                    modal={false}
                  />
                </div>
              </div>
            </div>

          )}
          {(!props.expandIframe && uidKey == 3) && (
            <div className="col-3 fixed-height" style={{ height: 760 }}>
              <div className="grid" >
                <div className="col-12 fixed-height" style={{ height: 760 }}>
                  <TicDocsprintgrpL
                    parameter={"inputTextValue"}
                    ticDoc={props.ticDoc}
                    handDocsprintgrpClose={handDocsprintgrpClose}
                    dialog={false}
                    akcija={props.akcija}
                    channel={props.channel}
                  />
                </div>
              </div>
            </div>
          )}
          {(!props.expandIframe && uidKey >= 1) && (
            <div className={props.expandStavke ? "col-12" : "col-9"}>
              <div className="grid " >
                <div className="col-12">
                  <TicTranssL
                    key={ticTransactionsKey}
                    ticDoc={props.ticDoc}
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
          {(!props.expandIframe && uidKey == 0) && (
            <div className={props.expandStavke ? "col-12" : "col-5"}>
              <div className="grid " >
                <div className="col-12">
                  <TicTranss1L
                    key={ticTransactionsKey}
                    ticDoc={props.ticDoc}
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

      {/* <Dialog
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
      </Dialog> */}
    </div >
  );
})

export default TicProdajaW;
