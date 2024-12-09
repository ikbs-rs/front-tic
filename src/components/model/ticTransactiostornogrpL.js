import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TicDocsService } from "../../service/model/TicDocsService";

import { TicEventlocService } from "../../service/model/TicEventlocService";
import { Button } from "primereact/button"; // Dodato za dugme
import { translations } from "../../configs/translations";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import ConfirmDocDialog from '../dialog/ConfirmDialog';
import ConfirmStDialog from '../dialog/ConfirmDialog';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { Dropdown } from 'primereact/dropdown';
import { CmnLoctpService } from "../../service/model/cmn/CmnLoctpService";
import { TicDocService } from "../../service/model/TicDocService";

export default function CmnLoclinkgrpL(props) {
  // console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", props)
  const emptyCmnloclink = "cmn_loclink"

  //const [products, setProducts] = useState([]);
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const [cmnLoclinkgrps, setCmnLoclinkgrps] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [selectedRowsData, setSelectedRowsData] = useState([]); // Novi state za selektovane redove
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmStornoDocVisible, setConfirmStornoDocVisible] = useState(false);
  const [confirmStornoStVisible, setConfirmStornoStVisible] = useState(false);
  const toast = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [addItems, setAddItems] = useState(true);
  const [ticDocss, setTicDocss] = useState([]);

  let [refresh, setRefresh] = useState(null);
  const [componentKey, setComponentKey] = useState(0);

  const [ddCmnLoctpItem, setDdCmnLoctpItem] = useState(props.loctpCode);
  const [ddCmnLoctpItems, setDdCmnLoctpItems] = useState(null);
  const [cmnLoctp, setCmnLoctp] = useState({});
  const [cmnLoctps, setCmnLoctps] = useState([]);
  const [cmnEventloc, setCmnEventloc] = useState(emptyCmnloclink);
  const [refCode, setRefCode] = useState(props.loctpCode || -1);

  // useEffect(() => {
  //   ProductService.getProductsMini().then((data) => setProducts(data));
  // }, []);
  let i = 0
  useEffect(() => {
    async function fetchData() {
      try {
// console.log(props.ticDoc[0]?.id, "HHHHHHHHHHHHHHHHHHHHH++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
          const ticDocsService = new TicDocsService();
          const data = await ticDocsService.getArtikliStornoListaP(props.ticDoc[0]?.id);
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
          initFilters();

      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [refresh, componentKey, refCode]);


  const handleCancelClick = () => {
    props.handleStornoClose({ obj: props.cmnLoc });
    props.setTicLoclinkgrpLVisible(false);
  };

  const handleStornoDokumentClick = async () => {
    setConfirmStornoDocVisible(true);
  };

  const handleAddSelectedRowsClick = async () => {
    setConfirmStornoStVisible(true);
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


  const handleDocConfirm = async () => {
    console.log(selectedProducts, "@DOC@@@@@@@@@@@@***********handleConfirm********************@@@@@@@@@@@")
    setSubmitted(true);
    const ticDocService = new TicDocService();
    await ticDocService.postDocStorno( ticDocss, props.ticDoc[0], 'DOC');

    props.handleStornoClose({ obj: props.ticEvent });
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Локације успешно копиране ?', life: 3000 });
    setVisible(false);
    setConfirmStornoDocVisible(false);
  };

  const handleStConfirm = async () => {
    console.log(selectedProducts, "@ST@@@@@@@@@@@@***********handleConfirm********************@@@@@@@@@@@")
    setSubmitted(true);
    const ticDocService = new TicDocService();
    await ticDocService.postDocStorno( selectedProducts, props.ticDoc[0], 'ST');

    props.handleStornoClose({ obj: props.ticEvent });
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Локације успешно копиране ?', life: 3000 });
    setVisible(false);
    setConfirmStornoStVisible(false);
  };

  const showDeleteDialog = () => {
    setDeleteDialogVisible(true);
  };

  const handleDeleteClick = async () => {
    try {
      setSubmitted(true);
      // const cmnLoclinkService = new CmnLoclinkService();
      //await cmnLoclinkService.deleteTicEvent(cmnLoc);
      props.handleDialogClose({ obj: props.cmnLoc, eventTip: 'DELETE' });
      props.setVisible(false);
      hideDeleteDialog();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 1000,
      });
    }
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

  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
  };
  const renderHeader = () => {
    return (
      <div className="flex card-container">
        {/* <div className="flex flex-wrap gap-1" />
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        /> */}
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Dokument} icon="pi pi-copy" severity="danger" onClick={handleStornoDokumentClick} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Stavke} icon="pi pi-plus" onClick={handleAddSelectedRowsClick} severity="warning" text raised />
        </div>
        <div className="flex-grow-1"></div>
        {(props.akcija === 'RAZ') ? (
                <b>{translations[selectedLanguage].Razdvajanje}</b>
            ) : (
                <b>{translations[selectedLanguage].Storno_transakcije}</b>
            )}
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

  const header = renderHeader();
  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-3">
              <label htmlFor="id">{translations[selectedLanguage].Id}</label>
              <InputText id="id"
                value={props.ticDoc[0].id}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-3">
              <label htmlFor="broj">{translations[selectedLanguage].Broj}</label>
              <InputText
                id="broj"
                value={props.ticDoc[0].broj}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-5">
              <label htmlFor="kanal">{translations[selectedLanguage].Kanal}</label>
              <InputText
                id="kanal"
                value={props.ticDoc[0].kanal}
                disabled={true}
              />
            </div>
            {/* <div className="field col-12 md:col-2">
              <label htmlFor="date">{translations[selectedLanguage].Datum}</label>
              <InputText
                id="date"
                value={props.ticDoc[0].date}
                disabled={true}
              />
            </div> */}
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Event}</label>
              <InputText
                id="text"
                value={props.ticDoc[0].text}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="npar">{translations[selectedLanguage].npar}</label>
              <InputText
                id="npar"
                value={props.ticDoc[0].npar}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
      <DataTable
        key={componentKey}
        value={ticDocss}
        selectionMode={rowClick ? null : "checkbox"}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
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
          style={{ width: "5%" }}
          sortable
        ></Column>
        <Column
          field="seat"
          style={{ width: "5%" }}
          sortable
        ></Column>
        <Column
          field="nart"
          header={translations[selectedLanguage].nart}
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
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
        ></Column>
      </DataTable>
      {selectedRowsData.length > 0 && (
        <div className="mt-4">
          <h5>Selected Rows Data:</h5>
          <ul>
            {selectedRowsData.map((row, index) => (
              <li key={index}>{JSON.stringify(row)}</li>
            ))}
          </ul>
        </div>
      )}
      <ConfirmDocDialog
        visible={confirmStornoDocVisible}
        onHide={() => setConfirmStornoDocVisible(false)}
        onConfirm={handleDocConfirm}
        uPoruka={'Сторниранје документа, да ли сте сигурни?'}
      />
      <ConfirmStDialog
        visible={confirmStornoStVisible}
        onHide={() => setConfirmStornoStVisible(false)}
        onConfirm={handleStConfirm}
        uPoruka={'Сторнирање ставки, да ли сте сигурни?'}
      />
      <DeleteDialog
        visible={deleteDialogVisible}
        inAction="delete"
        onHide={hideDeleteDialog}
        onDelete={handleDeleteClick}
      //uPoruka={'Копирањие поставки, да ли сте сигурни?'}
      />
    </div>
  );
}
