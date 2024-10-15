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
import { TicPrintlocalService } from "../../service/model/TicPrintlocalService";
import TicPrintlocal from './ticPrintlocal';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";

export default function TicPrintlocalL(props) {
  let i = 0
  const objName = null
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicPrintlocal = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticPrintlocals, setTicPrintlocals] = useState([]);
  const [ticPrintlocal, setTicPrintlocal] = useState(null);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [cenatpTip, setCenatpTip] = useState('');
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticPrintlocalService = new TicPrintlocalService();
          const data = await ticPrintlocalService.fetchPrinters();
          setTicPrintlocals(data);
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

    let _ticPrintlocals = [...ticPrintlocals];
    let _ticPrintlocal = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.cenatpTip === "CREATE") {
      _ticPrintlocals.push(_ticPrintlocal);
    } else if (localObj.newObj.cenatpTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticPrintlocals[index] = _ticPrintlocal;
    } else if ((localObj.newObj.cenatpTip === "DELETE")) {
      _ticPrintlocals = ticPrintlocals.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicPrintlocal Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicPrintlocal ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.cenatpTip}`, life: 3000 });
    setTicPrintlocals(_ticPrintlocals);
    setTicPrintlocal(emptyTicPrintlocal);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticPrintlocals.length; i++) {
      if (ticPrintlocals[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicPrintlocalDialog(emptyTicPrintlocal);
  };

  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.printname} `,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.printname} `,
      life: 3000,
    });
  };
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
      valid: { value: null, matchMode: FilterMatchMode.EQUALS },
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

  const handlePrintClick = async () => {
    handlePrintSt(0);
    // setPrintCopy(false)
  };

  const handlePrintSt = async (tp) => {
    console.log(selectedProducts, "@ST@@@@@@@@@@@@***********handleConfirm********************@@@@@@@@@@@")
    // setSubmitted(true);
    const ticPrintlocalService = new TicPrintlocalService();
    await ticPrintlocalService.addLocalPrinterHandler(selectedProducts);

  };

  const renderHeader = () => {
    return (
      <div className="flex card-container">

        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Print}
            icon="pi pi-print" onClick={handlePrintClick}
            severity="warning"
            // text
            raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Print}
            icon="pi pi-print" onClick={handlePrintClick}
            severity="success"
            // text
            raised />
        </div>
        <div className="flex-grow-1" />
        <b>{translations[selectedLanguage].PrinterlocalL}</b>
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

  const validBodyTemplate = (rowData) => {
    const valid = rowData.valid == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };

  const validFilterTemplate = (options) => {
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
  const setTicPrintlocalDialog = (ticPrintlocal) => {
    setVisible(true)
    setCenatpTip("CREATE")
    setTicPrintlocal({ ...ticPrintlocal });
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
            setTicPrintlocalDialog(rowData)
            setCenatpTip("UPDATE")
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
        dataKey="name"
        selectionMode={rowClick ? null : "checkbox"}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        loading={loading}
        value={ticPrintlocals}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        sortField="code"
        sortOrder={1}
        scrollHeight="730px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column
          field="printname"
          header={translations[selectedLanguage].Name}
          // sortable
          // filter
          style={{ width: "50%" }}
        ></Column>
        <Column
          //bodyClassName="text-center"
          body={actionTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Printerlocal}
        visible={visible}
        style={{ width: '50%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicPrintlocal
            parameter={"inputTextValue"}
            ticPrintlocal={ticPrintlocal}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            cenatpTip={cenatpTip}
          />
        )}
      </Dialog>
    </div>
  );
}
