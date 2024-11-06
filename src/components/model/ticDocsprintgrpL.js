import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TicDocsService } from "../../service/model/TicDocsService";

import { Button } from "primereact/button"; // Dodato za dugme
import { translations } from "../../configs/translations";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { TicDocService } from "../../service/model/TicDocService";
import DateFunction from "../../utilities/DateFunction"
import { EmptyEntities } from '../../service/model/EmptyEntities';

export default function TicDocsprintgrpL(props) {
  console.log("***** props *************####### TicDocsprintgrpL ################### props ######", props)

  const objName = "tic_stampa"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const userId = localStorage.getItem('userId')
  const emptyTicStampa = EmptyEntities[objName]
  emptyTicStampa.doc = props.ticDoc?.id
  emptyTicStampa.usr = userId
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [selectedRowsData, setSelectedRowsData] = useState([]); // Novi state za selektovane redove
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [ticDocss, setTicDocss] = useState([]);
  const [ticDoc, setTicDoc] = useState([]);
  const [printCopy, setPrintCopy] = useState(false);

  let [refresh, setRefresh] = useState(null);
  const [componentKey, setComponentKey] = useState(0);

  const [refCode, setRefCode] = useState(props.loctpCode || -1);

  let i = 0
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticDocsService = new TicDocsService();
          const data = await ticDocsService.getArtikliPrintLista(props.ticDoc?.id);
          const sortedData = data.sort((a, b) => {
            if (a.nevent !== b.nevent) {
              return a.nevent.localeCompare(b.nevent);
            } else if (a.nart !== b.nart) {
              return a.nart.localeCompare(b.nart);
            } else if (a.row !== b.row) {
              return a.row.localeCompare(b.row);
            } else {
              return a.seat.localeCompare(b.seat);
            }
          });

          setTicDocss(sortedData);
          setSelectedProducts(sortedData); 
          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [refresh, componentKey, refCode])

  useEffect(() => {
    async function fetchData() {
      try {
        const ticDocService = new TicDocService();
        const data = await ticDocService.getTicDocP(props.ticDoc?.id);
        console.log(data, "QQQQ-5555555555555555555555555555555555555555555555555555555555555555555")
        // const data = await ticDocService.getTicDoc(props.ticDoc?.id);
        setTicDoc(data);
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.ticDoc]);

  const handlePrintClick = async () => {
    handlePrintSt(1);
    setPrintCopy(false)
  };

  const handlePrintCopyClick = async () => {
    handlePrintCopySt(2);
    setPrintCopy(true)
  };

  const handlePrint2Click = async () => {
    handlePrintCopySt(3);
    setPrintCopy(true)
  };

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


  const handlePrintSt = async (tp) => {
    console.log(selectedProducts, "@ST@@@@@@@@@@@@***********handleConfirm********************@@@@@@@@@@@")
    setSubmitted(true);
    emptyTicStampa.valid = tp
    emptyTicStampa.time = DateFunction.currDatetime()
    emptyTicStampa.ticket = JSON.stringify(selectedProducts);
    const ticDocService = new TicDocService();
    await ticDocService.getPrintgrpLista(selectedProducts, emptyTicStampa, 'ORIGINAL');

  };

  const handlePrintCopySt = async (tp) => {
    console.log(selectedProducts, "@ST@@@@@@@@@@@@***********handleConfirm********************@@@@@@@@@@@")
    setSubmitted(true);
    let _tp = "DUPLIKAT"
    if (tp==2){
      _tp="KOPIJA"
    }

    emptyTicStampa.valid = tp
    emptyTicStampa.time = DateFunction.currDatetime()
    emptyTicStampa.ticket = JSON.stringify(selectedProducts);
    const ticDocService = new TicDocService();
    await ticDocService.getPrintgrpLPT(selectedProducts, emptyTicStampa, _tp);

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
          <Button label={translations[selectedLanguage].Print}
            icon="pi pi-print" onClick={handlePrintClick}
            severity="warning"
            // text
            disabled={ticDoc?.status!=2 ? ticDoc?.delivery!=1 ?true:false:false}
            raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].PrintCopy}
            icon="pi pi-print" onClick={handlePrintCopyClick}
            severity="success"
            // text
            disabled={ticDoc?.status!=2 ? ticDoc?.delivery!=1 ?true:false:false}
            raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Print2}
            icon="pi pi-print" onClick={handlePrint2Click}
            severity="success"
            // text
            disabled={ticDoc?.status!=2 ? ticDoc?.delivery!=1 ?true:false:false}
            raised />
        </div>        
        {/* <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].StampKarti}</b>
        <div className="flex-grow-1"></div> */}

        {/* <div className="flex flex-wrap gap-1">
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
        </div> */}
      </div>
    );
  };

  const header = renderHeader();
  return (
    <div className="">
      <Toast ref={toast} />
      <div className="col-12">
        {/* <div className="">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-3">
              <label htmlFor="id">{translations[selectedLanguage].Id}</label>
              <InputText id="id"
                value={props.ticDoc.id}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-3">
              <label htmlFor="broj">{translations[selectedLanguage].Broj}</label>
              <InputText
                id="broj"
                value={ticDoc.broj}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-3">
              <label htmlFor="kanal">{translations[selectedLanguage].Kanal}</label>
              <InputText
                id="kanal"
                value={props.channel?.text}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-2">
              <label htmlFor="date">{translations[selectedLanguage].Datum}</label>
              <InputText
                id="date"
                value={props.ticDoc.date ? DateFunction.formatDate(props.ticDoc.date) : ''}
                
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="cpar">{translations[selectedLanguage].cpar}</label>
              <InputText
                id="cpar"
                value={props.ticDoc.cpar}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="npar">{translations[selectedLanguage].npar}</label>
              <InputText
                id="npar"
                value={props.ticDoc.npar}
                disabled={true}
              />
            </div>
          </div>
        </div> */}
      </div>
      <DataTable
        key={componentKey}
        value={ticDocss}
        selectionMode={rowClick ? null : "checkbox"}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id"
        // tableStyle={{ minWidth: "50rem" }}
        sortField="code" sortOrder={1}
        header={header}
        scrollable
        scrollHeight="650px"
        showGridlines
        removableSort
        filters={filters}
        loading={loading}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column
          field="nevent"
          header={translations[selectedLanguage].nevent}
          sortable
          style={{ width: "35%" }}
        ></Column>
        <Column
          field="row"
          header={translations[selectedLanguage].red}
          style={{ width: "15%" }}
          sortable
        ></Column>
        <Column
          field="seat"
          style={{ width: "15%" }}
          sortable
        ></Column>
        <Column
          field="nart"
          header={translations[selectedLanguage].nart}
          sortable
          style={{ width: "35%" }}
        ></Column>
        {/* <Column
          field="price"
          header={translations[selectedLanguage].price}
          sortable
          style={{ width: "7%" }}
        ></Column>
        <Column
          field="output"
          header={translations[selectedLanguage].outputL}
          sortable
          style={{ width: "5%" }}
        ></Column>
        <Column
          field="discount"
          header={translations[selectedLanguage].discount}
          sortable
          style={{ width: "5%" }}
        ></Column>
        <Column
          field="potrazuje"
          header={translations[selectedLanguage].potrazuje}
          sortable
          style={{ width: "8%" }}
        ></Column> */}
      </DataTable>
      {selectedRowsData.length > 0 && (
        <div className="">
          {/* <h5>Selected Rows Data:</h5> */}
          <ul>
            {selectedRowsData.map((row, index) => (
              <li key={index}>{JSON.stringify(row)}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
