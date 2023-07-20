import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { AdmUserPermissService } from "../../service/model/AdmUserPermissService";
import AdmUserpermissU from './admUserPermissU';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";


export default function AdmUserpermissUL(props) {

  const objName = "adm_userpermiss_vu"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyAdmUserpermissU = EmptyEntities[objName]
  emptyAdmUserpermissU.roll = props.admRoll.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admUserpermissUs, setAdmUserpermissUs] = useState([]);
  const [admUserpermissU, setAdmUserpermissU] = useState(emptyAdmUserpermissU);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [userpermisUTip, setUserpermisUTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setAdmUserPermissULVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const admUserpermissUService = new AdmUserPermissService();
          const data = await admUserpermissUService.getAdmUserpermissUser(props.admRoll.id);
          setAdmUserpermissUs(data);
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

    let _admUserpermissUs = [...admUserpermissUs];
    let _admUserpermissU = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.userpermisUTip === "CREATE") {
      _admUserpermissUs.push(_admUserpermissU);
    } else if (localObj.newObj.userpermisUTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admUserpermissUs[index] = _admUserpermissU;
    } else if ((localObj.newObj.userpermisUTip === "DELETE")) {
      _admUserpermissUs = admUserpermissUs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmUserpermissU Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmUserpermissU ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.userpermisUTip}`, life: 3000 });
    setAdmUserpermissUs(_admUserpermissUs);
    setAdmUserpermissU(emptyAdmUserpermissU);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admUserpermissUs.length; i++) {
      if (admUserpermissUs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmUserpermissUDialog(emptyAdmUserpermissU);
  };

  const onRowSelect = (event) => {
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
      otext: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],       
      },
      o1code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      o1text: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],       
      },      
      onoff: { value: null, matchMode: FilterMatchMode.EQUALS },
      hijerarhija: { value: null, matchMode: FilterMatchMode.EQUALS },      
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
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].RollsList}</b>
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
  const onoffBodyTemplate = (rowData) => {
    const valid = rowData.onoff == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };
  const hijerarhijaBodyTemplate = (rowData) => {
    const valid = rowData.hijerarhija == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };   
  const onoffFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
        {translations[selectedLanguage].On_off}
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };  
  const hijerarhijaFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
        {translations[selectedLanguage].Hijerarhija}
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  }; 
        
  // <--- Dialog
  const setAdmUserpermissUDialog = (admUserpermissU) => {
    setVisible(true)
    setUserpermisUTip("CREATE")
    setAdmUserpermissU({ ...admUserpermissU });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const rollstrTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            rowData.nobj=rowData.o1text
            rowData.nobjtp = rowData.otext
            setAdmUserpermissUDialog(rowData)
            setUserpermisUTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="code">{translations[selectedLanguage].Code}</label>
              <InputText id="code"
                value={props.admRoll.code}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.admRoll.textx}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={admUserpermissU}
        loading={loading}
        value={admUserpermissUs}
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
        onSelectionChange={(e) => setAdmUserpermissU(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={rollstrTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="username"
          header={translations[selectedLanguage].Username}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="mail"
          header={translations[selectedLanguage].Mail}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>
        <Column
          field="firstname"
          header={translations[selectedLanguage].FirstName}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="lastname"
          header={translations[selectedLanguage].LastName}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>                                 
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Userpermiss}
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmUserpermissU
            parameter={"inputTextValue"}
            admUserpermissU={admUserpermissU}
            admRoll={props.admRoll}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            userpermisUTip={userpermisUTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
    </div>
  );
}
