import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnParService } from "../../service/model/cmn/CmnParService";
// import { proveriJMBG } from "../../service/model/cmn/CmnParService";
import { CmnPartpService } from "../../service/model/cmn/CmnPartpService";
import { CmnTerrService } from "../../service/model/cmn/CmnTerrService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from "primereact/inputswitch";
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction";
import env from '../../configs/env';
import AutoParProdaja from '../auto/autoParProdaja';
import { CardMembershipSharp } from '@mui/icons-material';
import { TicDocService } from "../../service/model/TicDocService";
import { TicEventattsService } from '../../service/model/TicEventattsService';
import { InputTextarea } from 'primereact/inputtextarea';

const TicDocsuidPar = (props) => {
    console.log(props, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnPar, setCmnPar] = useState(props.cmnPar);
    const [ticDoc, setTicDoc] = useState(props.ticDoc);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnParItem, setDdCmnParItem] = useState(null);
    const [ddCmnParItems, setDdCmnParItems] = useState(null);
    const [ddCountryItem, setDdCountryItem] = useState(null);
    const [ddCountryItems, setDdCountryItems] = useState(null);
    const [cmnParItem, setCmnParItem] = useState(null);
    const [cmnParItems, setCmnParItems] = useState(null);
    const [parTip, setParTip] = useState('EDIT');
    const [cmnCounryItem, setCmnCounryItem] = useState(null);
    const [cmnCounryItems, setCmnCounryItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnPar?.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate('99991231' || DateFunction.currDate())))
    const [birthday, setBirthday] = useState(props.cmnPar?.birthday ? new Date(DateFunction.formatJsDate(props.cmnPar.birthday)) : null);
    const [emailError, setEmailError] = useState(false);
    const [jmbgError, setJmbgError] = useState(false);
    const [keyAutoParProdaja, setKeyAutoParProdaja] = useState(0);
    const [checkedCL, setCheckedCL] = useState(false);
    const [checkedSZ, setCheckedSZ] = useState(false);
    const [btnNext, setBtnNext] = useState(false);
    const [eventUslov, setEventUslov] = useState({});



    useEffect(() => {
        // Dovlacim ID od clanse i sezonske karte ako postoje, odnosno njihov barkod
        async function fetchData() {
            try {
                if (props.ticEvent?.id) {
                    const _eventUslov = {
                        "clvalue": -1,
                        "szvalue": -1
                    }
                    const ticEventattsService = new TicEventattsService();
                    const data = await ticEventattsService.getDocsCLSZ(props.ticEvent.id);

                    const clDataValue = data.find(item => item.code == '00.00.');
                    const szDataValue = data.find(item => item.code == '00.01.');

                    console.log(`W-clD WWWW-szD  WWWWWWWWWWW-clDV ${clDataValue} WWWWWWWWWWWWW-szDV ${szDataValue} WWWWWWWWWWWWWWWWWWWWWWWWWWWWW`, data)

                    if (clDataValue) {
                        _eventUslov.clvalue = clDataValue.value
                    }

                    if (szDataValue) {
                        _eventUslov.szvalue = szDataValue.value
                    }
                    setEventUslov(_eventUslov)
                    console.log(data, "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", _eventUslov)
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [props.ticEvent?.id]);


    useEffect(() => {
        if (cmnPar.id == "1" || cmnPar.id == "2") {
            const _cmnPar = { ...cmnPar }
            _cmnPar.id = null
            setCmnPar(_cmnPar)
        }

    }, [props.cmnPar]);

    useEffect(() => {
        if (cmnPar.id == "1" || cmnPar.id == "2") {
            const _cmnPar = { ...cmnPar }
            _cmnPar.id = null
            setCmnPar({})
            setKeyAutoParProdaja(prev => prev + 1)
            setParTip("EDIT")
        }

    }, [cmnPar]);

    useEffect(() => {
        async function fetchData() {
            let _cl = false
            let _sz = false
            if (props.modal == 1) {
                const ticEventattsService = new TicEventattsService();
                const dataCL = await ticEventattsService.getDocsCLSZ(props.ticEvent.id);
                console.log(dataCL, "CLCLCLCLCLCLCLCLCLCLCLCLCLCL")





                if (props.eventUslov.cl == 1) {
                    // Filtriranje za code == '00.00.'
                    const filteredData00 = dataCL.filter(item => item.code === '00.00.');

                    // Provera za email ili uid u filteredData00
                    const match00 = filteredData00.some(item =>
                        item.email === cmnPar.email || item.uid === cmnPar.uid
                    );
                    if (match00) {
                        setCheckedCL(true)
                        _cl = true
                    }
                } else {
                    _cl = true
                }

                if (props.eventUslov.sz == 1) {
                    // Filtriranje za code == '00.01.'
                    const filteredData01 = dataCL.filter(item => item.code === '00.01.');

                    // Provera za email ili uid u filteredData01
                    const match01 = filteredData01.some(item =>
                        item.email === cmnPar.email || item.uid === cmnPar.uid
                    );
                    if (match01) {
                        setCheckedSZ(true)
                        _sz = true
                    }
                } else {
                    _sz = true
                }
            }
            if (_cl && _sz) {
                setBtnNext(true)
            }
        }
        fetchData();
    }, [cmnPar]);

    /************************************************************************************************ */
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    async function isValidDate(date, format) {
        const day = parseInt(date.substring(0, 2));
        const month = parseInt(date.substring(2, 4));
        const year = parseInt(date.substring(4, 8));

        // Provera datuma (osnovna provera bez dodatnih biblioteka)
        const dateObj = new Date(year, month - 1, day);
        return dateObj && (dateObj.getMonth() + 1) === month && dateObj.getDate() === day;
    }

    const proveriJMBG = async (uJMBG) => {
        // console.log(uJMBG, "00-##############################################################################################################################")
        if (uJMBG == '3333333333333') {
            return true
        }
        let A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13;
        let pKontrolniBroj, pIzlaz = false;
        let pYY;


        if (uJMBG != null && uJMBG.length === 13) {
            // console.log(uJMBG, "11-##############################################################################################################################")
            if (uJMBG.charAt(4) === '0') {
                pYY = '20';
            } else {
                pYY = '1' + uJMBG.charAt(4);
            }
            // Validacija datuma (DDMMYYYY)
            let datum = uJMBG.substring(0, 4) + pYY + uJMBG.substring(5, 7);
            if (await isValidDate(datum, 'DDMMYYYY')) {
                A1 = parseInt(uJMBG.charAt(0));
                A2 = parseInt(uJMBG.charAt(1));
                A3 = parseInt(uJMBG.charAt(2));
                A4 = parseInt(uJMBG.charAt(3));
                A5 = parseInt(uJMBG.charAt(4));
                A6 = parseInt(uJMBG.charAt(5));
                A7 = parseInt(uJMBG.charAt(6));
                A8 = parseInt(uJMBG.charAt(7));
                A9 = parseInt(uJMBG.charAt(8));
                A10 = parseInt(uJMBG.charAt(9));
                A11 = parseInt(uJMBG.charAt(10));
                A12 = parseInt(uJMBG.charAt(11));
                A13 = parseInt(uJMBG.charAt(12));

                pKontrolniBroj = (A1 * 7 + A2 * 6 + A3 * 5 + A4 * 4 + A5 * 3 + A6 * 2 +
                    A7 * 7 + A8 * 6 + A9 * 5 + A10 * 4 + A11 * 3 + A12 * 2) % 11;

                if (pKontrolniBroj > 1) {
                    if (11 - pKontrolniBroj === A13) {
                        pIzlaz = true;
                    }
                } else {
                    if (pKontrolniBroj === A13) {
                        pIzlaz = true;
                    }
                }
            }
        }
        // console.log(pIzlaz, "22-##############################################################################################################################")
        return pIzlaz;
    }
    /************************************************************************************************* */
    const handleEmailChange = async (email) => {
        const OK = await validateEmail(email)
        setEmailError(!OK);
        return OK
    };
    const handleJmbgValidate = async (idnum) => {
        const OK = await proveriJMBG(idnum)
        setJmbgError(OK);
        // console.log(OK, "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
        return OK
    };
    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {

        async function fetchData() {
            try {
                const cmnPartpService = new CmnPartpService();
                const data = await cmnPartpService.getCmnPartps();

                setCmnParItems(data)
                //console.log("******************", cmnParItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnParItems(dataDD);
                const tp = props.cmnPar?.tp || "2"
                // console.log(tp, "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
                setDdCmnParItem(dataDD.find((item) => item.code == tp) || null);

                if (tp) {
                    const foundItem = data.find((item) => item.id === tp);
                    setCmnParItem(foundItem || null);
                    cmnPar.ctp = foundItem.code
                    cmnPar.ntp = foundItem.textx
                }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnTerrService = new CmnTerrService();
                const data = await cmnTerrService.getTpLista('2');

                setCmnCounryItems(data)
                //console.log("******************", cmnParItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCountryItems(dataDD);
                setDdCountryItem(dataDD.find((item) => item.code === props.cmnPar.countryid) || null);
                if (props.cmnPar.countryid) {
                    const foundItem = data.find((item) => item.id === props.cmnPar.countryid);
                    setCmnCounryItem(foundItem || null);
                    cmnPar.ctp = foundItem.code
                    cmnPar.ntp = foundItem.textx
                }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);


    // const handleCancelClick = () => {
    //     props.setVisible(false);
    // };
    const handleCancelClick = () => {
        if (props.remote) {
            const dataToSend = { type: 'dataFromIframe', visible: false };
            sendToParent(dataToSend);
        } else {
            props.setVisible(false);
        }
    };
    const sendToParent = (data) => {
        const parentOrigin = `${env.DOMEN}`; // Promenite ovo na stvarni izvor roditeljskog dokumenta
        window.parent.postMessage(data, parentOrigin);
    }
    const handleEditClick = async () => {
        console.log(cmnPar, "03-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        setSubmitted(false);
        if (cmnPar.id) {
            if (cmnPar.id != "1" || cmnPar.id != "2") {
                setParTip("UPDATE")
            } else if (!cmnPar.code) {
                setCmnPar({})
                setParTip("CREATE")
            }
        } else {
            setParTip("CREATE")
        }
    }
    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            cmnPar.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnPar.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            cmnPar.birthday = birthday ? DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(birthday)) : null;
            const cmnParService = new CmnParService();
            const data = await cmnParService.postCmnPar(cmnPar);
            // console.log(data, "s03-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", )
            cmnPar.id = data.id
            cmnPar.code = data.code
            // if (cmnPar.code === null || cmnPar.code === "") {
            //     cmnPar.code = cmnPar.id;
            // }

            let _ticDoc = { ...ticDoc }
            _ticDoc.usr = data.id
            _ticDoc.cpar = cmnPar.code
            _ticDoc.npar = cmnPar.textx

            setTicDoc(_ticDoc)
            const ticDocService = new TicDocService();
            await ticDocService.putTicDocSet(_ticDoc);
            props.handleUidKey(cmnPar, props.modal)
            setCmnPar(cmnPar)
            props.handleSetCmnParW(cmnPar)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Podatci ažurirani', life: 2000 });
            // console.log({ obj: cmnPar, parTip: props.parTip }, "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
            // props.handleDialogClose({ newObj });
            // props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnPar ",
                detail: `${err}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            let _cmnPar = { ...cmnPar }
            setSubmitted(true);
            if (_cmnPar?.id == 1 || _cmnPar?.id == 2) {
                _cmnPar.id = null
            }
            _cmnPar.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            _cmnPar.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            _cmnPar.birthday = birthday ? DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(birthday)) : null;
            if (!(await handleEmailChange(_cmnPar.email))) {
                throw new Error(
                    "Neispravan EMAIL!"
                );
            } else {
                // console.log("00 - EMAIL je ok")
                if (!(await handleJmbgValidate(_cmnPar.idnum)) && cmnPar.tp == 2) {
                    throw new Error(
                        "Neispravan JMBG!"
                    );
                } else {
                    // console.log("00 - JMBG je ok", cmnPar)
                    const cmnParService = new CmnParService();

                    const data = await cmnParService.putCmnPar(_cmnPar);

                    props.handleUidKey(_cmnPar)
                    setCmnPar(_cmnPar)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Podatci ažurirani', life: 2000 });
                }
            }



        } catch (err) {
            setSubmitted(true);
            toast.current.show({
                severity: "error",
                summary: "CmnPar ",
                detail: `${err}`,
                life: 3000,
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const cmnParService = new CmnParService();
            await cmnParService.deleteCmnPar(cmnPar);
            props.handleDialogClose({ obj: cmnPar, parTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnPar ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == 'tp') {
                setDdCmnParItem(e.value);
                const foundItem = cmnParItems.find((item) => item.id === val);
                setCmnParItem(foundItem || null);
                cmnPar.ntp = e.value.name
                cmnPar.ctp = foundItem?.code
            } else {
                setDdCountryItem(e.value);
                const foundItem = cmnCounryItems.find((item) => item.id === val);
                // setCmnParItem(foundItem || null);
                // cmnPar.ntp = e.value.name
                // cmnPar.ctp = foundItem.code
            }
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnPar.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    break;
                case "birthday":
                    setBirthday(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
            console.log(val, "*******************", e.target)
        }
        console.log(cmnPar, "04-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa")
        let _cmnPar = { ...cmnPar };
        _cmnPar[`${name}`] = val;
        setCmnPar(_cmnPar);
    };
    const onDocInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {

        } else if (type === "Calendar") {

        } else {
            val = (e.target && e.target.value) || '';
            console.log(val, "*******************", e.target)
        }
        let _ticDoc = { ...ticDoc };
        _ticDoc[`${name}`] = val;
        setTicDoc(_ticDoc);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    const handleAutoParProdaja = async (ticDoc, cmnPar) => {
        // setTicDoc(ticDoc)
        const _cmnPar = { ...cmnPar }
        setCmnPar(_cmnPar)
        props.handleSetCmnParW(cmnPar)
        if (cmnPar.id == "1" || cmnPar.id == "2") {
            if (parTip == "CREATE") {
                _cmnPar.id = null
            } else {
                setParTip("EDIT")
                const _cmnPar = {}
                setCmnPar(_cmnPar)
            }
        }
        // console.log(e, "******* Clicked item details:", item);

    };
    const handleNapomenaClick = async (e) => {
        // console.log(ticDoc, "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", e)

        let _ticDoc = { ...ticDoc || props.ticDoc }
        setTicDoc(_ticDoc)
        props.handleAction(_ticDoc)
        await handleUpdateNapDoc(_ticDoc)
        props.handleParClose()
    };
    const handleNextClick = async (e) => {
        props.handleParClose()
    };
    const handleUpdateNapDoc = async (newObj) => {
        try {
            // console.log(newObj, "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
            const ticDocService = new TicDocService();
            await ticDocService.postTicDocSetValue('tic_doc', 'opis', newObj.opis, newObj.id);
        } catch (err) {
            // console.log(newObj, "ERRRRORRR ** 00 ***************************************************####################")
            const _ticDoc = { ...newObj }
            _ticDoc.opis = newObj.opis
            setTicDoc(_ticDoc)

            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    }
    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                            <AutoParProdaja
                                key={keyAutoParProdaja}
                                ticDoc={props.ticDoc}
                                cmnPar={cmnPar}
                                handleAutoParProdaja={handleAutoParProdaja}
                                setAutoParaddressKey1={props.setAutoParaddressKey1}
                                handleAction={props.handleAction}
                                setRefresh={props.setRefresh}
                                parTip={parTip}
                            // reservationStatus={reservationStatus}
                            />
                        </div>
                        {/* <div className="field col-12 md:col-5">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={cmnPar?.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnPar?.code })}
                            />
                            {submitted && !cmnPar?.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={cmnPar.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnPar.text })}
                            />
                            {submitted && !cmnPar.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div> */}

                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown id="tp"
                                value={ddCmnParItem}
                                options={ddCmnParItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnPar.tp })}
                                disabled={parTip == "EDIT"}
                            />
                            {submitted && !cmnPar.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}

                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="email">{translations[selectedLanguage].email}</label>
                            <InputText
                                id="email"
                                value={cmnPar.email} onChange={(e) => onInputChange(e, "text", 'email')}
                                className={classNames({ 'p-invalid': (submitted && !cmnPar.email) || emailError })}
                                disabled={parTip == "EDIT"}
                            />
                            {emailError && <small className="p-error">{translations[selectedLanguage].InvalidEmail}</small>}
                            {submitted && !cmnPar.email && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}

                        </div>

                        {/* <div className="field col-12 md:col-7">
                            <label htmlFor="short">{translations[selectedLanguage].short}</label>
                            <InputText
                                id="short"
                                value={cmnPar.short} onChange={(e) => onInputChange(e, "text", 'short')}
                            />
                        </div> */}
                        <div className="field col-12 md:col-5">
                            <label htmlFor="address">{translations[selectedLanguage].address}</label>
                            <InputText
                                id="address"
                                value={cmnPar.address} onChange={(e) => onInputChange(e, "text", 'address')}
                                disabled={parTip == "EDIT"}
                            />

                        </div>

                        <div className="field col-12 md:col-4">
                            <label htmlFor="place">{translations[selectedLanguage].place}</label>
                            <InputText
                                id="place"
                                value={cmnPar.place} onChange={(e) => onInputChange(e, "text", 'place')}
                                disabled={parTip == "EDIT"}
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="postcode">{translations[selectedLanguage].postcode}</label>
                            <InputText
                                id="postcode"
                                value={cmnPar.postcode} onChange={(e) => onInputChange(e, "text", 'postcode')}
                                disabled={parTip == "EDIT"}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="countryid">{translations[selectedLanguage].Country} *</label>
                            <Dropdown id="countryid"
                                value={ddCountryItem}
                                options={ddCountryItems}
                                onChange={(e) => onInputChange(e, "options", 'countryid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnPar.countryid })}
                                disabled={parTip == "EDIT"}
                            />
                            {submitted && !cmnPar.countryid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="birthday">{translations[selectedLanguage].Birthday} *</label>
                            <Calendar
                                value={birthday}
                                onChange={(e) => onInputChange(e, "Calendar", 'birthday')}
                                showIcon
                                dateFormat="dd.mm.yy"
                                disabled={parTip == "EDIT"}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="tel">{translations[selectedLanguage].tel}</label>
                            <InputText
                                id="tel"
                                value={cmnPar.tel} onChange={(e) => onInputChange(e, "text", 'tel')}
                                disabled={parTip == "EDIT"}
                            />
                        </div>
                        <div className="col-12">
                            <div className="p-fluid formgrid grid">
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="idnum">{translations[selectedLanguage].idnum}</label>
                                    <InputText
                                        id="idnum"
                                        value={cmnPar.idnum} onChange={(e) => onInputChange(e, "text", 'idnum')}
                                        className={classNames({ 'p-invalid': jmbgError })}
                                        disabled={parTip == "EDIT"}
                                    />
                                    {jmbgError && <small className="p-error">{translations[selectedLanguage].InvalidJMBG}</small>}
                                </div>
                            </div>
                        </div>
                        {(cmnParItem?.id != 2) && (
                            <div className="field col-12 md:col-4">
                                <label htmlFor="activity">{translations[selectedLanguage].activity}</label>
                                <InputText
                                    id="activity"
                                    value={cmnPar.activity} onChange={(e) => onInputChange(e, "text", 'activity')}
                                    disabled={parTip == "EDIT"}
                                />
                            </div>
                        )}
                        {(cmnParItem?.id != 2) && (
                            <div className="field col-12 md:col-4">
                                <label htmlFor="pib">{translations[selectedLanguage].pib}</label>
                                <InputText
                                    id="pib"
                                    value={cmnPar.pib} onChange={(e) => onInputChange(e, "text", 'pib')}
                                    disabled={parTip == "EDIT"}
                                />
                            </div>
                        )}
                        {(cmnParItem?.id != 2) && (
                            <div className="field col-12 md:col-4">
                                <label htmlFor="pdvnum">{translations[selectedLanguage].pdvnum}</label>
                                <InputText
                                    id="pdvnum"
                                    value={cmnPar.pdvnum} onChange={(e) => onInputChange(e, "text", 'pdvnum')}
                                    disabled={parTip == "EDIT"}
                                />
                            </div>
                        )}
                        <div className="field col-12 md:col-6">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar
                                value={begda}
                                onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                                disabled={parTip == "EDIT"}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="endda">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
                                disabled={parTip == "EDIT"}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">

                        {/* <Button
                            label={translations[selectedLanguage].Cancel}
                            icon="pi pi-times"
                            className="p-button-outlined p-button-secondary"
                            onClick={handleCancelClick}
                            outlined
                        /> */}

                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {(parTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(parTip == 'UPDATE') ?
                                (
                                    <Button
                                        label={translations[selectedLanguage].Save}
                                        icon="pi pi-check"
                                        onClick={handleSaveClick}
                                        severity="danger"
                                    />
                                )
                                : null}

                            {(parTip == 'EDIT' && props.modal == 0) ?
                                (
                                    <Button
                                        label={translations[selectedLanguage].Edit}
                                        icon="pi pi-check"
                                        onClick={handleEditClick}
                                        severity="danger"
                                    />
                                )
                                : null}
                        </div>
                    </div>
                </div>

                {(props.modal == 1) && (
                    <div className="card">
                        <div className="p-fluid formgrid grid">
                            {(props.eventUslov.cl == 1) && (

                                <div className="col-12 md:col-6" style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                                    <label style={{ marginBottom: '0.5rem' }} htmlFor="cl">{translations[selectedLanguage].clkarta}</label>
                                    <InputSwitch id="cl" checked={checkedCL}
                                        // onChange={(e) => handleChangeNaknade(e.value)}
                                        // onChange={(e) => onInputChange(e, "text", 'cl')}
                                        tooltip={translations[selectedLanguage].PosedujeClanskuKartu}
                                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        disabled={true}
                                    />
                                </div>

                            )}
                            {(props.eventUslov.sz == 1) && (
                                <div className="col-12 md:col-6" style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                                    <label style={{ marginBottom: '0.5rem' }} htmlFor="sz">{translations[selectedLanguage].szkarta}</label>
                                    <InputSwitch id="sz" checked={checkedSZ}
                                        // onChange={(e) => handleChangeNaknade(e.value)}
                                        // onChange={(e) => onInputChange(e, "text", 'sz')}
                                        tooltip={translations[selectedLanguage].PosedujeClanskuKartu}
                                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        disabled={true}
                                    />
                                </div>
                            )}
                            {(btnNext) && (
                                <div className="field col-12 md:col-12">
                                    <Button
                                        icon="pi pi-next "
                                        label={translations[selectedLanguage].Next}
                                        onClick={handleNextClick}
                                        className="p-button" />
                                </div>
                            )}
                        </div>
                        {(!btnNext) && (
                            <div className="field col-12 md:col-12">

                                <label htmlFor="napomena">{translations[selectedLanguage].Napomena}</label>
                                <InputTextarea
                                    id="opis"
                                    rows={3}
                                    autoResize
                                    style={{ width: '100%' }}
                                    // cols={100}
                                    value={ticDoc?.opis}
                                    onChange={(e) => onDocInputChange(e, 'text', 'opis')}
                                />
                                <Button
                                    icon="pi pi-save "
                                    label={translations[selectedLanguage].SaveNext}
                                    onClick={handleNapomenaClick}
                                    severity="danger"
                                    className="p-button" />
                            </div>
                        )}
                    </div>
                )
                }
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inCmnPar="delete"
                item={cmnPar.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicDocsuidPar;
