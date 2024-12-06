import React, { useRef } from 'react';

const PDFHtmlDownloader = ({ ticket }) => {
  const iframeRef = useRef(null);

  async function downloadAsPDFHtml(ticket) {
    localStorage.setItem('docsIds', JSON.stringify(['17332374550165219743']));

    // URL za preuzimanje
    const urlWithToken = `https://188.93.122.138/sal/print-tickets`;

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
      <button onClick={() => downloadAsPDFHtml(ticket)}>Preuzmi PDF HTML</button>
      <iframe ref={iframeRef} style={{ display: 'none' }} ></iframe>
    </div>
  );
};

export default PDFHtmlDownloader;
