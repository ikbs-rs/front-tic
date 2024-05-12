import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import { translations } from "../../configs/translations";

/********************************** */
import { TicDocService } from "../../service/model/TicDocService";
/********************************** */
import { TabView, TabPanel } from 'primereact/tabview';
import { Avatar } from 'primereact/avatar';
import TicTransactionsL from './ticTransactionsL';
import DateFunction from "../../utilities/DateFunction"
import { Toast } from "primereact/toast";
import { Dropdown } from 'primereact/dropdown';


export default function TicDocW(props) {
  console.log(props, "******************@@@@@@@@@@@@@@@@@@@@@@@*******************************", props.ticDoc)
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const iframeRef = useRef(null);
  const [key, setKey] = useState(0);
  const [ticDoc, setTicDoc] = useState(props.ticDoc);
  const [ticDocId, setTicDocId] = useState(props.ticDoc?.id);

  const iframe = document.getElementById('myIframe');
  const iframeWindow = iframe?.contentWindow;
  const [iframeVariable, setIframeVariable] = useState(iframeWindow?.cartItems);
  const [expandIframe, setExpandIframe] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  let [iframeKey, setIframeKey] = useState(Math.random());
  let [ticTransactionsKey, setTicTransactionsKey] = useState(0);
  const toast = useRef(null);

  const [ddChannellItem, setDdChannellItem] = useState({});
  const [ddChannellItems, setDdChannellItems] = useState([{}]);
  const [channellItem, setChannellItem] = useState({});
  const [channellItems, setChannellItems] = useState([{}]);

  useEffect(() => {
    async function fetchData() {
      console.log("#00##################BMVBMV#####################", props.channells)
      try {
        if (props?.channells) {
          console.log("#01##################BMVBMV#####################", props.channells)
          setChannellItems(props.channells)
          setChannellItem(props.channell)

          const dataDD = props.channells.map(({ text, id }) => ({ name: text, code: id }));
          setDdChannellItems(dataDD);
          setDdChannellItem(dataDD.find((item) => item.code === props.channell.id) || null);
        }
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
        ++i
        // if (i < 2) {
        console.log(ticDocId, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ticDocId@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        const ticDocService = new TicDocService();
        const data = await ticDocService.getTicDoc(ticDocId);
        if (ticDocId != -1) {
          setTicDoc(data);
        }
        // }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [ticDocId]);


  /********************************************************************** */
  const toggleIframeExpansion = () => {
    setExpandIframe(!expandIframe); // Toggle the state
  };

  const remountComponent = () => {
    console.log(props.ticEvent, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", ticDoc)
    setKey(prevKey => prevKey + 1); // Promenimo ključ kako bi se komponenta ponovo montirala
  };

  const handleClickInsideIframe = () => {
    if (iframeRef.current?.contentWindow) {
      const buttonInsideIframe = iframeRef.current.contentWindow.document.querySelector('#kupiBtn');
      if (buttonInsideIframe) {
        buttonInsideIframe.click();
      }
    }
  };

  const addMouseClickListener = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.addEventListener('click', handleMouseClick);
    }
  };

  useEffect(() => {
    const handleClick = (event) => {

      console.log('Kliknuto je na element unutar grid-a:', event.target);
      const iframes = document.querySelectorAll('.grid iframe');
      iframes.forEach((iframe) => {
        console.log('########### Iframe:', iframe);
      });
      const addMouseClickListener = () => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.addEventListener('click', handleMouseClick);
        }
      };
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  useEffect(() => {
    console.log('TicTransactionsL montirana ili osvežena sa key:', ticTransactionsKey);
    return () => {
      console.log('TicTransactionsL demontirana');
    }
  }, []);

  /****************** */
  const handleMouseClick = (event) => {

    const newDocId = iframeRef.current.contentWindow.document.querySelector('#docId').value;
    setTicDocId(newDocId);
    if (event.target.id == 'reserveBtn') {
      console.log(event.srcElement, 'Mouse clicked inside iframe:', event.target.id || "NESTO DRUGO",
        "======================= ##########################  DocId inside iframe:", iframeRef.current.contentWindow.document.querySelector('#docId').value)
      if (newDocId != ticDocId) {
        setTicDocId(newDocId);
      }
      setTicTransactionsKey(++ticTransactionsKey);
    }
    // addMouseClickListener();
  };


  useEffect(() => {
    const addMouseClickListener = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.addEventListener('click', handleMouseClick);
      }
    };

    addMouseClickListener();

    // return () => {
    //   removeMouseClickListener();
    // };
  }, [iframeRef.current]);

  /********************************************************* */

  let i = 0
  const handleCancelClick = () => {
    props.handleDialogClose(false);
  };

  const handleTaskComplete = (data) => {
    props.onTaskComplete(data);
  };

  const removeUserMenu = () => {
    if (iframeRef.current?.contentDocument) {
      const userMenuDiv = iframeRef.current.contentDocument.querySelector('.user-menu');
      if (userMenuDiv) {
        userMenuDiv.remove();
      } else {
        setTimeout(() => {
          removeUserMenu(); // Ponovo pokreni proveru i uklanjanje nakon 3 sekunde
        }, 1000); // Timeout od 3 sekunde
      }
    }
  };
  const removeCartSection = () => {
    for (let attempt = 0; attempt < 10; attempt++) {
      if (iframeRef.current?.contentDocument) {
        const cartSectionDiv = iframeRef.current.contentDocument.querySelector('.cart-section');
        if (cartSectionDiv) {
          cartSectionDiv.style.display = 'none'; // Hide the section instead of removing it
        } else {
          setTimeout(() => {
            removeCartSection(); // Retry hiding the section after a short delay
          }, 3000); // Timeout of 3 seconds to retry
        }
      }
    }
  };


  const handleIframeLoad = () => {
    removeUserMenu();
    removeCartSection();
  };
  /******************************************************************************** 
   * 
  ******************************************************************************** */

  const onInputChange = (e, type, name, a) => {
    let val = ''
    if (type === "options") {
      val = (e.target && e.target.value && e.target.value.code) || '';
      if (name == "channell") {
        setDdChannellItem(e.value);
        const foundItem = channellItems.find((item) => item.id === val);
        setChannellItem(foundItem || null);
        // } else {
        //     setDropdownItem(e.value);
      }

    } else {
      val = (e.target && e.target.value) || '';
    }
  };
  /******************************************************************************** 
   * 
  ******************************************************************************** */
  function HeaderBtn() {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1" >
          <Button label="Simuliraj klik" onClick={handleClickInsideIframe} icon="pi pi-cog" raised />
        </div>
        <div className="flex flex-wrap gap-1" raised>
          <Button label="Ponovo učitaj iframe" onClick={remountComponent} raised />
        </div>
      </div>
    );
  };

  /******************************************************************************** 
   * 
  ******************************************************************************** */
  const tab1HeaderTemplate = (options) => {
    return (
      <>
        <div className="fieldH flex align-items-center">
          <label htmlFor="myDropdown" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Izaberite_kanal}</label>
          <Dropdown id="channell"
            value={ddChannellItem}
            options={ddChannellItems}
            onChange={(e) => onInputChange(e, "options", 'channell')}
            optionLabel="name"
            placeholder="Select One"

          />
        </div>
        <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}> {/* onClick={options.onClick}>*/}
          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" className="mx-2" /> */}
          <Button icon={expandIframe ? "pi pi-angle-double-left" : "pi pi-angle-double-right"} onClick={toggleIframeExpansion} />
        </div>
      </>
    )
  };

  function NavigateTemplate({ activeIndex, setActiveIndex, totalTabs }) {
    return (
      <div className="flex justify-content-between mt-2">
        <Button
          label="Back"
          icon="pi pi-chevron-left"
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          className="p-button-text"
          disabled={activeIndex === 0}
        />
        <Button
          label="Next"
          icon="pi pi-chevron-right"
          iconPos="right"
          onClick={() => setActiveIndex(Math.min(totalTabs - 1, activeIndex + 1))}
          className="p-button-text"
          disabled={activeIndex === totalTabs - 1}
        />
      </div>
    );
  }

  return (
    <div key={key}>
      <div className="card">
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel header="Избор седишта">


            <div className="grid grid-nogutter">
              <div className={expandIframe ? "col-12" : "col-6"}> {/* IFRAME */}
                {props.eventTip == "SAL" && (
                  <div className="grid">
                    <div className="col-12">
                      <iframe key={iframeKey}
                        id="myIframe"
                        ref={iframeRef}
                        src={`https://82.117.213.106/sal/buy/card/event/${props.ticEvent.id}/${ticDoc?.id}?par1=BACKOFFICE&channel=${channellItem.id}`}
                        onLoad={handleIframeLoad}
                        title="Sal iframe"
                        width="100%"
                        height="600px"
                        frameBorder="0"
                      // scrolling="no"
                      ></iframe>
                    </div>
                  </div>
                )}
                {props.eventTip == "WEB" && (
                  <div className="grid">
                    <div className="col-12">
                      <div className="card">
                        <iframe
                          src={`https://dev.ticketline.rs/2023/08/22/sezonska-ulaznica-fk-napredak-2023-2024-vaucer/${props.ticEvent.id}/?parent=ADM`}
                          title="Sal iframe"
                          width="100%"
                          height="760px"
                          frameBorder="0"
                        // scrolling="no"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {!expandIframe && (
                <div className="col-6"> {/* TABELA*/}
                  <div className="grid">
                    <div className="col-12">
                      <div className="card">
                        <HeaderBtn />
                        <TicTransactionsL
                          key={ticTransactionsKey}
                          ticDoc={ticDoc}
                          propsParent={props}
                        />
                        <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </TabPanel>
          <TabPanel
            // headerTemplate={tab1HeaderTemplate}
            header="Header II"
            headerClassName="flex align-items-center"
          >
            <div className="grid grid-nogutter">
              <div className="col-6"> {/* TABELA */}
                {/****************************************************************************************************************** */}
                <div className="col-12">
                  <div className="card">
                    <TicTransactionsL
                      key={ticTransactionsKey}
                      ticDoc={ticDoc}
                      propsParent={props}
                    />
                    <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} />
                  </div>
                </div>
                {/****************************************************************************************************************** */}
              </div>
            </div>
          </TabPanel>
          <TabPanel
            // headerTemplate={tab1HeaderTemplate}
            header="Header III"
            headerClassName="flex align-items-center"
          >
            <b className="m-0">
              Element III
            </b>
            <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} />
          </TabPanel>
          <TabPanel
            headerTemplate={tab1HeaderTemplate}
            header="Header IV"
            headerClassName="flex align-items-center"
          >
            <b className="m-0">
              Element IV
            </b>
            <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}
