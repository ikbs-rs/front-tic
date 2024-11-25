import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { TicEventattsService } from "../../service/model/TicEventattsService";
import { TicDocsuidService } from "../../service/model/TicDocsuidService";
import { TicDocsdiscountService } from "../../service/model/TicDocsdiscountService";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Divider } from 'primereact/divider';
import { Toast } from "primereact/toast";
import { RadioButton } from "primereact/radiobutton";
import { TicDocsService } from '../../service/model/TicDocsService';
import { translations } from "../../configs/translations";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { CmnParService } from "../../service/model/cmn/CmnParService";
import { TicDocService } from "../../service/model/TicDocService";
import TicDocsdiscountL from "./ticDocsdiscountL";
import AutoParAddress from "../auto/autoParAddress";
import DateFunction from "../../utilities/DateFunction";
import { TicDocdeliveryService } from "../../service/model/TicDocdeliveryService"
import Token from "../../utilities/Token";
import AutoParProdaja from '../auto/autoParProdaja';
import { classNames } from 'primereact/utils';

// import Worker from 'worker-loader!../../workers/docuidWorker.js';


const TicDocsuidProdajaL = forwardRef((props, ref) => {
    // console.log(props, "^^-TicDocsuidProdajaL-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    const objName = "tic_docsuid";
    const objCmnPar = "cmn_par";
    const objTicDocdelivery = "tic_docdelivery";
    const userId = localStorage.getItem('userId') || -1
    const toast = useRef(null);
    const objTicDocsdiscount = "tic_docsdiscount";
    const emptyTicDocsdiscount = EmptyEntities[objTicDocsdiscount];
    const emptyTicDocdelivery = EmptyEntities[objTicDocdelivery];
    emptyTicDocdelivery.doc = props.ticDoc.id;
    emptyTicDocdelivery.status = '1';
    emptyTicDocdelivery.usr = userId;
    emptyTicDocdelivery.dat = DateFunction.currDate();
    emptyTicDocdelivery.tmrec = DateFunction.currDatetime();

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicEvent = EmptyEntities[objName];
    const emptyCmnPar = EmptyEntities[objCmnPar];
    const [cmnPar, setCmnPar] = useState(emptyCmnPar);
    const [ticDocdelivery, setTicDocdelivery] = useState(emptyCmnPar)
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

    let brojReda = 0

    useImperativeHandle(ref, () => ({
        setDocsuidSubmitted: () => handelSubbmitted(),
    }));

    const handelUnitSubbmitted = (itemUnit) => {
        //     console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH-Provera da li su sva polja popunjena...");

        // Prođi kroz svaki ID i njegove atribute iz requiredFields
        for (const field of requiredFields) {
            console.log(field, "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj", itemUnit)
            const item = ticDocsuids.find(doc => doc.id === field.id); // Nađi odgovarajući dokument u ticDocsuids
            if (!item||itemUnit.id!=field.id) {
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
                        detail: `Polje "${attribute}" za stavku ${field.id} nije popunjeno.`,
                        life: 3000,
                    });

                    return false; // Zaustavi dalje izvršenje koda
                }
            }
        }
        console.log("Sva polja su popunjena.");
        setSubmitted(true);
        return true
    }

    const handelSubbmitted = () => {
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH-Provera da li su sva polja popunjena...");

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
                        detail: `Polje "${attribute}" za stavku ${field.id} nije popunjeno.`,
                        life: 3000,
                    });

                    return false; // Zaustavi dalje izvršenje koda
                }
            }
        }

        console.log("Sva polja su popunjena.");
        setSubmitted(true);
        return true
    };


    useEffect(() => {
        const fieldsToUpdate = ticDocsuids.map(item => {
            const attributes = [];
            if (item.eventatt2 && (item.kupac === 1 ? item.eventatt1.some(att => att.nvalue === "first") : item.eventatt2.some(att => att.nvalue === "first"))) {
                attributes.push("first");
            }
            if (item.eventatt2 && (item.kupac === 1 ? item.eventatt1.some(att => att.nvalue === "last") : item.eventatt2.some(att => att.nvalue === "last"))) {
                attributes.push("last");
            }
            if (item.eventatt2 && (item.kupac === 1 ? item.eventatt1.some(att => att.nvalue === "uid") : item.eventatt2.some(att => att.nvalue === "uid"))) {
                attributes.push("uid");
            }
            if (item.eventatt2 && (item.kupac === 1 ? item.eventatt1.some(att => att.nvalue === "birthday") : item.eventatt2.some(att => att.nvalue === "birthday"))) {
                attributes.push("birthday");
            }
            if (item.eventatt2 && (item.kupac === 1 ? item.eventatt1.some(att => att.nvalue === "adress") : item.eventatt2.some(att => att.nvalue === "adress"))) {
                attributes.push("adress");
            }
            if (item.eventatt2 && (item.kupac === 1 ? item.eventatt1.some(att => att.nvalue === "city") : item.eventatt2.some(att => att.nvalue === "city"))) {
                attributes.push("city");
            }
            if (item.eventatt2 && (item.kupac === 1 ? item.eventatt1.some(att => att.nvalue === "zip") : item.eventatt2.some(att => att.nvalue === "zip"))) {
                attributes.push("zip");
            }
            if (item.eventatt2 && (item.kupac === 1 ? item.eventatt1.some(att => att.nvalue === "country") : item.eventatt2.some(att => att.nvalue === "country"))) {
                attributes.push("country");
            }
            if (item.eventatt2 && (item.kupac === 1 ? item.eventatt1.some(att => att.nvalue === "phon") : item.eventatt2.some(att => att.nvalue === "phon"))) {
                attributes.push("phon");
            }
            if (item.eventatt2 && (item.kupac === 1 ? item.eventatt1.some(att => att.nvalue === "email") : item.eventatt2.some(att => att.nvalue === "email"))) {
                attributes.push("email");
            }
            return { id: item.id, attributes };
        });
        console.log(fieldsToUpdate, "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
        setRequiredFields(fieldsToUpdate);
    }, [ticDocsuids]);

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
            // console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
            try {
                const ticDocdeliveryService = new TicDocdeliveryService();
                const data = await ticDocdeliveryService.getListaByDocP(props.ticDoc.id);
                const _delivery = data[0]
                if (_delivery) {
                    setTicDocdelivery(_delivery);
                    setValueTA(_delivery.address || '');  // Ensure it's non-null
                    setNote(_delivery.note || '');
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


    useEffect(() => {
        async function fetchData() {
            try {
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

                    return {
                        ...item,
                        show: 'no',
                        eventatt1: eventatt1,  // dodaj podniz eventatt1
                        eventatt2: eventatt2,  // dodaj podniz eventatt2
                        eventatt3: eventatt3   // dodaj podniz eventatt3
                    };
                }));
                // console.log(updatedData, "#01#########################################################################")
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
    }, [props.ticDoc.id, refresh]);


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
        await ticDocsuidService.postTicDocsuidParAll(_cmnPar, ticDoc.id);
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
            if (valueTA) {
                emptyTicDocdelivery.adress = valueTA
            }
            emptyTicDocdelivery.note = note
            const ticDocdeliveryService = new TicDocdeliveryService();
            if (ticDocdelivery?.doc == props.ticDoc.id) {
                emptyTicDocdelivery.id = ticDocdelivery.id
                await ticDocdeliveryService.putTicDocdelivery(emptyTicDocdelivery);
            } else {
                await ticDocdeliveryService.postTicDocdelivery(emptyTicDocdelivery);
            }

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
    /***************************************************************************************** */
    const handleChangeKupac = async (item, e) => {
        try {
            const updatedKupacValue = item.kupac === 1 ? 0 : 1;
            const updatedItem = { ...item, kupac: updatedKupacValue };
            // console.log(updatedItem, "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUkupacUUUUUUUUUUUUUUUUUUUUUUUUU")
            // Ažuriranje na serveru
            const ticDocsuidService = new TicDocsuidService();
            await ticDocsuidService.putTicDocsuid(updatedItem);

            // Ažuriranje lokalnog stanja
            setTicDocsuids((prevState) =>
                prevState.map((docItem) =>
                    docItem.id === item.id ? { ...docItem, kupac: updatedKupacValue } : docItem
                )
            );
        } catch (error) {
            console.error("Error updating Kupac value:", error);
        }
    };
    const DocZaglavlje = () => {
        return (
            <div className="card">
                <div className="grid">
                    <div className="field col-12 md:col-12">
                        <div className="p-inputgroup flex-1">
                            <AutoParProdaja
                                ticDoc={ticDoc}
                                cmnPar={cmnPar}
                                handleAutoParProdaja={handleAutoParProdaja}
                                setAutoParaddressKey1={setAutoParaddressKey1}
                                handleAction={props.handleAction}
                                setRefresh={props.setRefresh}
                            />
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
            </div>
        );
    };
    /*********************************************************************************** */
    const handleItemSelect = (item) => {
        // console.log("HhandleItemSelectHHHHHHHHHHHHHHHHHHHHHHHHHHHHHUUUUUUUUUUUHHHHHHHHHHHHHHHHHHHHHHHHHHHH", item)
        setValueTA(item.adresa);
    };

    return (
        <>
            <div className="card  scrollable-content" > 
                <Accordion >
                    <AccordionTab header={translations[selectedLanguage].delivery}>

                        <div className="grid" style={{ paddingTop: 0, width: "100%" }}>
                            <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 5 }}>
                                <label htmlFor="address">{translations[selectedLanguage].address}</label>
                                <AutoParAddress
                                    key={autoParaddressKey1}
                                    onItemSelect={handleItemSelect}
                                    ticDoc={props.ticDoc}
                                    ticDocdelivery={ticDocdelivery}
                                    address={valueTA || ticDocdelivery.address || '333333333'}
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
                                <div className="field col-12 md:col-4" style={{ paddingTop: 0, paddingBottom: 5 }}>
                                    <Button
                                        icon="pi pi-truck"
                                        className="p-button"
                                        style={{ width: '35px' }}
                                        raised severity="warning"
                                        onClick={(e) => handleDeliveryClick("item", e)}
                                        tooltip={translations[selectedLanguage].SnimiAdresuIsporuk}
                                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        disabled={ticDoc.statuspayment == 1}
                                    ></Button>
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
                                                <InputText
                                                    id={`country-${item.id}`}
                                                    value={item.country}
                                                    onChange={(e) => onInputChangeL(e, 'country', item.docsid, item)}
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
                                    <Button
                                        icon="pi pi-user-plus"
                                        className="p-button"
                                        style={{ width: '35px' }}
                                        size="small"
                                        raised
                                        onClick={(e) => handleParClick(item, cmnPar, e)}
                                        tooltip={translations[selectedLanguage].SnimiPodatkeKupca}
                                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                        disabled={ticDoc.statuspayment == 1}
                                    ></Button>
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