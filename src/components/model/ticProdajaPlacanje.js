import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { RadioButton } from "primereact/radiobutton";
import { TicDocpaymentService } from "../../service/model/TicDocpaymentService";
import { translations } from "../../configs/translations";
import { TicDocService } from "../../service/model/TicDocService";
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from "primereact/inputswitch";
import moment from "moment";

const TicProdajaPlacanje = forwardRef((props, ref) => {
    // console.log(props, "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
    const [categories, setCategories] = useState([]); // Inicijalizacija kao prazan niz
    const [selectedCategory, setSelectedCategory] = useState(null);
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [ticDoc, setTicDoc] = useState(props.ticDoc?.id ? props.ticDoc : ticDoc);
    const [zaUplatu, setZaUplatu] = useState(0);
    const [preostalo, setPreostalo] = useState(0);
    const [kes, setKes] = useState(0);
    const [kesTp, setKesTp] = useState(null);
    const [cek, setCek] = useState(0);
    const [cekTp, setCekTp] = useState(null);
    const [kartica, setKartica] = useState(0);
    const [karticaTp, setKarticaTp] = useState(0);
    const [vaucer, setVaucer] = useState(0);
    const [vaucerTp, setVaucerTp] = useState(0);    
    const [izborMesovito, setIzborMesovito] = useState(false);
    const [izborVaucer, setIzborVaucer] = useState(false);
    
    const [vrednost, setVrednost] = useState("");
    const [description, setDescription] = useState("");
    const [checkedPrintfiskal, setCheckedPrintfiskal] = useState(ticDoc?.printfiskal == "1" || false);
    const [reservationStatus, setReservationStatus] = useState(0);
    const [refresh, setRefresh] = useState(0);

    useImperativeHandle(ref, () => ({
        kes,
        kesTp,
        cek,
        cekTp,
        kartica,
        karticaTp,
        vaucer,
        vaucerTp,        
        zaUplatu,
        preostalo,
        izborMesovito,
        izborVaucer,
        vrednost,
        description
    }));

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocService = new TicDocService();
                const pId = props.ticDoc?.id ? props.ticDoc.id : ticDoc?.id
                const _ticDoc = await ticDocService.getTicDocP(pId);
                setTicDoc(_ticDoc);
                // const ticEventattsService = new TicEventattsService();
                // const dataAtts = ticEventattsService.getCodeValueListaP()
                
                const ticDocpaymentService = new TicDocpaymentService();
                const dataPT = await ticDocpaymentService.getCmnPaymenttpsP('cmn_paymenttp_p');
                const dataCH = await ticDocpaymentService.getChCmnPaymenttpsP(props.propsParent.ticEvent?.id, props.ticDoc?.channel, '03.03')
                // console.log(dataCH, 'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', dataPT)
                let data;

                if (!dataCH || dataCH.length === 0 || (dataCH.length === 1 && !dataCH[0].val2)) {
                    // Ako dataCH ne postoji, ima 0 elemenata ili ima samo jedan element sa praznim val2
                    data = [...dataPT];
                } else {
                    // Filtriraj na osnovu postojeće logike
                    data = dataPT.filter(item => 
                        dataCH.some(chItem => chItem.val2 == String(item.id))
                    );
                }
                console.log(dataCH, 'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', data)
                setCategories(data);

                const foundCategory = data.find(category => category.id === _ticDoc.paymenttp);
                const mixCategory = data.find(category => category.code === 'X');

                const cesCategory = data.find(category => category.code === 'C');
                if (cesCategory)  setKesTp(cesCategory.id)
                const cardCategory = data.find(category => category.code === 'K');
                if(cardCategory) setKarticaTp(cardCategory.id)
                const cekCategory = data.find(category => category.code === 'CH');
                if(cekCategory) setCekTp(cekCategory.id)
                const vaucerCategory = data.find(category => category.code === 'V');
                if(cekCategory) setVaucerTp(vaucerCategory.id)                
                console.log(foundCategory, '00-KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', mixCategory)
                if (foundCategory) {
                    setSelectedCategory(foundCategory);
                }
                const stavkePlacanja = await ticDocService.getDocPaymentS(pId);
                const ukupnoPlacanje = stavkePlacanja.reduce((ukupno, stavka) => {
                    return ukupno + parseFloat(stavka.amount || 0);
                }, 0);
                if (mixCategory && (mixCategory?.id == _ticDoc.paymenttp) ) {
                    setIzborMesovito(true)
                    const ces = stavkePlacanja.find(category => category.code === 'C');
                    if (ces) {
                        setKes(ces.amount)
                    }
                    const cart = stavkePlacanja.find(category => category.code === 'K');
                    if (cart) {
                        setKartica(cart.amount)
                    }

                    const cek = stavkePlacanja.find(category => category.code === 'CH');
                    if (cek) {
                        setCek(cek.amount)
                    }

                    const vaucer = stavkePlacanja.find(category => category.code === 'V');
                    if (vaucer) {
                        setVaucer(vaucer.amount)
                        setVrednost(vaucer.vrednost)
                        setDescription(vaucer.description)
                    }                    
                }
                if (vaucerCategory && (vaucerCategory?.id == _ticDoc.paymenttp)) {
                    setIzborVaucer(true)
                    const vaucer = stavkePlacanja.find(category => category.code === 'V');
                    if (vaucer) {
                        setVaucer(vaucer.amount)
                        setVrednost(vaucer.vrednost)
                        setDescription(vaucer.description)
                    }                    
                }

                setZaUplatu(props.zaUplatu);
                setPreostalo(props.zaUplatu - ukupnoPlacanje);
                setCheckedPrintfiskal(_ticDoc.printfiskal==1)
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchData();
    }, [props.ticDoc, props.zaUplat, refresh]);

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

    const handleUpdateTicDoc = async (newObj, previousValue) => {
        const _ticDoc = newObj;
        try {
            // console.log(newObj, "handleUpdateTicDoc 0005555555555555555555555555555555555555555555555555555555555", previousValue);
            const ticDocService = new TicDocService();
            await ticDocService.putTicDoc(newObj);
        } catch (err) {
            setTicDoc(previousValue);
        }
    };

    const handleChangePrintfiskal = async (value) => {
        const previousValue = ticDoc;
        setCheckedPrintfiskal(value);
        let _ticDoc = { ...ticDoc }
        value ? _ticDoc.printfiskal = `1` : _ticDoc.printfiskal = `0`
        setTicDoc(_ticDoc)
        props.handleAction(_ticDoc)
        // console.log(previousValue, "333333333333333333333333333333333333333333333333333333000", value)
        await handleUpdateTicDoc(_ticDoc, previousValue)

    };

    const handlePayClic = async (value) => {
        setIzborMesovito(false)
        setIzborVaucer(false)
        
        if (value.code == 'X') {
            let uplaceno = kes + kartica + cek + vaucer
            setIzborMesovito(true)
            if (kes > 0) {

            }
            if (kartica > 0) {

            }
            if (cek > 0) {

            }
        }
        if (value.code == 'V') {
            setIzborVaucer(true)
        }
        const previousValue = ticDoc;
        const _ticDoc = { ...ticDoc };
        console.log(value, "00-KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", _ticDoc)
        _ticDoc.paymenttp = value.id;
        if (value.code=='FC') {
            _ticDoc.printfiskal = 0; 
        } 
        console.log()
        await handleUpdateTicDoc(_ticDoc, previousValue);
        setSelectedCategory(value);
        await props.handlePlacanjetip(_ticDoc.paymenttp);
        setTicDoc(_ticDoc)
        props.handleAllRefresh(prev => prev + 1)
        setRefresh(prev => prev + 1)
    };

    const onInputChange = (e, type, name) => {
        let val =""
        if (name === "vrednost" || name === "description") {
            val = (e.target && e.target.value) || ""
        } else {
            val = parseFloat((e.target && e.target.value));
        } 
console.log(val, "JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ", e.target)
        if (name === "kes") {
            setKes(val);
            setPreostalo(prev => zaUplatu - val - parseFloat(kartica || 0) - parseFloat(cek || 0) - parseFloat(vaucer || 0));
        } else if (name === "kartica") {
            setKartica(val);
            setPreostalo(prev => zaUplatu - parseFloat(kes || 0) - val - parseFloat(cek || 0) - parseFloat(vaucer || 0));
        } else if (name === "cek") {
            setCek(val);
            setPreostalo(prev => zaUplatu - parseFloat(kes || 0) - parseFloat(kartica || 0) - val - parseFloat(vaucer || 0));
        } else if (name === "vaucer") {
            setVaucer(val);
            setPreostalo(prev => zaUplatu - parseFloat(kes || 0) - parseFloat(kartica || 0) - parseFloat(cek || 0) - val);
        } else if (name === "vrednost") {
            setVrednost(val);
        } else if (name === "description") {
            setDescription(val);
        }
    };


    const renderMesovito = () => {
        return (
            <>
                <div className="grid">

                    <div className="col-12">
                        {/* <div className="card"> */}
                            <div className="p-fluid formgrid grid">
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="kes">{translations[selectedLanguage].Kes}</label>
                                    <InputText id="kes" autoFocus
                                        value={kes} onChange={(e) => onInputChange(e, "text", 'kes')}
                                        disabled={ticDoc.statuspayment == 1}
                                    />
                                </div>
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="kartica">{translations[selectedLanguage].Kartica}</label>
                                    <InputText
                                        id="kartica"
                                        value={kartica} onChange={(e) => onInputChange(e, "text", 'kartica')}
                                        disabled={ticDoc.statuspayment == 1}
                                    />
                                </div>
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="cek">{translations[selectedLanguage].Cek}</label>
                                    <InputText
                                        id="cek"
                                        value={cek} onChange={(e) => onInputChange(e, "text", 'cek')}
                                        disabled={ticDoc.statuspayment == 1}
                                    />
                                </div>
                                <div className="field col-12 md:col-5">
                                    <label htmlFor="vaucer">{translations[selectedLanguage].Vaucer}</label>
                                    <InputText
                                        id="vaucer"
                                        value={vaucer} onChange={(e) => onInputChange(e, "text", 'vaucer')}
                                        disabled={ticDoc.statuspayment == 1}
                                    />
                                </div> 
                                <div className="field col-12 md:col-7">
                                    <label htmlFor="vrednost">{translations[selectedLanguage].Code}</label>
                                    <InputText id="vrednost" 
                                        value={vrednost} onChange={(e) => onInputChange(e, "text", 'vrednost')}
                                        disabled={ticDoc.statuspayment == 1}
                                    />
                                </div>
                                <div className="field col-12 md:col-12">
                                    <label htmlFor="description">{translations[selectedLanguage].Description}</label>
                                    <InputText
                                        id="description"
                                        value={description} onChange={(e) => onInputChange(e, "text", 'description')}
                                        disabled={ticDoc.statuspayment == 1}
                                    />
                                </div>                                                               
                            </div>
                        {/* </div> */}
                    </div>
                </div>
            </>
        );
    };
    const renderOpis = () => {
        return (
            <>
                <div className="grid">

                    <div className="col-12">
                        <div className="card">
                            <div className="p-fluid formgrid grid">
                                <div className="field col-12 md:col-7">
                                    <label htmlFor="vrednost">{translations[selectedLanguage].Code}</label>
                                    <InputText id="vrednost" autoFocus
                                        value={vrednost} onChange={(e) => onInputChange(e, "text", 'vrednost')}
                                        disabled={ticDoc.statuspayment == 1}
                                    />
                                </div>
                                <div className="field col-12 md:col-7">
                                    <label htmlFor="description">{translations[selectedLanguage].Description}</label>
                                    <InputText
                                        id="description"
                                        value={description} onChange={(e) => onInputChange(e, "text", 'description')}
                                        disabled={ticDoc.statuspayment == 1}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="card flex justify-content-center">
                {/* Dodavanje hedera sa naslovom */}
                <div className="grid grid-nogutter">
                    {/* <div className="col-12" style={{ backgroundColor: '#f0f0f0', padding: '10px', textAlign: 'center' }}>
                        <h3>{`${translations[selectedLanguage].Select_a_Payment_Option} ... ${preostalo} od ${zaUplatu}`}</h3>
                    </div> */}
                    <div className="col-12 flex flex-column gap-3" style={{ paddingTop: '20px' }}>
                        {/* Proverite da li postoje kategorije pre mapiranja */}
                        {categories.length > 0 ? (
                            <>
                                {categories.map((category) => {
                                    return (
                                        <div key={category.key} className="flex align-items-center">
                                            <RadioButton
                                                inputId={category.key}
                                                name="category"
                                                value={category}
                                                onChange={(e) => handlePayClic(e.value)}
                                                checked={selectedCategory === category}
                                                disabled={ticDoc.statuspayment == 1}
                                            />
                                            <label htmlFor={category.key} className="ml-2">{category.text}</label>
                                        </div>
                                    );
                                })}
                                {izborMesovito ? renderMesovito(): null}
                                {izborVaucer ? renderOpis() : null}
                                
                            </>
                        ) : (
                            <p>No categories available</p> // Opciono: prikaz poruke kada nema kategorija
                        )}
                    </div>
                </div>

            </div>
            <div className="card flex justify-content-center">
                <div className="grid grid-nogutter">
                    <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                        <label htmlFor="printfiskal" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Printfiskal}</label>
                        <InputSwitch id="printfiskal"
                            value={ticDoc.printfiskal}
                            checked={checkedPrintfiskal}
                            onChange={(e) => handleChangePrintfiskal(e.value)}
                            tooltip={translations[selectedLanguage].Printfiskal}
                            disabled={ticDoc.statuspayment == 1}
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
})

export default TicProdajaPlacanje;
