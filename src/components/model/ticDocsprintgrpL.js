import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TicDocsService } from "../../service/model/TicDocsService";

import { Button } from "primereact/button"; // Dodato za dugme
import { translations } from "../../configs/translations";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { TicDocService, getPrintgrpLPTX } from "../../service/model/TicDocService";
import DateFunction from "../../utilities/DateFunction"
import { EmptyEntities } from '../../service/model/EmptyEntities';
import PDFHtmlDownloader from './00a'
import env from "../../configs/env"

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
  const [reservationStatus, setReservationStatus] = useState(0);

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
        // console.log(data, "QQQQ-5555555555555555555555555555555555555555555555555555555555555555555")
        // const data = await ticDocService.getTicDoc(props.ticDoc?.id);
        setTicDoc(data);

      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.ticDoc]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (ticDoc.reservation == 1) {
          const endDate = moment(ticDoc.endtm, 'YYYYMMDDHHmmss');
          const now = moment();

          if (endDate.isAfter(now)) {
            setReservationStatus(1);
          }
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [ticDoc]);

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
    // console.log(selectedProducts, "@ST@@@@@@@@@@@@***********handleConfirm********************@@@@@@@@@@@")
    setSubmitted(true);
    emptyTicStampa.valid = tp
    emptyTicStampa.time = DateFunction.currDatetime()
    emptyTicStampa.ticket = JSON.stringify(selectedProducts);


    const ticDocService = new TicDocService();
    const OK = await ticDocService.getPrinFiskal(ticDoc)
    // if (await ticDocService.getPrinFiskal(ticDoc)) {
    //   await ticDocService.getPrintgrpLista(selectedProducts, emptyTicStampa, 'ORIGINAL');
    // }

  };

  const handlePrintCopySt = async (tp) => {
    // console.log(selectedProducts, "@ST@@@@@@@@@@@@***********handleConfirm********************@@@@@@@@@@@")
    setSubmitted(true);
    let _tp = "DUPLIKAT"
    if (tp == 2) {
      _tp = "KOPIJA"
    }

    emptyTicStampa.valid = tp
    emptyTicStampa.time = DateFunction.currDatetime()
    emptyTicStampa.ticket = JSON.stringify(selectedProducts);
    const ticDocService = new TicDocService();
    if (await ticDocService.getPrinFiskal(ticDoc)) {
      // await ticDocService.getPrintgrpLPTX(selectedProducts, emptyTicStampa, _tp);
      getPrintgrpLPTX(selectedProducts, emptyTicStampa, _tp);

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

  const handleDFFHtmlClose = async (printId, tp) => {
    setComponentKey(printId)
    if (tp == "ORIGINAL") {
      props.handPrintOriginal()
    }
  };
  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1">
          <PDFHtmlDownloader
            ticket={selectedProducts}
            ticDoc={ticDoc}
            reservationStatus={reservationStatus}
            ticStampa={emptyTicStampa}
            tpStampa='ORIGINAL'
            tp='1'
            handleDFFHtmlClose={handleDFFHtmlClose}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Fiskal}
            icon="pi pi-book" onClick={handlePrintClick}
            severity="warning"
            // text
            disabled={(ticDoc?.statuspayment == 1 || reservationStatus == 1 || ticDoc?.delivery == 1) ? false : true}

            raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <PDFHtmlDownloader
            ticket={selectedProducts}
            ticDoc={ticDoc}
            reservationStatus={reservationStatus}
            ticStampa={emptyTicStampa}
            tpStampa='KOPIJA'
            tp='2'
            handleDFFHtmlClose={handleDFFHtmlClose}
          />
        </div>
        <PDFHtmlDownloader
          ticket={selectedProducts}
          ticDoc={ticDoc}
          reservationStatus={reservationStatus}
          ticStampa={emptyTicStampa}
          tpStampa='DUPLIKAT'
          tp='3'
          handleDFFHtmlClose={handleDFFHtmlClose}
        />
      </div>
    );
  };
  const PDFHtmlDownloader1 = ({ ticket }) => {
    // console.log("00-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    const iframeRef = useRef(null);

    async function downloadAsPDFHtml(newObj) {
      // console.log(newObj, "00.1-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      const ticket = newObj.map(obj => obj.id);
      // console.log(ticket, "00.2-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      localStorage.setItem('docsIds', JSON.stringify(ticket));
      // localStorage.setItem('docsIds', JSON.stringify(['17350759440792892731', '17350759455923010679']));
      // console.log(JSON.stringify(ticket), "00.3-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")

      // URL za preuzimanje
      const urlWithToken = `${env.DOMEN}/sal/print-tickets`;

      iframeRef.current.src = urlWithToken;
      let i = 0
      // console.log(urlWithToken, "01-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      // Provera učitavanja sadržaja
      const checkContentLoaded = () => {
        // console.log("01.1-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        const iframeDocument = iframeRef.current.contentDocument;
        // console.log("01.2-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", iframeDocument)
        const ticketList = iframeDocument.querySelector('.ticket-list');
        // console.log("02-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")

        if (ticketList && !ticketList.innerHTML.trim().includes('Loading...')) {

          // Kada je sadržaj učitan, otvori u novom prozoru
          const htmlContent = iframeDocument.documentElement.outerHTML;
          // console.log(htmlContent, "03-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
          const newWindow = window.open('', '_blank'); // Otvori novi prozor
          newWindow.document.write(htmlContent); // Upiši sadržaj u novi prozor
          // newWindow.document.close(); // Zatvori strim i prikaži sadržaj
        } else {
          i++
          // Ako nije učitan, proveri ponovo posle kratkog kašnjenja
          setTimeout(checkContentLoaded, 100);
          if (i > 50) return
        }
      };

      // Pokretanje provere kada se iframe učita
      iframeRef.current.onload = async () => {
        await setTimeout(checkContentLoaded, 100); // Pokreni proveru nakon kratkog kašnjenja
      };
    }
    // console.log("04-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    return (
      <div>
        <button onClick={() => downloadAsPDFHtml(ticket)}>Preuzmi PDF!! HTML</button>
        <iframe ref={iframeRef} title='PrintHtml' style={{ display: 'none' }} ></iframe>
      </div>
    );
  };


  const header = renderHeader();
  return (
    <div key={componentKey} className="">
      <Toast ref={toast} />
      <div className="col-12">
      </div>
      <DataTable
        // key={componentKey}
        value={ticDocss}
        selectionMode={rowClick ? null : "checkbox"}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id"
        // tableStyle={{ minWidth: "50rem" }}
        header={header}
        scrollable
        sortField="code" sortOrder={1}
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
          style={{ width: "10%" }}
          sortable
        ></Column>
        <Column
          field="seat"
          style={{ width: "10%" }}
          sortable
        ></Column>
        <Column
          field="nart"
          header={translations[selectedLanguage].nart}
          sortable
          style={{ width: "30%" }}
        ></Column>
        <Column
          field="barcode"
          header={translations[selectedLanguage].barcode}
          sortable
          style={{ width: "15%" }}
        ></Column>
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
