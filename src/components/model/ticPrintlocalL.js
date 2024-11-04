import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import './index.css';
import { TicPrintlocalService } from "../../service/model/TicPrintlocalService";
import { translations } from "../../configs/translations";
import { ToggleButton } from 'primereact/togglebutton';
import { Dropdown } from 'primereact/dropdown';
import { ConstructionOutlined } from "@mui/icons-material";

export default function TicPrintlocalL(props) {
  let i = 0
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const [ticPrintlocals, setTicPrintlocals] = useState([]);
  const [ticPrintlocalsL, setTicPrintlocalsL] = useState([]);
  const [ticPrintlocal, setTicPrintlocal] = useState(null);
  const [ticPrintlocalL, setTicPrintlocalL] = useState(null);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductsL, setSelectedProductsL] = useState([]);
  const [rowClick, setRowClick] = useState(true);
  const [rowLClick, setRowLClick] = useState(true);
  const [checked, setChecked] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const [ddCmnObj, setDdCmnObj] = useState(null);
  const [ddCmnObjs, setDdCmnObjs] = useState(null);
  const [cmnObj, setCmnObj] = useState({});
  const [cmnObjs, setCmnObjs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const ticPrintlocalService = new TicPrintlocalService();
        const data = await ticPrintlocalService.getListaLL("LPRINT");
        setCmnObjs(data);
        const dataDD = data.map(({ textx, code }) => ({ name: textx, code: code }));
        setDdCmnObjs(dataDD);
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {

        const ticPrintlocalService = new TicPrintlocalService();
        const data = await ticPrintlocalService.fetchPrinters("printers");
        const updatedData = data.map((item) => ({
          ...item,
          default: 0,
          tip: "ALL"
        }));
        setTicPrintlocals(updatedData);
        initFilters();
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {

        const ticPrintlocalService = new TicPrintlocalService();
        const data = await ticPrintlocalService.fetchPrintersL("localprinters");
        const updatedData = data.map((item) => ({
          ...item,
          id: `${item.printname}:${item.tip}` 
        }));
        let filteredData = []
        if (ddCmnObj && ddCmnObj !== undefined) {
          filteredData = data.find((item) => item.tip === ddCmnObj.code)
        } else {
          filteredData = data
        }
        setTicPrintlocalsL(updatedData);
        initFilters();
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [refresh]);

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
  };
  const handlePrintLClick = async () => {
    handlePrintSt(1);
  };

  const handlePrintSt = async (tp) => {
    const ticPrintlocalService = new TicPrintlocalService();
    if (tp == 0) {
      await ticPrintlocalService.addLocalPrinterHandler(selectedProducts);
    } else {
      const updatedSelectedProductsL = selectedProductsL.map(product => ({
        ...product,
        tip: ddCmnObj?.code||'ALL'
      }));      
      await ticPrintlocalService.addLocalPrinterHandler(updatedSelectedProductsL);
    }
    setRefresh(prev => prev + 1)
  };

  const onObjChange = (e) => {
    let _cmnObjs = [...cmnObjs];
    let val = (e.target && e.target.value && e.target.value.code) || '';
    setDdCmnObj(e.value);
    const foundItem = cmnObjs.find((item) => item.id === val);
    setCmnObj(foundItem || null);
    // _cmnObjs.tp = val;
    // setCmnObjs(_cmnObjs);
    setRefresh(prev => prev + 1);
  }
  const renderHeader = () => {
    return (
      <div className="grid card-container">
        <div className="col-7">
          <div className="flex card-container">

            <div className="flex flex-wrap gap-1">
              <Button label={translations[selectedLanguage].SetPrintLocal}
                icon="pi pi-wrench" onClick={handlePrintClick}
                severity="warning"
                raised />
            </div>
            <div className="flex-grow-1"></div>
          </div>
        </div>
        <div className="col-3 flex align-items-center justify-content-center">
          <b>{translations[selectedLanguage].PrinterlocalL}</b>
        </div>
      </div>
    );
  };
  const renderHeaderL = () => {
    return (
      <div className="grid card-container">
        <div className="col-6">
          <div className="flex card-container">

            <div className="flex flex-wrap gap-1">
              <Button label={translations[selectedLanguage].SetPrintLocalL}
                icon="pi pi-wrench" onClick={handlePrintLClick}
                severity="warning"
                raised />
            </div>

            <div className="flex-grow-1"></div>
            <div className="flex-grow-1 ">
              <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
            </div>
            <div className="flex-grow-1">
              <Dropdown id="onjtp"
                value={ddCmnObj}
                options={ddCmnObjs}
                onChange={(e) => onObjChange(e)}
                showClear
                optionLabel="name"
                placeholder="Select One"
              />
            </div>
            <div className="flex-grow-1"></div>
          </div>
        </div>
        <div className="col-2 flex align-items-center justify-content-center">
          <b>{translations[selectedLanguage].LokalnePostavke}</b>
        </div>
        <div className="col-3">
          <div className="flex card-container">

            <div className="flex flex-wrap gap-1">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder={translations[selectedLanguage].KeywordSearch}
                />
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label={translations[selectedLanguage].Clear}
                outlined
                onClick={clearFilter}
                text
                raised
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const header = renderHeader();
  const headerL = renderHeaderL();

  const toggleBodyTemplate = (rowData, name, e) => {
    // console.log(rowData, e, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    const checked = rowData[name] === 1;
    const buttonClass = checked ? "toggle-button-checked" : "toggle-button-unchecked";
    return (
      <div className="flex justify-content-center" style={{ width: "18px", height: "18px", fontSize: "9px", border: 'none' }}>
        <ToggleButton
          id={`tgl${rowData.id}`}
          onLabel=""
          offLabel=""
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked}
          onChange={(e) => toggleChecked(e, name, rowData)}
          className={`${buttonClass}`}
          value={checked}
        />
      </div>
    );
  };

  const toggleBodyTemplateL = (rowData, name, e) => {
    // console.log(rowData, e, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    const checked = rowData[name] === 1;
    const buttonClass = checked ? "toggle-button-checked" : "toggle-button-unchecked";
    return (
      <div className="flex justify-content-center" style={{ width: "18px", height: "18px", fontSize: "9px", border: 'none' }}>
        <ToggleButton
          id={`tgl${rowData.id}`}
          onLabel=""
          offLabel=""
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked}
          onChange={(e) => toggleCheckedL(e, name, rowData)}
          className={`${buttonClass}`}
          value={checked}
        />
      </div>
    );
  };

  const toggleChecked = (e, name, rowData) => {
    const newCheckedState = e.value;
    const val = newCheckedState ? 1 : 0;

    console.log("Kliknuto na red sa id:", rowData.name); // Dodato za debagovanje

    // Ažurirajte samo izabrani red koristeći map
    const updatedTicPrintlocals = ticPrintlocals.map((row) => {
      if (row.name === rowData.name) {
        // Ažurirajte polje za izabrani red
        return { ...row, [name]: val };
      }
      return row; // Ostali redovi ostaju nepromenjeni
    });
    setTicPrintlocals(updatedTicPrintlocals);

    if (selectedProducts.length > 0) {
      const updatedSelectedProducts = selectedProducts.map((row) => {
        if (row.name === rowData.name) {
          // Ažurirajte polje za izabrani red
          return { ...row, [name]: val };
        }
        return row; // Ostali redovi ostaju nepromenjeni
      });
      setSelectedProducts(updatedSelectedProducts);
    }
    console.log("Ažurirano stanje za red:", updatedTicPrintlocals); // Debagovanje stanja
  };

  const toggleCheckedL = (e, name, rowData) => {
    const newCheckedState = e.value;
    const val = newCheckedState ? 1 : 0;

    console.log("Kliknuto na red sa id:", rowData.id); // Dodato za debagovanje

    // Ažurirajte samo izabrani red koristeći map
    const updatedTicPrintlocals = ticPrintlocalsL.map((row) => {
      if (row.id === rowData.id) {
        // Ažurirajte polje za izabrani red
        return { ...row, [name]: val };
      }
      return row; // Ostali redovi ostaju nepromenjeni
    });
    setTicPrintlocalsL(updatedTicPrintlocals);

    if (selectedProductsL.length > 0) {
      const updatedSelectedProducts = selectedProductsL.map((row) => {
        if (row.id === rowData.id) {
          // Ažurirajte polje za izabrani red
          return { ...row, [name]: val };
        }
        return row; // Ostali redovi ostaju nepromenjeni
      });
      setSelectedProductsL(updatedSelectedProducts);
    }
    console.log("Ažurirano stanje za red:", updatedTicPrintlocals); // Debagovanje stanja
  };

  const onCellEditComplete = async (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    if (newValue !== null) {
      rowData[field] = newValue;
      setTicPrintlocals([...ticPrintlocals]);
    } else {
      event.preventDefault();
    }
  };
  return (
    <div className="card">
      <div className="col-12">
        <div className="p-fluid formgrid grid">
          <div className="field col-12 md:col-4">
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
              metaKeySelection={false}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              ></Column>
              <Column
                field="printname"
                header={translations[selectedLanguage].Name}
                style={{ width: "60%" }}
              ></Column>
              <Column
                field="tip"
                header={translations[selectedLanguage].Tip}
                style={{ width: "20%" }}
              ></Column>
              <Column
                field="default"
                header={translations[selectedLanguage].Default}
                bodyClassName="text-center"
                body={(e) => toggleBodyTemplate(e, `default`, 'P')}
                onCellEditComplete={onCellEditComplete}
                style={{ width: "10%" }}
              ></Column>
            </DataTable>
          </div>

          <div className="field col-12 md:col-8">
            <Toast ref={toast} />
            <DataTable
              dataKey="id"
              selectionMode={rowLClick ? null : "checkbox"}
              selection={selectedProductsL}
              onSelectionChange={(e) => setSelectedProductsL(e.value)}
              loading={loading}
              value={ticPrintlocalsL}
              header={headerL}
              showGridlines
              removableSort
              filters={filters}
              scrollable
              sortField="tip"
              sortOrder={1}
              scrollHeight="730px"
              metaKeySelection={false}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              ></Column>
              <Column
                field="printname"
                header={translations[selectedLanguage].Name}
                style={{ width: "60%" }}
              ></Column>
              <Column
                field="tip"
                header={translations[selectedLanguage].Tip}
                style={{ width: "20%" }}
              ></Column>
              <Column
                field="default"
                header={translations[selectedLanguage].Default}
                bodyClassName="text-center"
                body={(e) => toggleBodyTemplateL(e, `default`, 'LP')}
                onCellEditComplete={onCellEditComplete}
                style={{ width: "10%" }}
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
}
