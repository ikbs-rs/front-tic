import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { AdmUserPermissService } from "../../service/model/AdmUserPermissService";
import AdmUserPermiss from './admUserPermiss';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";


export default function AdmUserPermissL(props) {
  const objName = "adm_userpermiss"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyAdmUserPermiss = EmptyEntities[objName]
  emptyAdmUserPermiss.usr = props.admUser.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admUserPermisss, setAdmUserPermisss] = useState([]);
  const [admUserPermiss, setAdmUserPermiss] = useState(emptyAdmUserPermiss);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [userPermissTip, setUserPermissTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setAdmUserPermissLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const admUserPermissService = new AdmUserPermissService();
          const data = await admUserPermissService.getAdmUserPermissRoll(props.admUser.id);
          setAdmUserPermisss(data);
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

    let _admUserPermisss = [...admUserPermisss];
    let _admUserPermiss = { ...localObj.newObj.obj };
    console.log(_admUserPermiss)

    //setSubmitted(true);
    if (localObj.newObj.userPermissTip === "CREATE") {
      _admUserPermisss.push(_admUserPermiss);
    } else if (localObj.newObj.userPermissTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admUserPermisss[index] = _admUserPermiss;
    } else if ((localObj.newObj.userPermissTip === "DELETE")) {
      _admUserPermisss = admUserPermisss.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmUserPermiss Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmUserPermiss ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.userPermissTip}`, life: 3000 });
    setAdmUserPermisss(_admUserPermisss);
    setAdmUserPermiss(emptyAdmUserPermiss);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admUserPermisss.length; i++) {
      if (admUserPermisss[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmUserPermissDialog(emptyAdmUserPermiss);
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
      rcode: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      rtext: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
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

  // <--- Dialog
  const setAdmUserPermissDialog = (admUserPermiss) => {
    setVisible(true)
    setUserPermissTip("CREATE")
    setAdmUserPermiss({ ...admUserPermiss });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const userPermissTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmUserPermissDialog(rowData)
            setUserPermissTip("UPDATE")
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
              <label htmlFor="code">{translations[selectedLanguage].Username}</label>
              <InputText id="code"
                value={props.admUser.username}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Mail}</label>
              <InputText
                id="mail"
                value={props.admUser.mail}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={admUserPermiss}
        loading={loading}
        value={admUserPermisss}
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
        onSelectionChange={(e) => setAdmUserPermiss(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={userPermissTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="rcode"
          header={translations[selectedLanguage].Rollcode}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="rtext"
          header={translations[selectedLanguage].Roll}
          sortable
          filter
          style={{ width: "75%" }}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Userspermiss}
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmUserPermiss
            parameter={"inputTextValue"}
            admUserPermiss={admUserPermiss}
            admUser={props.admUser}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            userPermissTip={userPermissTip}
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
