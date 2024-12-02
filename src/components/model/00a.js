import React, { useRef } from 'react';

const PDFHtmlDownloader = ({ ticket }) => {
  const iframeRef = useRef(null);

  async function downloadAsPDFHtml(ticket) {
    console.log(iframeRef, "00-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    localStorage.setItem('docsIds', JSON.stringify(['1863706028882137088']));

    // URL za preuzimanje
    const urlWithToken = `https://188.93.122.138/sal/sal/print-tickets`;

    console.log(urlWithToken, "01-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    iframeRef.current.src = urlWithToken;
    let i = 0

    // Provera učitavanja sadržaja
    const checkContentLoaded = () => {
      const iframeDocument = iframeRef.current.contentDocument;
      const ticketList = iframeDocument.querySelector('.ticket-list');

      if (ticketList && !ticketList.innerHTML.trim().includes('Loading...')) {
        console.log("03-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        // Kada je sadržaj učitan, otvori u novom prozoru
        const htmlContent = iframeDocument.documentElement.outerHTML;
        const newWindow = window.open('', '_blank'); // Otvori novi prozor
        newWindow.document.write(htmlContent); // Upiši sadržaj u novi prozor
        newWindow.document.close(); // Zatvori strim i prikaži sadržaj
      } else {
        i++
        console.log("04-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        // Ako nije učitan, proveri ponovo posle kratkog kašnjenja
        setTimeout(checkContentLoaded, 100);
        if (i > 50) return
      }
    };

    // Pokretanje provere kada se iframe učita
    iframeRef.current.onload = async () => {
      console.log("02-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      await setTimeout(checkContentLoaded, 100); // Pokreni proveru nakon kratkog kašnjenja
      console.log("05-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    };
  }

  return (
    <div>
      <button onClick={() => downloadAsPDFHtml(ticket)}>Preuzmi PDF HTML</button>
      <iframe ref={iframeRef} style={{ display: 'none' }} ></iframe>
    </div>
  );
};

export default PDFHtmlDownloader;
