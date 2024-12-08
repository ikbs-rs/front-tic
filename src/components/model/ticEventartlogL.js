import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { TicEventartService } from "../../service/model/TicEventartService";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function TicEventartlinkL(props) {

  const objName = "tic_eventartlink"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyTicEventartlink = EmptyEntities[objName]
  emptyTicEventartlink.eventart = props.ticEventart.id
  const [ticEventartlinks, setTicEventartlinks] = useState([]);
  const [ticEventartlink, setTicEventartlink] = useState(emptyTicEventartlink);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [eventartlinkTip, setEventartlinkTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setTicEventartlogLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticEventartService = new TicEventartService();
          const data = await ticEventartService.getLista(props.ticEventart.id);
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
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].EventartlogList}</b>
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
        {/* <Column
          //bodyClassName="text-center"
          body={eventartlinkTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        /> */}
        <Column
          field="kolicinaulaz"
          header={translations[selectedLanguage].kolicinaulaz}
          sortable
          filter
          style={{ width: "40%" }}
        ></Column>
        <Column
          field="maxkol"
          header={translations[selectedLanguage].maxkol}
          sortable
          filter
          style={{ width: "40%" }}
        ></Column>       
        <Column
          field="begda"
          header={translations[selectedLanguage].Begda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "begda")}
        ></Column>  
        <Column
          field="endda"
          header={translations[selectedLanguage].Endda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "endda")}
        ></Column>         
      </DataTable>
    </div>
  );
}
