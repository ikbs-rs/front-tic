import React, { useRef } from 'react';

const PDFHtmlDownloader = ({ ticket }) => {
  const iframeRef = useRef(null);

  async function downloadAsPDFHtml(ticket) {

    // const docsIds = ['17209732844398725920', '17209730534937155468'];

    localStorage.setItem('docsIds', JSON.stringify(['17328143866878232076']));

    // window.open('/sal/print-tickets', '_blank');


    const urlWithToken = `/sal/print-tickets`;


            // Load the content in the iframe

            iframeRef.current.src = urlWithToken;


            // Function to check if the content is fully loaded

            const checkContentLoaded = () => {

                const iframeDocument = iframeRef.current.contentDocument;

                const ticketList = iframeDocument.querySelector('.ticket-list');

    

                if (ticketList && !ticketList.innerHTML.trim().includes('Loading...')) {

                    // Content is fully loaded, capture the HTML

                    const htmlContent = iframeDocument.documentElement.outerHTML;

                    console.log("Captured HTML Content:", htmlContent);

    

                } else {

                    // Content is not fully loaded, check again after a short delay

                    setTimeout(checkContentLoaded, 100); // Check every 100ms

                }

            };

    

            // Wait for the iframe to load and then start checking the content

            iframeRef.current.onload = () => {

                setTimeout(checkContentLoaded, 100); // Start checking after a short delay

            };

};


  return (
    <div>
      <button onClick={() => downloadAsPDFHtml(ticket)}>Preuzmi PDF HTML</button>
      <iframe ref={iframeRef} style={{ display: 'none' }}></iframe>
    </div>
  );
};

export default PDFHtmlDownloader;
