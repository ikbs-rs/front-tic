import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
//import { ProductService } from "./service/ProductService";
import { TicEventattsService } from "../../service/model/TicEventattsService";
import { TicEventattService } from "../../service/model/TicEventattService";
import { Button } from "primereact/button"; // Dodato za dugme
import { translations } from "../../configs/translations";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import ConfirmDialog from '../dialog/ConfirmDialog';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { TicDocdeliveryService } from "../../service/model/TicDocdeliveryService";
import TicDocdelivery from './ticDocdelivery';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import DateFunction from "../../utilities/DateFunction";

export default function TicDocdeliveryL(props) {
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

  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [selectedRowsData, setSelectedRowsData] = useState([]); // Novi state za selektovane redove
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [addItems, setAddItems] = useState(true);


  // useEffect(() => {
  //   ProductService.getProductsMini().then((data) => setProducts(data));
  // }, []);
  let i = 0
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticDocdeliveryService = new TicDocdeliveryService();
          const data = await ticDocdeliveryService.getListaL();
          setTicDocdeliverys(data);

          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

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
        {/* <div className="flex flex-wrap gap-1" />
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div> */}
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].DocdeliveryList}</b>
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
  const formatDateColumn = (rowData, field) => {
    return DateFunction.formatDate(rowData[field]);
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      {/* <div className="flex justify-content-center align-items-center mb-4 gap-2">
        <InputSwitch
          inputId="input-rowclick"
          checked={rowClick}
          onChange={(e) => setRowClick(e.value)}
        />
        <label htmlFor="input-rowclick">Row Click</label>
        <Button
          label="Get Selected Rows"
          onClick={handleGetSelectedRowsClick}
        />
      </div> */}
      <DataTable
        value={ticDocdeliverys}
        size={"small"}
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
        <Column field="broj" header={translations[selectedLanguage].Transakcija}></Column>
        <Column field="cpar" header={translations[selectedLanguage].cpar}></Column>
        <Column field="npar" header={translations[selectedLanguage].npar}></Column>
        <Column field="adress" header={translations[selectedLanguage].address}></Column>
        <Column field="dat" header={translations[selectedLanguage].dat}
                body={(rowData) => formatDateColumn(rowData, "dat")}
        ></Column>
        <Column field="amount" header={translations[selectedLanguage].amount}></Column>
        <Column field="ncourier" header={translations[selectedLanguage].ncourier}></Column>
        <Column field="status" header={translations[selectedLanguage].status}></Column>
        <Column bodyClassName="text-center" body={docdeliveryTemplate} exportable={false} headerClassName="w-10rem" 
              style={{ width: "5%" }}/>        
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Payment}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicDocdelivery
            parameter={"inputTextValue"}
            ticDocdelivery={ticDocdelivery}
            ticDoc={props.ticDoc}
            cmnPar={cmnPar}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            setTicDocdeliveryVisible={setTicDocdeliveryVisible}
            dialog={true}
            docdeliveryTip={docdeliveryTip}
          />
        )}
      </Dialog>

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
      {/* <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        onConfirm={handleConfirm}
        uPoruka={'Копирањие поставки, да ли сте сигурни?'}
      />
      <DeleteDialog
        visible={deleteDialogVisible}
        inAction="delete"
        onHide={hideDeleteDialog}
        onDelete={handleDeleteClick}
      //uPoruka={'Копирањие поставки, да ли сте сигурни?'}
      /> */}
    </div>
  );
}
