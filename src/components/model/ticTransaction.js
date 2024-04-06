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
import { CmnParService } from "../../service/model/cmn/CmnParService";
import TicDocdelivery from './ticDocdelivery';
import TicStampaL from './ticStampaL';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import { TicDocService } from "../../service/model/TicDocService";


export default function TicDocdeliveryL(props) {
  console.log(props, "*-----------------------------props----------------*-*-*-*-*-*-*-*-*-*")
  const objName = "tic_docdelivery"
  const objPar = "cmn_par"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicDocdelivery = EmptyEntities[objName]
  const emptyPar = EmptyEntities[objPar]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticDocdeliverys, setTicDocdeliverys] = useState([]);
  const [ticDocdelivery, setTicDocdelivery] = useState(emptyTicDocdelivery);
  const [cmnPar, setCmnPar] = useState(emptyPar);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [docdeliveryTip, setDocdeliveryTip] = useState('');
  const [ticDocdeliveryVisible, setTicDocdeliveryVisible] = useState(false);
  let i = 0

  const [cmnParInfos, setCmnParInfos] = useState([]);
  const [cmnParInfo, setCmnParInfo] = useState('');

  const [cmnBtnInfos, setCmnBtnInfos] = useState([]);
  const [cmnBtnInfo, setCmnBtnInfo] = useState('');

  const [ticStampaLVisible, setTicStampaLVisible] = useState(false);

  const handleCancelClick = () => {
    props.setVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const name = {
            id: 1, firstname: 2, lastname: 3, mail: 4, tel: 5, address: 6, postcode: 7, place: 8, text: 9, code: 10
          }
          const cmnParService = new CmnParService();
          const data = await cmnParService.getCmnPar(props.ticDoc.usr);

          // Kreiranje novog objekta dataT
          // const dataT = [];

          // Iteriranje kroz elemente objekta data
          // for (const key in name) {
          //   if (data.hasOwnProperty(key)) {
          //     // Dodavanje objekta sa imenom i vrednošću u dataT
          //     dataT.push({ id: name[key], code: key, value: data[key] });
          //   }
          // }
          // Kreiranje novog objekta dataT
          const dataT = Object.keys(name).map(key => {
            // Provera da li objekat data sadrži svojstvo sa trenutnim ključem
            const value = data.hasOwnProperty(key) ? data[key] : null;
            return { id: name[key], code: key, value: value };
          });
          console.log(data, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", dataT)
          setCmnParInfos(dataT);

          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  /******************************************** */

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
        )
      },
      {
        event: "Payment", button: (
          <Button
            label={translations[selectedLanguage].Payment}
            icon="pi pi-dollar"
            className="p-button-warning"
            // onClick={handlePaymentClick}
            severity="success"
            raised
          />
        )
      },
      {
        event: "Delivery", button: (
          <Button
            label={translations[selectedLanguage].Delivery}
            icon="pi pi-gift"
            className="p-button-warning"
            onClick={handleDocdeliveryClick}
            severity="success"
            raised
          />
        )
      }
    ];
    setCmnBtnInfos(newData);
  }, [selectedLanguage]);
  /******************************************** */

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

  return (
    <>
      <div className="card">
        <div className="grid p-fluid formgrid nested-grid">
          <Toast ref={toast} />

          {/* I */}
          <div className="col-4">
            <div class="grid">
              <div className="col-12">
                {/* <div className="field col-4 md:col-4"> */}
                <div className="card">
                  <DataTable
                    dataKey="id"
                    size={"small"}
                    rowClassName=" custom-row-color"
                    stripedRows
                    selection={cmnParInfo}
                    value={cmnParInfos}
                    virtualScrollerOptions={{ itemSize: 46 }}
                  // onSelectionChange={(e) => setTicDocdelivery(e.value)}
                  >
                    <Column
                      field="code"
                      header={translations[selectedLanguage].Order_info}
                      style={{ width: "10%" }}
                    ></Column>
                    <Column
                      field="value"
                      style={{ width: "25%" }}
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
          <div className="col-8">
            <div class="grid">
              <div className="col-6">
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
                      style={{ width: "10%" }}
                    ></Column>
                    <Column
                      field="value"
                      style={{ width: "25%" }}
                    ></Column>
                  </DataTable>
                </div>
              </div>
              <div className="col-6">
                {/* III */}
                <div className="card">
                  <DataTable
                    dataKey="id"
                    size={"small"}
                    // rowClassName={rowClass}
                    rowClassName="custom-row-color"
                    selection={ticDocdelivery}
                    value={ticDocdeliverys}
                    virtualScrollerOptions={{ itemSize: 46 }}
                    onSelectionChange={(e) => setTicDocdelivery(e.value)}
                  >
                    <Column
                      field="cpar"
                      header={translations[selectedLanguage].Transaction_info}
                      style={{ width: "10%" }}
                    ></Column>
                    <Column
                      field="npar"
                      style={{ width: "25%" }}
                    ></Column>
                  </DataTable>
                </div>
              </div>
              <div className="col-6">
                {/* IV */}
                <div className="card">
                  <DataTable
                    dataKey="id"
                    size={"small"}
                    // rowClassName={rowClass}
                    rowClassName="custom-row-color"
                    selection={ticDocdelivery}
                    value={ticDocdeliverys}
                    virtualScrollerOptions={{ itemSize: 46 }}
                    onSelectionChange={(e) => setTicDocdelivery(e.value)}
                  >
                    <Column
                      field="cpar"
                      header={translations[selectedLanguage].Transaction_info}
                      style={{ width: "10%" }}
                    ></Column>
                    <Column
                      field="npar"
                      style={{ width: "25%" }}
                    ></Column>
                  </DataTable>
                </div>
              </div>
              <div className="col-6">
                {/* V */}
                <div className="card">
                  <DataTable
                    dataKey="id"
                    size={"small"}
                    // rowClassName={rowClass}
                    rowClassName="custom-row-color"
                    selection={cmnBtnInfo}
                    value={cmnBtnInfos}
                    virtualScrollerOptions={{ itemSize: 46 }}
                    onSelectionChange={(e) => setTicDocdelivery(e.value)}
                  >
                    <Column
                      field="event"
                      header={translations[selectedLanguage].Transaction_info}
                      style={{ width: "10%" }}
                    ></Column>
                    <Column
                      field="button"
                      style={{ width: "25%" }}
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <DataTable
          dataKey="id"
          size={"small"}
          // rowClassName={rowClass}
          rowClassName="customa-row-color"
          stripedRows
          selection={cmnParInfo}
          value={cmnParInfos}
          virtualScrollerOptions={{ itemSize: 46 }}
        // onSelectionChange={(e) => setTicDocdelivery(e.value)}
        >
          <Column
            field="code"
            header={translations[selectedLanguage].Customer_info}
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="value"
            style={{ width: "25%" }}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        header={translations[selectedLanguage].Docdelivery}
        visible={ticDocdeliveryVisible}
        style={{ width: '90%' }}
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
            docdeliveryTip={docdeliveryTip}
            ticDocdelivery={ticDocdelivery}
            handleDialogClose={handleDialogClose}
            handleTicDocdeliveryDialogClose={handleTicDocdeliveryDialogClose}
            setTicDocdeliveryVisible={setTicDocdeliveryVisible}
            dialog={true}
            lookUp={true}
            setVisible={setVisible}
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
            handleTicStampaLDialogClose={handleTicStampaLDialogClose}
            setTicStampaLVisible={setTicStampaLVisible}
            dialog={true} lookUp={false}
          />}
      </Dialog>

    </>

  );
}
