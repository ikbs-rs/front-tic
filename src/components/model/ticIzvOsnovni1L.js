import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import './index.css';
import { TicIzvService } from "../../service/model/TicIzvService";

import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";

export default function TicIzvOsnovni1L(props) {
  let i = 0
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ticIzvs, setTicIzvs] = useState([]);
  const [ticIzv, setTicIzv] = useState({});
  const mapa = 1
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticIzvService = new TicIzvService();
          const data = await ticIzvService.getOsnovni1();
          setTicIzvs(data);
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

  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticIzvs.length; i++) {
      if (ticIzvs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };



  const onRowSelect = (event) => {
    // toast.current.show({
    //   severity: "info",
    //   summary: "Action Selected",
    //   detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
    //   life: 3000,
    // });
  };

  const onRowUnselect = (event) => {
    // toast.current.show({
    //   severity: "warn",
    //   summary: "Action Unselected",
    //   detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
    //   life: 3000,
    // });
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

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex-grow-1" />
        <b>{translations[selectedLanguage].Osnovni1}</b>
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



  const header = renderHeader();
  // heder za filter/>
  /********************************************************************************/

  const brtransTotal = () => {
    let total = 0;

    for (let stavka of ticIzvs) {
      let potrazuje = Number(stavka.brtrans); // ili parseFloat(stavka.potrazuje)
      if (!isNaN(potrazuje)) {
        total += potrazuje;
      }
    }
    return total;
  };
  const brkartiTotal = () => {
    let total = 0;

    for (let stavka of ticIzvs) {
      let neto = Number(stavka.brkarti); // ili parseFloat(stavka.potrazuje)
      if (!isNaN(neto)) {
        total += neto;
      }
    }
    return total;
  };
  const iznosTotal = () => {
    let total = 0;

    for (let stavka of ticIzvs) {
      let broj = Number(stavka.iznos); // ili parseFloat(stavka.potrazuje)
      if (!isNaN(broj)) {
        total += broj;
      }
    }
    return total;
  };
  const popustTotal = () => {
    let popust = 0

    for (let stavka of ticIzvs) {
      let discount = Number(stavka.popust)
      if (!isNaN(discount)) {
        popust += discount
      }
    }
    return popust;
  };
  const reztransTotal = () => {
    let total = 0

    for (let stavka of ticIzvs) {
      let iznos = Number(stavka.reztrans)
      if (!isNaN(iznos)) {
        total += iznos
      }
    }
    return total;
  };  
  const rezkartiTotal = () => {
    let total = 0

    for (let stavka of ticIzvs) {
      let iznos = Number(stavka.rezkarti)
      if (!isNaN(iznos)) {
        total += iznos
      }
    }
    return total;
  }; 
  const reziznosTotal = () => {
    let total = 0

    for (let stavka of ticIzvs) {
      let iznos = Number(stavka.reziznos)
      if (!isNaN(iznos)) {
        total += iznos
      }
    }
    return total;
  }; 
  const footerArtikalGroup = (
    <ColumnGroup className="custom-table">
      <Row className="custom-table">
        <Column footer={translations[selectedLanguage].Total} colSpan={mapa} footerStyle={{ textAlign: 'right' }} />
        <Column footer={brtransTotal} />
        <Column footer={brkartiTotal} />
        <Column footer={iznosTotal} />
        <Column footer={popustTotal} />
        <Column footer={reztransTotal} />
        <Column footer={rezkartiTotal} />
        <Column footer={reziznosTotal} />
      </Row>
    </ColumnGroup>
  );


  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={ticIzv}
        loading={loading}
        value={ticIzvs}
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
        rowsPerPageOptions={[10, 25, 50]}
        onSelectionChange={(e) => setTicIzv(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
        footerColumnGroup={footerArtikalGroup}
      >

        <Column
          field="text"
          header={translations[selectedLanguage].Tip}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>

        <Column
          field="brtrans"
          header={translations[selectedLanguage].brtrans}
          sortable
          // filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="brkarti"
          header={translations[selectedLanguage].brkarti}
          sortable
          // filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="iznos"
          header={translations[selectedLanguage].iznos}
          sortable
          // filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="popust"
          header={translations[selectedLanguage].popust}
          sortable
          // filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="reztrans"
          header={translations[selectedLanguage].reztrans}
          sortable
          // filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="rezkarti"
          header={translations[selectedLanguage].rezkarti}
          sortable
          // filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="reziznos"
          header={translations[selectedLanguage].reziznos}
          sortable
          // filter
          style={{ width: "10%" }}
        ></Column>
      </DataTable>
    </div>
  );
}
