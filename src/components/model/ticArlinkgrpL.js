import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
//import { ProductService } from "./service/ProductService";
// import { TicArtlinkService } from "../../service/model/TicArtlinkService";
import { TicArtService } from "../../service/model/TicArtService";

import { TicEventartService } from "../../service/model/TicEventartService";
import { Button } from "primereact/button"; // Dodato za dugme
import { translations } from "../../configs/translations";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import ConfirmDialog from '../dialog/ConfirmDialog';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { Dropdown } from 'primereact/dropdown';
import { TicArttpService } from "../../service/model/TicArttpService";

export default function TicArtlinkgrpL(props) {
  console.log("***** props *************####### props ################### props ######", props)
  const emptyArt= "tic_art"

  //const [products, setProducts] = useState([]);
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const [ticArtlinkgrps, setTicArtlinkgrps] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [selectedRowsData, setSelectedRowsData] = useState([]); // Novi state za selektovane redove
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const toast = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [addItems, setAddItems] = useState(true);

  let [refresh, setRefresh] = useState(null);
  const [ddTicLoctpItem, setDdTicLoctpItem] = useState(null);
  const [ddTicLoctpItems, setDdTicLoctpItems] = useState(null);
  const [ticLoctp, setTicLoctp] = useState({});
  const [ticLoctps, setTicLoctps] = useState([]);
  const [ticEventart, setTicEventart] = useState(emptyArt);
  const [componentKey, setComponentKey] = useState(0);

  const [ddTicArttpItem, setDdTicArttpItem] = useState(null);
  const [ddTicArttpItems, setDdTicArttpItems] = useState(null);
  const [ticArttp, setTicArttp] = useState({});
  const [ticArttps, setTicArttps] = useState([]);
  const [refCode, setRefCode] = useState(props.loctpCode || -1);

  // useEffect(() => {
  //   ProductService.getProductsMini().then((data) => setProducts(data));
  // }, []);
  let i = 0
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        // if (i < 2) {
        const ticEventartService = new TicEventartService();
        const data = await ticEventartService.getArtLista(refCode || -1, props.ticEvent);
        setTicArtlinkgrps(data);
        console.log(refCode, "***** data *************####### data ################### data ######@@@@@@@@@@@", data)
        initFilters();
        // }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [refresh, componentKey, refCode]);


  useEffect(() => {
    async function fetchData() {
      try {
        const ticArttpService = new TicArttpService();
        const data = await ticArttpService.getTicArttps();

        setTicArttps(data)

        const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
        setDdTicArttpItems(dataDD);
        console.log(dataDD, "!!@---------------------******* !!! ***********------------------------@!!", data)
        //setDdTicLoctpItem(dataDD.find((item) => item.code === props.ticEventatt.tp) || null);
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const handleCancelClick = () => {
    props.handleTicArtlinkgrpLDialogClose({ obj: props.ticArt });
    props.setTicArtlinkgrpLVisible(false);
  };

  const handleCopySelectedRowsClick = async () => {
    setConfirmDialogVisible(true);
    await setAddItems(true)
  };

  const handleAddSelectedRowsClick = async () => {
    setConfirmDialogVisible(true);
    await setAddItems(false)
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


  const handleConfirm = async () => {
    console.log(addItems, "@@@@@@@@@@@@@***********handleConfirm********************@@@@@@@@@@@", props.lista)
    setSubmitted(true);
    const ticEventartService = new TicEventartService(selectedProducts);
    // if (props.lista == 'EL') {
      await ticEventartService.postGrpEventart(props.ticEvent.id, selectedProducts, addItems);
    // } else {
    //   await ticEventartService.postGrpEventart(props.ticEvent, selectedProducts, addItems, props.lista, props.ticEventart, props.lista);
    // }
    props.handleTicArtlinkgrpLDialogClose({ obj: props.ticEvent });
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Артикли успешно копирани ?', life: 3000 });
    setVisible(false);
    setConfirmDialogVisible(false);
  };

  const showDeleteDialog = () => {
    setDeleteDialogVisible(true);
  };


  const onLoctpChange = (e) => {
    let _ticArtlinkgrps = { ...ticArtlinkgrps };
    let val = (e.target && e.target.value && e.target.value.code) || '';
    setDdTicArttpItem(e.value);
    const foundItem = ticArttps.find((item) => item.id === val);
    setTicArttp(foundItem || null);
    _ticArtlinkgrps.tp = val;
    setRefCode(val);
    console.log(e.value, "!!!!!*************************_ticArtlinkgrps***************************!!!!!", foundItem, val)
    // setTicArtlinkgrps(_ticArtlinkgrps);
    setRefresh(++refresh);
  }

  const handleDeleteClick = async () => {
    try {
      setSubmitted(true);
      // const ticArtlinkService = new TicArtlinkService();
      //await ticArtlinkService.deleteTicEvent(ticArt);
      props.handleDialogClose({ obj: props.ticArt, eventTip: 'DELETE' });
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
        <div className="flex flex-wrap gap-1" />
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Copy} icon="pi pi-copy" severity="danger" onClick={handleCopySelectedRowsClick} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Add} icon="pi pi-plus" onClick={handleAddSelectedRowsClick} severity="warning" text raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].EventartgrpList}</b>
        <div className="flex-grow-1"></div>
        {/*  */}
        {/* <div className="flex-grow-1 ">
          <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
          <Dropdown id="tp"
            value={ddTicArttpItem}
            options={ddTicArttpItems}
            onChange={(e) => onLoctpChange(e)}
            showClear
            optionLabel="name"
            placeholder="Select One"
          />
        </div> */}

        {/*  */}
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
        key={componentKey}
        value={ticArtlinkgrps}
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
        <Column field="code" header={translations[selectedLanguage].code}></Column>
        <Column field="text" header={translations[selectedLanguage].text}></Column>
        <Column field="ntp" header={translations[selectedLanguage].ntp}></Column>
        <Column field="ctp" header={translations[selectedLanguage].ninputtp}></Column>
        {/* <Column field="ddlist" header={translations[selectedLanguage].ddlist}></Column> */}
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
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        onConfirm={handleConfirm}
        uPoruka={'Копирањие локација, да ли сте сигурни?'}
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
