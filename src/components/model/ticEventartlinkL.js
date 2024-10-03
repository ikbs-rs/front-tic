import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicEventartlinkService } from "../../service/model/TicEventartlinkService";
import TicEventartlink from './ticEventartlink';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function TicEventartlinkL(props) {
console.log(props, "-----------------------------------------------------------------------")
  const objName = "tic_eventartlink"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyTicEventartlink = EmptyEntities[objName]
  emptyTicEventartlink.eventart = props.ticEventart.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticEventartlinks, setTicEventartlinks] = useState([]);
  const [ticEventartlink, setTicEventartlink] = useState(emptyTicEventartlink);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleT, setVisibleT] = useState(false);
  const [eventartlinkTip, setEventartlinkTip] = useState('');
  
  let i = 0
  const handleCancelClick = () => {
    props.setTicEventartlinkLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticEventartlinkService = new TicEventartlinkService();
          const data = await ticEventartlinkService.getLista(props.ticEventart.id);
          console.log(data, "############################################")
          setTicEventartlinks(data);

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
    console.log(newObj, "***************************************handleDialogClose****************----------------")
    props.handleRefresh(newObj.obj.id+newObj.obj.value);

    let _ticEventartlinks = [...ticEventartlinks];
    let _ticEventartlink = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.eventartlinkTip === "CREATE") {
      _ticEventartlinks.push(_ticEventartlink);
    } else if (localObj.newObj.eventartlinkTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticEventartlinks[index] = _ticEventartlink;
    } else if ((localObj.newObj.eventartlinkTip === "DELETE")) {
      _ticEventartlinks = ticEventartlinks.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventartlink Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventartlink ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventartlinkTip}`, life: 3000 });
    setTicEventartlinks(_ticEventartlinks);
    setTicEventartlink(emptyTicEventartlink);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticEventartlinks.length; i++) {
      if (ticEventartlinks[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicEventartlinkDialog(emptyTicEventartlink);
  };


  const onRowSelect = (event) => {
    //ticEventartlink.begda = event.data.begda
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
      ccena: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ncena: {
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
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].EventartlinkList}</b>
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
  const setTicEventartlinkDialog = (ticEventartlink) => {
    setVisible(true)
    setEventartlinkTip("CREATE")
    setTicEventartlink({ ...ticEventartlink });
  }

  
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const eventartlinkTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicEventartlinkDialog(rowData)
            setEventartlinkTip("UPDATE")
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
                value={props.ticEventart.code}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.ticEventart.text}
                disabled={true}
              />
            </div>           
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={ticEventartlink}
        loading={loading}
        value={ticEventartlinks}
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
        onSelectionChange={(e) => setTicEventartlink(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={eventartlinkTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cart"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="nart"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "70%" }}
        ></Column>   
        <Column
          field="value"
          header={translations[selectedLanguage].Value}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>           
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Art}
        visible={visible}
        style={{ width: '55%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicEventartlink
            parameter={"inputTextValue"}
            ticEventartlink={ticEventartlink}
            ticEventart={props.ticEventart}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            eventartlinkTip={eventartlinkTip}
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
