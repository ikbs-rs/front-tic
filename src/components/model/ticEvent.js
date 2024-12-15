import React, { useState, useRef, useEffect } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { classNames } from 'primereact/utils';
import { TicEventService } from "../../service/model/TicEventService";
import { TicSeasonService } from "../../service/model/TicSeasonService";
import { CmnLocService } from "../../service/model/cmn/CmnLocService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction"
import InputMask from 'react-input-mask';
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";
import { Calendar } from "primereact/calendar";
import CmnLocL from './cmn/cmnLocL';
import TicEventctg from './ticEventctg';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from 'primereact/dialog';
import CmnParL from './cmn/cmnParL';
import { Divider } from 'primereact/divider';
import ConfirmDialog from '../dialog/ConfirmDialog';
import TicEventWL from './ticEventWL';




const TicEvent = (props) => {
    console.log(props, "************************************TicEvent*****************************************")
    let i = 0
    const parTp = 'XOR'
    const objName = "tic_events"
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicEvents = EmptyEntities[objName]
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [deleteAllDialogVisible, setDeleteAllDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);

    const [dropdownTmpItem, setDropdownTmpItem] = useState(null);
    const [dropdownTmpItems, setDropdownTmpItems] = useState(null);
    const [dropdownMapaItem, setDropdownMapaItem] = useState(null);
    const [dropdownMapaItems, setDropdownMapaItems] = useState(null);

    const [ticEventWLVisible, setTicEventWLVisible] = useState(false);
    const [ticEventartLVisible, setTicEventartLVisible] = useState(false);
    const [ticEventobjLVisible, setTicEventobjLVisible] = useState(false);
    const [ticEventattsLVisible, setTicEventattsLVisible] = useState(false);


    const [ticEvent, setTicEvent] = useState(props.ticEvent);
    const [ticEvents, setTicEvents] = useState(emptyTicEvents);

    const [submitted, setSubmitted] = useState(false);
    const [ddTpItem, setDdTpItem] = useState(null);
    const [ddTpItems, setDdTpItems] = useState(null);
    const [ddCtgItem, setDdCtgItem] = useState(null);
    const [ddCtgItems, setDdCtgItems] = useState(null);
    const [eventsTip, setEventsTip] = useState(false);
    const [ddLocItem, setDdLocItem] = useState(null);
    const [ddLocItems, setDdLocItems] = useState(null);
    const [ddMestoItem, setDdMestoItem] = useState(null);
    const [ddMestoItems, setDdMestoItems] = useState(null);
    const [ddSeasonItem, setDdSeasonItem] = useState(null);
    const [ddSeasonItems, setDdSeasonItems] = useState(null);
    const [ddEventItem, setDdEventItem] = useState(null);
    const [ddEventItems, setDdEventItems] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [ddOrganizatorItem, setDdOrganizatorItem] = useState(null);
    // const [ddOrganizatorItems, setDdOrganizatorItems] = useState(null);

    /************************AUTOCOMPLIT**************************** */
    const [cmnParLVisible, setCmnParLVisible] = useState(false);
    const [allPara, setAllPars] = useState([]);
    const [parValue, setParValue] = useState(props.ticEvent.cpar);
    const [filteredPars, setFilteredPars] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [selectedPar, setSelectedPar] = useState(null);
    /************************AUTOCOMPLIT**************************** */
    const [cmnLocLVisible, setCmnLocLVisible] = useState(false);
    const [allLoc, setAllLocs] = useState([]);
    const [mestoValue, setLocValue] = useState(props.ticEvent.cmesto);
    const [filteredLocs, setFilteredLocs] = useState([]);
    const [debouncedLocSearch, setDebouncedLocSearch] = useState("");
    //const [searchLocTimeout, setSearchLocTimeout] = useState(null);
    const [selectedLoc, setSelectedLoc] = useState(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    /************************AUTOCOMPLIT**************************** */

    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticEvent.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticEvent.endda || DateFunction.currDate())))

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Active}`, code: '1' },
        { name: `${translations[selectedLanguage].Inactive}`, code: '0' },
        { name: `${translations[selectedLanguage].Arhive}`, code: '2' }
    ];

    const itemsTmp = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' },
    ];

    const itemsMapa = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' },
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticEvent.status));
    }, []);

    useEffect(() => {
        setDropdownTmpItem(findDropdownTmpItemByCode(props.ticEvent.tmp));
    }, []);

    useEffect(() => {
        setDropdownMapaItem(findDropdownMapaItemByCode(props.ticEvent.mapa));
    }, []);

    // **** TIP DOGADJAJA  DROPDOWN
    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.TIC_BACK_URL}/tic/x/eventtp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTpItems(dataDD);
                setDdTpItem(dataDD.find((item) => item.code === props.ticEvent.tp) || null);
                setEventsTip(true)
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // **** KATEGORIJA DOGADJAJA  DROPDOWN
    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.TIC_BACK_URL}/tic/x/eventctg/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCtgItems(dataDD);
                setDdCtgItem(dataDD.find((item) => item.code === props.ticEvent.ctg) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // **** DOGADJAJ-S  DROPDOWN ne znam da li se ovo upotrebljava ?????
    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const ticEventsService = new TicEventsService();
    //             const data = await ticEventsService.getTicEvents(props.ticEvent.id);
    //             if (data) {
    //                 setTicEvents(data)
    //                 updateEventsTip(true)
    //             } else {
    //                 emptyTicEvents.id = null
    //                 setTicEvents(emptyTicEvents)
    //                 updateEventsTip(false)
    //             }
    //         } catch (error) {
    //             console.error(error);
    //             // Obrada greške ako je potrebna
    //         }
    //     }
    //     fetchData();
    // }, [props.ticEvent, eventsTip]);
    // **** SEZONA  DROPDOWN
    useEffect(() => {
        async function fetchData() {
            try {
                const ticSeasonService = new TicSeasonService();
                const data = await ticSeasonService.getTicSeasons();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdSeasonItems(dataDD);
                setDdSeasonItem(dataDD.find((item) => item.code === props.ticEvent.season) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // **** MESTO DESAVANJA  DROPDOWN
    useEffect(() => {
        async function fetchData() {
            try {
                const ticEventService = new TicEventService();
                const data = await ticEventService.getCmnObjXVLista();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdMestoItems(dataDD);
                setDdMestoItem(dataDD.find((item) => item.code === ticEvent.mesto) || null);
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
                const ticEventService = new TicEventService();
                const data = await ticEventService.getCmnObjXcsIdLista(ticEvent.mesto);
                // console.log(data, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdLocItems(dataDD);
                setDdLocItem(dataDD.find((item) => item.code === props.ticEvent.loc) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [ticEvent.mesto]);
    // **** NADREDJENI DOGADJAJA  DROPDOWN
    useEffect(() => {
        async function fetchData() {
            try {
                const ticEventService = new TicEventService();
                const data = await ticEventService.getLista();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdEventItems(dataDD);
                setDdEventItem(dataDD.find((item) => item.code === props.ticEvent.event) || null);
                setTicEvents(data);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    useEffect(() => {
        setDropdownTmpItems(itemsTmp);
    }, []);

    useEffect(() => {
        setDropdownMapaItems(itemsMapa);
    }, []);

    // useEffect(() => {
    //     async function fetchData() {
    //       try { 
    //         const ticEventService = new TicEventService();
    //         const data = await ticEventService.getLista();
    //         const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
    //         setDdEventItems(dataDD);
    //         setDdEventItem(dataDD.find((item) => item.code === props.ticEvent.par) || null);            
    //         setTicEvents(data);
    //       } catch (error) {
    //         console.error(error);
    //         // Obrada greške ako je potrebna
    //       }
    //     }
    //     fetchData();
    //   }, []);      

    // useEffect(() => {
    //     setDropdownItems(items);
    // }, []);

    // **** ORGANIZATOR  DROPDOWN
    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const ticEventService = new TicEventService();
    //             const data = await ticEventService.getOrganizatorLista('cmn_par', 't.code', parTp);
    //             const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
    //             setDdOrganizatorItems(dataDD);
    //             setDdOrganizatorItem(dataDD.find((item) => item.code === props.ticEvent.par) || null);
    //             setTicEvents(data);
    //         } catch (error) {
    //             console.error(error);
    //             // Obrada greške ako je potrebna
    //         }
    //     }
    //     fetchData();
    // }, []);

    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    const findDropdownTmpItemByCode = (code) => {
        return itemsTmp.find((item) => item.code === code) || null;
    };

    const findDropdownMapaItemByCode = (code) => {
        return itemsMapa.find((item) => item.code === code) || null;
    };

    // EVENT-S ????????
    // const updateEventsTip = (value) => {
    //     setEventsTip(value);
    // };

    /*************************AUTOCOMPLIT*******************************************LOC****** */
    /**************** */
    useEffect(() => {
        async function fetchData() {
            const cmnLocService = new CmnLocService();
            const data = await cmnLocService.getListaLL('XV');
            setAllLocs(data);
            //setParValue(data.find((item) => item.id === props.ticEvent.par) || null);
        }
        fetchData();
    }, []);
    /**************** */
    useEffect(() => {
        if (debouncedLocSearch && selectedLoc === null) {
            console.log("9999999999999999999999999debouncedLocSearch9999999999999999999999999999", debouncedLocSearch, "***********")
            // Filtrirajte podatke na osnovu trenutnog unosa
            const query = debouncedLocSearch.toLowerCase();
            const filtered = allLoc.filter(
                (item) =>
                    item.textx.toLowerCase().includes(query) ||
                    item.code.toLowerCase().includes(query) ||
                    item.id.toLowerCase().includes(query)
            );

            setSelectedLoc(null);
            setFilteredLocs(filtered);
        }
    }, [debouncedLocSearch, allLoc]);
    /*** */

    useEffect(() => {
        // Samo kada je izabrani element `null`, izvršavamo `onChange`
        console.log(mestoValue, "*********************parValue*****************@@@@@@@@@***********")
        setLocValue(mestoValue);
    }, [mestoValue, selectedLoc]);

    const handleLocSelect = (e) => {
        // Postavite izabrani element i automatski popunite polje za unos sa vrednošću "code"
        setSelectedLoc(e.value.code);
        setLocValue(e.value.code);
    };
    /************************** */
    const handleLocLClick = async (e, destination) => {
        try {
            console.log(destination, "*********************handleParLClick****************************")
            if (destination === 'local') setCmnLocLDialog();
            else setCmnLocLDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch cmnLoc data',
                life: 3000
            });
        }
    };
    const setCmnLocLDialog = (destination) => {
        setCmnLocLVisible(true);
    };
    /************************** */
    const handleCmnLocLDialogClose = (newObj) => {
        console.log(newObj, "11111111111111111111111111111-Close-1111111111111111111111111111111111")
        setLocValue(newObj.code);
        ticEvent.mesto = newObj.id;
        ticEvent.nmesto = newObj.textx;
        ticEvent.cmesto = newObj.code;
        setTicEvent(ticEvent)
        //ticDocs.potrazuje = newObj.cena * ticDocs.output;
        setCmnLocLVisible(false);
    };
    /**************************AUTOCOMPLIT***********************************LOC************* */

    /*************************AUTOCOMPLIT************************************PAR************* */
    /**************** */
    useEffect(() => {
        async function fetchData() {
            const ticEventService = new TicEventService();
            const data = await ticEventService.getOrganizatorLista('cmn_par', 't.code', parTp);
            setAllPars(data);
            //setParValue(data.find((item) => item.id === props.ticEvent.par) || null);
        }
        fetchData();
    }, []);
    /**************** */
    useEffect(() => {
        if (debouncedSearch && selectedPar === null) {
            // Filtrirajte podatke na osnovu trenutnog unosa
            console.log("9999999999999999999999999debouncedLocSearch9999999999999999999999999999", debouncedSearch, "=============================")
            const query = debouncedSearch.toLowerCase();
            const filtered = allPara.filter(
                (item) =>
                    item.textx.toLowerCase().includes(query) ||
                    item.code.toLowerCase().includes(query) ||
                    item.id.toLowerCase().includes(query)
            );

            setSelectedPar(null);
            setFilteredPars(filtered);
        }
    }, [debouncedSearch, allPara]);
    /*** */

    useEffect(() => {
        // Samo kada je izabrani element `null`, izvršavamo `onChange`
        console.log(parValue, "*********************parValue*****************@@@@@@@@@***********")
        setParValue(parValue);
    }, [parValue, selectedPar]);

    const handleSelect = (e) => {
        // Postavite izabrani element i automatski popunite polje za unos sa vrednošću "code"
        console.log(e.value, "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")
        setSelectedPar(e.value.code);
        setParValue(e.value.code);
    };
    /************************** */
    const handleParLClick = async (e, destination) => {
        try {
            console.log(destination, "*********************handleParLClick****************************")
            if (destination === 'local') setCmnParDialog();
            else setCmnParDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch cmnPar data',
                life: 3000
            });
        }
    };
    const setCmnParDialog = (destination) => {
        setCmnParLVisible(true);
    };
    /************************** */
    const handleCmnParLDialogClose = (newObj) => {
        console.log(newObj, "11111111111111111111111111111-Close-1111111111111111111111111111111111")
        setParValue(newObj.code);
        ticEvent.par = newObj.id;
        ticEvent.npar = newObj.text;
        ticEvent.cpar = newObj.code;
        setTicEvent(ticEvent)
        //ticDocs.potrazuje = newObj.cena * ticDocs.output;
        setCmnParLVisible(false);
    };
    /**************************AUTOCOMPLIT************************************************ */

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const _ticEvent = { ...ticEvent }
            _ticEvent.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            _ticEvent.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            _ticEvent.begtm = DateFunction.convertTimeToDBFormat(ticEvent.begtm)
            _ticEvent.endtm = DateFunction.convertTimeToDBFormat(ticEvent.endtm)
            _ticEvent.tm = DateFunction.currDatetime();
            setTicEvent(ticEvent)
            const ticEventService = new TicEventService();
            const data = await ticEventService.postTicEvent(_ticEvent);
            // console.log(data, "999999999999999999999999999999999999999999999999999999999999999999999999999999")
            _ticEvent.id = data
            props.handleDialogClose({ obj: _ticEvent, eventTip: props.eventTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };
    
    const handleCreateClickNext = async () => {
        try {
            setSubmitted(true);
            const _ticEvent = { ...ticEvent }
            _ticEvent.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            _ticEvent.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            _ticEvent.begtm = DateFunction.convertTimeToDBFormat(ticEvent.begtm)
            _ticEvent.endtm = DateFunction.convertTimeToDBFormat(ticEvent.endtm)
            _ticEvent.tm = DateFunction.currDatetime();
           
            const ticEventService = new TicEventService();
            const data = await ticEventService.postTicEvent(_ticEvent);
            // console.log(data, "999999999999999999999999999999999999999999999999999999999999999999999999999999")
            _ticEvent.id = data
            setTicEvent(_ticEvent)
            props.handleDialogClose({ obj: _ticEvent, eventTip: props.eventTip });
            setTicEventWLVisible(true);
            // props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };
    
    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticEvent.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEvent.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            ticEvent.begtm = DateFunction.convertTimeToDBFormat(ticEvent.begtm)
            ticEvent.endtm = DateFunction.convertTimeToDBFormat(ticEvent.endtm)
            const ticEventService = new TicEventService();
            await ticEventService.putTicEvent(ticEvent);
            props.handleDialogClose({ obj: ticEvent, eventTip: props.eventTip });
            setTicEventWLVisible(true);
            // props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };
        
    const handleSaveClickNext = async () => {
        try {
            setSubmitted(true);
            ticEvent.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEvent.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            ticEvent.begtm = DateFunction.convertTimeToDBFormat(ticEvent.begtm)
            ticEvent.endtm = DateFunction.convertTimeToDBFormat(ticEvent.endtm)
            const ticEventService = new TicEventService();
            await ticEventService.putTicEvent(ticEvent);
            props.handleDialogClose({ obj: ticEvent, eventTip: props.eventTip });
            setTicEventWLVisible(true);
            // props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };
    
    const handleSaveDateClick = async () => {
        try {
            setSubmitted(true);
            ticEvent.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEvent.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            ticEvent.begtm = DateFunction.convertTimeToDBFormat(ticEvent.begtm)
            ticEvent.endtm = DateFunction.convertTimeToDBFormat(ticEvent.endtm)
            const ticEventService = new TicEventService();
            await ticEventService.postTicEventSaveDate(ticEvent);
            props.handleDialogClose({ obj: ticEvent, eventTip: props.eventTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const handleCopyClick = () => {
        setConfirmDialogVisible(true);
    };

    const handleConfirm = async () => {
        try {
            // console.log(ticEvent, "***********handleConfirm********************")
            setSubmitted(true);
            setLoading(true)
            setConfirmDialogVisible(false);
            ticEvent.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEvent.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            ticEvent.begtm = DateFunction.convertTimeToDBFormat(ticEvent.begtm)
            ticEvent.endtm = DateFunction.convertTimeToDBFormat(ticEvent.endtm)
            ticEvent.tm = DateFunction.currDatetime()
            const ticEventService = new TicEventService();
            
            const pId = await ticEventService.postTicEventCopy(ticEvent);
            console.log(pId, '*00********************handleCopyClick*************************')
            setLoading(false)
            const _ticEvent = { ...ticEvent };
            _ticEvent.id = pId;
            setTicEvent(pId)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Догађај успешно активиран ?', life: 3000 });
            props.handleDialogClose({ obj: _ticEvent, eventTip: props.eventTip });
            setVisible(false);
            props.setVisible(false);

        } catch (err) {
            setLoading(false)
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    // const handleCopyClick = async () => {
    //     try {
    //         setSubmitted(true);
    //         ticEvent.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
    //         ticEvent.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
    //         ticEvent.begtm = DateFunction.convertTimeToDBFormat(ticEvent.begtm)
    //         ticEvent.endtm = DateFunction.convertTimeToDBFormat(ticEvent.endtm)
    //         const ticEventService = new TicEventService();
    //         console.log('*00********************handleCopyClick*************************')
    //         await ticEventService.postTicEventCopy(ticEvent);

    //         props.setVisible(false);
    //     } catch (err) {
    //         toast.current.show({
    //             severity: "error",
    //             summary: "Action ",
    //             detail: `${err.response.data.error}`,
    //             life: 1000,
    //         });
    //     }
    // };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const showDeleteAllDialog = () => {
        setDeleteAllDialogVisible(true);
    };
    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const ticEventService = new TicEventService();
            await ticEventService.deleteTicEvent(ticEvent);
            props.handleDialogClose({ obj: ticEvent, eventTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };
    const handleDeleteAllClick = async () => {
        try {
            setSubmitted(true);
            const ticEventService = new TicEventService();
            await ticEventService.deleteAllTicEvent(ticEvent);
            props.handleDialogClose({ obj: ticEvent, eventTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteAllDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };
    const onInputChange = (e, type, name) => {
        let val = ''
        if (type === "options") {
            if (name == "tp") {
                setDdTpItem(e.value);
                ticEvent.ctp = e.value.code
                ticEvent.ntp = e.value.name
            } else if (name == "ctg") {
                setDdCtgItem(e.value);
                ticEvent.cctg = e.value.code
                ticEvent.nctg = e.value.name
            } else if (name == "mesto") {
                setDdMestoItem(e.value);
                ticEvent.cmesto = e.value.code
                ticEvent.nmesto = e.value.name
            } else if (name == "season") {
                setDdSeasonItem(e.value);
                ticEvent.cseason = e.value.code
                ticEvent.nseason = e.value.name
            } else if (name == "event") {
                setDdEventItem(e.value);
                ticEvent.cevent = e.value.code
                ticEvent.nevent = e.value.name
            } else if (name == "loc") {
                setDdLocItem(e.value);
                ticEvent.cloc = e.value.code
                ticEvent.nloc = e.value.name
            } else if (name == "tmp") {
                setDropdownTmpItem(e.value);
            } else if (name == "mapa") {
                setDropdownMapaItem(e.value);
            } else {
                setDropdownItem(e.value);
            }
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    ticEvent.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    ticEvent.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else if (type === "auto") {
            let timeout = null
            switch (name) {
                case "par":
                    if (selectedPar === null) {
                        setParValue(e.target.value.textx || e.target.value);
                    } else {
                        setSelectedPar(null);
                        setParValue(e.target.value.textx || e.target.value.textx);
                    }
                    console.log(e.target, "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", e.target.value)
                    ticEvent.par = e.target.value.id
                    ticEvent.npar = e.target.value.textx
                    ticEvent.cpar = e.target.value.code
                    // Postavite debouncedSearch nakon 1 sekunde neaktivnosti unosa
                    clearTimeout(searchTimeout);
                    timeout = setTimeout(() => {
                        setDebouncedSearch(e.target.value);
                    }, 400);
                    break;
                case "mesto":
                    if (selectedLoc === null) {
                        setLocValue(e.target.value.textx || e.target.value);
                    } else {
                        setSelectedLoc(null);
                        setLocValue(e.target.value.textx || e.target.value.textx);
                    }
                    console.log(e.target, "###########################-auto-##################setDebouncedLocSearch############", e.target.value)
                    ticEvent.mesto = e.target.value.id
                    ticEvent.nmesto = e.target.value.textx
                    ticEvent.cmesto = e.target.value.code
                    // Postavite debouncedSearch nakon 1 sekunde neaktivnosti unosa
                    clearTimeout(searchTimeout);
                    timeout = setTimeout(() => {
                        setDebouncedLocSearch(e.target.value);
                    }, 400);
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }


            setSearchTimeout(timeout);
            val = (e.target && e.target.value && e.target.value.id) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticEvent = { ...ticEvent };
        _ticEvent[`${name}`] = val;
        if (name === `textx`) _ticEvent[`text`] = val

        setTicEvent(_ticEvent);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    const hideDeleteAllDialog = () => {
        setDeleteAllDialogVisible(false);
    };

    const itemTemplate = (item) => {
        return (
            <>
                <div>
                    {item.textx}
                    {` `}
                    {item.code}
                </div>
                <div>
                    {item.id}
                </div>
            </>
        );
    };
    const mestoTemplate = (item) => {
        return (
            <>
                <div>
                    {item.textx}
                    {` `}
                    {item.code}
                </div>
                <div>
                    {item.id}
                </div>
            </>
        );
    };

    const handleWebMapDialogClose = (newObj) => {
        setTicEventWLVisible(false);
    };


    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
            {loading ? (
                    <div className="card">
                        <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
                    </div>
                ) : (null)}
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={ticEvent.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvent.code })}
                            />
                            {submitted && !ticEvent.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={ticEvent.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvent.textx })}
                            />
                            {submitted && !ticEvent.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="par">{translations[selectedLanguage].Organizer} *</label>
                            <div className="p-inputgroup flex-1">
                                <AutoComplete
                                    value={parValue}
                                    suggestions={filteredPars}
                                    completeMethod={() => { }}
                                    onSelect={handleSelect}
                                    onChange={(e) => onInputChange(e, "auto", 'par')}
                                    itemTemplate={itemTemplate} // Koristite itemTemplate za prikazivanje objekata
                                    placeholder="Pretraži"
                                />
                                <Button icon="pi pi-search" onClick={(e) => handleParLClick(e, "local")} className="p-button" />
                            </div>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="par">...</label>
                            <InputText
                                id="npar"
                                value={ticEvent.npar}
                                required
                            />
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="season">{translations[selectedLanguage].Season} *</label>
                            <Dropdown id="season"
                                value={ddSeasonItem}
                                options={ddSeasonItems}
                                onChange={(e) => onInputChange(e, "options", 'season')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.season })}
                            />
                            {submitted && !ticEvent.season && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        {/* <div className="field col-12 md:col-10">
                            <label htmlFor="par">{translations[selectedLanguage].Organizer}</label>
                            <Dropdown id="par"
                                value={ddOrganizatorItem}
                                options={ddOrganizatorItems}
                                onChange={(e) => onInputChange(e, "options", 'par')}
                                filter
                                optionLabel="name"
                                placeholder="Select One"
                            />
                        </div> */}
                        <div className="field col-12 md:col-2">
                            <label htmlFor="mesto">{translations[selectedLanguage].MestoOdrzavanja} *</label>
                            <div className="p-inputgroup flex-1">
                                <AutoComplete
                                    value={mestoValue}
                                    suggestions={filteredLocs}
                                    completeMethod={() => { }}
                                    onSelect={handleLocSelect}
                                    onChange={(e) => onInputChange(e, "auto", 'mesto')}
                                    itemTemplate={mestoTemplate} // Koristite itemTemplate za prikazivanje objekata
                                    placeholder="Pretraži"
                                />
                                <Button icon="pi pi-search" onClick={(e) => handleLocLClick(e, "local")} className="p-button" />
                            </div>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="mesto">...</label>
                            <InputText
                                id="nmesto"
                                value={ticEvent.nmesto}
                                required
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="loc">{translations[selectedLanguage].Scena} *</label>
                            <Dropdown id="loc"
                                value={ddLocItem}
                                options={ddLocItems}
                                onChange={(e) => onInputChange(e, "options", 'loc')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.loc })}
                            />
                            {submitted && !ticEvent.loc && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        {/* <div className="field col-12 md:col-6">
                            <label htmlFor="event">{translations[selectedLanguage].ParentEvent}</label>
                            <Dropdown id="event"
                                value={ddEventItem}
                                options={ddEventItems}
                                onChange={(e) => onInputChange(e, "options", 'event')}
                                filter
                                optionLabel="name"
                                placeholder="Select One"
                            />
                        </div> */}
                        <Divider>
                            <div className="inline-flex align-items-center">
                                <i className="pi pi-tag mr-2"></i>
                            </div>
                        </Divider>

                        <div className="field col-12 md:col-12">
                            <label htmlFor="descript">{translations[selectedLanguage].Descript}</label>
                            <InputText
                                id="descript"
                                value={ticEvent.descript} onChange={(e) => onInputChange(e, "text", 'descript')}
                                required
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="ctg">{translations[selectedLanguage].ctg} *</label>
                            <Dropdown id="ctg"
                                value={ddCtgItem}
                                options={ddCtgItems}
                                onChange={(e) => onInputChange(e, "options", 'ctg')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.ctg })}
                            />
                            {submitted && !ticEvent.ctg && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="tp">{translations[selectedLanguage].EventTp} *</label>
                            <Dropdown id="tp"
                                value={ddTpItem}
                                options={ddTpItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                filter
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.tp })}
                            />
                            {submitted && !ticEvent.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="begda">{translations[selectedLanguage].DatProd} *</label>
                            <Calendar
                                value={begda}
                                onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />

                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="begtm">{translations[selectedLanguage].TmProd}</label>
                            <InputText
                                id="begtm"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticEvent.begtm)} onChange={(e) => onInputChange(e, "text", 'begtm')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvent.begtm })}
                            />
                            {submitted && !ticEvent.begtm && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                        
                        <div className="field col-12 md:col-3">
                            <label htmlFor="roenddal">{translations[selectedLanguage].DatEvent} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="endtm">{translations[selectedLanguage].TmEvent}</label>
                            <InputText
                                id="endtm"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticEvent.endtm)} onChange={(e) => onInputChange(e, "text", 'endtm')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvent.endtm })}
                            />
                            {submitted && !ticEvent.endtm && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <Divider>
                            <div className="inline-flex align-items-center" style={{ borderColor: 'blue' }}>
                                <i className="pi pi-tags mr-2"></i>
                            </div>
                        </Divider>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="note">{translations[selectedLanguage].Note}</label>
                            <InputText
                                id="note"
                                value={ticEvent.note} onChange={(e) => onInputChange(e, "text", 'note')}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="mapa">{translations[selectedLanguage].Mapa}</label>
                            <Dropdown id="mapa"
                                value={dropdownMapaItem}
                                options={dropdownMapaItems}
                                onChange={(e) => onInputChange(e, "options", 'mapa')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.mapa })}
                            />
                            {submitted && !ticEvent.tmp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="status">{translations[selectedLanguage].Status}</label>
                            <Dropdown id="status"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'status')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.status })}
                            />
                            {submitted && !ticEvent.status && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="tmp">{translations[selectedLanguage].Template}</label>
                            <Dropdown id="tmp"
                                value={dropdownTmpItem}
                                options={dropdownTmpItems}
                                onChange={(e) => onInputChange(e, "options", 'tmp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.tmp })}
                            />
                            {submitted && !ticEvent.tmp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    {/**/}
                    <div className="card">
                        <div className="flex flex-wrap gap-1">
                            {props.dialog ? (
                                <Button
                                    label={translations[selectedLanguage].Cancel}
                                    icon="pi pi-times"
                                    className="p-button-outlined p-button-secondary"
                                    onClick={handleCancelClick}
                                    outlined
                                />
                            ) : null}
                            <div className="flex-grow-1"></div>
                            <div className="flex flex-wrap gap-1">
                                {(props.eventTip === 'CREATE') ? (
                                    <>
                                        <Button
                                            label={translations[selectedLanguage].Create}
                                            icon="pi pi-check"
                                            onClick={handleCreateClick}
                                            severity="success"
                                            outlined
                                        />
                                        <Button
                                            label={translations[selectedLanguage].CreateNext}
                                            icon="pi pi-check"
                                            onClick={handleCreateClickNext}
                                            severity="success"
                                            outlined
                                        />
                                    </>
                                ) : null}
                                {(props.eventTip !== 'CREATE' && props.eventTip !== 'COPY') ? (
                                    <>
                                        <Button
                                            label={translations[selectedLanguage].Delete}
                                            icon="pi pi-trash"
                                            onClick={showDeleteDialog}
                                            className="p-button-outlined p-button-danger"
                                            outlined
                                        />
                                        <Button
                                            label={translations[selectedLanguage].DeleteAll}
                                            icon="pi pi-trash"
                                            onClick={showDeleteAllDialog}
                                            // className="p-button-outlined p-button-danger"
                                            severity="danger"
                                        // outlined
                                        />
                                    </>
                                ) : null}
                                {(props.eventTip !== 'CREATE' && props.eventTip !== 'COPY') ? (
                                    <>
                                        <Button
                                            label={translations[selectedLanguage].SaveDate}
                                            icon="pi pi-calendar-plus"
                                            onClick={handleSaveDateClick}
                                            severity="warning"
                                        />
                                        <Button
                                            label={translations[selectedLanguage].Save}
                                            icon="pi pi-check"
                                            onClick={handleSaveClick}
                                            severity="success"
                                            outlined
                                        />
                                        <Button
                                            label={translations[selectedLanguage].SaveNext}
                                            icon="pi pi-check"
                                            onClick={handleSaveClickNext}
                                            severity="success"
                                            outlined
                                        />                                        
                                    </>
                                ) : null}
                                {(props.eventTip === 'COPY') ? (
                                    <Button
                                        label={translations[selectedLanguage].Copy}
                                        icon="pi pi-check"
                                        onClick={handleCopyClick}
                                        severity="warning"
                                        raised
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <ConfirmDialog
                        visible={confirmDialogVisible}
                        onHide={() => setConfirmDialogVisible(false)}
                        onConfirm={handleConfirm}
                        uPoruka={'Aktivacija događaja, da li ste sigurni?'}
                    />
                    {/*
                    {showMyComponent && (
                        <TicEvents
                            parameter={"inputTextValue"}
                            ticEvent={ticEvent}
                            ticEvents={ticEvents}
                            updateEventsTip={updateEventsTip}
                            //handleDialogClose={handleDialogClose}
                            setVisible={true}
                            dialog={false}
                            eventsTip={eventsTip}
                        />
                    )}
                    */}
                </div>
            </div>


            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={ticEvent.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
            <DeleteDialog
                visible={deleteAllDialogVisible}
                inAction="deleteall"
                item={ticEvent.text}
                onHide={hideDeleteAllDialog}
                onDelete={handleDeleteAllClick}
            />
            <Dialog
                header={translations[selectedLanguage].ParList}
                visible={cmnParLVisible}
                style={{ width: '90%', height: '1400px' }}
                onHide={() => {
                    setCmnParLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {cmnParLVisible &&
                    <CmnParL
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        onTaskComplete={handleCmnParLDialogClose}
                        setCmnParLVisible={setCmnParLVisible}
                        dialog={true}
                        lookUp={true}
                        parentData={true}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].VenueList}
                visible={cmnLocLVisible}
                style={{ width: '90%', height: '1400px' }}
                onHide={() => {
                    setCmnLocLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {cmnLocLVisible &&
                    <CmnLocL
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        onTaskComplete={handleCmnLocLDialogClose}
                        setCmnLocLVisible={setCmnLocLVisible}
                        dialog={true}
                        lookUp={true}
                        parentData={true}
                        loctpId={'XV'}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventWList}
                visible={ticEventWLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventWLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticEventWLVisible &&
                    <TicEventWL
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        //setTicArtLVisible={setTicArtLVisible} 
                        setTicEventWLVisible={setTicEventWLVisible}
                        setTicEventobjLVisible={setTicEventobjLVisible}
                        setTicEventartLVisible={setTicEventartLVisible}
                        setTicEventattsLVisible={setTicEventattsLVisible}
                        dialog={true}
                        lookUp={true}
                        eventArt={true}
                        onTaskComplete={handleWebMapDialogClose}
                    />}
            </Dialog>            
        </div>
    );
};

export default TicEvent;
