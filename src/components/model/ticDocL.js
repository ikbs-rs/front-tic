import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import './index.css';
import { TicDocService } from "../../service/model/TicDocService";
import { TicDocvrService } from "../../service/model/TicDocvrService";
import TicDoc from './ticDoc';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction"
import { Dropdown } from 'primereact/dropdown';

export default function TicDocL(props) {
  let i = 0
  const objName = "tic_doc"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicDoc = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticDocs, setTicDocs] = useState([]);
  const [ticDoc, setTicDoc] = useState(emptyTicDoc);
  const [ticDocvrs, setTicDocvrs] = useState([]);
  const [ticDocvr, setTicDocvr] = useState(null);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [docTip, setDocTip] = useState('');
  const [ddTicDocvrItem, setDdTicDocvrItem] = useState(null);
  const [ddTicDocvrItems, setDdTicDocvrItems] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticDocService = new TicDocService();
          const data = await ticDocService.getCmnListaByItem('doc', 'listabynum', 'tic_docbynum_v', 'aa.docvr', ddTicDocvrItem.code);
          setTicDocs(data);
          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [ddTicDocvrItem]);

  useEffect(() => {
    async function fetchData() {
      try {
        const ticDocvrService = new TicDocvrService();
        const data = await ticDocvrService.getTicDocvrs();

        setTicDocvrs(data)
        //console.log("******************", ticDocvrlinkItem)

        const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
        setDdTicDocvrItems(dataDD);
        //setDdTicDocvrItem(dataDD.find((item) => item.code === props.ticDoc.doc1) || null);
        if (props.ticDoc.docvr) {
          const foundItem = data.find((item) => item.id === props.ticDoc.docvr);
          setTicDocvr(foundItem || null);
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

    let _ticDocs = [...ticDocs];
    let _ticDoc = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.docTip === "CREATE") {
      _ticDocs.push(_ticDoc);
    } else if (localObj.newObj.docTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticDocs[index] = _ticDoc;
    } else if ((localObj.newObj.docTip === "DELETE")) {
      _ticDocs = ticDocs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDoc Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDoc ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docTip}`, life: 3000 });
    setTicDocs(_ticDocs);
    setTicDoc(emptyTicDoc);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticDocs.length; i++) {
      if (ticDocs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicDocDialog(emptyTicDoc);
  };

  const onRowSelect = (doc) => {
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${doc.data.id} Name: ${doc.data.broj}`,
      life: 3000,
    });
  };

  const onRowUnselect = (doc) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${doc.data.id} Name: ${doc.data.textx}`,
      life: 3000,
    });
  };
  const onInputChange = (e, type, name) => {
    let val = ''
    if (type === "options") {
      val = (e.target && e.target.value && e.target.value.code) || '';
      if (name == "docvr") {
        setDdTicDocvrItem(e.value);
        const foundItem = ticDocvrs.find((item) => item.id === val);
        console.log(ticDocvrs, "+++++++++++++++++++onInputChange++++++++++++++++++++++", foundItem)
        setTicDocvr(foundItem || null);
        ticDoc.docvr = val
      }
    }
  }
  // <heder za filter
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      textx: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      storno: { value: null, matchMode: FilterMatchMode.EQUALS },
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
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>

       
        <div className="flex-grow-1" />
        <b>{translations[selectedLanguage].DocList}</b>
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

  const formatTimeColumn = (rowData, field) => {
    return DateFunction.convertTimeToDisplayFormat(rowData[field]);
  };

  const stornoBodyTemplate = (rowData) => {
    const storno = rowData.storno == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": storno,
          "text-red-500 pi-times-circle": !storno
        })}
      ></i>
    );
  };

  const stornoFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          {translations[selectedLanguage].Valid}
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
  const setTicDocDialog = (ticDoc) => {
    setVisible(true)
    setDocTip("CREATE")
    setTicDoc({ ...ticDoc });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const actionTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicDocDialog(rowData)
            setDocTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />   
      <div className="p-fluid formgrid grid">
        <div className="field col-12 md:col-3">
          <label htmlFor="docvr">{translations[selectedLanguage].docvr_}</label>
          <Dropdown id="docvr"
            value={ddTicDocvrItem}
            options={ddTicDocvrItems}
            onChange={(e) => onInputChange(e, "options", 'docvr')}
            optionLabel="name"
            placeholder="Select One"
          />

        </div>
        <div className="field col-12 md:col-4">
          <label htmlFor="docobj">{translations[selectedLanguage].ndocobj}</label>
          <Dropdown id="docobj"
            //value={ddTicEventlinkItem}
            // options={ddTicEventlinkItems}
            onChange={(e) => onInputChange(e, "options", 'docobj')}
            required
            optionLabel="name"
            placeholder="Select One"
          //className={classNames({ 'p-invalid': submitted && !ticDoc.event })}
          />
          {/*submitted && !ticDoc.event && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>*/}
        </div>
        <div className="field col-12 md:col-4">
          <label htmlFor="event">{translations[selectedLanguage].Event} *</label>
          <Dropdown id="event"
            //value={ddTicEventlinkItem}
            // options={ddTicEventlinkItems}
            onChange={(e) => onInputChange(e, "options", 'event')}
            required
            optionLabel="name"
            placeholder="Select One"
          //className={classNames({ 'p-invalid': submitted && !ticDoc.event })}
          />
          {/*submitted && !ticDoc.event && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>*/}
        </div>        
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={ticDoc}
        loading={loading}
        value={ticDocs}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        sortField="date"
        sortOrder={1}
        scrollHeight="750px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setTicDoc(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={actionTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="nevent"
          header={translations[selectedLanguage].nevent}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="ndocvr"
          header={translations[selectedLanguage].ndocvr}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="ndocobj"
          header={translations[selectedLanguage].ndocobj}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="year"
          header={translations[selectedLanguage].year}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="broj"
          header={translations[selectedLanguage].broj}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="storno"
          filterField="storno"
          dataType="numeric"
          header={translations[selectedLanguage].storno}
          sortable
          filter
          filterElement={stornoFilterTemplate}
          style={{ width: "5%" }}
          bodyClassName="text-center"
          body={stornoBodyTemplate}
        ></Column>
        <Column
          field="date"
          header={translations[selectedLanguage].date}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "date")}
        ></Column>
        <Column
          field="cpar"
          header={translations[selectedLanguage].cpar}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="npar"
          header={translations[selectedLanguage].npar}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>

      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Doc}
        visible={visible}
        style={{ width: '95%', height: '1400px' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicDoc
            parameter={"inputTextValue"}
            ticDoc={ticDoc}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            ticDocvr={ticDocvr}
            docTip={docTip}
          />
        )}
      </Dialog>
    </div>
  );
}
