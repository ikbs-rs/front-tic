import React, { useRef } from 'react';
import env from "../../configs/env"
import { Button } from "primereact/button";
import { translations } from "../../configs/translations";

const PDFHtmlDownloader = ( props) => {
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const iframeRef = useRef(null);

  async function downloadAsPDFHtml(newObj) {


    const newObj1 = [
      { id: '17332374550165219743', name: 'Item1' },
      { id: '17332374550165219743', name: 'Item2' },
      { id: '17332374550165219743', name: 'Item3' }
    ];
    console.log(newObj, "00.1-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    const ticket = newObj.map(obj => obj.id);
    console.log(ticket, "00.2-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    localStorage.setItem('docsIds', JSON.stringify(ticket));
    // localStorage.setItem('docsIds', JSON.stringify(['17350862247937781068', '17350862516051218663', '17350862232388013236']));
    // localStorage.setItem('docsIds', JSON.stringify(['17332374550165219743', '17332374550165219743', '17332374550165219743']));

    // URL za preuzimanje
    const urlWithToken = `${env.DOMEN}/sal/print-tickets`;
    console.log(urlWithToken, "00.2.1-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    iframeRef.current.src = urlWithToken;
    let i = 0

    // Provera učitavanja sadržaja
    const checkContentLoaded = () => {
      const iframeDocument = iframeRef.current.contentDocument;
      const ticketList = iframeDocument.querySelector('.ticket-list');

      if (ticketList && !ticketList.innerHTML.trim().includes('Loading...')) {

        // Kada je sadržaj učitan, otvori u novom prozoru
        const htmlContent = iframeDocument.documentElement.outerHTML;
        console.log(htmlContent, "03-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
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

  return (
    <div>
      {/* <button onClick={() => downloadAsPDFHtml(ticket)}>Preuzmi PDF HTML</button> */}
      <Button label={translations[selectedLanguage].Print}
        icon="pi pi-print" onClick={() => downloadAsPDFHtml(props.ticket)}
        severity="warning"
        // text
        disabled={(props.ticDoc?.statuspayment == 1 || props.reservationStatus == 1 || props.ticDoc?.delivery == 1) ? false :  true }
        raised />
      <iframe ref={iframeRef} style={{ display: 'none' }} ></iframe>
    </div>
  );
};

export default PDFHtmlDownloader;
