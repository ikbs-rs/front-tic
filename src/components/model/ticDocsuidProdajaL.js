import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import moment from "moment";
import axios from 'axios';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from 'primereact/dropdown';
import { TicEventattsService } from "../../service/model/TicEventattsService";
import { TicDocsuidService } from "../../service/model/TicDocsuidService";
import { TicDocsdiscountService } from "../../service/model/TicDocsdiscountService";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Divider } from 'primereact/divider';
import { Toast } from "primereact/toast";
import { RadioButton } from "primereact/radiobutton";
import { TicDocsService } from '../../service/model/TicDocsService';
import { CmnTerrService } from '../../service/model/cmn/CmnTerrService';
import { translations } from "../../configs/translations";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import { CmnParService } from "../../service/model/cmn/CmnParService";
import { TicDocService } from "../../service/model/TicDocService";
import TicDocsdiscountL from "./ticDocsdiscountL";
import AutoParAddress from "../auto/autoParAddress";
import DateFunction from "../../utilities/DateFunction";
import { TicDocdeliveryService } from "../../service/model/TicDocdeliveryService"
import Token from "../../utilities/Token";
import AutoParProdaja from '../auto/autoParProdaja';
import { classNames } from 'primereact/utils';
import env from "../../configs/env"

// import Worker from 'worker-loader!../../workers/docuidWorker.js';


