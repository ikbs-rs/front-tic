import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
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
import CmnPar from "./cmn/cmnPar";
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
import WebSalMap from './ticDocW';


export default function TicDocdeliveryL(props) {
  console.log(props, "*-----------------------------props----------------*-*-*-*-*-*-*-*-*-*")
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

  const iframeRef = useRef(null);

  const handleCancelClick = () => {
    props.setVisible(false);
  };

  //******************************************************************************************************************** */
  //******************************************************************************************************************** */

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
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
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [cmnPar]);

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 5) {
          const dataO = [];
          dataO.push({ code: `Sales channel`, value: props.ticDoc.kanal });
          dataO.push({ code: `Agent`, value: `${props.ticDoc.firstname} ${props.ticDoc.lastname}` });
          dataO.push({ code: `Order transaction no`, value: transactionTemplate(props.ticDoc.id) });
          dataO.push({ code: `Event`, value: neventTemplate(props.ticDoc) });
          dataO.push({ code: `Transaction time`, value: DateFunction.formatDatetime(props.ticDoc.tm) });
          dataO.push({ code: `Number of ticket`, value: props.ticDoc.ticketcount });
          dataO.push({ code: `Ticket total price`, value: props.ticDoc.tickettotal });
          dataO.push({ code: `Discount`, value: props.ticDoc?.discount });
          dataO.push({ code: `Order total price`, value: props.ticDoc.potrazuje });
          setTicOrderInfos(dataO);

          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {

        const dataO = [];
        dataO.push({ code: `Sales channel`, value: props.ticDoc.kanal });
        dataO.push({ code: `Agent`, value: `${props.ticDoc.firstname} ${props.ticDoc.lastname}` });
        dataO.push({ code: `Order transaction no`, value: props.ticDoc.id });
        dataO.push({ code: `Event`, value: neventTemplate(props.ticDoc) });
        dataO.push({ code: `Transaction time`, value: DateFunction.formatDatetime(props.ticDoc.tm) });
        dataO.push({ code: `Number of ticket`, value: props.ticDoc.ticketcount });
        dataO.push({ code: `Ticket total price`, value: props.ticDoc.tickettotal });
        dataO.push({ code: `Discount`, value: props.ticDoc?.discount });
        dataO.push({ code: `Order total price`, value: props.ticDoc.potrazuje });
        console.log(dataO, "%%%%%%%%%%%%%%%%%%%%%%22222222222%%%%%%%%%%%%%%%%%%%%%%")
        setTicTransactionInfos(dataO);

        initFilters();
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
    async function fetchData() {
      try {
        const cmnParService = new CmnParService();
        const data = await cmnParService.getCmnPar(props.ticDoc.idpar);
        console.log(data, "**###$$$%%%***!!!---+++///((({{{}}})))")
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
  }, [parRefresh]);
  /******************************************** */

  useEffect(() => {
    async function fetchData() {
      try {

        const ticDocdeliveryService = new TicDocdeliveryService();
        const dataD = await ticDocdeliveryService.getTicListaByItem("docdelivery", "listabynum", "tic_docdelivery_v", "doc", ticDoc.id);
        if (dataD[0]) {
          setTicDocdelivery(dataD[0])
          const admUserService = new AdmUserService();
          const data = await admUserService.getAdmUser(dataD[0].usr);
          setAdmUser(data);
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);
  //******************************************************************************************************************** */
  
  useEffect(() => {
    async function fetchData() {
      try {
        console.log( "**************************************setAdmUserPayment***********************************************")
        const ticDocpaymentService = new TicDocpaymentService();
        const dataD = await ticDocpaymentService.getTicListaByItem("docpayment", "listabynum", "tic_docpayment_v", "doc", ticDoc.id);
        console.log( "**************************************setAdmUserPayment***********************************************")
        if (dataD[0]) {
          await setTicDocpayment(dataD[0])
          const admUserService = new AdmUserService();
          const data = await admUserService.getAdmUser(dataD[0].usr);
          console.log(data, "*00*************************************setAdmUserPayment***********************************************", dataD[0])
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
    const newData = [
      {
        event: "Print", button: (
          <Button
            label={translations[selectedLanguage].Print}
            icon="pi pi-print"
            onClick={openStampa}
            severity="success"
            raised
          />
        ),
        status: ''

      },
      {
        event: ((ticDoc.paid) ? <Button
          label={translations[selectedLanguage].paid}
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
        status: (admUserPayment && admUserPayment.firstname && admUserPayment.lastname) ?
        `${DateFunction.formatDatetime(ticDocpayment.tm)} ${admUserPayment.firstname} ${admUserPayment.lastname}` :
        ''
      },
      {
        event:
          ((ticDoc.delivery == 0) ?
            <Button
              label={translations[selectedLanguage].ForDelivery}
              style={{ backgroundColor: 'rgb(207, 142, 73)', color: 'white' }}
            /> : (ticDoc.status == 1) ?
              <Button
                label={translations[selectedLanguage].InDelivery}
                style={{ backgroundColor: 'rgb(190, 66, 66)', color: 'white' }}
              /> : (ticDoc.status == 2) ?
                <Button
                  label={translations[selectedLanguage].HandedOut}
                  style={{ backgroundColor: 'red', color: 'white' }}
                /> :
                <Button
                  label={translations[selectedLanguage].Delivery}
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
        status: admUser.firstname ? `${DateFunction.formatDate(ticDocdelivery.dat)} ${admUser.firstname} ${admUser.lastname}`:''
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
  }, [admUser, admUserPayment]);
  /******************************************** */
  useEffect(() => {
    // Kreiranje niza objekata za cmnParInfos
    const newData = [
      {
        col1: (
          <Button
            label={translations[selectedLanguage].Go}
            icon="pi pi-cog"
            onClick={openStampa}
            severity="success"
            raised
          />
        ), col2: (
          <Button
            label={translations[selectedLanguage].Go}
            icon="pi pi-cog"
            onClick={openStampa}
            severity="success"
            raised
          />
        ),
        col3: (
          <Button
            label={translations[selectedLanguage].Go}
            icon="pi pi-cog"
            onClick={openStampa}
            severity="success"
            raised
          />
        )
      },
      {
        col1: (
          <Button
            label={translations[selectedLanguage].Go}
            icon="pi pi-cog"
            onClick={openStampa}
            severity="success"
            raised
          />
        ), col2: (
          <Button
            label={translations[selectedLanguage].Go}
            icon="pi pi-cog"
            onClick={openStampa}
            severity="success"
            raised
          />
        ),
        col3: (
          <Button
            label={translations[selectedLanguage].Go}
            icon="pi pi-cog"
            onClick={openStampa}
            severity="success"
            raised
          />
        )
      },
      {
        col1: (
          <Button
            label={translations[selectedLanguage].Go}
            icon="pi pi-cog"
            onClick={openStampa}
            severity="success"
            raised
          />
        ), col2: (
          <Button
            label={translations[selectedLanguage].Go}
            icon="pi pi-cog"
            onClick={openStampa}
            severity="success"
            raised
          />
        ),
        col3: (
          <Button
            label={translations[selectedLanguage].Go}
            icon="pi pi-cog"
            onClick={openStampa}
            severity="success"
            raised
          />
        )
      }
    ];
    setCmnBtnActions(newData);
  }, [selectedLanguage]);
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
    }
  };

  const handleDocdeliveryClick = async (e) => {
    try {
      const rowPar = await fetchPar()
      setCmnPar(rowPar.item)
      const rowDocdelivery = await fetchDocdelivery()
      console.log(rowPar, "***************rowDocdelivery************rowPar****", rowDocdelivery)
      if (rowDocdelivery && rowDocdelivery.length > 0) {
        setDocdeliveryTip("UPDATE");
        setTicDocdelivery(rowDocdelivery[0])
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
      console.log(rowData, "***************rowDocdelivery************rowPar****", e)
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

  const handleWebMapClick = async (rowData) => {
    try {
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
      //console.log(ticDoc.usr, "*-*-*************getCmnParById*************-*", data)
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
      // console.log(ticDoc.usr, "*-*-*************getCmnParById*************-*", data)
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
  const neventTemplate = (rowData) => {
    // Proveri da li postoji niz proizvoda
    console.log(rowData.nevent, "rowData*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*-*", JSON.parse(rowData.nevent))

    const nizObjekata = JSON.parse(rowData.nevent)

    if (nizObjekata && nizObjekata.length > 0) {
      console.log(nizObjekata.length, "nizObjekata.length*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*-*", JSON.parse(rowData.nevent))
      return (
        <div>
          <table className="p-datatable" style={{ minWidth: "20rem" }}>
            <tbody>
              {nizObjekata.map((item) => (
                <tr key={item.starttm}>
                  <b>
                    <td style={{ width: '45%' }}>{item.name}</td>
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
      // Ako nema proizvoda, možete prikazati odgovarajuću poruku ili ništa
      return null;
    }
  }
  return (
    <>
      <div className="card">
        <div className="grid p-fluid formgrid nested-grid">
          <Toast ref={toast} />
          <div className="col-5">
            <div class="grid">
              <div className="col-12">
                <div className="card">
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
          <div className="col-3">
            <div class="grid">
              <div className="col-12">
                {/* II */}
                <div className="card">
                  <DataTable
                    dataKey="id"
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
          <div className="col-4">
            <div class="grid">
              <div className="col-12">
                {/* V */}
                <div className="card">
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
                <div className="card">
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
          </div>
        </div>
      </div>

      <div className="flex-grow-1">
        <TicDocsL
          parameter={"inputTextValue"}
          ticDoc={ticDoc}
          ticDocs={ticDocs}
          cmnPar={cmnPar}
          setVisible={true}
          dialog={false}
          docTip={props.docTip}
        />
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
          />
        )}
      </Dialog>

      <Dialog
        header={translations[selectedLanguage].Par}
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
            ticEvent={ticEvent}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            eventTip={eventTip}
            onTaskComplete={handleWebMapDialogClose}
          />
        )}
      </Dialog>

    </>

  );
}
