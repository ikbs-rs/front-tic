import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CmnParService } from "../../service/model/CmnParService";
import CmnPar from './cmnPar';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
//import CmnParattsL from './cmnParattsL';
//import CmnParlinkL from './cmnParlinkL';


export default function CmnParL(props) {
  console.log("propspropspropspropsprops", props)
  const objName = "cmn_par"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyCmnPar = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnPars, setCmnPars] = useState([]);
  const [cmnPar, setCmnPar] = useState(emptyCmnPar);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [parTip, setParTip] = useState('');
  const [cmnParattsLVisible, setCmnParattsLVisible] = useState(false);
  const [cmnParlinkLVisible, setCmnParlinkLVisible] = useState(false);
  let i = 0

  const handleCancelClick = () => {
    props.setCmnParLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const cmnParService = new CmnParService();
          const data = await cmnParService.getLista();
          setCmnPars(data);

          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _cmnPars = [...cmnPars];
    let _cmnPar = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.parTip === "CREATE") {
      _cmnPars.unshift(_cmnPar);
    } else if (localObj.newObj.parTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnPars[index] = _cmnPar;
    } else if ((localObj.newObj.parTip === "DELETE")) {
      _cmnPars = cmnPars.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnPar Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnPar ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.parTip}`, life: 3000 });
    setCmnPars(_cmnPars);
    setShowMyComponent(false)
    setCmnPar(emptyCmnPar);
  };

  const handleCmnParattsLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleCmnParlinkLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnPars.length; i++) {
      if (cmnPars[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setShowMyComponent(true)
    setCmnParDialog(emptyCmnPar);
  };

  
  const returnPar = () => {
    props.setCmnParLVisible(false);
    props.handleCmnParLDialogClose({obj: cmnPar})
    setCmnParDialog(emptyCmnPar);
  };

  const openParAtt = () => {
    setCmnParattsLDialog();
  };

  const openParLink = () => {
    setCmnParlinkLDialog();
  };

  const onRowSelect = (event) => {
    //cmnPar.begda = event.data.begda
    console.log("****************event.data************************", event.data)
    setCmnPar(event.data)
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
      ctp: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ntp: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      endda: {
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

        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        {!props.lookUp && (
          <>
            <div className="flex flex-wrap gap-1">
              <Button label={translations[selectedLanguage].Attributes} icon="pi pi-table" onClick={openParAtt} text raised disabled={!cmnPar} />
            </div>
            <div className="flex flex-wrap gap-1">
              <Button label={translations[selectedLanguage].Links} icon="pi pi-sitemap" onClick={openParLink} text raised disabled={!cmnPar} />
            </div>
          </>
        )}
        {props.lookUp && (
          <>
            <div className="flex flex-wrap gap-1">
              <Button label={translations[selectedLanguage].Attributes} icon="pi pi-table" onClick={returnPar} text raised disabled={!cmnPar} />
            </div>
          </>
        )}        
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].ParList}</b>
        <div className="flex-grow-1"></div>
        <div className="flex flex-wrap gap-1">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder={translations[selectedLanguage].KeywordSearch}
            />
          </span>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label={translations[selectedLanguage].Clear}
            outlined
            onClick={clearFilter}
            text raised
          />
        </div>
      </div>
    );
  };

  const formatDateColumn = (rowData, field) => {
    return DateFunction.formatDate(rowData[field]);
  };

  // <--- Dialog

  const setCmnParattsLDialog = () => {
    setShowMyComponent(true);
    setCmnParattsLVisible(true);
  }

  const setCmnParlinkLDialog = () => {
    setShowMyComponent(true);
    setCmnParlinkLVisible(true);
  }

  const setCmnParDialog = (cmnPar) => {
    setVisible(true)
    setParTip("CREATE")
    setCmnPar({ ...cmnPar });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const parTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setShowMyComponent(true)
            setCmnParDialog(rowData)
            setParTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />

      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={cmnPar}
        loading={loading}
        value={cmnPars}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="550px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setCmnPar(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={parTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="code"
          header={translations[selectedLanguage].code}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="text"
          header={translations[selectedLanguage].text}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="ntp"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "35%" }}
        ></Column>
        <Column
          field="place"
          header={translations[selectedLanguage].place}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="activity"
          header={translations[selectedLanguage].activity}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="pib"
          header={translations[selectedLanguage].pib}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="idnum"
          header={translations[selectedLanguage].idnum}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Link}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnPar
            parameter={"inputTextValue"}
            cmnPar={cmnPar}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            parTip={parTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      {/*
      <Dialog
        header={translations[selectedLanguage].ParattsLista}
        visible={cmnParattsLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setCmnParattsLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnParattsL
            parameter={"inputTextValue"}
            cmnPar={cmnPar}
            handleCmnParattsLDialogClose={handleCmnParattsLDialogClose}
            setCmnParattsLVisible={setCmnParattsLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>       
      <Dialog
        header={translations[selectedLanguage].ParlinkLista}
        visible={cmnParlinkLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setCmnParlinkLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnParlinkL
            parameter={"inputTextValue"}
            cmnPar={cmnPar}
            handleCmnParlinkLDialogClose={handleCmnParlinkLDialogClose}
            setCmnParlinkLVisible={setCmnParlinkLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>   
      */}
    </div>
  );
}
