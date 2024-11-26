import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import MoneyIcon from '@mui/icons-material/Money';
import { Button } from "primereact/button";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import TicProdajaL from './ticProdajaL';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from "primereact/inputswitch";
import AA from './AA';
import { Tooltip } from 'primereact/tooltip';

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
import TicDocsprintgrpL from './ticDocsprintgrpL'
import { SelectButton } from 'primereact/selectbutton';
import TicDocpayment from './ticDocpayment';
import TicProdajaPlacanje from "./ticProdajaPlacanje";
import { TicDocpaymentService } from "../../service/model/TicDocpaymentService";

export default function TicProdajaTab(props) {
    const location = useLocation();
    const { channel } = location.state || {};
    const objEvent = "tic_event"
    const objDoc = "tic_doc"
    const codeAttInterval = '60'
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const userId = localStorage.getItem('userId')
    const emptyTicEvent = EmptyEntities[objEvent]
    const emptyTicDoc = EmptyEntities[objDoc]
    emptyTicDoc.status = '0'

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

    const [ticDocsprintgrpgrpLVisible, setTicDocsprintgrpgrpLVisible] = useState(false)

    const iframeRef = useRef(null);
    const deliveryRef = useRef(null);
    let [ticTransactionsKey, setTicTransactionsKey] = useState(0);
    const [ticPaymentLVisible, setTicPaymentLVisible] = useState(false);
    const [ticPayment, setTicPayment] = useState(null);
    // const [ticStampaLVisible, setTicStampaLVisible] = useState(false);
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [cmnPar, setCmnPar] = useState(null);
    const [paymenttpId, setPaymenttpId] = useState(null);
    const [akcija, setAkcija] = useState(null);

    /*********************************************************************************************** */
    const objDocPayment = "tic_docpayment";
    const emptyTicDocpayment = EmptyEntities[objDocPayment]
    const [ticDocpayment, setTicDocpayment] = useState(emptyTicDocpayment);
    const [docpaymentTip, setDocpaymentTip] = useState('');
    const [paymentTip, setPaymentTip] = useState('-1')
    const [visiblePT, setVisiblePT] = useState(false);
    /*********************************************************************************************** */
    /*********************************************************************************************** */
    const placanjeRef = useRef();
    const [zbirzbirniiznos, setZbirniiznos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [paying, setPaying] = useState(0);
    useEffect(() => {
   
            // console.log(ticDoc, "##################################################################################################################");
            // Logika za rukovanje plaćanjem

    }, [paying]);
    
    /********************************************************************************/
    const handleTabZaglavlje = (_ticDoc) => {
        // console.log(_ticDoc, "##########################################################################################handleTabZaglavlje########")
        setTicDoc(_ticDoc)
        setPaying(prev => prev + 1);
    }
    const handlePayTicDoc = async () => {
        try {
            // console.log("PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_")
            const userId = localStorage.getItem('userId')
            setSubmitted(true);
            const ticDocService = new TicDocService();
            const dataDoc = await ticDocService.getTicDocP(props.ticDoc.id);
            // const dataDoc = await ticDocService.getTicDoc(props.ticDoc.id);
            setTicDoc(dataDoc)
            const _ticDocpayment = { ...ticDocpayment }
            _ticDocpayment.doc = props.ticDoc.id;
            _ticDocpayment.paymenttp = dataDoc.paymenttp;
            _ticDocpayment.total = placanjeRef.current.zaUplatu;
            _ticDocpayment.usr = userId
            _ticDocpayment.tm = DateFunction.currDatetime()
            const ticDocpaymentService = new TicDocpaymentService();

            if (placanjeRef.current) {
                if (placanjeRef.current.izborMesovito) {
                    // console.log("00.1 PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_")
                    if (placanjeRef.current.preostalo > 0) {
                        toast.current.show({
                            severity: "error",
                            summary: "Greška",
                            detail: "Mora biti ceo iznos za uplatu!",
                            life: 3000,
                        });
                        return;  // Prekinuti izvršenje funkcije
                    }
                    const newArray = []
                    if (placanjeRef.current.kes > 0) {
                        const kesPayment = { ..._ticDocpayment };
                        kesPayment.amount = placanjeRef.current.kes
                        kesPayment.paymenttp = placanjeRef.current.kesTp
                        newArray.push(kesPayment)
                    }
                    if (placanjeRef.current.kartica > 0) {
                        const karticaPayment = { ..._ticDocpayment };
                        karticaPayment.amount = placanjeRef.current.kartica
                        karticaPayment.paymenttp = placanjeRef.current.karticaTp
                        newArray.push(karticaPayment)
                    }
                    if (placanjeRef.current.cek > 0) {
                        const cekPayment = { ..._ticDocpayment };
                        cekPayment.amount = placanjeRef.current.cek
                        cekPayment.paymenttp = placanjeRef.current.cekTp
                        newArray.push(cekPayment)
                    }
                    const data = await ticDocpaymentService.postTicDocpayments(newArray);
                } else {
                    _ticDocpayment.amount = placanjeRef.current.zaUplatu
                    // console.log("01 PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_", _ticDocpayment)
                    const data = await ticDocpaymentService.postTicDocpayment(_ticDocpayment);
                }

                // const dataIznos = await ticDocService.getDocZbirniiznos(props.ticDoc?.id);
                // const _ticDocpayment = {...ticDocpayment}
                // ticDocpayment.amount = dataIznos.iznos
                // setTicDocpayment({..._ticDocpayment})

                // ticDocpayment.id = data
                const _ticDoc = { ...ticDoc }
                _ticDoc.status = 2
                _ticDoc.statuspayment = 1
                setTicDoc(_ticDoc)
                // console.log(_ticDoc, "###############################################################################################")
                setPaying(prev => prev + 1);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Placanje izvrseno', life: 2000 });
                // setUidKey(++uidKey)
            }
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocpayment ",
                detail: `${err}`,
                life: 1000,
            });
        }
    }
    /*********************************************************************************************** */
    /*********************************************************************************************** */


    const setTicDocpaymentDialog = (ticDocpayment) => {
        setVisiblePT(true)
        setDocpaymentTip("CREATE")
        setTicDocpayment({ ...ticDocpayment });
    }
    const openCach = () => {
        setPaymentTip('1')
        setTicDocpaymentDialog(emptyTicDocpayment);
    };

    const openCard = () => {
        setPaymentTip('2')
        setTicDocpaymentDialog(emptyTicDocpayment);
    };

    const openCek = () => {
        setPaymentTip('7')
        setTicDocpaymentDialog(emptyTicDocpayment);
    };
    const handleDialogClosePT = (newObj) => {
        const localObj = { newObj };
    }
    /*********************************************************************************************** */
    const [value, setValue] = useState(null);
    const items = [
        { icon: "pi pi-map-marker", name: 'Option 1', value: 1 },
        { icon: "pi pi-user-edit", name: 'Option 2', value: 2 },
        { icon: "pi pi-euro", name: 'Option 3', value: 3 },
        { icon: "pi pi-print", name: 'Option 4', value: 4 }
    ];
    function handleOption(value) {
        if (value == '1') {
            remountComponent()
        }
        if (value == '2') {
            handleClickInsideIframe()
        }
        if (value == '3') {
            handlePaymentClick()
        }
        if (value == '4') {
            openStampa()
        }
        setValue(value)
    }
    const justifyTemplate = (option) => {
        return <i className={option.icon}></i>;
    }
    /************************************************************************************************ */
    const toast = useRef(null);

    const ticProdajaWRef = useRef();

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocService = new TicDocService();
                const data = await ticDocService.getDocZbirniiznosP(props.ticDoc?.id);

                setZbirniiznos(data.iznos)
                const _ticDocpayment = { ...ticDocpayment }
                _ticDocpayment.amount = data.iznos
                setTicDocpayment({ ..._ticDocpayment })
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [props.ticDoc?.id]);

    let ii = 0
    useEffect(() => {
        async function fetchData() {
            //console.log("0$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
            try {
                const ticDocService = new TicDocService();
                const data = await ticDocService.getParByUserIdP();
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
                const data = await ticDocService.getCmnPaymenttpsP('cmn_paymenttp_p');

                setPaymenttps(data);
                const foundChannel = data.find((item) => item.id === paymenttp?.id) || data[0]
                setPaymenttp(foundChannel);
                // await createDoc(data[0])

                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                const foundItem = dataDD.find((item) => item.code === ticDoc?.paymenttp || paymenttp?.id) || dataDD[0]
                setDdPaymenttpItems(dataDD);
                setDdPaymenttpItem(foundItem);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const fachChannell = async (uId) => {
        try {
            const ticEventService = new TicEventService();
            const data = await ticEventService.getTicEventchpermissL(uId, userId);
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
                const data = await ticEventService.getTicChpermissLP(userId);
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
                    const data = await ticEventattsService.getListaP(ticEvent.id, pTp);
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
            const data = await ticDocService.getTicDocP(uId);
            // const data = await ticDocService.getTicDoc(uId);
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
            // const data = await ticDocService.getTicListaByItemId(
            //     `doc`, 'lista', `tic_docactivuser_v`,
            //     `usersys`, localStorage.getItem('userId')
            // );
            const data = await ticDocService.getTicListaByItemIdP(
                `tic_docactivuser_v`,
                `usersys`, localStorage.getItem('userId')
            );
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
            const data = await cmnParService.getCmnParP(uId);
            //console.log(data, '** PARTNER 11111111111111111111111111111111111111111111111111111111111111111111')
            if (data) {
                return data;
            }

        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }
    const createDoc = async (channel, event) => {
        try {
            // console.log(event?.id, channel?.id, "** KANALI KORISNIKA/EVENT *  createDoc *****************************************************************************")
            const ticEventattsService = new TicEventattsService()
            const eventAtt = await ticEventattsService.getEventAttsDD(event?.id, channel?.id, '01.13.');
            // console.log(eventAtt, "$11  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
            const foundPaymenttp = ddPaymenttpItems.find((item) => item.code == paymenttpId)
            setDdPaymenttpItem(foundPaymenttp);

            const _ticDoc = { ...emptyTicDoc }
            const intervalProdaje = eventAtt?.text || 60
            _ticDoc.id = null
            _ticDoc.tm = DateFunction.currDatetime();
            _ticDoc.endtm = DateFunction.currDatetimePlusMinutes(intervalProdaje); // TO DO
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
            _ticDoc.paymenttp = null //paymenttpId
            _ticDoc.services = `1`
            _ticDoc.delivery = 0
            _ticDoc.reservation = 0

            const ticDocService = new TicDocService();
            const row = await ticDocService.postTicDoc(_ticDoc);
            _ticDoc.id = row.id
            _ticDoc.broj = row.broj
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
    const Tab1HeaderTemplate = (options) => {
        return (
            <>

                <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                    <label htmlFor="rezervacija" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Rezervacija}</label>
                    <InputSwitch id="rezervacija" checked={checkedRezervacija} onChange={(e) => handleChangeRezervacija(e.value)}
                        tooltip={translations[selectedLanguage].RezervisiKarteKupca}
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        disabled={ticDoc.statuspayment == 1}
                    />
                </div>
                <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                    <label htmlFor="isporuka" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Isporuka}</label>
                    <InputSwitch id="isporuka" checked={checkedIsporuka} onChange={(e) => handleChangeIsporuka(e.value)}
                        ref={deliveryRef}
                        tooltip={translations[selectedLanguage].OmoguciIsporukuKupcu}
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        disabled={ticDoc.statuspayment == 1}
                    />
                </div>
                <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                    <label htmlFor="naknade" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Naknade}</label>
                    <InputSwitch id="naknade" checked={checkedNaknade} onChange={(e) => handleChangeNaknade(e.value)}
                        tooltip={translations[selectedLanguage].OmoguciNaknada}
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        disabled={ticDoc.statuspayment == 1}
                    />
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
                    {/* <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                        <SelectButton
                            value={value}
                            onChange={(e) => handleOption(e.value)}
                            // optionLabel="name" 
                            options={items}
                            itemTemplate={justifyTemplate}
                            className="select-button-warning"
                        />
                    </div> */}
                    <div className="flex flex-wrap gap-1" raised>
                        <Button
                            // label={translations[selectedLanguage].Mapa}
                            icon="pi pi-map-marker"
                            style={{ width: '40px' }}
                            onClick={remountComponent} raised
                            tooltip={translations[selectedLanguage].SelektujSedsteSamape}
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                            disabled={ticDoc.statuspayment == 1}
                        />
                    </div>
                    {/* <div className="flex flex-wrap gap-1" >
                        <Button
                            // label={translations[selectedLanguage].KupacNext}
                            icon="pi pi-user-edit"
                            onClick={handleClickInsideIframe}
                            style={{ width: '40px' }}
                            // icon="pi pi-cog" 
                            raised
                            tooltip={translations[selectedLanguage].PopuniPodatkeKupcaPopusta}
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        />

                    </div> */}
                    <div className="flex flex-wrap gap-1" raised>
                        <Button
                            icon="pi pi-euro"
                            // label={translations[selectedLanguage].Placanje} 
                            onClick={handlePaymentClick} raised
                            severity="secondary"
                            style={{ width: '40px' }}
                            tooltip={translations[selectedLanguage].OstalaPlacanja}
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                            disabled={ticDoc.statuspayment == 1}
                        />
                    </div>
                    {/* <div className="flex flex-wrap gap-1" raised>
                        <Button
                            icon="pi pi-wallet"
                            // label={translations[selectedLanguage].Placanje} 
                            onClick={openCach} raised
                            severity="secondary"
                            style={{ width: '40px' }}
                            tooltip={translations[selectedLanguage].PlacanjeKesom}
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        />
                    </div>
                    <div className="flex flex-wrap gap-1" raised>
                        <Button
                            icon="pi pi-credit-card"
                            // label={translations[selectedLanguage].Placanje} 
                            onClick={openCard} raised
                            severity="secondary"
                            style={{ width: '40px' }}
                            tooltip={translations[selectedLanguage].PlacanjeKarticom}
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        />
                    </div>
                    <div className="flex flex-wrap gap-1" raised>
                        <Button
                            icon="pi pi-book"
                            // label={translations[selectedLanguage].Placanje} 
                            onClick={openCek} raised
                            severity="secondary"
                            style={{ width: '40px' }}
                            tooltip={translations[selectedLanguage].PlacanjeCekovima}
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        />
                    </div> */}
                    <Button
                        // label={translations[selectedLanguage].Print}
                        icon="pi pi-print"
                        onClick={openStampa}
                        severity="warning"
                        raised
                        style={{ width: '40px' }}
                        tooltip={translations[selectedLanguage].StampaKarti}
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    />

                    <Button icon={expandIframe ? "pi pi-angle-double-left" : "pi pi-angle-double-right"} onClick={toggleIframeExpansion}
                        severity="warning" raised style={{ width: '40px' }}
                        tooltip={translations[selectedLanguage].ProsiriMapu}
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        disabled={ticDoc.statuspayment == 1}
                    />
                    {/* <Button icon={expandStavke ? "pi pi-angle-double-right" : "pi pi-angle-double-left"} onClick={toggleStavkeExpansion}
                        severity="warning" raised style={{ width: '40px' }}
                    /> */}
                    <div className="flex flex-wrap gap-1" >
                        <Button
                            // label={translations[selectedLanguage].Cancel}
                            icon={"pi pi-sign-out"}
                            style={{ width: '40px' }}
                            onClick={handleCancelSales} severity="danger" raised
                            tooltip={translations[selectedLanguage].OdustaniOdKupovine}
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                            disabled={ticDoc.statuspayment == 1}
                        />
                    </div>
                    <div>
                        <CountdownTimer 
                        targetDate={ticDoc?.endtm} 
                        handleSetActiveIndex={handleSetActiveIndex}
                        />
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
        setTicDocsprintgrpgrpLVisible(true);
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
    const [expandStavke, setExpandStavke] = useState(false);

    const toggleIframeExpansion = () => {
        setExpandIframe(!expandIframe);
    };


    const handleDelivery = () => {
        const newValue = !checkedIsporuka; // Promenite trenutnu vrednost
        setCheckedIsporuka(newValue); // Ažurirajte stanje
        handleChangeIsporuka(newValue); // Ručno pokrenite onChange funkciju
    };

    const handleRezervaciju = (checkedRez) => {
        const newValue = checkedRez; // Promenite trenutnu vrednost
        setCheckedRezervacija(newValue); // Ažurirajte stanje
        handleChangeRezervacija(newValue); // Ručno pokrenite onChange funkciju
    };

    const toggleStavkeExpansion = () => {
        setExpandStavke(!expandStavke);
    };
    // const handleBBClick = () => {
    //     toggleIframeExpansion();
    // };
    /**************************************************************************** */
    /**************************************************************************** */

    // const TabHeaderTemplate = (options) => {
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
        // console.log(previousValue, "333333333333333333333333333333333333333333333333333333000", value)
        await handleUpdateNakTicDoc(_ticDoc, previousValue)
        remountStavke();
    };

    const handleCancelSales = async () => {
        const previousValue = ticDoc.status;

        let _ticDoc = { ...ticDoc }
        _ticDoc.status = 4

        setTicDoc(_ticDoc)
        // console.log(previousValue, "3333333333333333333334444444444444333333333333333333333333333333333000", value)
        await handleUpdateCancelTicDoc(_ticDoc, previousValue)
        remountStavke();
        setActiveIndex(0)
    };

    const handleChangeRezervacija = async (value) => {
        const previousValue = checkedRezervacija;
        setCheckedRezervacija(value);

        let _ticDoc = { ...ticDoc }
        value ? _ticDoc.reservation = `1` : _ticDoc.reservation = `0`
        _ticDoc.status = 1
        // _ticDoc.services? _ticDoc.services = 1 : _ticDoc.services = 0
        setTicDoc(_ticDoc)
        // console.log(previousValue, "333333333333333333333333333333333333333333333333333333000", value)
        await handleUpdateRezTicDoc(_ticDoc, previousValue)
        remountStavke();
    };

    const handleChangeIsporuka = async (value) => {

        const previousValue = checkedIsporuka;
        setCheckedIsporuka(value);

        let _ticDoc = { ...ticDoc }
        // console.log(_ticDoc.reservation, "111333333333333333333333333333333333333333333333333333333111", _ticDoc.services)
        value ? _ticDoc.delivery = `1` : _ticDoc.delivery = `0`
        // _ticDoc.services ? _ticDoc.services = 1 : _ticDoc.services = 0
        // _ticDoc.reservation ? _ticDoc.reservation = 1 : _ticDoc.reservation = 0
        setTicDoc(_ticDoc)
        // console.log(previousValue, "333333333333333333333333333333333333333333333333333333111", value)
        await handleUpdateIspTicDoc(_ticDoc, previousValue)
        remountStavke();
    };

    const handleUpdateIspTicDoc = async (newObj, previousValue) => {
        const _ticDoc = newObj
        try {
            // console.log(newObj, "handleUpdateTicDoc 1115555555555555555555555555555555555555555555555555555555555", previousValue)
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
            // console.log(newObj, "handleUpdateTicDoc 0005555555555555555555555555555555555555555555555555555555555", previousValue)
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

    const handleUpdateCancelTicDoc = async (newObj, previousValue) => {
        const _ticDoc = newObj
        try {
            // console.log(newObj, "handleUpdateTicDoc 0005555555555555555555555555555555555555555555555555555555555", previousValue)
            const ticDocService = new TicDocService();
            await ticDocService.setCancelTicDoc(newObj);
        } catch (err) {
            _ticDoc.status = previousValue
            setTicDoc(_ticDoc)

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
            // console.log(newObj, "handleUpdateTicDoc 0005555555555555555555555555555555555555555555555555555555555", previousValue)
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
    const handleEventProdaja = async (newObj, newDoc) => {
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
            let _ticDoc = await fachDoc(ticDoc.id)
            if (!ticDoc?.id) {
                _ticDoc = { ...ticDoc }
            }
            // console.log(_ticDoc, "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
            const _cmnPar = await fachPar(_ticDoc.usr)
            _ticDoc.cpar = _cmnPar?.code
            _ticDoc.npar = _cmnPar?.text
            await setTicDoc(_ticDoc)
            //console.log(_channel.id, _ticDoc.channel, "$  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$_")
            // if (_ticDoc.status != 0 || moment(_ticDoc.endtm, 'YYYYMMDDHHmmss').isBefore(moment()) || _ticDoc.channel != _channel.id) {
            if (_ticDoc.status != 0 || moment(_ticDoc.endtm, 'YYYYMMDDHHmmss').isBefore(moment())) {
                OK = true
                // console.log(11, "** KANALI KORISNIKA/EVENT *")
            }
        } else {
            //console.log(_channel.id, ticDocOld.channel, "$  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$OLD")
            ticDocOld = await fachUserDoc()
            if (ticDocOld?.id) {
                // if (ticDocOld?.status != 0 || moment(ticDocOld.endtm, 'YYYYMMDDHHmmss').isBefore(moment()) || ticDocOld.channel != _channel.id) {
                if (moment(ticDocOld.endtm, 'YYYYMMDDHHmmss').isBefore(moment())) {
                    OK = true
                    // console.log(22, "** KANALI KORISNIKA/EVENT *")
                } else {
                    const _cmnPar = await fachPar(ticDocOld.usr)
                    ticDocOld.cpar = _cmnPar.code
                    ticDocOld.npar = _cmnPar.text
                    await setTicDoc(ticDocOld)
                }
            } else {
                OK = true
                // console.log(33, "** KANALI KORISNIKA/EVENT *")
            }
        }

        // if (OK || newDoc) {
        if (OK) {
            // console.log(_channel, _ticEvent, "** KANALI KORISNIKA/EVENT *  POZIV CREATE_DOC *****************************************************************************")
            const _ticDoc = await createDoc(_channel, _ticEvent)
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
            setCheckedRezervacija(ticDoc.reservation == '1')
            setCheckedIsporuka(ticDoc.delivery == '1')
            setCheckedNaknade(ticDoc.services == '1')
        }, 1000);
    }
    const handleSetActiveIndex = (index) => {
            // console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ")
        setActiveIndex(index)
    }
    /******************************************************************************************************************************************************************************** */
    const handleDialogClose = (newObj) => {

    }

    const handDocsprintgrpClose = (newObj) => {
        setTicDocsprintgrpgrpLVisible(false);
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
    const handleAllRefresh = () => {
    }

    const handlePlacanjetip = async (value) => {
        const _ticDocpayment = { ...ticDocpayment }
        _ticDocpayment.paymenttp = value
        setTicDocpayment({ ..._ticDocpayment })
        // console.log(ticDocpayment, "411111111111111111111 4444444444444444444444444444444444444444444444", _ticDocpayment)
    }
    const handleRefresh = () => {
    }
    const handleFirstColumnClick = () => {
    }
    const handleActionTab = (rowData) => {
        // console.log(rowData, "TAB-TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
        setTicDoc(rowData)
    }
    return (
        <div>
            <Toast ref={toast} />
            <div  >
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel
                        // header="Dogadjaji"
                        header={<span id="dogadjaji-tab">Dogadjaji</span>}
                        tooltip={translations[selectedLanguage].IzaberiDogadja}
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    >
                        <TicProdajaL
                            ticDoc={ticDoc}
                            propsParent={props}
                            handleEventProdaja={handleEventProdaja}
                            channel={channel}
                        />
                    </TabPanel>
                    <TabPanel
                        // header="Selekcija"
                        header={<span id="selekcija-tab">Selekcija</span>}
                        headerClassName="flex align-items-center"
                        style={{ height: "100%" }}
                        tooltip={translations[selectedLanguage].SelektujSedisteIzabranogDogadjaja}
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15, showDelay: 1000, hideDelay: 300 }}
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
                            channel={channel}
                            akcija={akcija}
                            expandIframe={expandIframe}
                            expandStavke={expandStavke}
                            toggleIframeExpansion={toggleIframeExpansion}
                            handleDelivery={handleDelivery}
                            handleRezervaciju={handleRezervaciju}
                            handleTabZaglavlje={handleTabZaglavlje}
                            ref={ticProdajaWRef}
                            setActiveIndex={setActiveIndex}
                            handleActionTab={handleActionTab}
                        />
                        <div>
                            {/* <NavigateTemplate activeIndex={activeIndex} setActiveIndex={setActiveIndex} totalTabs={4} /> */}
                        </div>
                    </TabPanel>

                    {activeIndex >= "1" ? (
                        <TabPanel
                            headerTemplate={Tab1HeaderTemplate}
                            // header="Header V"
                            headerClassName="flex align-items-center"
                        >
                        </TabPanel>
                    ) : null}
                </TabView>

                <Tooltip target="#dogadjaji-tab" content={translations[selectedLanguage].IzaberiDogadja} position="bottom" />
                <Tooltip target="#selekcija-tab" content={translations[selectedLanguage].SelektujSedisteIzabranogDogadjaja} position="bottom" />
                {/* <div>
                    <tabHeaderTemplat />
                </div> */}
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
                        setActiveIndex={setActiveIndex}
                        channel={channel}
                    />
                )}
            </Dialog>
            <Dialog
                header={
                    <div className="dialog-header">
                        <Button
                            label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                            onClick={() => {
                                setTicDocsprintgrpgrpLVisible(false);
                            }}
                            severity="secondary" raised
                        />
                    </div>
                }
                visible={ticDocsprintgrpgrpLVisible}
                style={{ width: '80%' }}
                onHide={() => {
                    setTicDocsprintgrpgrpLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                    <TicDocsprintgrpL
                        parameter={"inputTextValue"}
                        ticDoc={ticDoc}
                        handDocsprintgrpClose={handDocsprintgrpClose}
                        dialog={false}
                        akcija={akcija}
                        channel={channel}
                    />
                )}
            </Dialog>
            {/* <Dialog
                header={
                    <div className="grid grid-nogutter">
                        <div className="col-2">
                            <Button
                                label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                                onClick={() => {
                                    setTicPaymentLVisible(false);
                                }}
                                severity="secondary" raised
                            />
                        </div>
                        {(Number(props.ticDoc.status) != 2) && (
                        <div className="col-2">
                            <Button label={translations[selectedLanguage].Payment}
                                severity="warning" raised 
                                onClick={(e) => handlePayTicDoc(e)}
                            />

                        </div>
                        )}
                    </div>
                }
                visible={ticPaymentLVisible}
                style={{ width: '55%' }}
                onHide={() => {
                    setTicPaymentLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticPaymentLVisible && (
                    <TicProdajaPlacanje
                        key={ticTransactionsKey}
                        ticDoc={ticDoc}
                        propsParent={props}
                        handleFirstColumnClick={handleFirstColumnClick}
                        //   handleAction={handleAction}
                        setRefresh={handleRefresh}
                        handleAllRefresh={handleAllRefresh}
                        handlePlacanjetip={handlePlacanjetip}
                        ref={placanjeRef}
                        modal={true}
                    />
                )}
            </Dialog> */}
            <Dialog
                header={translations[selectedLanguage].Payment}
                visible={visiblePT}
                style={{ width: '80%' }}
                onHide={() => {
                    setVisiblePT(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                    <TicDocpayment
                        parameter={"inputTextValue"}
                        ticDocpayment={ticDocpayment}
                        ticDoc={ticDoc}
                        handleDialogClose={handleDialogClose}
                        setVisible={setVisiblePT}
                        dialog={true}
                        docpaymentTip={docpaymentTip}
                        paymentTip={paymentTip}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                        channel={channel}
                    />
                )}
                <div className="p-dialog-header-icons" style={{ display: 'none' }}>
                    <button className="p-dialog-header-close p-link">
                        <span className="p-dialog-header-close-icon pi pi-times"></span>
                    </button>
                </div>
            </Dialog>

        </div>
    );
}
