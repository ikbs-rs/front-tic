import React, { useState, useEffect, useRef } from "react";
import moment from 'moment'
import { Button } from "primereact/button";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import TicProdajaL from './ticProdajaL';
import { InputText } from 'primereact/inputtext';
import AA from './AA';

import { TabView, TabPanel } from 'primereact/tabview';
import { Avatar } from 'primereact/avatar';
import WebSalMap from './ticDocW';
import { Dropdown } from 'primereact/dropdown';
import { translations } from "../../configs/translations";
import { TicEventService } from '../../service/model/TicEventService';
import { TicEventattsService } from '../../service/model/TicEventattsService';
import DateFunction from '../../utilities/DateFunction';
import { TicDocService } from "../../service/model/TicDocService";
import { Toast } from 'primereact/toast';
import TicProdajaW from "./ticProdajaW";

export default function TicProdajaTab(props) {
    console.log(props, "******************@@@@@@@@@@@@@@@@@@@@@@@*******************************", props.ticDoc)
    const objEvent = "tic_event"
    const objDoc = "tic_doc"
    const codeAttInterval = '60'
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const userId = localStorage.getItem('userId') || -1
    const emptyTicEvent = EmptyEntities[objEvent]
    const emptyTicDoc = EmptyEntities[objDoc]

    const [key, setKey] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalTabs, setTotalTabs] = useState(5);
    const [inputValueI1, setInputValueI1] = useState("");
    const [inputValueI2, setInputValueI2] = useState("");
    const [triggerA2, setTriggerA2] = useState(false);

    const [inputForAA, setInputForAA] = useState(null);
    const [triggerAction, setTriggerAction] = useState(false);

    const [ticEvent, setTicEvent] = useState(emptyTicEvent);
    const [ticDoc, setTicDoc] = useState(emptyTicDoc);
    const [ticDocId, setTicDocId] = useState(null);

    let [numberChannell, setNumberChannell] = useState(0)
    let [channells, setChannells] = useState([{}])
    let [channell, setChannell] = useState(null)

    const [ddChannellItem, setDdChannellItem] = useState({});
    const [ddChannellItems, setDdChannellItems] = useState([{}]);
    const [channellItem, setChannellItem] = useState({});
    const [channellItems, setChannellItems] = useState([{}]);

    const [visible, setVisible] = useState(false);
    const [eventTip, setEventTip] = useState('');
    const [webMapVisible, setWebMapVisible] = useState(false);
    const [ticEventattss, setTicEventattss] = useState([]);
    const toast = useRef(null);

    let ii = 0

    /** KANALI KORISNIKA/EVENT ********************************************************************************** */
    const fachChannell = async (uId) => {
        try {
            const ticEventService = new TicEventService();
            console.log(uId, '** KANALI KORISNIKA/EVENT **************************** 00 **************************************************', userId)
            const data = await ticEventService.getTicEventchpermissL(uId, userId);
            console.log(data, '** KANALI KORISNIKA/EVENT ******************************************************************************', ticEvent?.id)
            if (data && data.length > 0) {
                return data[0];
            }
        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                if (ticEvent?.id) {

                    const ticEventService = new TicEventService();
                    const data = await ticEventService.getTicEventchpermissL(ticEvent?.id, userId);
                    if (data && data.length > 0) {
                        setNumberChannell(data.length);
                        setChannells(data);
                        const foundChannel = data.find((item) => item.id === channell?.id) || data[0]
                        setChannell(foundChannel);
                        // await createDoc(data[0])

                        setChannellItems(data)
                        setChannellItem(foundChannel)

                        const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                        const foundItem = dataDD.find((item) => item.code === channell?.id) || dataDD[0]
                        console.log(dataDD, "## 00 # BMV ################################", foundItem)
                        setDdChannellItems(dataDD);
                        setDdChannellItem(foundItem);
                    }
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [ticEvent?.id]);
    /** POSTAVKE ******************************************************************************* */

    useEffect(() => {
        async function fetchData() {
            try {
                if (ticEvent?.id) {
                    // setLoading(true);
                    const pTp = "-1";
                    const ticEventattsService = new TicEventattsService();
                    const data = await ticEventattsService.getLista(ticEvent.id, pTp);
                    setTicEventattss(data);
                    console.log("## 01 # BMV #############################", data)
                    // setLoading(false);
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }

        }
        fetchData();
    }, [ticEvent?.id]);

    /* ******************************************************************************* */
    /** KREIRANJE TIC_DOC ************************************************************************** */
    const fachDoc = async (uId) => {
        try {
            const ticDocService = new TicDocService();
            const data = await ticDocService.getTicDoc(uId);
            console.log(data, '** KANALI KORISNIKA/EVENT ******************************************************************************')
            if (data) {
                return data;
            }
        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }
    const createDoc = async (channel) => {
        try {
            const _ticDoc = { ...emptyTicDoc }
            const foundTicEventAtt = ticEventattss.find((item) => item.ctp === codeAttInterval || '00')
            const intervalProdaje = foundTicEventAtt?.value || 60
            _ticDoc.id = null
            _ticDoc.tm = DateFunction.currDatetime();
            _ticDoc.endtm = DateFunction.currDatetimePlusMinutes(60); // TO DO
            _ticDoc.timecreation = _ticDoc.tm
            _ticDoc.date = DateFunction.currDate();
            _ticDoc.year = DateFunction.currYear()
            _ticDoc.usr = 1;
            _ticDoc.docvr = 22;
            _ticDoc.usersys = localStorage.getItem('userId')
            _ticDoc.curr = 1;
            _ticDoc.currrate = 1;
            _ticDoc.storno = 0;
            _ticDoc.channel = channel?.id;
            _ticDoc.status = 0;
            _ticDoc.provera = 'PROVERA'

            const ticDocService = new TicDocService();
            const row = await ticDocService.postTicDoc(_ticDoc);
            _ticDoc.id = row.id
            _ticDoc.broj = row.id
            setTicDoc({ ..._ticDoc });
            return _ticDoc;
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };
    /**************************************************************************** */
    /**************************************************************************** */
    const tab1HeaderTemplate = (options) => {
        return (
            <>
                <div className="fieldH flex align-items-center"><b>
                    <label htmlFor="myDropdown" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Izaberite_kanal}</label>
                </b>
                    <Dropdown id="channell"
                        value={ddChannellItem}
                        options={ddChannellItems}
                        onChange={(e) => onInputChange(e, "options", 'channell')}
                        optionLabel="name"
                        placeholder="Select One"

                    />
                </div>
                <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                    <Button icon={expandIframe ? "pi pi-angle-double-left" : "pi pi-angle-double-right"} onClick={toggleIframeExpansion}
                        severity="warning"
                    />
                </div>
            </>
        )
    };

    const [expandIframe, setExpandIframe] = useState(false);

    const toggleIframeExpansion = () => {
        setExpandIframe(!expandIframe);
    };

    // const handleBBClick = () => {
    //     toggleIframeExpansion();
    // };
    /**************************************************************************** */
    /**************************************************************************** */

    const tabHeaderTemplate = (options) => {
        return (
            <>
                <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                    {/* <Button icon={expandIframe ? "pi pi-angle-double-left" : "pi pi-angle-double-right"} onClick={toggleIframeExpansion}
                severity="warning"
              /> */}
                    <div className="p-inputgroup flex-1">
                        <InputText id="cevent" value={ticEvent?.id} />
                    </div>
                    <div className="p-inputgroup flex-1">
                        <InputText id="cdoc" value={activeIndex} />
                    </div>
                    <div className="p-inputgroup flex-1">
                        <InputText id="cdoc" value={ticDoc?.id} />
                    </div>
                </div>
            </>
        )
    };
    /******************************************************************************** */

    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "channell") {
                setDdChannellItem(e.value);
                const foundItem = channellItems.find((item) => item.id === val);
                setChannellItem(foundItem || null);
                setChannell(foundItem || null);
                //   ++iframeKey
                //   setIframeKey(++iframeKey)
                // } else {
                //     setDropdownItem(e.value);
            }

        } else {
            val = (e.target && e.target.value) || '';
            let _ticEvent = { ...ticEvent };
            _ticEvent[`${name}`] = val;
            _ticEvent.cevent = val
            // if (name === `textx`) _ticEvent[`text`] = val;
            ticEvent(_ticEvent);
        }
    };
    /********************************************************************************/
    const handleEventProdaja = async (newObj) => {
        ++ii
        let localChannel = {}
        let timeout = null
        const _ticEvent = { ...emptyTicEvent }
        _ticEvent.id = newObj.id
        _ticEvent.code = newObj.code
        _ticEvent.text = newObj.textx
        setTicEvent(_ticEvent)
        setEventTip('SAL')

        console.log(channell, "#  00 #########################################################################")

        if (channell?.id) {
            localChannel = channell
        } else {
            localChannel = await fachChannell(newObj.id)
        }

        let OK = false
        if (ticDoc.id) {
            const _ticDoc = await fachDoc(ticDoc.id)
            if (_ticDoc.status != 0 || moment(_ticDoc.endtm, 'YYYYMMDDHHmmss').isBefore(moment())) {
                OK = true
            }
        } else {
            OK = true
        }
        if (OK) {
            const _ticDoc = await createDoc(channell || localChannel)
            setTicDoc(_ticDoc)
        }
        setChannell(localChannel)
        timeout = setTimeout(async () => {
            setActiveIndex(Math.min(totalTabs - 1, activeIndex + 1))
        }, 1000);
    }

    const handleDialogClose = (newObj) => {

    }
    const handleWebMapDialogClose = (newObj) => {
        setWebMapVisible(false);
    };

    const handleB1Click = () => {
        setInputForAA(inputValueI1);
        setTriggerAction(!triggerAction);  // Toggle akciju
    };

    /********************************************************************************/
    const NavigateTemplate = ({ activeIndex, setActiveIndex, totalTabs }) => {
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
            <Toast ref={toast} />
            <div className="card">
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Преглед догађаја">
                        <TicProdajaL
                            ticDoc={ticDoc}
                            propsParent={props}
                            handleEventProdaja={handleEventProdaja}
                        />
                        <div>
                            {/* <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} /> */}
                        </div>
                    </TabPanel>
                    <TabPanel
                        header="Избор седишта"
                        headerClassName="flex align-items-center"
                    >
                        <TicProdajaW
                            parameter={'inputTextValue'}
                            ticEvent={ticEvent}
                            handleDialogClose={handleDialogClose}
                            setVisible={setVisible}
                            dialog={true}
                            eventTip={eventTip}
                            ticDoc={ticDoc}
                            onTaskComplete={handleWebMapDialogClose}
                            numberChannell={numberChannell}
                            channells={channells}
                            channell={channell}
                            expandIframe={expandIframe}
                        />
                        <div>
                            {/* <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} /> */}
                        </div>
                    </TabPanel>
                    {/* <TabPanel header="Header III">
                        <div>
                            <AA updateInput={inputForAA} executeAction={triggerAction} />
                        </div>
                        <div>
                            <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} />
                        </div>
                    </TabPanel> */}
                    {/* <TabPanel header="Header IV">
                        <div>
                            <input
                                type="text"
                                value={inputValueI1}
                                onChange={(e) => setInputValueI1(e.target.value)}
                                placeholder="Unesite vrednost I1..."
                            />
                            <Button label="A1" onClick={() => console.log("Akcija dugmeta A1")}>A1</Button>
                            <Button label="B1" onClick={handleB1Click}>B1</Button>
                        </div>
                        <div>
                            <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} />
                        </div>
                    </TabPanel> */}
                    {/* <TabPanel
                        headerTemplate={tabHeaderTemplate}
                        header="Header V"
                        headerClassName="flex align-items-center"
                    >
                    </TabPanel> */}
                    <TabPanel
                        headerTemplate={tab1HeaderTemplate}
                        header="Header V"
                        headerClassName="flex align-items-center"
                    >
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
}
