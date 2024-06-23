import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { TicDocsuidService } from "../../service/model/TicDocsuidService";
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
import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from 'primereact/dialog';
import CmnParL from './cmn/cmnParL';

export default function TicDocsuidProdajaL(props) {
    const objName = "tic_docsuid";
    const toast = useRef(null);
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicEvent = EmptyEntities[objName];
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticDocsuids, setTicDocsuids] = useState([]);
    const [ticDoc, setTicDoc] = useState(props.ticDoc);

    const [cmnTickettps, setCmnTickettps] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedValues, setSelectedValues] = useState({});
    const [activeStates, setActiveStates] = useState({});
    const [highlightedId, setHighlightedId] = useState(null);

    const [valueTA, setValueTA] = useState('');
    const [note, setNote] = useState('');
    let [refresh, setRefresh] = useState(0); 

    /************************AUTOCOMPLIT**************************** */
    const [cmnParLVisible, setCmnParLVisible] = useState(false);
    const [allPara, setAllPars] = useState([]);
    const [parValue, setParValue] = useState(props.ticDoc?.cpar);
    const [filteredPars, setFilteredPars] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [selectedPar, setSelectedPar] = useState(null);
    /************************AUTOCOMPLIT**************************** */


    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocsuidService = new TicDocsuidService();
                const data = await ticDocsuidService.getProdajaLista(props.ticDoc.id);
                // Sortiranje podataka pre postavljanja u state
                const sortedData = data.sort((a, b) => {
                    // Poređenje po 'nevent'
                    if (a.nevent < b.nevent) return -1;
                    if (a.nevent > b.nevent) return 1;
                    // Ako su 'nevent' isti, poređenje po 'nartikal'
                    if (a.nartikal < b.nartikal) return -1;
                    if (a.nartikal > b.nartikal) return 1;
                    // Ako su 'nevent' i 'nartikal' isti, poređenje po 'row'
                    if (a.row < b.row) return -1;
                    if (a.row > b.row) return 1;
                    // Ako su 'nevent', 'nartikal', i 'row' isti, poređenje po 'seat'
                    return a.seat - b.seat;
                });

                setTicDocsuids(sortedData);
                await setSelectedValues(sortedData.reduce((acc, item) => ({
                    ...acc,
                    [item.id]: item.tickettp
                }), {}));

                await setActiveStates(data.reduce((acc, item) => ({ ...acc, [item.id]: item.delivery == '1' }), {}));

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [props.ticDoc.id, refresh]);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocsService = new TicDocsService();
                const data = await ticDocsService.getCmnObjByTpCode('t.code', 'XTCTP');
                setCmnTickettps(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const handleChange = (e, itemId, item) => {
        console.log(itemId, "55555555555555555555555555555555", e.value, "5555555555555555", item)
        setSelectedValues(prev => ({
            ...prev,
            [itemId]: e.value
        }));
        console.log(itemId, "55555555555555555555555555555555", e.value, "5555555555555555222")
    };

    const handleSwitchChange = (e, itemId) => {
        setActiveStates(prev => ({ ...prev, [itemId]: e.value }));
    };
    
    const handleAllParr = (e, item) => {
        e.preventDefault(); // Prevent default action if necessary
        setRefresh(++refresh)
        // setHighlightedId(item.id);
        console.log(e, "******* Clicked item details:", item);
        // Možete ovde implementirati dalje logike kao što je otvaranje modalnog prozora, ažuriranje stanja itd.
    };

    const handleClick = (item, e) => {
        e.preventDefault(); // Prevent default action if necessary
        setHighlightedId(item.id);
        console.log(e, "******* Clicked item details:", item);
        // Možete ovde implementirati dalje logike kao što je otvaranje modalnog prozora, ažuriranje stanja itd.
    };

    const handleDeleteClick = (item, e) => {
        e.preventDefault(); // Prevent default action if necessary
        setRefresh(++refresh)
        console.log(e, "******* Clicked item details:", item);
        // Možete ovde implementirati dalje logike kao što je otvaranje modalnog prozora, ažuriranje stanja itd.
    };

    const onInputChangeL = (e, field, index, item) => {
        const value = e.target.value;
        const _ticDocsuids = [...ticDocsuids];
        console.log(value, "**WWW****************", _ticDocsuids, "**WWW****************#######################################", index);
        // _ticDocsuids[index][field] = value;
        // setFormData(newFormData);
    };
    /*************************AUTOCOMPLIT************************************<PAR************* */
    const onInputChange = (e, type, name) => {
        //console.log(e.target, "###########################-INPUT-###########################setDebouncedSearch###", e.target.value)
        let val = ''
        if (type === "auto") {
            let timeout = null
            switch (name) {
                case "par":
                    const _ticDoc = {}
                    if (selectedPar === null) {
                        setParValue(e.target.value.textx || e.target.value);
                    } else {
                        setSelectedPar(null);
                        setParValue(e.target.value.textx || e.target.value.textx);
                    }
                    //console.log(e.target, "###########################-auto-###########################setDebouncedSearch###", e.target.value)
                    ticDoc.usr = e.target.value.id
                    ticDoc.npar = e.target.value.textx
                    ticDoc.cpar = e.target.value.code
                    // Postavite debouncedSearch nakon 1 sekunde neaktivnosti unosa
                    props.handleAction(ticDoc)
                    clearTimeout(searchTimeout);
                    timeout = setTimeout(() => {
                        setDebouncedSearch(e.target.value);
                    }, 400);
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        }
    }
    /**************** */
    useEffect(() => {
        async function fetchData() {
            const cmnParService = new CmnParService();
            const data = await cmnParService.getLista(-1);
            setAllPars(data);
            //setParValue(data.find((item) => item.id === props.ticDoc.usr) || null);
        }
        fetchData();
    }, []);
    /**************** */
    useEffect(() => {
        if (debouncedSearch && selectedPar === null) {
            // Filtrirajte podatke na osnovu trenutnog unosa
            //console.log("9999999999999999999999999debouncedLocSearch9999999999999999999999999999", debouncedSearch, "=============================")
            const query = debouncedSearch.toLowerCase();
            const filtered = allPara.filter(
                (item) =>
                    item.textx.toLowerCase().includes(query) ||
                    item.code.toLowerCase().includes(query) ||
                    item.email?.toLowerCase().includes(query) ||
                    item.address?.toLowerCase().includes(query)
            );

            setSelectedPar(null);
            setFilteredPars(filtered);
        }
    }, [debouncedSearch, allPara]);
    /*** */

    useEffect(() => {
        setParValue(parValue);
        if (parValue) {
            //console.log("Izabrao vrednost")
        }
    }, [parValue, selectedPar]);

    const handleSelect = (e) => {
        // Postavite izabrani element i automatski popunite polje za unos sa vrednošću "code"
        setSelectedPar(e.value.code);
        setParValue(e.value.code);
    };
    /************************** */
    const handleParLClick = async (e, destination) => {
        try {
            //console.log(destination, "*********************handleParLClick****************************")
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
    const handleCmnParLDialogClose = async (newObj) => {

        setParValue(newObj.code);
        ticDoc.usr = newObj.id;
        ticDoc.npar = newObj.textx;
        ticDoc.cpar = newObj.code;
        setTicDoc(ticDoc)
        const ticDocService = new TicDocService();
        await ticDocService.putTicDocSet(ticDoc);

        props.handleAction(ticDoc)
        //ticDocs.potrazuje = newObj.cena * ticDocs.output;
        setCmnParLVisible(false);
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
                    {item.email}
                    {` `}
                    {item.address}
                </div>
            </>
        );
    };
    /**************************AUTOCOMPLIT************************************************ */

    /***************************************************************************************** */
    const DocZaglavlje = () => {
        return (
            <div className="card">
                <div className="grid">
                    <div className="field col-12 md:col-12">
                        <div className="p-inputgroup flex-1">
                            <label htmlFor="par">{translations[selectedLanguage].Kupac} *</label>
                            <AutoComplete
                                value={parValue}
                                suggestions={filteredPars}
                                completeMethod={() => { }}
                                onSelect={handleSelect}
                                onChange={(e) => onInputChange(e, "auto", 'par')}
                                itemTemplate={itemTemplate}
                                placeholder="Pretraži"
                            />
                            <Button icon="pi pi-search" onClick={(e) => handleParLClick(e, "local")} className="p-button" />
                            <InputText
                                id="npar"
                                value={props.ticDoc?.npar || ticDoc.npar}
                                required
                            />
                            <Button icon="pi pi-users" onClick={(e) => handleAllParr(e, "ALL")} style={{ width: '60px' }} raised severity="warning" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    /*********************************************************************************** */

    return (
        <>
            <div className="card  scrollable-content">
                <Accordion >
                    <AccordionTab header={translations[selectedLanguage].delivery}>

                        <div className="grid" style={{ paddingTop: 0, width: "100%" }}>
                            <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 5 }}>
                                <label htmlFor="address">{translations[selectedLanguage].address}</label>
                                <InputTextarea value={valueTA}
                                    id="address"
                                    onChange={(e) => setValueTA(e.target.value)}
                                    rows={3} cols={90}
                                    style={{ paddingTop: 20, width: "100%" }}
                                />
                            </div>
                            <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 5 }}>
                                <label htmlFor="note">{translations[selectedLanguage].note}</label>
                                <InputTextarea value={note}
                                    id="note"
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={3} cols={90}
                                    style={{ paddingTop: 20, width: "100%" }}
                                />
                            </div>
                            <div className="field col-12 md:col-4" style={{ paddingTop: 0, paddingBottom: 5 }}>
                                <Button
                                    icon="pi pi-truck"
                                    className="p-button"
                                    style={{ width: '60px' }}
                                    raised severity="warning"
                                    onClick={(e) => handleClick("item", e)}
                                ></Button>
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
                <Toast ref={toast} />
                <DocZaglavlje />
                {ticDocsuids.map((item) => (
                    <>
                        <div key={item.id} style={{ paddingTop: 15, paddingBottom: 0, backgroundColor: item.id === highlightedId ? '#b7dfb7' : 'transparent' }}>
                            <div className="grid" style={{ paddingTop: 0, width: "100%" }}>
                                <div className="field col-12 md:col-12" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                    <span>{`${item?.nevent}: `}</span> <b><span>{` ${item?.nartikal}`}</span>
                                        <span>{` - red: ${item?.row}`}</span>
                                        <span>{` - sedište: ${item?.seat}`}</span>
                                    </b>
                                    <span style={{ color: '#800020' }}>{` - cena: ${item?.price} ${item?.ccurr}`}</span>
                                </div>
                                <div className="field col-12 md:col-4" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                    <div className="flex flex-wrap gap-3">
                                        {cmnTickettps.map((option) => (
                                            <div key={option.id} className="p-field-radiobutton">
                                                <RadioButton
                                                    inputId={`radio-${item.id}-${option.id}`}
                                                    name={`cmnTickettp-${item.id}`} // Ovo osigurava da svaki red ima svoju grupu radiobuttona
                                                    value={option.id}
                                                    onChange={(e) => handleChange(e, item.id, item)}
                                                    checked={selectedValues[item.id] === option.id}
                                                />

                                                <label htmlFor={`radio-${item.id}-${option.id}`}>{option.text}</label>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                                <div className="field col-12 md:col-8" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                    <div className="flex flex-wrap gap-3">
                                        <InputSwitch
                                            id={`delivery-${item.id}`}
                                            checked={activeStates[item.id]}
                                            onChange={(e) => handleSwitchChange(e, item.id)}
                                        />
                                        <label htmlFor={`delivery-${item.id}`} style={{ marginRight: '1em' }}>{translations[selectedLanguage].delivery}</label>
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                    <span className="p-float-label">
                                        <InputText
                                            id={`first-${item.id}`}
                                            className="p-inputtext-sm"
                                            value={item.first}
                                            onChange={(e) => onInputChangeL(e, 'first', item.docsid, item)}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor={`first-${item.id}`}>First</label>
                                    </span>
                                </div>
                                <div className="field col-12 md:col-4" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                    <span className="p-float-label">
                                        <InputText
                                            id={`last-${item.id}`}
                                            className="p-inputtext-sm"
                                            value={item.last}
                                            onChange={(e) => onInputChangeL(e, 'last', item.docsid, item)}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor={`last-${item.id}`}>Last</label>
                                    </span>
                                </div>
                                <div className="field col-12 md:col-4" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                    <span className="p-float-label">
                                        <InputText
                                            id={`uid-${item.id}`}
                                            className="p-inputtext-sm"
                                            value={item.uid}
                                            onChange={(e) => onInputChangeL(e, 'uid', item.docsid, item)}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor={`uid-${item.id}`}>Uid</label>
                                    </span>

                                </div>
                                <div className="field col-12 md:col-4" style={{ paddingTop: 0, paddingBottom: 0 }}>
                                    <span className="p-float-label">
                                        <InputText
                                            id={`adress-${item.id}`}
                                            className="p-inputtext-sm"
                                            value={item.adress}
                                            onChange={(e) => onInputChangeL(e, 'adress', item.docsid, item)}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor={`adress-${item.id}`}>Adress</label>
                                    </span>
                                </div>
                                <div className="field col-12 md:col-4" style={{ paddingTop: 0, paddingBottom: 5 }}>
                                    <Button
                                        icon="pi pi-user-plus"
                                        className="p-button"
                                        style={{ width: '60px' }}
                                        raised severity="warning"
                                        onClick={(e) => handleClick(item, e)}
                                    ></Button>
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button"
                                        style={{ width: '60px' }}
                                        raised severity="danger"
                                        onClick={(e) => handleDeleteClick(item, e)}
                                    ></Button>
                                </div>
                                <div className="field col-12 md:col-4" style={{ paddingTop: 0, paddingBottom: 5 }}>

                                </div>
                            </div>
                        </div>
                        <hr />
                    </>
                ))}

            </div>
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
                        ticDoc={ticDoc}
                        onTaskComplete={handleCmnParLDialogClose}
                        setCmnParLVisible={setCmnParLVisible}
                        dialog={true}
                        lookUp={true}
                        parentData={true}
                    />}
            </Dialog>
        </>
    );
}
