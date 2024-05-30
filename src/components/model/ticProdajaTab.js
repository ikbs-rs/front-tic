import React, { useState, useEffect, useRef } from "react";
import moment from 'moment'
import { Button } from "primereact/button";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import TicProdajaL from './ticProdajaL';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from "primereact/inputswitch";
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
import { useLocation } from 'react-router-dom';

export default function TicProdajaTab(props) {
    const location = useLocation();
    const { channel } = location.state || {}; 
    console.log(props, "****BMB**************@@@@@@@@@@@@@@@@@@@@@@@*******************************", channel )
    const objEvent = "tic_event"
    const objDoc = "tic_doc"
    const codeAttInterval = '60'
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const userId = localStorage.getItem('userId') || -1
    const emptyTicEvent = EmptyEntities[objEvent]
    const emptyTicDoc = EmptyEntities[objDoc]
    emptyTicDoc.status = '0'

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

    let [paymenttps, setPaymenttps] = useState([{}])
    let [paymenttp, setPaymenttp] = useState(null)
    const [ddPaymenttpItem, setDdPaymenttpItem] = useState({});
    const [ddPaymenttpItems, setDdPaymenttpItems] = useState([{}]);


    const [visible, setVisible] = useState(false);
    const [eventTip, setEventTip] = useState('');
    const [webMapVisible, setWebMapVisible] = useState(false);
    const [ticEventattss, setTicEventattss] = useState([]);

    const [checkedRezervacija, setCheckedRezervacija] = useState(ticDoc?.status == "1" || false);
    const [checkedIsporuka, setCheckedIsporuka] = useState(props.ticDoc?.delivery == "1" || false);

    const toast = useRef(null);

    let ii = 0
    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocOld = await fachUserDoc()
                console.log(ticDocOld, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                if (ticDocOld?.id) {
                    if (ticDocOld?.status != 0 || moment(ticDocOld.endtm, 'YYYYMMDDHHmmss').isBefore(moment())) {
                    } else {
                        await setTicDoc(ticDocOld)
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchData()
    }, []);

    useEffect(() => {
        // console.log(ticDoc, 'BMBMBMBMBMBMBMBMBMBBMBMBMBMBMBMBMBMBM')
        setCheckedRezervacija(ticDoc?.status == "1")
    }, [ticDoc]);

    useEffect(() => {
        if (activeIndex == 1) {
            setCheckedRezervacija(ticDoc?.status == "1");
        }
    }, [activeIndex]);

    /** KANALI KORISNIKA/EVENT ********************************************************************************** */
    const fachPaymenttp = async (uId) => {
        try {
            const ticDocService = new TicDocService();
            // console.log(uId, '** KANALI KORISNIKA/EVENT **************************** 00 **************************************************', userId)
            const data = await ticDocService.getCmnPaymenttps();
            // console.log(data, '** KANALI KORISNIKA/EVENT ******************************************************************************', ticEvent?.id)
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

                const ticDocService = new TicDocService();
                const data = await ticDocService.getCmnPaymenttps();

                setPaymenttps(data);
                const foundChannel = data.find((item) => item.id === paymenttp?.id) || data[0]
                setPaymenttp(foundChannel);
                // await createDoc(data[0])

                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                const foundItem = dataDD.find((item) => item.code === paymenttp?.id) || dataDD[0]
                // console.log(dataDD, "## 00 # BMV ################################", foundItem)
                setDdPaymenttpItems(dataDD);
                setDdPaymenttpItem(foundItem);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    /** KANALI KORISNIKA/EVENT ********************************************************************************** */
    const fachChannell = async (uId) => {
        try {
            const ticEventService = new TicEventService();
            // console.log(uId, '** KANALI KORISNIKA/EVENT **************************** 00 **************************************************', userId)
            const data = await ticEventService.getTicEventchpermissL(uId, userId);
            // console.log(data, '** KANALI KORISNIKA/EVENT ******************************************************************************', ticEvent?.id)
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

                const ticEventService = new TicEventService();
                const data = await ticEventService.getTicChpermissL(userId);
                console.log(data, "--------------------------------------------------- Permiss ")
                if (data && data.length > 0) {
                    setNumberChannell(data.length);
                    setChannells(data);
                    const foundChannel = data.find((item) => item.id === channel?.id) || data[0]
                    setChannell(foundChannel);
                    // TO DO setovati usr.kanal
                    let user = JSON.parse(localStorage.getItem('user'))
                    
                    console.log(user, "--------------------------------------------------- user = ", localStorage.getItem('user'))
                    user.kanal = foundChannel.id
                    localStorage.setItem('user', JSON.stringify(user));

                    setChannellItems(data)
                    setChannellItem(foundChannel)

                    const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                    const foundItem = dataDD.find((item) => item.code === channell?.id) || dataDD[0]
                    // console.log(dataDD, "## 00 # BMV ################################", foundItem)
                    setDdChannellItems(dataDD);
                    setDdChannellItem(foundItem);
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
                    // console.log("## 01 # BMV #############################", data)
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
            // console.log(data, '** KANALI KORISNIKA/EVENT ******************************************************************************')
            if (data) {
                return data;
            }
        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }
    const fachUserDoc = async () => {
        try {
            const ticDocService = new TicDocService();
            const data = await ticDocService.getTicListaByItemId(
                `doc`, 'lista', `tic_docactivuser_v`,
                `usersys`, localStorage.getItem('userId')
            );
            // console.log(data, '** KANALI KORISNIKA/EVENT ******************************************************************************')
            if (data) {
                return data[0];
            }
        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }
    const createDoc = async (channel) => {
        try {
            // console.log("$ createDoc $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
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
    const tab0HeaderTemplate = (options) => {
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

            </>
        )
    };
    /**************************************************************************** */
    /**************************************************************************** */
    const tab1HeaderTemplate = (options) => {
        return (
            <>
                {activeIndex >= "1" ? (
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

                    </>

                ) : null
                }
                <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                    <b>
                        <label htmlFor="rezervacija" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Rezervacija}</label>
                    </b>
                    <InputSwitch id="rezervacija" checked={checkedRezervacija} onChange={(e) => handleChangeRezervacija(e.value)} />
                </div>
                <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                    <b>
                        <label htmlFor="isporuka" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Isporuka}</label>
                    </b>
                    <InputSwitch id="isporuka" checked={checkedIsporuka} onChange={(e) => handleChangeIsporuka(e.value)} />
                </div>
                <>
                    <div className="fieldH flex align-items-center"><b>
                        <label htmlFor="myDropdown" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Izaberite_kanal}</label>
                    </b>
                        <Dropdown id="paymenttp"
                            value={ddPaymenttpItem}
                            options={ddPaymenttpItems}
                            onChange={(e) => onInputChange(e, "options", 'paymenttp')}
                            optionLabel="name"
                            placeholder="Select One"

                        />
                    </div>

                </>
                <>
                    <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                        <Button label={translations[selectedLanguage].Cancel} icon={"pi pi-times"} onClick={toggleIframeExpansion}
                            severity="danger"
                        />
                    </div>
                </>

                {activeIndex >= "1" ? (
                    <>
                        <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                            <Button icon={expandIframe ? "pi pi-angle-double-left" : "pi pi-angle-double-right"} onClick={toggleIframeExpansion}
                                severity="warning"
                            />
                        </div>
                    </>

                ) : null
                }
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
                let user = JSON.parse(localStorage.getItem('user'))
                    
                console.log(user, "--------------------------------------------------- user = ", localStorage.getItem('user'))
                user.kanal = foundItem.id
                localStorage.setItem('user', JSON.stringify(user));                
                setChannellItem(foundItem || null);
                setChannell(foundItem || null);
                //   ++iframeKey
                //   setIframeKey(++iframeKey)
                // } else {
                //     setDropdownItem(e.value);
            } else if (name == "paymenttp") {
                setDdPaymenttpItem(e.value);
                const foundItem = paymenttps.find((item) => item.id === val);
                setPaymenttp(foundItem || null);

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

    const handleChangeIsporuka = async (value) => {
        setCheckedIsporuka(value);
        let _ticDoc = { ...ticDoc }
        value ? _ticDoc.status = `1` : _ticDoc.status = `0`
        _ticDoc.channel = ddChannellItem.code

        setTicDoc(_ticDoc)
        await handleUpdateIspTicDoc(_ticDoc)
    };

    const handleChangeRezervacija = async (value) => {
        const previousValue = checkedRezervacija;

        let _ticDoc = { ...ticDoc }
        const pStatus = _ticDoc.status
        value ? _ticDoc.status = `1` : _ticDoc.status = `0`
        _ticDoc.reservation = _ticDoc.status
        setCheckedRezervacija(value);
        setTicDoc(_ticDoc)
        await handleUpdateRezTicDoc(_ticDoc, pStatus, previousValue)
    };

    const handleUpdateIspTicDoc = async (newObj) => {
        try {
            // console.log(newObj, "handleUpdateTicDoc *****************************************************####################")
            const ticDocService = new TicDocService();
            await ticDocService.putTicDoc(newObj);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    }
    const handleUpdateRezTicDoc = async (newObj, pStatus, previousValue) => {
        try {
            // console.log(newObj, "handleUpdateTicDoc ** 00 ***************************************************####################")
            const ticDocService = new TicDocService();
            await ticDocService.obradaProdajeRezervacija(newObj, 'RZV');
        } catch (err) {
            // console.log(newObj, "ERRRRORRR ** 00 ***************************************************####################")
            const _ticDoc = { ...newObj }
            _ticDoc.status = pStatus
            setTicDoc(_ticDoc)
            setCheckedRezervacija(previousValue);

            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    }
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
        let ticDocOld = { ...emptyTicDoc }

        if (channell?.id) {
            localChannel = channell
        } else {
            localChannel = await fachChannell(newObj.id)
        }

        let OK = false
        if (ticDoc?.id) {
            const _ticDoc = await fachDoc(ticDoc.id)
            if (_ticDoc.status != 0 || moment(_ticDoc.endtm, 'YYYYMMDDHHmmss').isBefore(moment())) {
                OK = true
            }
        } else {
            ticDocOld = await fachUserDoc()
            if (ticDocOld?.id) {
                if (ticDocOld?.status != 0 || moment(ticDocOld.endtm, 'YYYYMMDDHHmmss').isBefore(moment())) {
                    OK = true
                } else {
                    await setTicDoc(ticDocOld)
                }
            } else {
                OK = true
            }
        }
        if (OK) {
            const _ticDoc = await createDoc(channell || localChannel)
            setTicDoc(_ticDoc)
        }
        setCheckedRezervacija(ticDoc.status == '1')
        setChannell(localChannel)
        timeout = setTimeout(async () => {
            setActiveIndex(Math.min(totalTabs - 1, activeIndex + 1))
            // console.log(ticDoc.status, "########################################################################################################", ticDoc.status == '1')
            setCheckedRezervacija(ticDoc.status == '1')
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
                    {/* <TabPanel
                        headerTemplate={tab0HeaderTemplate}
                        header="Header 0"
                        headerClassName="flex align-items-center"
                    >
                    </TabPanel> */}
                    <TabPanel header="Преглед догађаја">
                        <TicProdajaL
                            ticDoc={ticDoc}
                            propsParent={props}
                            handleEventProdaja={handleEventProdaja}
                        />
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
                            toggleIframeExpansion={toggleIframeExpansion}
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

                    <TabPanel
                        headerTemplate={tabHeaderTemplate}
                        header="Header V"
                        headerClassName="flex align-items-center"
                    >

                    </TabPanel>

                    {activeIndex >= "1" ? (
                        <TabPanel
                            headerTemplate={tab1HeaderTemplate}
                            header="Header V"
                            headerClassName="flex align-items-center"
                        >
                        </TabPanel>
                    ) : null}
                </TabView>
            </div>
        </div>
    );
}
