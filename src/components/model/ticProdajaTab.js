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
import { CmnParService } from "../../service/model/cmn/CmnParService";
import { Toast } from 'primereact/toast';
import TicProdajaW from "./ticProdajaW";
import { useLocation } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import TicDocpaymentL from './ticDocpaymentL';
import { Dialog } from 'primereact/dialog';

export default function TicProdajaTab(props) {
    const location = useLocation();
    const { channel } = location.state || {};
    //console.log(props, "5858585858585858585858585858585858585858585858585858585858585858585858585", channel, location)
    const objEvent = "tic_event"
    const objDoc = "tic_doc"
    const codeAttInterval = '60'
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const userId = localStorage.getItem('userId')
    const emptyTicEvent = EmptyEntities[objEvent]
    const emptyTicDoc = EmptyEntities[objDoc]
    emptyTicDoc.status = '0'

    const [key, setKey] = useState(0);
    const [activeIndex, setActiveIndex] = useState(props.activeIndex || 0);
    const [totalTabs, setTotalTabs] = useState(5);
    const [inputValueI1, setInputValueI1] = useState("");
    const [inputValueI2, setInputValueI2] = useState("");
    const [triggerA2, setTriggerA2] = useState(false);

    const [inputForAA, setInputForAA] = useState(null);
    const [triggerAction, setTriggerAction] = useState(false);

    const [ticEvent, setTicEvent] = useState(props.ticEvent || emptyTicEvent);
    const [ticDoc, setTicDoc] = useState(props.ticDoc || emptyTicDoc);
    const [ticDocId, setTicDocId] = useState(props.ticDoc?.id || null);

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
    // console.log(ticDoc, "--------------------------------------------------------------------------------------------------", ticDoc?.reservation == "1")
    const [checkedRezervacija, setCheckedRezervacija] = useState(ticDoc?.reservation == "1" || false);
    const [checkedIsporuka, setCheckedIsporuka] = useState(ticDoc?.delivery == "1" || false);
    const [checkedNaknade, setCheckedNaknade] = useState(ticDoc?.services == "1" || false);


    const iframeRef = useRef(null);
    let [ticTransactionsKey, setTicTransactionsKey] = useState(0);
    const [ticPaymentLVisible, setTicPaymentLVisible] = useState(false);
    const [ticPayment, setTicPayment] = useState(null);
    const [ticStampaLVisible, setTicStampaLVisible] = useState(false);
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [cmnPar, setCmnPar] = useState(null);
    const [paymenttpId, setPaymenttpId] = useState(null);



    const toast = useRef(null);

    const ticProdajaWRef = useRef();

    let ii = 0
    useEffect(() => {
        async function fetchData() {
            //console.log("0$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
            try {
                const ticDocService = new TicDocService();
                const data = await ticDocService.getParByUserId();
                //console.log(data, "0$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                setCmnPar(data[0]);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData()
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocOld = await fachUserDoc()
                //console.log(ticDocOld, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
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
        async function fetchData() {
            try {
                const ticDocOld = await fachUserDoc()
                //console.log(ticDocOld, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
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

    /** KANALI KORISNIKA/EVENT ********************************************************************************** */
    async function fetchPaymenttp() {
        try {
            const ticDocService = new TicDocService();
            const data = await ticDocService.getIdByItem('paymenttp', 'X');
            return data.id;
        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }
    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocService = new TicDocService();
                //console.log('** KANALI KORISNIKA/EVENT 55555555555555555555555555555555555555555555555555555**', userId)
                const data = await ticDocService.getIdByItem('paymenttp', 'X');
                //console.log(data.id, '** KANALI KORISNIKA/EVENT 5555555555555555555555555555555555555555555555555', ticEvent?.id)
                setPaymenttpId(data.id)
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

                const ticDocService = new TicDocService();
                const data = await ticDocService.getCmnPaymenttps();

                setPaymenttps(data);
                const foundChannel = data.find((item) => item.id === paymenttp?.id) || data[0]
                setPaymenttp(foundChannel);
                // await createDoc(data[0])

                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                const foundItem = dataDD.find((item) => item.code === ticDoc?.paymenttp || paymenttp?.id) || dataDD[0]
                // //console.log(dataDD, "## 00 # BMV ################################", foundItem)
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
            // //console.log(uId, '** KANALI KORISNIKA/EVENT **************************** 00 **************************************************', userId)
            const data = await ticEventService.getTicEventchpermissL(uId, userId);
            // //console.log(data, '** KANALI KORISNIKA/EVENT ******************************************************************************', ticEvent?.id)
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
                //console.log(data, "--------------------------------------------------- Permiss ")
                if (data && data.length > 0) {
                    setNumberChannell(data.length);
                    setChannells(data);
                    const foundChannel = data.find((item) => item.id === channel?.id) || data[0]
                    setChannell(foundChannel);
                    // TO DO setovati usr.kanal
                    let user = JSON.parse(localStorage.getItem('user'))

                    //console.log(user, "--------------------------------------------------- user = ", localStorage.getItem('user'))
                    user.kanal = foundChannel.id
                    localStorage.setItem('user', JSON.stringify(user));

                    setChannellItems(data)
                    setChannellItem(foundChannel)

                    const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                    const foundItem = dataDD.find((item) => item.code === channell?.id) || dataDD[0]
                    // //console.log(dataDD, "## 00 # BMV ################################", foundItem)
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
                    // //console.log("## 01 # BMV #############################", data)
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
            // //console.log(data, '** AKTIVNA TRANSAKCIJA ******************************************************************************')
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
            // //console.log(data, '** KANALI KORISNIKA/EVENT ******************************************************************************')
            if (data) {
                return data[0];
            }
        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }
    const fachPar = async (uId) => {
        try {

            const cmnParService = new CmnParService();
            const data = await cmnParService.getCmnPar(uId);
            //console.log(data, '** PARTNER 11111111111111111111111111111111111111111111111111111111111111111111')
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
            //console.log(channel, "$ createDoc $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
            const foundPaymenttp = ddPaymenttpItems.find((item) => item.code == paymenttpId)
            setDdPaymenttpItem(foundPaymenttp);

            const _ticDoc = { ...emptyTicDoc }
            const foundTicEventAtt = ticEventattss.find((item) => item.ctp === codeAttInterval || '00')
            const intervalProdaje = foundTicEventAtt?.value || 60
            _ticDoc.id = null
            _ticDoc.tm = DateFunction.currDatetime();
            _ticDoc.endtm = DateFunction.currDatetimePlusMinutes(60); // TO DO
            _ticDoc.timecreation = _ticDoc.tm
            _ticDoc.date = DateFunction.currDate();
            _ticDoc.year = DateFunction.currYear()
            _ticDoc.usr = cmnPar.id;
            _ticDoc.docvr = 22;
            _ticDoc.usersys = localStorage.getItem('userId')
            _ticDoc.curr = 1;
            _ticDoc.currrate = 1;
            _ticDoc.storno = 0;
            _ticDoc.channel = channel?.id;
            _ticDoc.status = 0;
            _ticDoc.provera = 'PROVERA'
            _ticDoc.paymenttp = paymenttpId
            _ticDoc.services = `1`
            _ticDoc.delivery = 0
            _ticDoc.reservation = 0

            const ticDocService = new TicDocService();
            const row = await ticDocService.postTicDoc(_ticDoc);
            _ticDoc.id = row.id
            _ticDoc.broj = row.id
            setTicDoc(_ticDoc);
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
    // const tab0HeaderTemplate = (options) => {
    //     return (

    //         <>
    //             <div className="fieldH flex align-items-center"><b>
    //                 <label htmlFor="myDropdown" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Izaberite_kanal}</label>
    //             </b>
    //                 <Dropdown id="channell"
    //                     value={ddChannellItem}
    //                     options={ddChannellItems}
    //                     onChange={(e) => onInputChange(e, "options", 'channell')}
    //                     optionLabel="name"
    //                     placeholder="Select One"

    //                 />
    //             </div>

    //         </>
    //     )
    // };
    /**************************************************************************** *
     *      HEDER DUGMICI 
     *
    /**************************************************************************** */
    const tab1HeaderTemplate = (options) => {
        return (
            <>
                <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                    <label htmlFor="rezervacija" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Rezervacija}</label>
                    <InputSwitch id="rezervacija" checked={checkedRezervacija} onChange={(e) => handleChangeRezervacija(e.value)} />
                </div>
                <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                    <label htmlFor="isporuka" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Isporuka}</label>
                    <InputSwitch id="isporuka" checked={checkedIsporuka} onChange={(e) => handleChangeIsporuka(e.value)} />
                </div>
                <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                    <label htmlFor="naknade" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Naknade}</label>
                    <InputSwitch id="naknade" checked={checkedNaknade} onChange={(e) => handleChangeNaknade(e.value)} />
                </div>
                {/* <>
                    <div className="fieldH flex align-items-center"><b>
                        <label htmlFor="myDropdown" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Izaberite_placanje}</label>
                    </b>
                        <Dropdown id="paymenttp"
                            value={ddPaymenttpItem}
                            options={ddPaymenttpItems}
                            onChange={(e) => onInputChange(e, "options", 'paymenttp')}
                            optionLabel="name"
                            placeholder="Select One"

                        />
                    </div>
                </> */}
                <>
                    {/* <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                        <Button label={translations[selectedLanguage].Cancel} icon={"pi pi-times"} onClick={toggleIframeExpansion}
                            severity="danger"
                        />
                    </div> */}
                    {/* {activeIndex >= "1" ? (
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
                    } */}

                    <div className="flex flex-wrap gap-1" raised>
                        <Button
                            // label={translations[selectedLanguage].Mapa}
                            icon="pi pi-map-marker"
                            style={{ width: '60px' }}
                            onClick={remountComponent} raised />
                    </div>                    
                    <div className="flex flex-wrap gap-1" >
                        <Button
                            // label={translations[selectedLanguage].KupacNext}
                            icon="pi pi-user-edit"
                            onClick={handleClickInsideIframe}
                            style={{ width: '60px' }}
                            // icon="pi pi-cog" 
                            raised />

                    </div>                  
                    <div className="flex flex-wrap gap-1" raised>
                        <Button
                            icon="pi pi-euro"
                            // label={translations[selectedLanguage].Placanje} 
                            onClick={handlePaymentClick} raised severity="warning"
                            style={{ width: '60px' }} />
                    </div>
                    <Button
                        // label={translations[selectedLanguage].Print}
                        icon="pi pi-print"
                        onClick={openStampa}
                        severity="warning"
                        raised
                        style={{ width: '60px' }}
                    />

                    <Button icon={expandIframe ? "pi pi-angle-double-left" : "pi pi-angle-double-right"} onClick={toggleIframeExpansion}
                                    severity="warning" raised style={{ width: '60px' }} 
                                />
                    <div>
                        <CountdownTimer targetDate={ticDoc?.endtm} />
                    </div>
                    <div className="flex flex-wrap gap-1" >
                        <Button
                            // label={translations[selectedLanguage].Cancel}
                            icon={"pi pi-sign-out"}
                            style={{ width: '60px' }}
                            onClick={toggleIframeExpansion} severity="danger" raised />
                    </div>                    
                </>

                {
                    activeIndex >= "1" ? (
                        <>
                              
                            <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>

                            </div>
                        </>

                    ) : null
                }

            </>
        )
    };

    /******************************************************************* *
     *      DUGMICI 
    /******************************************************************* */

    const handleClickInsideIframe = () => {
        if (ticProdajaWRef.current) {
            ticProdajaWRef.current.handleClickInsideIframe();
        }
    };

    const remountComponent = () => {
        if (ticProdajaWRef.current) {
            ticProdajaWRef.current.remountComponent();
        }
    };


    const remountStavke = () => {
        if (ticProdajaWRef.current) {
            ticProdajaWRef.current.remountStavke();
        }
    };

    const handlePaymentClick = async (e) => {
        try {
            setTicPaymentLVisible(true);
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch cmnPar data",
                life: 3000,
            });
        }
    };

    const handleTicPaymentLDialogClose = (newObj) => {
        setTicPayment(newObj);
        setTicPaymentLVisible(false)
    };

    /****************************************************************************************** */
    const openStampa = () => {
        setTicStampaDialog();
    };

    const setTicStampaDialog = () => {
        setShowMyComponent(true);
        setTicStampaLVisible(true);
    };

    /****************************************************************************************** */
    /******************************************************************* *
     *      DUGMICI 
    /******************************************************************* */
    useEffect(() => {
        const handleClick = (event) => {

            //console.log('Kliknuto je na element unutar grid-a:', event.target);
            const iframes = document.querySelectorAll('.grid iframe');
            iframes.forEach((iframe) => {
                //console.log('########### Iframe:', iframe);
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
        //console.log('TicTransactionsL montirana ili osvežena sa key:', ticTransactionsKey);
        return () => {
            //console.log('TicTransactionsL demontirana');
        }
    }, []);

    /****************** */
    const handleMouseClick = (event) => {

        const newDocId = iframeRef.current.contentWindow.document.querySelector('#docId')?.value;
        setTicDocId(newDocId);
        if (event.target.id == 'reserveBtn') {
            //console.log(event.srcElement, 'Mouse clicked inside iframe:', event.target.id || "NESTO DRUGO",  "======================= ##########################  DocId inside iframe:", iframeRef.current.contentWindow.document.querySelector('#docId').value)
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

    }, [iframeRef.current]);
    /******************************************************************* */
    /******************************************************************* */
    const [expandIframe, setExpandIframe] = useState(false);

    const toggleIframeExpansion = () => {
        setExpandIframe(!expandIframe);
    };

    // const handleBBClick = () => {
    //     toggleIframeExpansion();
    // };
    /**************************************************************************** */
    /**************************************************************************** */

    // const tabHeaderTemplate = (options) => {
    //     return (
    //         <>
    //             <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
    //                 {/* <Button icon={expandIframe ? "pi pi-angle-double-left" : "pi pi-angle-double-right"} onClick={toggleIframeExpansion}
    //                 severity="warning"
    //               /> */}
    //                 <div className="p-inputgroup flex-1">
    //                     <InputText id="cevent" value={ticEvent?.id} />
    //                 </div>
    //                 <div className="p-inputgroup flex-1">
    //                     <InputText id="cdoc" value={activeIndex} />
    //                 </div>
    //                 <div className="p-inputgroup flex-1">
    //                     <InputText id="cdoc" value={ticDoc?.id} />
    //                 </div>
    //             </div>
    //         </>
    //     )
    // };
    /******************************************************************************** */

    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "channell") {
                setDdChannellItem(e.value);
                const foundItem = channellItems.find((item) => item.id === val);
                let user = JSON.parse(localStorage.getItem('user'))

                //console.log(user, "--------------------------------------------------- user = ", localStorage.getItem('user'))
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

    const handleChangeNaknade = async (value) => {
        const previousValue = checkedNaknade;
        setCheckedNaknade(value);

        let _ticDoc = { ...ticDoc }
        value ? _ticDoc.services = `1` : _ticDoc.services = `0`
        // _ticDoc.delivery? _ticDoc.delivery = 1 : _ticDoc.delivery = 0
        // _ticDoc.reservation? _ticDoc.reservation = 1 : _ticDoc.reservation = 0
        setTicDoc(_ticDoc)
        console.log(previousValue, "333333333333333333333333333333333333333333333333333333000", value)
        await handleUpdateNakTicDoc(_ticDoc, previousValue)
        remountStavke();
    };

    const handleChangeRezervacija = async (value) => {
        const previousValue = checkedRezervacija;
        setCheckedRezervacija(value);

        let _ticDoc = { ...ticDoc }
        value ? _ticDoc.reservation = `1` : _ticDoc.reservation = `0`
        // _ticDoc.delivery? _ticDoc.delivery = 1 : _ticDoc.delivery = 0
        // _ticDoc.services? _ticDoc.services = 1 : _ticDoc.services = 0
        setTicDoc(_ticDoc)
        console.log(previousValue, "333333333333333333333333333333333333333333333333333333000", value)
        await handleUpdateRezTicDoc(_ticDoc, previousValue)
        remountStavke();
    };

    const handleChangeIsporuka = async (value) => {

        const previousValue = checkedIsporuka;
        setCheckedIsporuka(value);

        let _ticDoc = { ...ticDoc }
        console.log(_ticDoc.reservation, "111333333333333333333333333333333333333333333333333333333111", _ticDoc.services)
        value ? _ticDoc.delivery = `1` : _ticDoc.delivery = `0`
        // _ticDoc.services ? _ticDoc.services = 1 : _ticDoc.services = 0
        // _ticDoc.reservation ? _ticDoc.reservation = 1 : _ticDoc.reservation = 0
        setTicDoc(_ticDoc)
        console.log(previousValue, "333333333333333333333333333333333333333333333333333333111", value)
        await handleUpdateIspTicDoc(_ticDoc, previousValue)
        remountStavke();
    };

    const handleUpdateIspTicDoc = async (newObj, previousValue) => {
        const _ticDoc = newObj
        try {
            console.log(newObj, "handleUpdateTicDoc 1115555555555555555555555555555555555555555555555555555555555", previousValue)
            const ticDocService = new TicDocService();
            await ticDocService.putTicDoc(newObj);
        } catch (err) {
            _ticDoc.delivery = previousValue
            setTicDoc(_ticDoc)
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    }
    const handleUpdateRezTicDoc = async (newObj, previousValue) => {
        const _ticDoc = newObj
        try {
            console.log(newObj, "handleUpdateTicDoc 0005555555555555555555555555555555555555555555555555555555555", previousValue)
            const ticDocService = new TicDocService();
            await ticDocService.putTicDoc(newObj);
        } catch (err) {
            _ticDoc.reservation = previousValue
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

    const handleUpdateNakTicDoc = async (newObj, previousValue) => {
        const _ticDoc = newObj
        try {
            console.log(newObj, "handleUpdateTicDoc 0005555555555555555555555555555555555555555555555555555555555", previousValue)
            const ticDocService = new TicDocService();
            await ticDocService.putTicDoc(newObj);
        } catch (err) {
            _ticDoc.services = previousValue
            setTicDoc(_ticDoc)
            setCheckedNaknade(previousValue);

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
        const _channel = channell || localChannel
        let OK = false
        if (ticDoc?.id) {
            const _ticDoc = await fachDoc(ticDoc.id)
            const _cmnPar = await fachPar(_ticDoc.usr)
            _ticDoc.cpar = _cmnPar?.code
            _ticDoc.npar = _cmnPar?.text
            await setTicDoc(_ticDoc)
            //console.log(_channel.id, _ticDoc.channel, "$ createDoc $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$_")
            if (_ticDoc.status != 0 || moment(_ticDoc.endtm, 'YYYYMMDDHHmmss').isBefore(moment()) || _ticDoc.channel != _channel.id) {
                OK = true
            }
        } else {
            //console.log(_channel.id, ticDocOld.channel, "$ createDoc $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$OLD")
            ticDocOld = await fachUserDoc()
            if (ticDocOld?.id) {
                if (ticDocOld?.status != 0 || moment(ticDocOld.endtm, 'YYYYMMDDHHmmss').isBefore(moment()) || ticDocOld.channel != _channel.id) {
                    OK = true
                } else {
                    const _cmnPar = await fachPar(ticDocOld.usr)
                    ticDocOld.cpar = _cmnPar.code
                    ticDocOld.npar = _cmnPar.text
                    await setTicDoc(ticDocOld)
                }
            } else {
                OK = true
            }
        }

        if (OK) {
            const _ticDoc = await createDoc(_channel)
            const _cmnPar = await fachPar(_ticDoc.usr)
            _ticDoc.cpar = _cmnPar.code
            _ticDoc.npar = _cmnPar.text
            await setTicDoc(_ticDoc)
        }
        setCheckedRezervacija(ticDoc.reservation == '1')
        setCheckedIsporuka(ticDoc.delivery == '1')
        setCheckedNaknade(ticDoc.services == '1')
        setChannell(localChannel)
        timeout = setTimeout(async () => {
            setActiveIndex(Math.min(totalTabs - 1, activeIndex + 1))
            // //console.log(ticDoc.status, "########################################################################################################", ticDoc.status == '1')
            setCheckedRezervacija(ticDoc.reservation == '1')
            setCheckedIsporuka(ticDoc.delivery == '1')
            setCheckedNaknade(ticDoc.services == '1')
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
                    <TabPanel header="Догађаји">
                        <TicProdajaL
                            ticDoc={ticDoc}
                            propsParent={props}
                            handleEventProdaja={handleEventProdaja}
                        />
                    </TabPanel>
                    <TabPanel
                        header="Selekcija"
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
                            ref={ticProdajaWRef}
                        />
                        <div>
                            {/* <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} /> */}
                        </div>
                    </TabPanel>

                    {activeIndex >= "1" ? (
                        <TabPanel
                            headerTemplate={tab1HeaderTemplate}
                            // header="Header V"
                            headerClassName="flex align-items-center"
                        >
                        </TabPanel>
                    ) : null}
                </TabView>
                <div>
                    <tabHeaderTemplat />
                </div>
            </div>
            <Dialog
                header={translations[selectedLanguage].PaymentList}
                visible={ticPaymentLVisible}
                style={{ width: '55%' }}
                onHide={() => {
                    setTicPaymentLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticPaymentLVisible && (
                    <TicDocpaymentL
                        parameter={"inputTextValue"}
                        ticDoc={ticDoc}
                        cmnPar={cmnPar}
                        handleTicPaymentLDialogClose={handleTicPaymentLDialogClose}
                        setTicPaymentLVisible={setTicPaymentLVisible}
                        dialog={true}
                        lookUp={true}
                    />
                )}
            </Dialog>
        </div>
    );
}