const TicDocsuidProdajaL = forwardRef((props, ref) => {
    // console.log(props, "00-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    const objName = "tic_docsuid";
    const objCmnPar = "cmn_par";
    const objTicDocdelivery = "tic_docdelivery";
    const userId = localStorage.getItem('userId') || -1
    const toast = useRef(null);
    const objTicDocsdiscount = "tic_docsdiscount";
    const emptyTicDocsdiscount = EmptyEntities[objTicDocsdiscount];
    const emptyTicDocdelivery = EmptyEntities[objTicDocdelivery];
    // emptyTicDocdelivery.id = props.ticDoc.id;
    emptyTicDocdelivery.doc = props.ticDoc.id;
    emptyTicDocdelivery.status = '1';
    emptyTicDocdelivery.usr = userId;
    emptyTicDocdelivery.dat = DateFunction.currDate();
    emptyTicDocdelivery.tmrec = DateFunction.currDatetime();

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicEvent = EmptyEntities[objName];
    const emptyCmnPar = EmptyEntities[objCmnPar];
    const [cmnPar, setCmnPar] = useState(emptyCmnPar);
    const [ticDocdelivery, setTicDocdelivery] = useState(emptyTicDocdelivery)
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticDocsuids, setTicDocsuids] = useState([]);
    const [_ticDocsuids, set_ticDocsuids] = useState([]);
    const [ticDoc, setTicDoc] = useState(props.ticDoc);

    const [cmnTickettps, setCmnTickettps] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedValues, setSelectedValues] = useState({});
    const [activeStates, setActiveStates] = useState({});
    const [highlightedId, setHighlightedId] = useState(null);

    const [valueTA, setValueTA] = useState('');
    const [note, setNote] = useState('');
    let [refresh, setRefresh] = useState(0);
    const [uniqueDocs, setUniqueDocs] = useState([]);
    const [ppNobj, setPpNobj] = useState([]);
    const [ppPrikazi, setPpPrikazi] = useState([]);
    const [showDiscount, setShowDiscount] = useState(false);
    const [discountRefresh, setDiscountRefresh] = useState(0);
    let [autoParaddressKey1, setAutoParaddressKey1] = useState(0);
    const [checkedKupac, setCheckedKupac] = useState(false);

    const colors = ["#f5f5f5", "#f2f2da", "#c2d4f2", "#ecd7f7", "#a0a0a0", "#ffa0a0"];
    const [eventColors, setEventColors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [requiredFields, setRequiredFields] = useState([]);
    const [reservationStatus, setReservationStatus] = useState(0);

    const [ddTicDocdeliveryterrItem, setDdTicDocdeliveryterrItem] = useState(null);
    const [ddTicDocdeliveryterrItems, setDdTicDocdeliveryterrItems] = useState(null);
    const [ticDocdeliveryterrItem, setTicDocdeliveryterrItem] = useState(null);
    const [ticDocdeliveryterrItems, setTicDocdeliveryterrItems] = useState(null);
    const [delivryStatus, setDeliveryStatus] = useState(1);

    const [activeIndex, setActiveIndex] = useState(null);
    const [eventUslov, setEventUslov] = useState({});
    const [checkedCL, setCheckedCL] = useState(false);
    const [checkedSZ, setCheckedSZ] = useState(false);

    let brojReda = 0

    useImperativeHandle(ref, () => ({
        setDocsuidSubmitted: () => handelSubbmitted(),
        openDeliveryTab,
    }));
    const openDeliveryTab = () => {
        setActiveIndex(0);
    };
    useEffect(() => {
        async function fetchData() {
            try {
                if (ticDoc.reservation == 1) {
                    const endDate = moment(ticDoc.endtm, 'YYYYMMDDHHmmss');
                    const now = moment();

                    if (endDate.isAfter(now)) {
                        setReservationStatus(1);
                    }
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [ticDoc]);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnParService = new CmnParService();
                const dataPar = await cmnParService.getCmnParP(ticDoc.usr);
                // let _cmnPar = {...cmnPar}
                let _cmnPar = { ...dataPar[0] };
                const ticDocsuidService = new TicDocsuidService();
                const data = await ticDocsuidService.getProdajaListaP(props.ticDoc.id);
                // console.log(data, "H 0.0.0 HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
                const uniqueDocsArray = Array.from(new Set(data.map(item => item.event)));
                setUniqueDocs(uniqueDocsArray);
                const sortedData = data.sort((a, b) => {
                    if (a.nevent < b.nevent) return -1;
                    if (a.nevent > b.nevent) return 1;
                    if (a.nartikal < b.nartikal) return -1;
                    if (a.nartikal > b.nartikal) return 1;
                    if (a.row < b.row) return -1;
                    if (a.row > b.row) return 1;
                    return a.seat - b.seat;
                });
                // const updatedData = sortedData.map(item => ({
                //     ...item,
                //     show: 'no'
                // }));
                // console.log(sortedData, "#00#########################################################################")
                const updatedData = await Promise.all(sortedData.map(async (item) => {
                    const ticEventattsService = new TicEventattsService();
                    const eventatt = await ticEventattsService.getTicEventatts11LP(item.event);

                    // Filtriraj eventatt podatke u tri posebna niza
                    const eventatt1 = eventatt.filter(e => e.code === "11.01.");
                    const eventatt2 = eventatt.filter(e => e.code === "11.02.");
                    const eventatt3 = eventatt.filter(e => e.code === "11.03.");
                    /***************************************************************************************************************** */
                    /*************************************************************************** */
                    const _eventUslov = {
                        "cl": 0,
                        "sz": 0,
                    }
                    const ticEventatts0Service = new TicEventattsService();
                    const dataE = await ticEventatts0Service.getCLSZGR(item.event);

                    const clData = dataE.find(item => item.code == '10.01.');
                    const szData = dataE.find(item => item.code == '10.02.');

                    if (clData) {
                        _eventUslov.cl = 1
                    }
                    if (szData) {
                        _eventUslov.sz = 1
                    }
                    setEventUslov(_eventUslov)

                    /*************************************************************************** */
                    const _eventUslovValue = {
                        "cl": false,
                        "clvalue": "",
                        "sz": false,
                        "szvalue": ""
                    }
                    const ticEventattsServiceA = new TicEventattsService();
                    const _dataCL = await ticEventattsServiceA.getDocsCLSZ(item.event);
                    const dataCL = _dataCL || []


                    if (_eventUslov.cl == 1) {
                        // Filtriranje za code == '00.00.'
                        const filteredData00 = dataCL.filter(item => item.code === '00.00.');

                        // if (dataCL.code === '00.00.') {
                        // Provera za email ili uid u filteredData00
                        const match00 = filteredData00.find(item =>
                            item.email === _cmnPar.email || item.uid === _cmnPar.uid
                        );

                        // console.log(match00, "qqqWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", _cmnPar)
                        if (match00) {
                            // console.log(match00, "aaaaWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", item)
                            _eventUslovValue.cl = true
                            _eventUslovValue.clvalue = match00.barcodevalue || 'BK'
                            item.brojcl = item.brojcl || _eventUslovValue.clvalue
                        }
                        // }
                    } else {
                        _eventUslovValue.cl = true
                    }

                    if (_eventUslov.sz == 1) {
                        // Filtriranje za code == '00.01.'
                        const filteredData01 = dataCL.filter(item => item.code === '00.01.');

                        // Provera za email ili uid u filteredData01
                        const match01 = filteredData01.find(item =>
                            item.email === _cmnPar.email || item.uid === _cmnPar.uid
                        );
                        if (match01) {
                            _eventUslovValue.sz = true
                            _eventUslovValue.szvalue = match01.barcodevalue || 'BK'
                            item.brojsz = item.brojsz || _eventUslovValue.szvalue
                        }
                    } else {
                        _eventUslovValue.sz = true
                    }

                    /*************************************************************************** */
                    /***************************************************************************************************************** */

                    return {
                        ...item,
                        show: 'no',
                        eventatt1: eventatt1,  // dodaj podniz eventatt1
                        eventatt2: eventatt2,  // dodaj podniz eventatt2
                        eventatt3: eventatt3,  // dodaj podniz eventatt3
                        eventUslov: _eventUslov,
                        eventUslovValue: _eventUslovValue
                    };
                }));
                // console.log(updatedData, "#01HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHaa")
                setTicDocsuids(updatedData)
                set_ticDocsuids(updatedData)
                await assignColorsToEvents(updatedData);
                await setSelectedValues(updatedData.reduce((acc, item) => ({
                    ...acc,
                    [item.id]: item.tickettp
                }), {}));



                await setActiveStates(data.reduce((acc, item) => ({ ...acc, [item.id]: item.delivery == '1' }), {}));
                // console.log(updatedData, "H 0.0 HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
                updatedData.reduce((acc, item) => ({
                    ...acc,
                    [item.id]: item.tickettp
                }), {})



            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [props.ticDoc.id, ticDoc.usr, refresh]);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.PROD1_BACK_URL}/prodaja/?stm=tic_eventterrnaknade_v&objid=${props.ticEvent?.id}&sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };
                // console.log(url, "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
                const response = await axios.get(url, { headers });
                // console.log(response.data, "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
                const data = response.data.items || response.data.item;

                setTicDocdeliveryterrItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicDocdeliveryterrItems(dataDD);
                setDdTicDocdeliveryterrItem(dataDD.find((item) => item.code === ticDocdelivery.country) || null);
                if (ticDocdelivery.country) {
                    const foundItem = data.find((item) => item.id === ticDocdelivery.country);
                    setTicDocdeliveryterrItem(foundItem || null);
                    // ticDocdelivery.cterr = foundItem.code
                    // ticDocdelivery.vterr = foundItem.textx
                }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [props.ticDoc, refresh, ticDocdelivery]);

    useEffect(() => {
        async function fetchData() {
            try {
                const endDate = moment(ticDoc.endda, 'YYYYMMDD');
                const now = moment();

                if (endDate.isAfter(now)) {
                    setDeliveryStatus(0);
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [ticDoc]);

    const proveriTapkarosa = async (itemUnit) => {
        console.log(itemUnit.eventatt3, "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
        return props.handleDocsuidProdaja(itemUnit)
    }
    const handelUnitSubbmitted = (itemUnit) => {
        // Prođi kroz svaki ID i njegove atribute iz requiredFields
        for (const field of requiredFields) {
            const item = ticDocsuids.find(doc => doc.id === field.id); // Nađi odgovarajući dokument u ticDocsuids
            if (!item || itemUnit.id != field.id) {
                console.error(`ID ${field.id} ne postoji u ticDocsuids.`);
                continue; // Preskoči ako ID nije pronađen
            }

            // Provera za svaki atribut
            // for (const attribute of field.attributes) {
            //     if (!item[attribute] || item[attribute].trim() === "") {
            //         setSubmitted(true)
            //         console.error(`Polje "${attribute}" za ID ${field.id} nije popunjeno.`);
            //         toast.current.show({
            //             severity: "error",
            //             summary: "Validacija greška",
            //             detail: `Polje "${attribute}" za stavku ${field.id} nije popunjeno.`,
            //             life: 3000,
            //         });

            //         return false; // Zaustavi dalje izvršenje koda
            //     }
            // }
            for (const attribute of field.attributes) {
                let value = item[attribute];

                // **Osiguramo da `value` bude string pre trim()**
                if (value === undefined || value === null || (typeof value !== "string" && typeof value !== "number")) {
                    setSubmitted(true);
                    console.error(`Polje "${attribute}" za ID ${field.id} nije popunjeno.`);
                    toast.current.show({
                        severity: "error",
                        summary: "Validacija greška",
                        detail: `Polje "${attribute}" za stavku ${field.id} nije popunjeno.`,
                        life: 3000,
                    });
                    return false;
                }

                // **Ako je broj, konvertuj u string**
                if (typeof value === "number") {
                    value = value.toString();
                }

                if (value.trim() === "") {
                    setSubmitted(true);
                    console.error(`Polje "${attribute}" za ID ${field.id} nije popunjeno.`);
                    toast.current.show({
                        severity: "error",
                        summary: "Validacija greška",
                        detail: `Polje "${attribute}" za stavku ${field.id} nije popunjeno.`,
                        life: 3000,
                    });
                    return false;
                }
            }
        }

        if (proveriTapkarosa (itemUnit)) {
            setSubmitted(true);
            return true
        }
        return false;

    }

    const handelSubbmitted = () => {
        // console.log(ticDocsuids, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH-Provera da li su sva polja popunjena...");

        // Prođi kroz svaki ID i njegove atribute iz requiredFields
        for (const field of requiredFields) {
            const item = ticDocsuids.find(doc => doc.id === field.id); // Nađi odgovarajući dokument u ticDocsuids
            if (!item) {
                console.error(`ID ${field.id} ne postoji u ticDocsuids.`);
                continue; // Preskoči ako ID nije pronađen
            }

            // Provera za svaki atribut
            for (const attribute of field.attributes) {
                if (!item[attribute] || item[attribute].trim() === "") {
                    setSubmitted(true)
                    console.error(`Polje "${attribute}" za ID ${field.id} nije popunjeno.`);
                    toast.current.show({
                        severity: "error",
                        summary: "Validacija greška",
                        detail: `Polje "${attribute}" za stavku ${field.id} nije popunjeno!`,
                        life: 3000,
                    });

                    return false; // Zaustavi dalje izvršenje koda
                }
            }
        }
        const ticDocsuidService = new TicDocsuidService();
        for (const row of ticDocsuids) {
            ticDocsuidService.putTicDocsuid(row);
        }

        // console.log("Sva polja su popunjena.");
        setSubmitted(true);
        return true
    };


    useEffect(() => {
        const fieldsToUpdate = ticDocsuids.map(item => {
            console.log(item, "000HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", item.kupac)
            const attributes = [];
            if (item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "first") : item.eventatt2.some(att => att.nvalue === "first"))) {
                attributes.push("first");
            }
            if (item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "last") : item.eventatt2.some(att => att.nvalue === "last"))) {
                attributes.push("last");
            }
            if (item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "uid") : item.eventatt2.some(att => att.nvalue === "uid"))) {
                attributes.push("uid");
            }
            if (item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "birthday") : item.eventatt2.some(att => att.nvalue === "birthday"))) {
                attributes.push("birthday");
            }
            if (item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "adress") : item.eventatt2.some(att => att.nvalue === "adress"))) {
                attributes.push("adress");
            }
            if (item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "city") : item.eventatt2.some(att => att.nvalue === "city"))) {
                attributes.push("city");
            }
            if (item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "zip") : item.eventatt2.some(att => att.nvalue === "zip"))) {
                attributes.push("zip");
            }
            if (item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "country") : item.eventatt2.some(att => att.nvalue === "country"))) {
                attributes.push("country");
            }
            if (item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "phon") : item.eventatt2.some(att => att.nvalue === "phon"))) {
                attributes.push("phon");
            }
            if (item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "email") : item.eventatt2.some(att => att.nvalue === "email"))) {
                attributes.push("email");
            }
            if (item.eventUslov.cl == 1) {
                attributes.push("brojcl");
            }
            if (item.eventUslov.sz == 1) {
                attributes.push("brojsz");
            }
            return { id: item.id, attributes };
        });
        // console.log(fieldsToUpdate, "03HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        setRequiredFields(fieldsToUpdate);
    }, [ticDocsuids, refresh]);

    const assignColorsToEvents = (data) => {
        const eventColorMap = {};
        let colorIndex = 0;
        let previousEvent = null;

        data.forEach(item => {
            if (item.event !== previousEvent) {
                eventColorMap[item.event] = colors[colorIndex % colors.length];
                colorIndex++;
                previousEvent = item.event;
            }
        });

        setEventColors(eventColorMap);
    };

    /**************************** COLOR ************************************ */
    useEffect(() => {
        async function fetchData() {

            try {
                const ticDocdeliveryService = new TicDocdeliveryService();
                const data = await ticDocdeliveryService.getListaByDocP(props.ticDoc.id);
                const _delivery = data[0]
                if (_delivery) {
                    // console.log(_delivery, "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
                    setTicDocdelivery(_delivery);
                    setValueTA(_delivery.address || '');  // Ensure it's non-null
                    setNote(_delivery.note || '');
                    setDdTicDocdeliveryterrItem(ddTicDocdeliveryterrItems.find((item) => item.code === _delivery.country) || null);
                    setAutoParaddressKey1(prev => prev + 1)
                    // } else {
                    //     setValueTA('');
                    //     setNote('');
                }

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [props.ticDoc, refresh]);

    /******************************************************************************************** */
    // useEffect(() => {
    //     const fetchTokenAndPostMessage = async () => {
    //         try {
    //             const tokenLocal = await Token.getTokensLS();

    //             if (tokenLocal && props.ticDoc.id) {
    //                 const worker = new Worker(new URL('../../workers/docuidWorker.js', import.meta.url));

    //                 worker.onmessage = (e) => {
    //                     const { action, result } = e.data;
    //                     if (action === 'setTicDocsuids') {
    //                         console.log(result, "AAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBBBBBBB")
    //                         setTicDocsuids(result);
    //                         assignColorsToEvents(result);
    //                         setSelectedValues(result.reduce((acc, item) => ({
    //                             ...acc,
    //                             [item.id]: item.tickettp
    //                         }), {}));
    //                         setActiveStates(result.reduce((acc, item) => ({ ...acc, [item.id]: item.delivery == '1' }), {}));
    //                     }
    //                 };

    //                 worker.postMessage({
    //                     action: 'fetchTicDocsuidData',
    //                     data: {
    //                         ticDocId: props.ticDoc.id,
    //                         par1: props.ticDoc.usr,
    //                         selectedLanguage: selectedLanguage,
    //                         token: tokenLocal.token,
    //                         refreshToken: tokenLocal.refreshToken
    //                     }
    //                 });

    //                 worker.onerror = (error) => {
    //                     console.error('Worker error:', error);
    //                 };

    //                 return () => worker.terminate();
    //             }
    //         } catch (error) {
    //             console.error('Error fetching token:', error);
    //         }
    //     };

    //     fetchTokenAndPostMessage();
    // }, [props.ticDoc.id]);





    /******************************************************************************************** */


    // useEffect(() => {
    //     async function fetchAdditionalData() {
    //         try {
    //             const ticDocsService = new TicDocsService();
    //             const allNobjs = [];
    //             const attCodes = ['11.01.', '11.02.', '11.03.'];
    //             for (const row of attCodes) {
    //                 for (const doc of uniqueDocs) {
    //                     const data = await ticDocsService.getEventattsobjcode(doc, row, 'XATTB');
    //                     data.forEach(item => {
    //                         const _obj = { doc: doc, catt: item.catt, nobj: item.nobj };
    //                         if (!allNobjs.some(obj => JSON.stringify(obj) === JSON.stringify(_obj))) {
    //                             allNobjs.push(_obj);
    //                         }
    //                     });
    //                 }
    //             }
    //             console.log(allNobjs, 'H 02 HHHHHH-555555555555555555555555555555555555555555555555555555555555555', uniqueDocs);
    //             setPpNobj(allNobjs);

    //             const newAa = [];

    //             for (const ticDocItem of ticDocsuids) {
    //                 const doc = ticDocItem.doc;
    //                 // console.log(doc, 'H 02.1 HHHHHH-555555555555555555555555555555555555555555555555555555555555555');
    //                 for (const obj of allNobjs) {
    //                     // console.log(ticDocItem.doc, obj.doc, 'H 02.1 HHHHHH-555555555555555555555555555555555555555555555555555555555555555');
    //                     if (obj.doc === doc) {
    //                         const catt = obj.catt;
    //                         const first = obj.nobj === 'first';
    //                         const last = obj.nobj === 'last';

    //                         newAa.push({ doc, catt, first, last });
    //                     }
    //                 }
    //             }
    //             // console.log(newAa, 'H 02 HHHHHH-555555555555555555555555555555555555555555555555555555555555555');
    //             setPpPrikazi(newAa)
    //         } catch (error) {
    //             console.error("Error fetching additional data:", error);
    //         }
    //     }
    //     if (uniqueDocs.length > 0) {
    //         fetchAdditionalData();
    //     }
    // }, [uniqueDocs]);

    //--------------------------------------------------------------------------------------------------------------------------------/
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const ticDocsService = new TicDocsService();
                const data = await ticDocsService.getCmnObjByTpCodeP('t.code', 'XTCTP', abortController.signal);
                setCmnTickettps(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnParService = new CmnParService();
                const data = await cmnParService.getCmnParP(ticDoc.usr);
                setCmnPar(data[0]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);
    const handleChange = async (e, itemId, item) => {
        // console.log(itemId, "55555555555555555555555555555555", e.value, "5555555555555555", item)
        setSelectedValues(prev => ({
            ...prev,
            [itemId]: e.value
        }));
        const ticDocService = new TicDocService();
        await ticDocService.postTicDocSetValue('tic_docs', 'tickettp', e.value, item.docs);
        props.setRefresh(prev => prev + 1)
    };

    const handleSwitchChange = async (e, itemId, item) => {

        setActiveStates(prev => ({ ...prev, [itemId]: e.value }));
        // const _ticDocs = ticDocsuids.find((item) => item.id === itemId)
        const value = e.value ? '1' : '0'
        const ticDocService = new TicDocService();
        await ticDocService.postTicDocSetValue('tic_docs', 'delivery', value, item.docs);
        props.setRefresh(prev => prev + 1)
    };

    const handleAllParr = async (e, item) => {
        e.preventDefault(); // Prevent default action if necessary
        const _cmnPar = { ...cmnPar }
        if (_cmnPar.tp == 2) {
            const parts = _cmnPar.textx.split(' '); // Podeli string na delove prema razmaku
            _cmnPar.first = parts.slice(0, 1)[0]; // Prvi deo ide u `first`
            _cmnPar.last = parts.slice(1).join(' '); // Svi ostali delovi spojeni u `last`
        }
        // console.log(_cmnPar, "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
        // setHighlightedId(item.id);
        const ticDocsuidService = new TicDocsuidService();
        const updatedItem = await ticDocsuidService.postTicDocsuidParAll(_cmnPar, ticDoc.id);
        // console.log(updatedItem, "02HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        setRefresh(prev => prev + 1)
        // Možete ovde implementirati dalje logike kao što je otvaranje modalnog prozora, ažuriranje stanja itd.
    };

    const handleAllNullParr = async (e, item) => {
        e.preventDefault(); // Prevent default action if necessary

        // setHighlightedId(item.id);
        const ticDocsuidService = new TicDocsuidService();
        await ticDocsuidService.postTicDocsuidParAllNull(cmnPar, ticDoc.id);
        setRefresh(prev => prev + 1)
        // Možete ovde implementirati dalje logike kao što je otvaranje modalnog prozora, ažuriranje stanja itd.
    };

    const handleDeliveryClick = async (item, e) => {
        try {
            e.preventDefault(); // Prevent default action if necessary
            const _ticDocdelivery = { ...ticDocdelivery }
            if (valueTA) {
                emptyTicDocdelivery.adress = valueTA
                _ticDocdelivery.adress = valueTA
            }
            emptyTicDocdelivery.note = note
            _ticDocdelivery.note = note
            // console.log(_ticDocdelivery, "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", valueTA)

            const ticDocdeliveryService = new TicDocdeliveryService();
            if (_ticDocdelivery?.id && _ticDocdelivery?.id != null) {
                emptyTicDocdelivery.id = ticDocdelivery.id
                await ticDocdeliveryService.putTicDocdelivery(_ticDocdelivery);
            } else {
                _ticDocdelivery.id = props.ticDoc.id
                await ticDocdeliveryService.postTicDocdelivery(_ticDocdelivery);
            }
            setTicDocdelivery(_ticDocdelivery)
            // console.log(e, "******* Clicked item details:", item);

            toast.current.show({
                severity: 'success', summary: 'Success',
                detail: 'Podatci za isporuku uspešno snimljeni',
                life: 3000
            });
            props.handleDelivery()
            props.setRefresh(prev => prev + 1)
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

    const handlePosetilacClick = async (item, e) => {
        // console.log(item, "H-UNIT-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        if (!handelUnitSubbmitted(item)) {
            return
        };
        // console.log(item, "H-item-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        e.preventDefault(); // Prevent default action if necessary
        const ticDocsuidService = new TicDocsuidService();
        await ticDocsuidService.postTicDocsuidPosetilac(item, item.docs);
        setRefresh(prev => prev + 1)
        setHighlightedId(item.id);
        // console.log(e, "******* Clicked item details:", item);

    };

    const handleParClick = async (item, cmnPar, e) => {
        e.preventDefault(); // Prevent default action if necessary
        const ticDocsuidService = new TicDocsuidService();
        await ticDocsuidService.postTicDocsuidPar(cmnPar, item.docs);
        setRefresh(prev => prev + 1)
        setHighlightedId(item.id);
        // console.log(e, "******* Clicked item details:", item);

    };

    /***************************************************************************************** */
    const handleChangeKupac = async (item, e) => {
        try {
            const updatedKupacValue = item.kupac === 1 ? 0 : 1;
            const updatedItem = { ...item, kupac: updatedKupacValue };
            const _cmnPar = { ...cmnPar }
            // console.log(updatedItem, "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUkupacUUUUUUUUUUUUUUUUUUUUUUUUU")
            // Ažuriranje na serveru
            if (_cmnPar.tp == 2) {
                const parts = _cmnPar.textx.split(' '); // Podeli string na delove prema razmaku
                _cmnPar.first = parts.slice(0, 1)[0]; // Prvi deo ide u `first`
                _cmnPar.last = parts.slice(1).join(' '); // Svi ostali delovi spojeni u `last`
            }
            updatedItem.first = updatedKupacValue == 1 ? _cmnPar?.first || _cmnPar?.text || _cmnPar?.textx : item.first
            updatedItem.last = updatedKupacValue == 1 ? _cmnPar?.last || _cmnPar?.text || _cmnPar?.textx : item.last
            updatedItem.uid = updatedKupacValue == 1 ? _cmnPar.idnum : item.uid
            updatedItem.adress = updatedKupacValue == 1 ? _cmnPar?.address : item.adress
            updatedItem.city = updatedKupacValue == 1 ? _cmnPar?.place : item.city
            updatedItem.country = updatedKupacValue == 1 ? _cmnPar?.country : item.country
            updatedItem.phon = updatedKupacValue == 1 ? _cmnPar?.tel : item.phon
            updatedItem.email = updatedKupacValue == 1 ? _cmnPar?.email : item.email
            updatedItem.par = updatedKupacValue == 1 ? _cmnPar?.id : item.par
            updatedItem.birthday = updatedKupacValue == 1 ? _cmnPar?.birthday : item.birthday
            updatedItem.kupac = updatedKupacValue
            console.log(updatedItem, "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUkupacUUUUUUUUUUUUUUUUUUUUUUUUU", cmnPar)
            const ticDocsuidService = new TicDocsuidService();
            await ticDocsuidService.putTicDocsuid(updatedItem);

            // Ažuriranje lokalnog stanja
            setTicDocsuids((prevState) =>
                prevState.map((docItem) =>
                    // docItem.id === item.id ? { ...docItem, kupac: updatedKupacValue } : docItem
                    docItem.id === item.id ? { ...updatedItem } : docItem
                )
            );
        } catch (error) {
            console.error("Error updating Kupac value:", error);
        }
    };
    /***************************************************************************************** */

    const handleDiscountEventDelete = async (item, e) => {
        const ticDocsdiscountService = new TicDocsdiscountService();
        // console.log(emptyTicDocsdiscount, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", item)
        const data = await ticDocsdiscountService.delTicDocsdiscountEventAll(item);
        // setRefresh(prev => prev + 1)
        setTimeout(() => {
            setDiscountRefresh(prev => prev + 1);
            props.setRefresh(prev => prev + 1)
        }, 1000);
        // console.log(e, "******* Clicked item details:", item);
    }

    const handleDiscountDelete = async (item, e) => {
        const ticDocsdiscountService = new TicDocsdiscountService();

        // console.log(emptyTicDocsdiscount, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", item)
        const data = await ticDocsdiscountService.delTicDocsdiscountAll(item);
        // setRefresh(prev => prev + 1)
        setTimeout(() => {
            setDiscountRefresh(prev => prev + 1);
            props.setRefresh(prev => prev + 1)
        }, 1000);
        // console.log(e, "******* Clicked item details:", item);
    }

    const handleDiscountCreate = async (item, e) => {
        const ticDocsdiscountService = new TicDocsdiscountService();
        emptyTicDocsdiscount.docs = item.docs
        const data = await ticDocsdiscountService.postTicDocsdiscount(emptyTicDocsdiscount);
        // setRefresh(prev => prev + 1)
        setDiscountRefresh(prev => prev + 1);
        // console.log(e, "******* Clicked item details:", item);

    };

    const handleDiscountClick = async (item, e) => {
        const _showDiscount = showDiscount ? false : true
        setShowDiscount(_showDiscount)
        const val = _showDiscount ? "show" : "no"
        const field = "show"
        const index = ticDocsuids.findIndex((row) => row.id === item.id);
        if (index !== -1) {
            const updatedTicDocsuids = [...ticDocsuids];

            updatedTicDocsuids[index] = {
                ...updatedTicDocsuids[index],
                [field]: val
            };

            setTicDocsuids(updatedTicDocsuids);
            // console.log(updatedTicDocsuids[index][field], index, field, '333333333333333333333333333333333333333333333444444444444444444444444444444444', ticDocsuids)
        }
        emptyTicDocsdiscount.docs = item.docs
        // const ticDocsdiscountService = new TicDocsdiscountService();
        // const data = await ticDocsdiscountService.postTicDocsdiscount(emptyTicDocsdiscount);
        setRefresh(prev => prev + 1)
        // console.log(e, "******* Clicked item details:", item);

    };

    const handleParClickNull = async (item, e) => {
        e.preventDefault(); // Prevent default action if necessary
        const ticDocsuidService = new TicDocsuidService();
        await ticDocsuidService.postTicDocsuidParNull(cmnPar, item.docs);
        setRefresh(prev => prev + 1)
        setHighlightedId(item.id);
        // console.log(e, "******* Clicked item details:", item);

    };
    const handleDeleteClick = (item, e) => {
        e.preventDefault(); // Prevent default action if necessary
        setRefresh(prev => prev + 1)
        // console.log(e, "******* Clicked item details:", item);
        // Možete ovde implementirati dalje logike kao što je otvaranje modalnog prozora, ažuriranje stanja itd.
    };

    const handleAutoParProdaja = async (ticDoc, cmnPar) => {
        setTicDoc(ticDoc)
        setCmnPar(cmnPar)
        // console.log(e, "******* Clicked item details:", item);

    };

    const onInputChangeL = (e, field, itemId, item) => {

        const index = ticDocsuids.findIndex((row) => row.id === item.id);
        if (index !== -1) {
            const updatedTicDocsuids = [...ticDocsuids];

            updatedTicDocsuids[index] = {
                ...updatedTicDocsuids[index],
                [field]: e.target.value
            };

            setTicDocsuids(updatedTicDocsuids);
            // console.log(updatedTicDocsuids[index][field], index, field, '333333333333333333333333333333333333333333333444444444444444444444444444444444', ticDocsuids)
        }

        // _ticDocsuids[index][field] = value;
        // setFormData(newFormData);
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        let foundItem = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            switch (name) {
                case "country":
                    setDdTicDocdeliveryterrItem(e.value);
                    foundItem = ticDocdeliveryterrItems.find((item) => item.id === val);
                    setTicDocdeliveryterrItem(foundItem || null);
                    ticDocdelivery.nterr = e.value.name
                    ticDocdelivery.cterr = foundItem.code
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticDocdelivery = { ...ticDocdelivery };
        _ticDocdelivery[`${name}`] = val;
        // console.log(ticDocdelivery, "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
        setTicDocdelivery(_ticDocdelivery);
    };


    const DocZaglavlje = () => {
        return (
            <>
                <div className="grid">
                    <div className="field col-12 md:col-12">
                        <AutoParProdaja
                            ticDoc={ticDoc}
                            cmnPar={cmnPar}
                            handleAutoParProdaja={handleAutoParProdaja}
                            setAutoParaddressKey1={setAutoParaddressKey1}
                            handleAction={props.handleAction}
                            setRefresh={props.setRefresh}
                            reservationStatus={reservationStatus}
                        />
                    </div>
                    <div className="field col-12 md:col-12">
                        <div className="p-inputgroup flex-1">
                            <Button icon="pi pi-users" onClick={(e) => handleAllParr(e, "ALL")} style={{ width: '35px' }}
                                raised
                                tooltip={translations[selectedLanguage].PopuniPodatkeKupcaSveStavke}
                                tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                disabled={ticDoc.statuspayment == 1}
                            />
                            <Button icon="pi pi-users" onClick={(e) => handleAllNullParr(e, "ALL")} style={{ width: '35px' }}
                                raised severity="danger"
                                tooltip={translations[selectedLanguage].ObrisiPodatkePosetilacaTransakcije}
                                tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                disabled={ticDoc.statuspayment == 1}
                            />
                            <Button
                                icon="pi pi-percentage"
                                className="p-button"
                                style={{ width: '35px' }}
                                raised severity="danger"
                                onClick={(e) => handleDiscountDelete(props.ticDoc, e)}
                                tooltip={translations[selectedLanguage].ObrisiPopusteTransakcije}
                                tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                disabled={ticDoc.statuspayment == 1}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    };
    /*********************************************************************************** */
    const handleItemSelect = (item) => {
        // console.log("HhandleItemSelectHHHHHHHHHHHHHHHHHHHHHHHHHHHHHUUUUUUUUUUUHHHHHHHHHHHHHHHHHHHHHHHHHHHH", item)
        setValueTA(item);
    };
    const [filteredTerrs, setFilteredTerrs] = useState([]);
    const [terrs, setTerrs] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const cmnTerrService = new CmnTerrService();
                const data = await cmnTerrService.getTpLista('2');

                // Izvlačenje samo `text` vrednosti u novi niz
                const textValues = data.map(item => ({ name: item.text }));
                console.log(data, "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", textValues);
                // Postavljanje filtriranih podataka u state
                setTerrs(textValues);

            } catch (error) {
                console.error("Greška pri učitavanju podataka iz baze:", error);
            }
        }

        fetchData();
    }, []);
    const searchTerrs = (event) => {
        let query = event.query ? event.query.toLowerCase() : ''; // Proveravamo da nije undefined

        let filtered = terrs.filter(t => t.name.toLowerCase().includes(query)); // Proveravamo i t

        setFilteredTerrs(filtered);
    };
    const handleAutoCompleteSelect = (e, selectedItem) => {
        const selectedCountry = e.value.name; // Uzimamo ime zemlje
    
        setTicDocsuids((prev) =>
            prev.map((item) =>
                item.id === selectedItem.id ? { ...item, country: selectedCountry } : item
            )
        );
    };
    
    return (
        <>
            <div className="card  scrollable-content" >
                <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <AccordionTab header={translations[selectedLanguage].delivery} disabled={delivryStatus == 0}>

                        <div className="grid" style={{ paddingTop: 0, width: "100%" }}>
                            <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 5 }}>
                                {/* <label htmlFor="address">{translations[selectedLanguage].address}</label> */}
                                <AutoParAddress
                                    key={autoParaddressKey1}
                                    onItemSelect={handleItemSelect}
                                    ticDoc={ticDoc}
                                    ticDocdelivery={ticDocdelivery}
                                    address={valueTA || ticDocdelivery.adress || '333333333'}
                                />
                                <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 5 }}>
                                    <label htmlFor="note">{translations[selectedLanguage].note}</label>
                                    <InputTextarea
                                        value={note}
                                        id="note"
                                        onChange={(e) => setNote(e.target.value)}
                                        rows={3} cols={90}
                                        style={{ paddingTop: 20, width: "100%" }}
                                        disabled={ticDoc.statuspayment == 1}
                                    />
                                </div>
                                {/* </div>
                            <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 5 }}> */}
                                <div className="field col-12 md:col-12" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label htmlFor="country">{translations[selectedLanguage].Terr} *</label>
                                        <Dropdown
                                            id="country"
                                            value={ddTicDocdeliveryterrItem}
                                            options={ddTicDocdeliveryterrItems}
                                            onChange={(e) => onInputChange(e, "options", 'country')}
                                            required
                                            optionLabel="name"
                                            placeholder="Select One"
                                            disabled={ticDoc.statuspayment == 1}
                                            className={classNames({ 'p-invalid': submitted && !ticDocdelivery.country })}
                                        />
                                        {submitted && !ticDocdelivery.country && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                    </div>
                                    <div>
                                        <Button
                                            icon="pi pi-truck"
                                            className="p-button"
                                            style={{ width: '35px' }}
                                            raised
                                            severity="warning"
                                            onClick={(e) => handleDeliveryClick("item", e)}
                                            tooltip={translations[selectedLanguage].SnimiAdresuIsporuk}
                                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                            disabled={ticDoc.statuspayment == 1}
                                        ></Button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
                <Toast ref={toast} />
                <DocZaglavlje />
                {ticDocsuids.map((item) => {
                    brojReda = ++brojReda
                    const backgroundColor = eventColors[item.event] || "#ffffff";

                    return (
                        <>
                            <div key={item.id} style={{ paddingTop: 15, paddingBottom: 0, backgroundColor: item.id === highlightedId ? '#b7dfb7' : 'transparent' }}>
                                <div className="grid" style={{ paddingTop: 0, width: "100%", backgroundColor: backgroundColor }}>
                                    <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                        <span>{`${item?.nevent}: `}</span> <b><span>{` ${item?.nartikal}`}</span>
                                            <span>{` - red: ${item?.row}`}</span>
                                            <span>{` - sedište: ${item?.seat}`}</span>
                                        </b>
                                        <span style={{ color: '#800020' }}>{` - cena: ${item?.price} ${item?.ccurr}`}</span>
                                    </div>
                                    {(item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "first") : item.eventatt2.some(att => att.nvalue === "first"))) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`first-${item.id}`}
                                                    value={item.first}
                                                    onChange={(e) => onInputChangeL(e, 'first', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    required
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.first })}
                                                />
                                                {submitted && !item.first && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`first-${item.id}`}>{translations[selectedLanguage].First}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "last") : item.eventatt2.some(att => att.nvalue === "last"))) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`last-${item.id}`}
                                                    value={item.last}
                                                    onChange={(e) => onInputChangeL(e, 'last', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.last })}
                                                />
                                                {submitted && !item.last && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`last-${item.id}`}>{translations[selectedLanguage].Last}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "uid") : item.eventatt2.some(att => att.nvalue === "uid"))) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`uid-${item.id}`}
                                                    value={item.uid}
                                                    onChange={(e) => onInputChangeL(e, 'uid', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.uid })}
                                                />
                                                {submitted && !item.uid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`uid-${item.id}`}>{translations[selectedLanguage].Uid}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "birthday") : item.eventatt2.some(att => att.nvalue === "birthday"))) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`birthday-${item.id}`}
                                                    value={item.birthday}
                                                    onChange={(e) => onInputChangeL(e, 'birthday', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.birthday })}
                                                />
                                                {submitted && !item.birthday && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`birthday-${item.id}`}>{translations[selectedLanguage].birthday}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "adress") : item.eventatt2.some(att => att.nvalue === "adress"))) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`adress-${item.id}`}
                                                    value={item.adress}
                                                    onChange={(e) => onInputChangeL(e, 'adress', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.adress })}
                                                />
                                                {submitted && !item.adress && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`adress-${item.id}`}>{translations[selectedLanguage].Adress}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "city") : item.eventatt2.some(att => att.nvalue === "city"))) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`city-${item.id}`}
                                                    value={item.city}
                                                    onChange={(e) => onInputChangeL(e, 'city', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.city })}
                                                />
                                                {submitted && !item.city && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`city-${item.id}`}>{translations[selectedLanguage].city}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "zip") : item.eventatt2.some(att => att.nvalue === "zip"))) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`zip-${item.id}`}
                                                    value={item.zip}
                                                    onChange={(e) => onInputChangeL(e, 'zip', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.zip })}
                                                />
                                                {submitted && !item.zip && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`zip-${item.id}`}>{translations[selectedLanguage].zip}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "country") : item.eventatt2.some(att => att.nvalue === "country"))) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                {/* <InputText
                                                    id={`country-${item.id}`}
                                                    value={item.country}
                                                    onChange={(e) => onInputChangeL(e, 'country', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.country })}
                                                /> */}
                                                <AutoComplete
                                                    id={`country-${item.id}`}
                                                    value={item.country}
                                                    suggestions={filteredTerrs}
                                                    completeMethod={searchTerrs}
                                                    field="name"
                                                    onChange={(e) => onInputChangeL(e, 'country', item.docsid, item)}
                                                    onSelect={(e) => handleAutoCompleteSelect(e, item)} 
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.country })}
                                                />
                                                {submitted && !item.country && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`country-${item.id}`}>{translations[selectedLanguage].country}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "phon") : item.eventatt2.some(att => att.nvalue === "phon"))) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`phon-${item.id}`}
                                                    value={item.phon}
                                                    onChange={(e) => onInputChangeL(e, 'phon', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.phon })}
                                                />
                                                {submitted && !item.phon && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`phon-${item.id}`}>{translations[selectedLanguage].phon}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventatt2 && (item.kupac == 1 ? item.eventatt1.some(att => att.nvalue === "email") : item.eventatt2.some(att => att.nvalue === "email"))) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`email-${item.id}`}
                                                    value={item.email}
                                                    onChange={(e) => onInputChangeL(e, 'email', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.email })}
                                                />
                                                {submitted && !item.email && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`email-${item.id}`}>{translations[selectedLanguage].email}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventUslov.cl == 1) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`brojcl-${item.id}`}
                                                    value={item.brojcl}
                                                    onChange={(e) => onInputChangeL(e, 'brojcl', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.brojcl })}
                                                />
                                                {submitted && !item.brojcl && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`email-${item.id}`}>{translations[selectedLanguage].brojcl}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                    {(item.eventUslov.sz == 1) ? (
                                        <div className="field col-12 md:col-6" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <span className="p-float-label">
                                                <InputText
                                                    id={`brojsz-${item.id}`}
                                                    value={item.brojsz}
                                                    onChange={(e) => onInputChangeL(e, 'brojsz', item.docsid, item)}
                                                    style={{ width: '100%' }}
                                                    disabled={ticDoc.statuspayment == 1}
                                                    className={classNames('p-inputtext-sm', { 'p-invalid': submitted && !item.brojsz })}
                                                />
                                                {submitted && !item.brojsz && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                                                <label htmlFor={`email-${item.id}`}>{translations[selectedLanguage].brojsz}</label>
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div
                                className="grid"
                                style={{
                                    paddingTop: 0, width: "100%", backgroundColor: backgroundColor, display: 'flex', justifyContent: 'flex-end',
                                }}>
                                <div
                                    className="field col-12 md:col-4"
                                    style={{
                                        paddingTop: 0, paddingBottom: 5, display: 'flex', justifyContent: 'flex-end',
                                    }}
                                >
                                    <label htmlFor="kupac" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Kupac}</label>
                                    <InputSwitch id="kupac"
                                        value={item.kupac}
                                        checked={item.kupac == 1 ? true : false}
                                        onChange={(e) => handleChangeKupac(item, e)}
                                        tooltip={translations[selectedLanguage].Kupac}
                                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        disabled={ticDoc.statuspayment == 1}
                                    />
                                </div>
                                <div className="field col-12 md:col-8"
                                    style={{ paddingTop: 0, paddingBottom: 5, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        icon="pi pi-user-plus"
                                        className="p-button"
                                        style={{ width: '35px' }}
                                        size="small"
                                        raised severity="warning"
                                        onClick={(e) => handlePosetilacClick(item, e)}
                                        tooltip={translations[selectedLanguage].SnimiPodatkePosetioca}
                                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        disabled={ticDoc.statuspayment == 1}
                                    ></Button>
                                    {/* <Button
                                        icon="pi pi-user-plus"
                                        className="p-button"
                                        style={{ width: '35px' }}
                                        size="small"
                                        raised
                                        onClick={(e) => handleParClick(item, cmnPar, e)}
                                        tooltip={translations[selectedLanguage].SnimiPodatkeKupca}
                                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        disabled={ticDoc.statuspayment == 1}
                                    ></Button> */}
                                    <Button
                                        icon="pi pi-user"
                                        className="p-button"
                                        style={{ width: '35px' }}
                                        size="small"
                                        raised severity="danger"
                                        onClick={(e) => handleParClickNull(item, e)}
                                        tooltip={translations[selectedLanguage].ObrisiPodatkePosetiocaStavke}
                                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        disabled={ticDoc.statuspayment == 1}
                                    ></Button>
                                    <Button
                                        icon="pi pi-percentage"
                                        className="p-button"
                                        style={{ width: '35px' }}
                                        size="small"
                                        text
                                        raised severity="info"
                                        onClick={(e) => handleDiscountCreate(item, e)}
                                        tooltip={translations[selectedLanguage].DodajPopustNaStavku}
                                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        disabled={ticDoc.statuspayment == 1}
                                    ></Button>
                                    <Button
                                        icon="pi pi-percentage"
                                        className="p-button"
                                        style={{ width: '35px' }}
                                        size="small"
                                        text
                                        raised severity="danger"
                                        onClick={(e) => handleDiscountEventDelete(item, e)}
                                        tooltip={translations[selectedLanguage].ObrisiPopustStavkiDogadjaja}
                                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        disabled={ticDoc.statuspayment == 1}
                                    ></Button>
                                </div>
                            </div>

                            <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                <TicDocsdiscountL
                                    showDiscount={item.show}
                                    item={item}
                                    discountRefresh={discountRefresh}
                                    ticDoc={props.ticDoc}
                                    setRefresh={props.setRefresh}
                                    // handleDelivery={props.handleDelivery}
                                    handleAllRefresh={props.handleAllRefresh}
                                />
                            </div>
                        </>
                    )
                }
                )}
            </div>
        </>
    );
})

export default TicDocsuidProdajaL;