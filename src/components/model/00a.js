import React, { useState, useEffect, useRef } from 'react';
import env from "../../configs/env"
import { Button } from "primereact/button";
import { translations } from "../../configs/translations";
import { TicStampaService } from "../../service/model/TicStampaService";
import { TicDocService } from "../../service/model/TicDocService";
import { TicDocpaymentService } from "../../service/model/TicDocpaymentService";
import DateFunction from "../../utilities/DateFunction"
import ConfirmDialog from '../dialog/ConfirmDialog';

const PDFHtmlDownloader = (props) => {
  // console.log(props, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const iframeRef = useRef(null);
  const [ticStampa, setTicStampa] = useState(props.ticStampa || {})
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [countPrint, setCountPrint] = useState(0);
  const [brojStampe, setBrojStampe] = useState(0);
  const [notDisabledButton, setNotDisabledButton] = useState(false);
  const [disabledTpButton, setDisabledTpButton] = useState(false);


  useEffect(() => {
    async function fetchData() {
      try {
        if (props.ticDoc?.paymenttp && 
          (props.ticDoc.paymenttp == "1865524634976653312"
          || props.ticDoc.paymenttp == "6"
          || props.ticDoc.paymenttp == "5"
          || props.ticDoc.paymenttp == "4")
        ) {
          setDisabledTpButton(true)
        }
        const ticDocService = new TicDocService();
        console.log(props.ticDoc, "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ")
        const data = await ticDocService.getDocCountPrint(props.ticDoc?.id || -1);
        setCountPrint(data.broj);
        if (props.tpStampa == 'ORIGINAL') {
          if (data.broj == 0) {
            setNotDisabledButton(true)
          } else {
            setNotDisabledButton(false)
          }
        } else {
          if (data.broj == 0) {
            setNotDisabledButton(false)
          } else {
            setNotDisabledButton(true)
          }
        }
      } catch (error) {
        console.error({ error });
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.ticDoc, brojStampe]);



  async function downloadAsPDFHtml(newObj) {
    console.log(newObj, "1.1-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    const emptyTicStampa = { ...ticStampa }
    const userString = localStorage.getItem('user')
    const userObj = JSON.parse(userString);

    emptyTicStampa.valid = props.tp
    emptyTicStampa.tp = props.tpStampa
    emptyTicStampa.tmupdate = DateFunction.currDatetime()
    const stampaTicket = newObj.map(item => ({
      nevent: item.nevent,
      nart: item.nart,
      seat: item.seat,
      row: item.row,
      potrazuje: item.potrazuje,
      user: userObj.username,
      tp: props.tpStampa,
      tm: emptyTicStampa.tmupdate,
      barcode: item.barcode || 'QQQ'
    }));
    emptyTicStampa.ticket = JSON.stringify(stampaTicket);
    emptyTicStampa.usr = userObj.id
    emptyTicStampa.time = emptyTicStampa.tmupdate

    let _data = -1
    if (props.tpStampa == 'KOPIJA') {
      const ticDocService = new TicDocService();
      const data = await ticDocService.postStampKopija(newObj, emptyTicStampa);
    } else {
      const ticStampaService = new TicStampaService();
      const _data = await ticStampaService.postTicStampa(emptyTicStampa);
    }

    const ticket = newObj.map(obj => obj.id);
    localStorage.setItem('docsIds', JSON.stringify(ticket));

    const urlWithToken = `${env.DOMEN}/sal/print-tickets`;
    iframeRef.current.src = urlWithToken;
    let i = 0

    // Provera učitavanja sadržaja
    const checkContentLoaded = async () => {
      const iframeDocument = iframeRef.current.contentDocument;
      const ticketList = iframeDocument.querySelector('.ticket-list');
      if (ticketList && !ticketList.innerHTML.trim().includes('Loading...')) {

        const htmlContent = iframeDocument.documentElement.outerHTML;
        const newWindow = window.open('', '_blank'); // Otvori novi prozor
        newWindow.document.write(htmlContent); // Upiši sadržaj u novi prozor

        // const ticStampaService = new TicStampaService();
        // const _data = await ticStampaService.postTicStampa(emptyTicStampa);

        setConfirmDialogVisible(false);
        props.handleDFFHtmlClose(_data, props.tpStampa)

        // newWindow.document.close(); // Zatvori strim i prikaži sadržaj
      } else {
        i++
        // Ako nije učitan, proveri ponovo posle kratkog kašnjenja

        if (i > 50) {
          return
        } else {
          setTimeout(checkContentLoaded, 300);
        }
      }
    };

    // Pokretanje provere kada se iframe učita
    iframeRef.current.onload = async () => {
      await setTimeout(checkContentLoaded, 100); // Pokreni proveru nakon kratkog kašnjenja
    };
  }

  const handleActivationClick = () => {

    if (props.tpStampa == "ORIGINAL") {
      // setConfirmDialogVisible(true);
      downloadAsPDFHtml(props.ticket)
    } else {
      setConfirmDialogVisible(true);
    }
  };

  return (
    <>
      <div>
        {/* <button onClick={() => downloadAsPDFHtml(ticket)}>Preuzmi PDF HTML</button> */}
        <Button label={translations[selectedLanguage][props.tpStampa]}
          icon="pi pi-print" onClick={handleActivationClick}
          // severity="warning"
          // text
          disabled={((props.ticDoc?.statuspayment == 1 || (props.reservationStatus == 1 && disabledTpButton) || props.ticDoc?.delivery == 1) && notDisabledButton) ? false : true}
          raised />
        <iframe ref={iframeRef} style={{ display: 'none' }} ></iframe>
      </div>
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        onConfirm={() => downloadAsPDFHtml(props.ticket)}
        uPoruka={`${translations[selectedLanguage][props.tpStampa]} - штампа, да ли сте сигурни?`}
      />
    </>
  );
};

export default PDFHtmlDownloader;
