import React, { useState, useEffect, useRef } from "react";
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicDocdeliveryService } from "../../service/model/TicDocdeliveryService";
import { TicDocpaymentService } from "../../service/model/TicDocpaymentService";
import { CmnParService } from "../../service/model/cmn/CmnParService";
import { TicEventService } from '../../service/model/TicEventService';
import CmnPar from "./cmn/cmnPar";
import { InputSwitch } from "primereact/inputswitch";
import TicDocdelivery from './ticDocdelivery';
import TicStampaL from './ticStampaL';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import { TicDocService } from "../../service/model/TicDocService";
import TicDocsL from './ticDocsL';
import TicDocpaymentL from './ticDocpaymentL';
import { AdmUserService } from "../../service/model/cmn/AdmUserService";
import WebSalMap from './ticProdajaTab';
import TicDocsuidProdajaL from "./ticDocsuidProdajaL";
import TicDocsNaknadeL from "./ticDocsNaknadeL";
import TicDocsKarteL from "./ticDocsKarteL";
import TicDocDiscountL from './ticDocdiscountL'
import TicProdajaPlacanje from "./ticProdajaPlacanje";
import { TabView, TabPanel } from 'primereact/tabview';
import TicDocsprintgrpL from './ticDocsprintgrpL'


export default function TicDocdeliveryL(props) {
  console.log(props, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
  const objName = "tic_docdelivery"
  const objPar = "cmn_par"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const userId = localStorage.getItem('userId')
  const emptyTicDocdelivery = EmptyEntities[objName]
  emptyTicDocdelivery.doc = props.ticDoc.id
  const emptyPar = EmptyEntities[objPar]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticDocdeliverys, setTicDocdeliverys] = useState([]);
  const [ticDocdelivery, setTicDocdelivery] = useState(emptyTicDocdelivery);

  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [docdeliveryTip, setDocdeliveryTip] = useState('');
  const [ticDocdeliveryVisible, setTicDocdeliveryVisible] = useState(false);

  const [ticPaymentLVisible, setTicPaymentLVisible] = useState(false);
  const [ticPayment, setTicPayment] = useState(null);

  const [cmnParVisible, setCmnParVisible] = useState(false);
  const [cmnPar, setCmnPar] = useState(null);
  let i = 0

  const [ticDoc, setTicDoc] = useState(props.ticDoc);
  const [ticDocs, setTicDocs] = useState(props.ticDocs);

  const [ticTransactionInfos, setTicTransactionInfos] = useState([]);
  const [ticTransactionInfo, setTicTransactionInfo] = useState('');

  const [ticOrderInfos, setTicOrderInfos] = useState([]);
  const [ticOrderInfo, setTicOrderInfo] = useState('');

  const [cmnParInfos, setCmnParInfos] = useState([]);
  const [cmnParInfo, setCmnParInfo] = useState('');

  const [cmnBtnInfos, setCmnBtnInfos] = useState([]);
  const [cmnBtnInfo, setCmnBtnInfo] = useState('');

  const [cmnBtnActions, setCmnBtnActions] = useState([]);
  const [cmnBtnAction, setCmnBtnAction] = useState('');

  const [ticStampaLVisible, setTicStampaLVisible] = useState(false);
  const [openDialog, setOpenDialog] = useState('');
  const [parRefresh, setparRefresh] = useState(0);

  const [admUserPayment, setAdmUserPayment] = useState({});
  const [admUser, setAdmUser] = useState({});

  const [ticDocpayments, setTicDocpayments] = useState([]);
  const [ticDocpayment, setTicDocpayment] = useState(emptyTicDocdelivery);

  const [ticEvent, setTicEvent] = useState({});
  const [eventTip, setEventTip] = useState('');
  const [webMapVisible, setWebMapVisible] = useState(false);
  const [ticDocsuidProdajaLVisible, setTicDocsuidProdajaLVisible] = useState(false);
  let [ticTransactionsKey, setTicTransactionsKey] = useState(0);
  let [ticTransactionsKey2, setTicTransactionsKey2] = useState(1000);


  let [numberChannell, setNumberChannell] = useState(0)
  let [channells, setChannells] = useState([{}])
  let [channell, setChannell] = useState(null)

  let [refresh, setRefresh] = useState(1)
  const [checkedRezervacija, setCheckedRezervacija] = useState(ticDoc?.reservation == "1" || false);
  const [checkedIsporuka, setCheckedIsporuka] = useState(ticDoc?.delivery == "1" || false);
  const [checkedNaknade, setCheckedNaknade] = useState(ticDoc?.services == "1" || false);
  let [refreshKey, setRefreshKey] = useState(0);
  let [refreshKeyN, setRefreshKeyN] = useState(0);

  const [zaUplatu, setZaUplatu] = useState(0);
  const [karteIznos, setKarteIznos] = useState(0);
  const [brojIznos, setBrojIznos] = useState(0);
  const [netoIznos, setNetoIznos] = useState(0);
  const [naknadeIznos, setNaknadeIznos] = useState(0);
  const [popustIznos, setPopustIznos] = useState(0);
  // const [formattedZaUplatu, setFormattedZaUplatu] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeIndex2, setActiveIndex2] = useState(-1)
  const [countPrint, setCountPrint] = useState(0);
  const [lastPrinter, setLastPrinter] = useState(null);
  const [refreshPrint, setRefreshPrint] = useState(0);

  const [countPay, setCountPay] = useState(0);
  const [lastPay, setLastPay] = useState(null);
  const [refreshPay, setRefreshPay] = useState(0);
  const [refreshDelivery, setRefreshDelivery] = useState(0);
  const [countDelivery, setCountDelivery] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState(null);

  const iframeRef = useRef(null);
  /*********************************************************************************************** */
  /*********************************************************************************************** */
  const placanjeRef = useRef();
  const [zbirzbirniiznos, setZbirniiznos] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  /********************************************************************************/

  const handleNext = () => {
    console.log(activeIndex, "04-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    if (activeIndex < 3) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };
  /******************************************** */
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const cmnParService = new CmnParService();
  //       const data = await cmnParService.getCmnParP(props.ticDoc.idpar);
  //       // console.log(data, "**###$$$%%%***!!!---+++///((({{{}}})))")
  //       const [firstname, lastname] = data.textx.split(' ');
  //       const _cmnPar = { ...data, firstname: firstname, lastname: lastname }
  //       setCmnPar(_cmnPar);
  //       initFilters();
  //     } catch (error) {
  //       console.error(error);
  //       // Obrada greške ako je potrebna
  //     }
  //   }
  //   fetchData();
  // }, [parRefresh, refreshKey, props.ticDoc]);
  /******************************************** */

  const handlePayTicDoc = async () => {
    try {
      // console.log("PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_")
      const userId = localStorage.getItem('userId')
      setSubmitted(true);
      const ticDocService = new TicDocService();
      // const dataDoc = await ticDocService.getTicDoc(props.ticDoc.id);
      const dataDoc = await ticDocService.getTicDocP(props.ticDoc.id);
      setTicDoc(dataDoc)
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
        setTicDoc(_ticDoc)
        ticDoc.status = 2
        ticDoc.statuspayment = 1
        setActiveIndex(prev => prev + 1);
        // handleNext()
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Placanje izvrseno', life: 2000 });
        // setUidKey(++uidKey)
      }
      handleTicPaymentLDialogClose(_ticDocpayment)
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "TicDocpayment ",
        detail: `${err}`,
        life: 1000,
      });
    }
  }
  /*********************************************************************************************** */
  /*********************************************************************************************** */

  const handleCancelClick = () => {
    props.setVisible(false);
  };

  const remoteRefresh = () => {
    setRefresh(++refresh)
    // setRefreshKey(++refreshKey);
    // setRefreshKeyN(++refreshKey);  
    // console.log(refreshKey, "000033333333333333333333333333333333333333333333355555555555555555555")
  }
  const handleRefresh = () => {
    setRefreshKey(++refreshKey);
    setRefreshKeyN(++refreshKey);
    // console.log(refreshKey, "33333333333333333333333333333333333333333333355555555555555555555")
  };
  const handleAllRefresh = () => {
    // setRefresh(prev => prev + 1)
    setRefreshKey(++refreshKey);
    setRefreshKeyN(++refreshKey);
    setTicTransactionsKey(++ticTransactionsKey);
    // setTicTransactionsKey1(++ticTransactionsKey1);
  };
  //******************************************************************************************************************** */
  //******************************************************************************************************************** */
  const ticProdajaWRef = useRef();

  const handleClickInsideIframe = () => {
    if (ticProdajaWRef.current) {
      ticProdajaWRef.current.handleClickInsideIframe();
    }
  };

  const remountComponent = () => {
    if (ticProdajaWRef.current) {
      ticProdajaWRef.current.remountComponent();
    }
  };


  const remountStavke = () => {
    if (ticProdajaWRef.current) {
      ticProdajaWRef.current.remountStavke();
    }
  };

  const handleChangeNaknade = async (value) => {
    const previousValue = checkedNaknade;
    setCheckedNaknade(value);

    let _ticDoc = { ...ticDoc }
    value ? _ticDoc.services = `1` : _ticDoc.services = `0`
    // _ticDoc.delivery? _ticDoc.delivery = 1 : _ticDoc.delivery = 0
    // _ticDoc.reservation? _ticDoc.reservation = 1 : _ticDoc.reservation = 0
    setTicDoc(_ticDoc)
    // console.log(previousValue, "333333333333333333333333333333333333333333333333333333000", value)
    await handleUpdateNakTicDoc(_ticDoc, previousValue)
    remoteRefresh()
    setRefresh(++refresh)
    // remountStavke();
  };

  const handleChangeRezervacija = async (value) => {
    const previousValue = checkedRezervacija;
    setCheckedRezervacija(value);

    let _ticDoc = { ...ticDoc }
    value ? _ticDoc.reservation = `1` : _ticDoc.reservation = `0`
    // _ticDoc.delivery? _ticDoc.delivery = 1 : _ticDoc.delivery = 0
    // _ticDoc.services? _ticDoc.services = 1 : _ticDoc.services = 0
    await setTicDoc(_ticDoc)
    // console.log(_ticDoc, "333333333333333333333333333333333333333333333333333333000", value)
    await handleUpdateRezTicDoc(_ticDoc, previousValue)
    remoteRefresh()
    setRefresh(++refresh)
    // remountStavke();
  };

  const handleChangeIsporuka = async (value) => {

    const previousValue = checkedIsporuka;
    setCheckedIsporuka(value);

    let _ticDoc = { ...ticDoc }
    value ? _ticDoc.delivery = `1` : _ticDoc.delivery = `0`
    // _ticDoc.services ? _ticDoc.services = 1 : _ticDoc.services = 0
    // _ticDoc.reservation ? _ticDoc.reservation = 1 : _ticDoc.reservation = 0
    setTicDoc(_ticDoc)
    // console.log(refresh, "333333333333333333333333333333333333333333333333333333111")
    await handleUpdateIspTicDoc(_ticDoc, previousValue)

    // console.log(refresh, "333333333333333333333333333333333333333333333333333333111")
    // remountStavke();
  };

  const handleUpdateIspTicDoc = async (newObj, previousValue) => {
    const _ticDoc = newObj
    try {
      // console.log(newObj, "handleUpdateTicDoc 1115555555555555555555555555555555555555555555555555555555555", previousValue)
      const ticDocService = new TicDocService();
      await ticDocService.putTicDoc(newObj);
      remoteRefresh()
      setRefresh(++refresh)
    } catch (err) {
      _ticDoc.delivery = previousValue
      setTicDoc(_ticDoc)
      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
  }
  const handleUpdateRezTicDoc = async (newObj, previousValue) => {
    const _ticDoc = newObj
    try {
      // console.log(newObj, "handleUpdateTicDoc 000 5555555555555555555555555555555555555555555555555555555555", previousValue)
      const ticDocService = new TicDocService();
      await ticDocService.putTicDoc(newObj);
      remoteRefresh()
      setRefresh(++refresh)
      // console.log("handleUpdateTicDoc 001 5555555555555555555555555555555555555555555555555555555555")      
    } catch (err) {
      // console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH")
      _ticDoc.reservation = previousValue ? '1' : '0'
      setTicDoc(_ticDoc)
      setCheckedRezervacija(previousValue);

      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
  }

  const handleUpdateNakTicDoc = async (newObj, previousValue) => {
    const _ticDoc = newObj
    try {
      // console.log(newObj, "handleUpdateTicDoc 0005555555555555555555555555555555555555555555555555555555555", previousValue)
      const ticDocService = new TicDocService();
      await ticDocService.putTicDoc(newObj);
      remoteRefresh()
      setRefresh(++refresh)
    } catch (err) {
      _ticDoc.services = previousValue
      setTicDoc(_ticDoc)
      setCheckedNaknade(previousValue);

      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
  }
  //******************************************************************************************************************** */  
  useEffect(() => {
    async function fetchData() {
      try {
        const cmnParService = new CmnParService();
        const datas = await cmnParService.getCmnParP(props.ticDoc.idpar);
        const data = datas[0]
        // console.log(data, "**###$$$%%%***!!!---+++///((({{{}}})))")
        const [firstname, lastname] = data.textx.split(' ');
        const _cmnPar = { ...data, firstname: firstname, lastname: lastname }
        setCmnPar(_cmnPar);
        initFilters();
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [parRefresh, refreshKey, props.ticDoc]);
  /******************************************** */
  useEffect(() => {
    async function fetchData() {
      try {
        const dataT = [];
        dataT.push({ code: `First name`, value: cmnPar.firstname });
        dataT.push({ code: `Last name`, value: cmnPar?.lastname });
        dataT.push({ code: `Customer id`, value: cmnPar?.pib || cmnPar?.idnum });
        dataT.push({ code: `Email`, value: cmnPar?.email });
        dataT.push({ code: `Phon`, value: cmnPar?.tel });
        dataT.push({ code: `Address`, value: cmnPar?.address });
        dataT.push({ code: `Post number`, value: cmnPar?.postcode });
        dataT.push({ code: `City`, value: cmnPar?.place });
        dataT.push({ code: `Country`, value: cmnPar.country });
        setCmnParInfos(dataT);

        initFilters();
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [cmnPar, refreshKey]);

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 5) {
          const dataO = [];
          dataO.push({ code: `Sales channel:`, value: props.ticDoc.kanal });
          dataO.push({ code: `Agent:`, value: `${props.ticDoc.firstname} ${props.ticDoc.lastname}` });
          dataO.push({ code: `Order transaction no:`, value: transactionTemplate(props.ticDoc.broj) });
          dataO.push({ code: `Event:`, value: neventTemplate(props.ticDoc) });
          dataO.push({ code: `Transaction time:`, value: DateFunction.formatDatetime(props.ticDoc.tm) });
          dataO.push({ code: `Number of ticket:`, value: karteTemplate(brojIznos, `Iznos:`, karteIznos) });
          dataO.push({ code: `Discount`, value: popustIznos });
          dataO.push({ code: `Ticket total price:`, value: netoIznos });
          dataO.push({ code: `Fee total price:`, value: naknadeIznos });
          dataO.push({ code: `Order total price:`, value: transactionTemplate(zaUplatu) });
          setTicOrderInfos(dataO);

          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [zaUplatu]);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {

  //       const dataO = [];
  //       dataO.push({ code: `Sales channel`, value: props.ticDoc.kanal });
  //       dataO.push({ code: `Agent`, value: `${props.ticDoc.firstname} ${props.ticDoc.lastname}` });
  //       dataO.push({ code: `Order transaction no:`, value: transactionTemplate(props.ticDoc.broj) });
  //       dataO.push({ code: `Event22:`, value: neventTemplate(props.ticDoc) });
  //       dataO.push({ code: `Transaction time:`, value: DateFunction.formatDatetime(props.ticDoc.tm) });
  //       dataO.push({ code: `Number of ticket:`, value: `${brojIznos} **** Iznos: ${karteIznos} ` });
  //       dataO.push({ code: `Discount:`, value: popustIznos });
  //       dataO.push({ code: `Ticket total price`, value: netoIznos });
  //       dataO.push({ code: `Fee total price:`, value: naknadeIznos });
  //       dataO.push({ code: `Order total price:`, value: zaUplatu });
  //       // console.log(dataO, "%%%%%%%%%%%%%%%%%%%%%%22222222222%%%%%%%%%%%%%%%%%%%%%%")
  //       setTicTransactionInfos(dataO);

  //       initFilters();
  //     } catch (error) {
  //       console.error(error);
  //       // Obrada greške ako je potrebna
  //     }
  //   }
  //   fetchData();
  // }, []);
  //******************************************************************************************************************** */
  //******************************************************************************************************************** */

  useEffect(() => {
    async function fetchData() {
      try {
        const ticDocService = new TicDocService();
        const data = await ticDocService.getDocCountPrint(props.ticDoc.id);
        // console.log(data, "**HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", Number(data.broj), Number(data.broj) > 0)
        setCountPrint(data.broj);
        if (Number(data.broj) > 0) {
          // console.log(data, "*01*HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
          setLastPrinter(data.username)
        }
        // initFilters();
        const dataPay = await ticDocService.getDocCountPay(props.ticDoc.id);
        setCountPay(dataPay.broj);
        if (Number(dataPay.broj) > 0) {
          // console.log(dataPay, "*02*HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
          setLastPay(dataPay.username)
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.ticDoc, refreshPrint, refreshPay]);


  useEffect(() => {
    async function fetchData() {
      try {

        const ticDocdeliveryService = new TicDocdeliveryService();
        // console.log("*0*HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        const dataD = await ticDocdeliveryService.getTicListaByItem("docdelivery", "listabynum", "tic_docdelivery_v", "doc", ticDoc.id);

        // console.log(dataD, "*1*HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        if (dataD) {
          setCountDelivery(1)
          setDeliveryStatus(dataD.status)
          setTicDocdelivery(dataD)
          const admUserService = new AdmUserService();
          const data = await admUserService.getAdmUser(dataD.usr);
          setAdmUser(data);
        } else {
          setCountDelivery(0)
          setDeliveryStatus(-1)
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [refreshDelivery, props.ticDoc]);
  //******************************************************************************************************************** */

  useEffect(() => {
    async function fetchData() {
      try {
        // console.log("**************************************setAdmUserPayment***********************************************")
        const ticDocpaymentService = new TicDocpaymentService();
        const dataD = await ticDocpaymentService.getTicListaByItem("docpayment", "listabynum", "tic_docpayment_v", "doc", ticDoc.id);
        // console.log("**************************************setAdmUserPayment***********************************************")
        if (dataD[0]) {
          await setTicDocpayment(dataD[0])
          const admUserService = new AdmUserService();
          const data = await admUserService.getAdmUser(dataD[0].usr);
          // console.log(data, "*00*************************************setAdmUserPayment***********************************************", dataD[0])
          await setAdmUserPayment(data);
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);
  //******************************************************************************************************************** */
  //******************************************************************************************************************** */
  useEffect(() => {
    // Kreiranje niza objekata za cmnParInfos
    remoteRefresh()
    const newData = [
      {
        event: ((Number(countPrint) > 0) ? <Button
          label={`Printed ${countPrint}`}
          severity="success"
        /> :
          <Button
            label={`Not printed`}
            severity="warning"
          />
        ),
        button: (
          <Button
            label={translations[selectedLanguage].Print}
            icon="pi pi-print"
            onClick={openStampa}
            severity="success"
            raised
          />
        ),
        status: ((countPrint > 0) ? lastPrinter : null
        )

      },
      {
        event: ((ticDoc.paid || countPay > 0) ? <Button
          label={translations[selectedLanguage].paid + ` ${countPay} `}
          severity="success"
        /> :
          <Button
            label={translations[selectedLanguage].notpaid}
            severity="danger"
          />
        ),
        button: (
          <Button
            label={translations[selectedLanguage].Payment}
            icon="pi pi-dollar"
            className="p-button-warning"
            onClick={handlePaymentClick}
            severity="danger"
            raised
          />
        ),
        status: (countPay > 0) ? lastPay : null
      },
      {
        event:
          ((deliveryStatus < 1) ?
            <Button
              label={translations[selectedLanguage].Delivery}
              style={{ backgroundColor: 'white', color: 'black' }}
            /> :
            (deliveryStatus == 1) ?
              <Button
                label={translations[selectedLanguage].ForDelivery}
                style={{ backgroundColor: 'rgb(207, 142, 73)', color: 'white' }}
              /> : (deliveryStatus == 2) ?
                <Button
                  label={translations[selectedLanguage].InDelivery}
                  style={{ backgroundColor: 'rgb(190, 66, 66)', color: 'white' }}
                /> : (deliveryStatus == 3) ?
                  <Button
                    label={translations[selectedLanguage].HandedOut}
                    style={{ backgroundColor: 'green', color: 'white' }}
                  /> :
                  <Button
                    label={translations[selectedLanguage].GaveUp}
                    style={{ backgroundColor: 'white', color: 'black' }}
                  />
          )

        , button: (
          <Button
            label={translations[selectedLanguage].Delivery}
            icon="pi pi-gift"
            className="p-button-warning"
            onClick={handleDocdeliveryClick}
            severity="success"
            raised
          />
        ),
        status: admUser?.firstname ? `${DateFunction.formatDate(ticDocdelivery.dat)} ${admUser?.firstname} ${admUser?.lastname}` : ''
      },
      {
        event: "Fiscal receipt", button: (
          <Button
            label={translations[selectedLanguage].Fiscal}
            icon="pi pi-dollar"
            className="p-button-warning"
            onClick={handleDocdeliveryClick}
            severity="success"
            raised
          />
        ),
        status: (
          <Button
            label={translations[selectedLanguage].SendFiscalReceipt}
            icon="pi pi-send"
            className="p-button-warning"
            onClick={handleDocdeliveryClick}
            severity="success"
            raised
          />
        )
      }
    ];
    setCmnBtnInfos(newData);
  }, [admUser, admUserPayment, countPrint, countPay, refreshDelivery]);
  /******************************************** */
  useEffect(() => {
    // Kreiranje niza objekata za cmnParInfos
    const newData = [
      {
        col1: (
          <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
            <label htmlFor="rezervacija" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Rezervacija}</label>
            <InputSwitch id="rezervacija"
              checked={checkedRezervacija}
              onChange={(e) => handleChangeRezervacija(e.value)}
            />
          </div>
        ), col2: (
          <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
            <label htmlFor="isporuka" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Isporuka}</label>
            <InputSwitch id="isporuka"
              checked={checkedIsporuka} onChange={(e) => handleChangeIsporuka(e.value)}
            />
          </div>
        )
        ,
        col3: (
          <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
            <label htmlFor="naknade" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Naknade}</label>
            <InputSwitch id="naknade"
              checked={checkedNaknade} onChange={(e) => handleChangeNaknade(e.value)}
            />
          </div>
        )
      },
      {
        col1: (
          <Button
            label={translations[selectedLanguage].Posetioci}
            icon="pi pi-users"
            onClick={handleTicDocsuidProdajaLClick}
            severity="success"
            raised
          />
        ), col2: (
          <Button
            label={translations[selectedLanguage].Cancel}
            icon="pi pi-times"
            onClick={openStampa}
            severity="danger"
            raised
          />
        ),
        col3: (
          <Button
            label={translations[selectedLanguage].Logovi}
            icon="pi pi-history"
            onClick={openStampa}
            severity="success"
            raised
          />
        )
      }
      // ,
      // {
      //   col1: (
      //     <Button
      //       label={translations[selectedLanguage].Razdvajanje}
      //       icon="pi pi-file-export"
      //       onClick={openStampa}
      //       severity="warning"
      //       raised
      //     />
      //   ), col2: (
      //     <Button
      //       label={translations[selectedLanguage].Spajanje}
      //       icon="pi pi-file-import"
      //       onClick={openStampa}
      //       severity="warning"
      //       raised
      //     />
      //   )
      //   ,
      //   col3: (
      //     <Button
      //       label={translations[selectedLanguage].Logovi}
      //       icon="pi pi-history"
      //       onClick={openStampa}
      //       severity="success"
      //       raised
      //     />
      //   )
      // }
    ];
    setCmnBtnActions(newData);
    remoteRefresh()
  }, [selectedLanguage, checkedRezervacija, checkedIsporuka, checkedNaknade]);
  //******************************************************************************************************************** */
  //******************************************************************************************************************** */
  //******************************************************************************************************************** */


  const rowClass = (rowData) => {
    const tableRow = document.querySelectorAll('.p-datatable-tbody');
    tableRow.forEach((row) => {
      row.classList.remove('p-datatable-tbody');
    });
    const selRow = document.querySelectorAll('.p-selectable-row');
    selRow.forEach((row) => {
      //console.log("*-*-*************row.row.classList*************-*", row.classList)
      row.classList.remove('p-selectable-row');
    });

    //console.log(rowData.docvr == '1683550594276921344', "****************rowData************************", rowData)
    return rowData.doc == '1683550594276921344'
      ? 'highlight-row-blue'
      : rowData.docvr == '1683550132932841472'
        ? 'highlight-row-green'
        : '';
  };

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };
    if (openDialog == 'PAR') {
      const [firstname, lastname] = localObj.newObj.obj.textx.split(' ');
      setCmnPar({ ...localObj.newObj.obj, firstname: firstname, lastname: lastname })
    } else {

      let _ticDocdeliverys = [...ticDocdeliverys];
      let _ticDocdelivery = { ...localObj.newObj.obj };
      //setSubmitted(true);
      if (localObj.newObj.docdeliveryTip === "CREATE") {
        _ticDocdeliverys.push(_ticDocdelivery);
      } else if (localObj.newObj.docdeliveryTip === "UPDATE") {
        const index = findIndexById(localObj.newObj.obj.id);
        _ticDocdeliverys[index] = _ticDocdelivery;
      } else if ((localObj.newObj.docdeliveryTip === "DELETE")) {
        _ticDocdeliverys = ticDocdeliverys.filter((val) => val.id !== localObj.newObj.obj.id);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocdelivery Delete', life: 3000 });
      } else {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocdelivery ?', life: 3000 });
      }
      toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docdeliveryTip}`, life: 3000 });
      setTicDocdeliverys(_ticDocdeliverys);
      setTicDocdelivery(emptyTicDocdelivery);
      setRefreshDelivery(prev => prev + 1)
    }
  };

  const handleDocdeliveryClick = async (e) => {

    try {
      const rowPar = await fetchPar()
      setCmnPar(rowPar.item)
      const rowDocdelivery = await fetchDocdelivery()
      if (rowDocdelivery?.id) {
        setDocdeliveryTip("UPDATE");
        setTicDocdelivery(rowDocdelivery)
      } else {
        setDocdeliveryTip("CREATE");
      }
      setTicDocdeliveryVisible(true);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch cmnPar data",
        life: 3000,
      });
    }
  };

  /***************************************************************************************** */
  const handleSalClick = async (e, rowData) => {
    try {
      // console.log(rowData, "***************rowDocdelivery************rowPar****", e)
      handleWebMapClick(rowData)
      setEventTip('SAL');
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch cmnPar data",
        life: 3000,
      });
    }
  };

  /**************************************************************************************** */
  /**************************************************************************************** */
  const getChannell = async (rowData) => {
    try {
      // console.log(rowData, "######################################################################################", userId)
      // const ticEventService = new TicEventService();
      // const data = await ticEventService.getTicEventchpermissL(rowData.id, userId);
      const ticDocService = new TicDocService();
      const data = await ticDocService.getChannel('XPK');
      // console.log(data, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", userId)
      if (data && data.length > 0) {
        setNumberChannell(data.length);
        setChannells(data);
        const foundItem = data.find((item) => item.id === ticDoc.channel);
        console.log(foundItem, "010-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", ticDoc.channel)
        setChannell(foundItem);
        // DO - OVDE NE TREBA DA SE KREIRIA DOKUMENT JER DOLAZIM SA TRANSAKCIJE

      } else {
        // Prikazuje obaveštenje korisniku
        toast.current.show({
          severity: "warn",
          summary: "Obaveštenje",
          detail: "Nemate pravo na channell",
          life: 3000,
        });
        throw new Error("Nemate pravo na channell"); // Izaziva grešku
      }
    } catch (err) {
      // Logovanje greške
      console.error("Error fetching channel permissions:", err.message);
      // Obrada greške koja se može prikazati korisniku ili dalje logovati
      throw err; // Propagira grešku dalje ako je potrebno
    }
  };

  /**************************************************************************************** */
  /**************************************************************************************** */
  const handleWebMapClick = async (rowData) => {
    try {
      await getChannell(rowData)
      setTicEvent(rowData)
      setWebMapDialog();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch cmnPar data',
        life: 3000
      });
    }
  };

  const handleTicDocsuidProdajaLClick = async () => {
    try {
      setTicDocsuidProdajaLDialog(true);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch cmnPar data',
        life: 3000
      });
    }
  };

  const setTicDocsuidProdajaLDialog = () => {
    setTicDocsuidProdajaLVisible(true);
  };

  const setWebMapDialog = () => {
    setWebMapVisible(true);
  };
  const handleWebMapDialogClose = (newObj) => {
    setWebMapVisible(false);
  };

  /******************************************************************************** */

  const handlePaymentClick = async (e) => {
    try {
      setTicPaymentLVisible(true);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch cmnPar data",
        life: 3000,
      });
    }
  };

  const handleTicPaymentLDialogClose = (newObj) => {
    setRefreshPay(prev => prev + 1)
    setTicPayment(newObj);
    setTicPaymentLVisible(false)
  };


  const handleParClick = async (e) => {
    // try {
    // await setparRefresh (++parRefresh)
    setOpenDialog("PAR")
    setCmnParVisible(true);
    // } catch (error) {
    //   console.error(error);
    //   toast.current.show({
    //     severity: "error",
    //     summary: "Error",
    //     detail: "Failed to fetch cmnPar data",
    //     life: 3000,
    //   });
    // }
  };


  const handleCmnParLDialogClose = (newObj) => {
    setCmnPar(newObj);
    setCmnParVisible(false)
  };

  async function fetchDocdelivery() {
    try {
      const ticDocService = new TicDocService();
      const data = await ticDocService.getTicListaByItem('docdelivery', 'listabynum', 'tic_docdelivery_v', 'aa.doc', props.ticDoc.id);
      return data;
    } catch (error) {
      console.error(error);
      // Obrada greške ako je potrebna
    }
  }
  async function fetchPar() {
    try {
      const ticDocService = new TicDocService();
      const data = await ticDocService.getCmnParById(props.ticDoc.usr);
      return data;
    } catch (error) {
      console.error(error);
      // Obrada greške ako je potrebna
    }
  }
  const handleTicDocdeliveryDialogClose = (newObj) => {
    setTicDocdelivery(newObj);
    setTicDocdeliveryVisible(false)
  };

  const handleTicStampaLDialogClose = (newObj) => {
    const localObj = { newObj };
    setRefreshPrint(prev => prev + 1)
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticDocdeliverys.length; i++) {
      if (ticDocdeliverys[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicDocdeliveryDialog(emptyTicDocdelivery);
  };

  const openStampa = () => {
    setTicStampaDialog();
  };


  const setTicStampaDialog = () => {
    setShowMyComponent(true);
    setTicStampaLVisible(true);
  };

  const onRowSelect = (event) => {
    //ticDocdelivery.begda = event.data.begda
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };
  // <heder za filter
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ocode: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      text: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      begda: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      }
    });
    setGlobalFilterValue("");
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    let value1 = e.target.value
    let _filters = { ...filters };

    _filters["global"].value = value1;

    setFilters(_filters);
    setGlobalFilterValue(value1);
  };

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1" />
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        {/* <div className="flex flex-wrap gap-1" />
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div> */}
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].DocdeliveryList}</b>
        <div className="flex-grow-1"></div>
      </div>
    );
  };

  const formatDateColumn = (rowData, field) => {
    return DateFunction.formatDate(rowData[field]);
  };

  // <--- Dialog
  const setTicDocdeliveryDialog = (ticDocdelivery) => {
    setVisible(true)
    setDocdeliveryTip("CREATE")
    setTicDocdelivery({ ...ticDocdelivery });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const docdeliveryTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicDocdeliveryDialog(rowData)
            setDocdeliveryTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  const removeUserMenu = () => {
    const userMenuDiv = iframeRef.current.contentDocument.querySelector('.user-menu');
    if (userMenuDiv) {
      userMenuDiv.remove();
    }
  };

  const handleIframeLoad = () => {
    removeUserMenu();
  };
  const transactionTemplate = (pId) => {
    return (
      <b>
        {pId}
      </b>
    )
  }
  const karteTemplate = (broj, tekst, iznos) => {
    return (
      <div>
        <table className="p-datatable" style={{ minWidth: "20rem" }}>
          <tbody>
          </tbody>
          <tr >
            <b>
              <td style={{ width: '30%' }}>{broj}</td>
            </b>
            <td style={{ width: '40%' }}>{tekst}</td>
            <b>
              <td style={{ width: '30%' }}>{iznos}</td>
            </b>
          </tr>
        </table>
      </div>

    )
  }
  const neventTemplate = (rowData) => {
    // Proveri da li postoji niz proizvoda
    // console.log(rowData, "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", JSON.parse(rowData.nevent))

    const nizObjekata = JSON.parse(rowData.nevent)

    if (nizObjekata && nizObjekata.length > 0) {
      // console.log(nizObjekata.length, "nizObjekata.length*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*-*", JSON.parse(rowData.nevent))
      return (
        <div>
          <table className="p-datatable" style={{ minWidth: "20rem" }}>
            <tbody>
              {nizObjekata.map((item) => (
                <tr key={item.starttm}>
                  <b>
                    <td style={{ width: '45%' }}>{item.text}</td>
                  </b>
                  <td style={{ width: '35%' }}>{item.venue}</td>
                  <td style={{ width: '10%' }}>{DateFunction.formatDate(item.startda)}</td>
                  <td style={{ width: '5%' }}>{DateFunction.formatTimeMin(item.starttm)}</td>
                  <td style={{ width: '5%' }}>
                    <Button
                      label={item.count}
                      className="p-button-warning"
                      onClick={(e) => handleSalClick(e, item)}
                      raised
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return null;
    }
  }
  const handleFirstColumnClick = (rowData) => {
    console.log("handleFirstColumnClick")
  };
  const handleAction = (rowData) => {
    console.log("handleAction")
  };
  /************************************************************************************* */
  function formatNumberAsText(iznos) {
    console.log(iznos, "************************************************")
    if (!iznos) {
      return ''; // ili vratite neki podrazumevani tekst, npr. '0.00'
    }
    const parts = iznos.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  // setFormattedZaUplatu( formatNumberAsText(zaUplatu))

  const handleZaUplatu = (iznos) => {
    setZaUplatu(iznos);
    // setFormattedZaUplatu(formatNumberAsText(iznos))
  };
  const handleNetoIznos = (iznos) => {
    // setNetoIznos(karteIznos - popustIznos);
    // handleZaUplatu(karteIznos + naknadeIznos - popustIznos)
  };
  const handleKarteIznos = (iznos) => {
    setKarteIznos(iznos);
    setNetoIznos(iznos - popustIznos);
    handleZaUplatu(iznos + naknadeIznos - popustIznos)
  };
  const handleBrojIznos = (iznos) => {
    setBrojIznos(iznos);
    setNetoIznos(karteIznos - popustIznos);
    handleZaUplatu(karteIznos + naknadeIznos - popustIznos)
  };

  const handleNaknadeIznos = (iznos) => {
    setNaknadeIznos(iznos);
    setNetoIznos(karteIznos - popustIznos);
    handleZaUplatu(karteIznos + naknadeIznos - popustIznos)
  };
  const handlePopustIznos = (iznos) => {
    setPopustIznos(iznos);
    setNetoIznos(karteIznos - iznos);
    handleZaUplatu(karteIznos + naknadeIznos - iznos)
  };
  /************************************************************************************* */
  const onInputChange = (e, type, name) => {
    let val = ''
    if (type === "options") {
      // setDropdownItem(e.value);
      val = (e.target && e.target.value && e.target.value.code) || '';
    } else {
      val = (e.target && e.target.value) || '';
    }

    let _ticDoc = { ...ticDoc };
    _ticDoc[`${name}`] = val;
    if (name === `textx`) _ticDoc[`text`] = val

    setTicDoc(_ticDoc);
  };

  const handleNapomenaClick = async () => {

    let _ticDoc = { ...ticDoc }
    setTicDoc(_ticDoc)
    await handleUpdateNapDoc(_ticDoc)
    // remountStavke();
  };
  const handleUpdateNapDoc = async (newObj) => {
    try {
      // console.log(newObj, "handleUpdateTicDoc ** 00 ***************************************************####################")
      const ticDocService = new TicDocService();
      await ticDocService.postTicDocSetValue('tic_doc', 'opis', newObj.opis, newObj.id);
    } catch (err) {
      // console.log(newObj, "ERRRRORRR ** 00 ***************************************************####################")
      const _ticDoc = { ...newObj }
      _ticDoc.opis = newObj.opis
      setTicDoc(_ticDoc)

      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
  }
  /************************************************************************************* */

  const handlePlacanjetip = async (value) => {
    const _ticDocpayment = { ...ticDocpayment }
    _ticDocpayment.paymenttp = value
    const _ticDoc = { ...ticDoc }
    _ticDoc.paymenttp = value
    setTicDoc(_ticDoc)
  }

  const setActiveIndex11 = async (index) => {
    // console.log(index, "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
    // setActiveIndex1(index)

  }
  /************************************************************************************** */

  /************************************************************************************** */
  return (
    <>
      <div className="card">
        {/* <div className="grid p-fluid formgrid nested-grid"> */}
        <div
          class="grid"
          style={{
            display: 'flex',
            // flexDirection: 'column',
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          }}
        >
          <Toast ref={toast} />
          <div id="1"
            // className= "col-5"
            class="sm:col-12 md:col-4 lg:col-4"
          >
            <div class="grid">
              <div className="col-12">
                <div className="">
                  <DataTable
                    dataKey="id"
                    size={"small"}
                    rowClassName=" custom-row-color"
                    stripedRows
                    selection={ticOrderInfo}
                    value={ticOrderInfos}
                    virtualScrollerOptions={{ itemSize: 46 }}
                  // onSelectionChange={(e) => setTicDocdelivery(e.value)}
                  >
                    <Column
                      field="code"
                      header={translations[selectedLanguage].Order_info}
                      style={{ width: "20%" }}
                    ></Column>
                    <Column
                      field="value"
                      style={{ width: "80%" }}
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
          {/**** *********************/}

          {/**** *********************/}
          <div id="2"
            // className= "col-3"
            class="sm:col-12 md:col-3 lg:col-3"
          >
            <div class="grid">
              <div className="col-12">
                {/* II */}
                <div className="">
                  <DataTable
                    dataKey="id"
                    key={refreshKey}
                    size={"small"}
                    // rowClassName={rowClass}
                    rowClassName="custom-row-color"
                    stripedRows
                    selection={cmnParInfo}
                    value={cmnParInfos}
                    virtualScrollerOptions={{ itemSize: 46 }}
                  // onSelectionChange={(e) => setTicDocdelivery(e.value)}
                  >
                    <Column
                      field="code"
                      header={translations[selectedLanguage].Customer_info}
                      style={{ width: "30%" }}
                    ></Column>
                    <Column
                      header={
                        <div >
                          <Button
                            label={translations[selectedLanguage].Updation}
                            icon="pi pi-spin pi-cog"
                            className="p-button-warning"
                            onClick={handleParClick}
                            severity="success"
                            raised
                          />
                        </div>
                      }
                      field="value"
                      style={{ width: "70%" }}
                    ></Column>
                  </DataTable>
                </div>
              </div>
              {/**** *********************/}

              {/**** *********************/}
            </div>
          </div>
          {/**** *********************/}

          {/**** *********************/}
          <div id="3"
            // className= "col-4"
            class="sm:col-12 md:col-4 lg:col-4"
          >
            <TabView
              activeIndex={activeIndex}
              onTabChange={(e) => {
                console.log(e, "TTTTTTTTTTTT");
                setActiveIndex(e.index);
              }}
            >
              <TabPanel header="Status">
                <div class="grid"
                  style={{
                    display: 'flex',
                    // flexDirection: 'column',
                    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                  }}
                >
                  <div className="col-12">
                    {/* V */}
                    <div className="">
                      <DataTable
                        dataKey="id"
                        size={"small"}
                        // rowClassName={rowClass}
                        showHeaders={false}
                        rowClassName="custom-row-color"
                        selection={cmnBtnInfo}
                        value={cmnBtnInfos}
                        virtualScrollerOptions={{ itemSize: 46 }}
                        onSelectionChange={(e) => setTicDocdelivery(e.value)}
                      >
                        <Column
                          field="event"
                          header={translations[selectedLanguage].Action}
                          style={{ width: "25%" }}
                        ></Column>
                        <Column
                          field="button"
                          style={{ width: "25%" }}
                        ></Column>
                        <Column
                          field="status"
                          style={{ width: "50%" }}
                        ></Column>
                      </DataTable>
                    </div>

                  </div>
                  <div className="col-12">
                    {/* V */}
                    <div className="">
                      <DataTable
                        dataKey="id"
                        size={"small"}
                        // rowClassName={rowClass}
                        rowClassName="custom-row-color"
                        selection={cmnBtnAction}
                        value={cmnBtnActions}
                        virtualScrollerOptions={{ itemSize: 46 }}
                        onSelectionChange={(e) => setTicDocdelivery(e.value)}
                      >
                        <Column
                          field="col1"
                          style={{ width: "30%" }}
                        ></Column>
                        <Column
                          field="col2"
                          style={{ width: "30%" }}
                        ></Column>
                        <Column
                          field="col3"
                          style={{ width: "30%" }}
                        ></Column>
                      </DataTable>
                    </div>

                  </div>

                  {/**** *********************/}

                  {/**** *********************/}
                </div>
              </TabPanel>
              <TabPanel header="Placanje">

                <div className="grid" >
                  <div class="card sm:col-2 md:col-4 lg:col-4">
                    <Button
                      label={translations[selectedLanguage].Placanje}
                      icon="pi pi-spin pi-euro"
                      className="p-button-warning"
                      onClick={handlePayTicDoc}
                      severity="danger"
                      raised
                      disabled={props.ticDoc?.status == 2}
                    />
                  </div>
                  <div class="sm:col-5 md:col-7 lg:col-7  fixed-height" style={{ height: 360, overflowY: 'scroll' }}>
                    <TicProdajaPlacanje
                      key={ticTransactionsKey2}
                      ticDoc={ticDoc}
                      propsParent={props}
                      handleFirstColumnClick={handleFirstColumnClick}
                      handleAction={handleAction}
                      setRefresh={handleRefresh}
                      handleAllRefresh={handleAllRefresh}
                      handlePlacanjetip={handlePlacanjetip}
                      zaUplatu={zaUplatu}
                      ref={placanjeRef}
                      modal={false}
                    />
                  </div>

                </div>
              </TabPanel>
              <TabPanel header="Stampa">
                <div className="grid" >
                  <div className="col-12 fixed-height" style={{ height: 360, overflowY: 'scroll' }}>
                    <TicDocsprintgrpL
                      parameter={"inputTextValue"}
                      ticDoc={props.ticDoc}
                      // handDocsprintgrpClose={handDocsprintgrpClose}
                      dialog={false}
                      akcija={props.akcija}
                      channel={props.channel}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Fiskal">
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div >

      {/* <div className="flex-grow-1">
        <TicDocsL
          parameter={"inputTextValue"}
          ticDoc={ticDoc}
          ticDocs={ticDocs}
          cmnPar={cmnPar}
          setVisible={true}
          dialog={false}
          docTip={props.docTip}
        />
      </div> */}
      {/* <div className="flex-grow-1">
        <TicDocDiscountL
          key={refreshKey}
          parameter={"inputTextValue"}
          ticDoc={ticDoc}
          ticDocs={ticDocs}
          cmnPar={cmnPar}
          setVisible={true}
          dialog={false}
          docTip={props.docTip}
          remoteRefresh={remoteRefresh}
          refresh={refresh}
          parentC={"BL"}
          handlePopustIznos={handlePopustIznos}
          karteIznos={karteIznos}
        />
      </div> */}
      <div className="flex-grow-1">
        <TicDocsKarteL
          key={refreshKey}
          parameter={"inputTextValue"}
          ticDoc={ticDoc}
          ticDocs={ticDocs}
          cmnPar={cmnPar}
          setVisible={true}
          dialog={false}
          docTip={props.docTip}
          remoteRefresh={remoteRefresh}
          refresh={refresh}
          parentC={"TR"}
          handleKarteIznos={handleKarteIznos}
          handleNetoIznos={handleNetoIznos}
          handlePopustIznos={handlePopustIznos}
          handleBrojIznos={handleBrojIznos}
          handleFirstColumnClick={handleFirstColumnClick}
          zaUplatu={zaUplatu}
        />
      </div>
      <div className="flex-grow-1">
        <TicDocsNaknadeL
          key={refreshKeyN}
          parameter={"inputTextValue"}
          ticDoc={ticDoc}
          ticDocs={ticDocs}
          cmnPar={cmnPar}
          setVisible={true}
          dialog={false}
          docTip={props.docTip}
          refresh={refresh}
          handleNaknadeIznos={handleNaknadeIznos}
        />
      </div>
      <div className="">
        <div className="p-fluid formgrid grid">
          <div className="field col-12 md:col-12">

            <label htmlFor="opis">{translations[selectedLanguage].Napomena}</label>
            <InputTextarea
              id="opis"
              rows={5}
              autoResize
              style={{ width: '100%' }}
              // cols={100}
              value={ticDoc.opis}
              onChange={(e) => onInputChange(e, 'text', 'opis')}
            />
            <Button icon="pi pi-save"
              onClick={handleNapomenaClick}
              className="p-button" />
          </div>
        </div>
      </div>
      <Dialog
        header={translations[selectedLanguage].Docdelivery}
        visible={ticDocdeliveryVisible}
        style={{ width: '60%' }}
        onHide={() => {
          setTicDocdeliveryVisible(false);
          setShowMyComponent(false);
        }}
      >
        {ticDocdeliveryVisible && (
          <TicDocdelivery
            parameter={"inputTextValue"}
            ticDoc={props.ticDoc}
            cmnPar={cmnPar}
            proba={"PROBA"}
            docdeliveryTip={docdeliveryTip}
            ticDocdelivery={ticDocdelivery}
            handleDialogClose={handleDialogClose}
            handleTicDocdeliveryDialogClose={handleTicDocdeliveryDialogClose}
            setTicDocdeliveryVisible={setTicDocdeliveryVisible}
            setVisible={setVisible}
            dialog={true}
            lookUp={true}
          />
        )}
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].StampaLista}
        visible={ticStampaLVisible}
        style={{ width: '90%' }}
        onHide={() => {
          setTicStampaLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent &&
          <TicStampaL parameter={'inputTextValue'}
            ticDoc={props.ticDoc}
            cmnPar={cmnPar}
            handleTicStampaLDialogClose={handleTicStampaLDialogClose}
            setTicStampaLVisible={setTicStampaLVisible}
            dialog={true} lookUp={false}
          />}
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].PaymentList}
        visible={ticPaymentLVisible}
        style={{ width: '55%' }}
        onHide={() => {
          setTicPaymentLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {ticPaymentLVisible && (
          <TicDocpaymentL
            parameter={"inputTextValue"}
            ticDoc={ticDoc}
            cmnPar={cmnPar}
            handleTicPaymentLDialogClose={handleTicPaymentLDialogClose}
            setTicPaymentLVisible={setTicPaymentLVisible}
            dialog={true}
            lookUp={true}
            setActiveIndex={setActiveIndex2}
          />
        )}
      </Dialog>
      {/* <Dialog
        header={
          <div className="grid grid-nogutter">
            <div className="col-2">
              <Button
                label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                onClick={() => {
                  handleTicPaymentLDialogClose(ticDocpayment)
                  setTicPaymentLVisible(false);
                }}
                severity="secondary" raised
              />
            </div>
            {(Number(ticDoc.status) != 2) && (
              <div className="col-2">
                <Button label={translations[selectedLanguage].Payment}
                  severity="warning" raised
                  onClick={(e) => handlePayTicDoc(e)}
                />

              </div>
            )}
          </div>
        }
        visible={ticPaymentLVisible}
        style={{ width: '55%' }}
        onHide={() => {
          setTicPaymentLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {ticPaymentLVisible && (
          <TicProdajaPlacanje
            key={ticTransactionsKey}
            ticDoc={ticDoc}
            propsParent={props}
            handleFirstColumnClick={handleFirstColumnClick}
            //   handleAction={handleAction}
            setRefresh={handleRefresh}
            handleAllRefresh={handleAllRefresh}
            handlePlacanjetip={handlePlacanjetip}
            ref={placanjeRef}
            modal={true}
          />
        )}
      </Dialog> */}

      <Dialog
        header={
          <div className="grid" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className="field col-12 md:col-5" style={{ paddingTop: 0, paddingBottom: 0 }}>
              <Button
                label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                onClick={() => {
                  setCmnParVisible(false);
                }}
                severity="secondary" raised
              />
            </div>
            <div className="field col-12 md:col-5" style={{ paddingTop: 0, paddingBottom: 0 }}>
              <span>{translations[selectedLanguage].Par}</span>
            </div>
          </div>
        }
        visible={cmnParVisible}
        style={{ width: '60%' }}
        onHide={() => {
          setCmnParVisible(false);
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {cmnParVisible && (
          <CmnPar
            parameter={"inputTextValue"}
            ticDoc={ticDoc}
            cmnPar={cmnPar}
            handleCmnParLDialogClose={handleCmnParLDialogClose}
            handleDialogClose={handleDialogClose}
            setCmnParVisible={setCmnParVisible}
            setVisible={setVisible}
            remote={false}
            dialog={true}
            lookUp={true}
            parTip={"UPDATE"}
          />
        )}
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <Button
              label={translations[selectedLanguage].Cancel} icon="pi pi-times"
              onClick={() => {
                setWebMapVisible(false);
              }}
              severity="secondary" raised
            />
          </div>
        }
        visible={webMapVisible}
        style={{ width: '90%', height: '1100px' }}
        onHide={() => {
          setWebMapVisible(false);
          setShowMyComponent(false);
        }}
      >
        {webMapVisible && (
          <WebSalMap
            parameter={'inputTextValue'}
            ticDoc={ticDoc}
            ticEvent={ticEvent}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            eventTip={eventTip}
            onTaskComplete={handleWebMapDialogClose}
            numberChannell={numberChannell}
            channells={channells}
            channel={ticDoc.channel}
            channell={channell}
            activeIndex={1}
          />
        )}
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <Button
              label={translations[selectedLanguage].Cancel} icon="pi pi-times"
              onClick={() => {
                setTicDocsuidProdajaLVisible(false);
              }}
              severity="secondary" raised
            />
          </div>
        }
        visible={ticDocsuidProdajaLVisible}
        style={{ width: '90%', height: '1100px' }}
        onHide={() => {
          setTicDocsuidProdajaLVisible(false);
          setShowMyComponent(false);
          remoteRefresh()
          setRefresh(++refresh)
        }}
      >
        {ticDocsuidProdajaLVisible && (
          <TicDocsuidProdajaL
            key={ticTransactionsKey}
            ticDoc={ticDoc}
            propsParent={props}
            handleFirstColumnClick={handleFirstColumnClick}
            handleAction={handleAction}
            // handleRefresh={handleRefresh}
            setRefresh={handleRefresh}
            handleAllRefresh={handleAllRefresh}
          />
        )}
      </Dialog>

    </>

  );
}
