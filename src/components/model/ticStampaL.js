import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicStampaService } from "../../service/model/TicStampaService";
// import TicStampa from './ticStampa';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import TicDocsprintgrpL from './ticDocsprintgrpL'
import { TicDocService } from '../../service/model/TicDocService';


export default function TicStampaL(props) {

  const objName = "tic_eventlink"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicStampa = EmptyEntities[objName]
  emptyTicStampa.doc = props.ticDoc.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticStampas, setTicStampas] = useState([]);
  const [ticStampa, setTicStampa] = useState(emptyTicStampa);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [eventlinkTip, setEventlinkTip] = useState('');
  const [ticDocsprintgrpgrpLVisible, setTicDocsprintgrpgrpLVisible] = useState(false)
  let [numberChannell, setNumberChannell] = useState(0)
  let [channells, setChannells] = useState([{}])
  let [channell, setChannell] = useState(null)
  let [refresh, setRefresh] = useState(0);
  let i = 0
  const handleCancelClick = () => {
    props.handleTicStampaLDialogClose(ticStampa)
    props.setTicStampaLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {

        const ticStampaService = new TicStampaService();
        const data = await ticStampaService.getLista(props.ticDoc.id);
        setTicStampas(data);

        initFilters();

      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [refresh]);

  useEffect(() => {
    async function fetchData() {
      try {

        const ticDocService = new TicDocService();
        const data = await ticDocService.getObjTpL('XPK');
        const foundChannel = data.find((item) => item.id === props.ticDoc.channel) || data[0]
        setChannell(foundChannel);
        initFilters();
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.ticDoc]);


  const handDocsprintgrpClose = (newObj) => {
    handleDialogClose(newObj)
    setRefresh(prev => prev + 1)
  }
  const handleDialogClose = (newObj) => {
    setRefresh(prev => prev + 1)
    const localObj = { newObj };

    let _ticStampas = [...ticStampas];
    let _ticStampa = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.eventlinkTip === "CREATE") {
      _ticStampas.push(_ticStampa);
    } else if (localObj.newObj.eventlinkTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticStampas[index] = _ticStampa;
    } else if ((localObj.newObj.eventlinkTip === "DELETE")) {
      _ticStampas = ticStampas.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicStampa Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicStampa ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventlinkTip}`, life: 3000 });
    setTicStampas(_ticStampas);
    setTicStampa(emptyTicStampa);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticStampas.length; i++) {
      if (ticStampas[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicStampaDialog(emptyTicStampa);
  };

  const onRowSelect = (event) => {
    //ticStampa.begda = event.data.begda
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
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Print} icon="pi pi-print" severity="success" onClick={openNew} raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].EventlinkList}</b>
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
    return DateFunction.formatDatetime(rowData[field]);
  };

  // <--- Dialog
  const setTicStampaDialog = (ticStampa) => {
    setTicDocsprintgrpgrpLVisible(true)
    setEventlinkTip("CREATE")
    setTicStampa({ ...ticStampa });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const eventlinkTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicStampaDialog(rowData)
            setEventlinkTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };
  const karteTemplate = (rowData) => {
    // if (rowData.ticket && rowData.ticket > 0) {
      const nizObjekata = JSON.parse(rowData.ticket)
      if (nizObjekata && nizObjekata.length > 0) {
        return (
          <div>
            <table className="p-datatable" style={{ minWidth: "20rem" }}>
              <tbody>
              </tbody>
              {nizObjekata.map((item) => (
                <tr >
                  <td style={{ width: '30%' }}>{item.nevent}</td>
                  <td style={{ width: '40%' }}>{item.nart}</td>
                  <td style={{ width: '30%' }}>{item.row}</td>
                  <td style={{ width: '40%' }}>{item.potrazuje}</td>
                  <td style={{ width: '40%' }}>{item.tp}</td>
                </tr>
              ))}
            </table>
          </div>

        )
      }
    // }
  }
  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="code">{translations[selectedLanguage].Code}</label>
              <InputText id="code"
                value={props.ticDoc.broj}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.ticDoc.broj}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={ticStampa}
        loading={loading}
        value={ticStampas}
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
        onSelectionChange={(e) => setTicStampa(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={eventlinkTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="username"
          header={translations[selectedLanguage].Usr}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="tp"
          header={translations[selectedLanguage].Tp}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="time"
          header={translations[selectedLanguage].tm}
          sortable
          filter
          style={{ width: "20%" }}
          body={(rowData) => formatDateColumn(rowData, "time")}
        ></Column>
        <Column
          field="ticket"
          body={karteTemplate}
          header={translations[selectedLanguage].Ticket}
          sortable
          filter
          style={{ width: "45%" }}
        ></Column>

      </DataTable>
      <Dialog
        header={
          <div className="dialog-header">
            <Button
              label={translations[selectedLanguage].Cancel} icon="pi pi-times"
              onClick={() => {
                setRefresh(prev => prev + 1)
                setTicDocsprintgrpgrpLVisible(false);

              }}
              severity="secondary" raised
            />
          </div>
        }
        visible={ticDocsprintgrpgrpLVisible}
        style={{ width: '80%' }}
        onHide={() => {
          setTicDocsprintgrpgrpLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicDocsprintgrpL
            parameter={"inputTextValue"}
            ticDoc={props.ticDoc}
            handDocsprintgrpClose={handDocsprintgrpClose}
            dialog={true}
            // akcija={akcija}
            channel={channell}
          />
        )}
      </Dialog>

    </div>
  );
}
