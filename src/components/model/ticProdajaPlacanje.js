import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { RadioButton } from "primereact/radiobutton";
import { TicDocpaymentService } from "../../service/model/TicDocpaymentService";
import { translations } from "../../configs/translations";
import { TicDocService } from "../../service/model/TicDocService";
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from "primereact/inputswitch";

const TicProdajaPlacanje = forwardRef((props, ref) => {
    // console.log(props, "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
    const [categories, setCategories] = useState([]); // Inicijalizacija kao prazan niz
    const [selectedCategory, setSelectedCategory] = useState(null);
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [ticDoc, setTicDoc] = useState(props.ticDoc?.id?props.ticDoc:ticDoc);
    const [zaUplatu, setZaUplatu] = useState(0);
    const [preostalo, setPreostalo] = useState(0);
    const [kes, setKes] = useState(0);
    const [kesTp, setKesTp] = useState(null);
    const [cek, setCek] = useState(0);
    const [cekTp, setCekTp] = useState(null);
    const [kartica, setKartica] = useState(0);
    const [karticaTp, setKarticaTp] = useState(0);
    const [izborMesovito, setIzborMesovito] = useState(false);
    const [checkedPrintfiskal, setCheckedPrintfiskal] = useState(ticDoc?.printfiskal == "1" || false);

    useImperativeHandle(ref, () => ({
        kes,
        kesTp,
        cek,
        cekTp,
        kartica,
        karticaTp,
        zaUplatu,
        preostalo,
        izborMesovito
    }));

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocService = new TicDocService();
                const pId = props.ticDoc?.id?props.ticDoc.id:ticDoc?.id
                const _ticDoc = await ticDocService.getTicDocP(pId);
                // const _ticDoc = await ticDocService.getTicDoc(props.ticDoc.id);

                setTicDoc(_ticDoc);
                const ticDocpaymentService = new TicDocpaymentService();
                const data = await ticDocpaymentService.getCmnPaymenttpsP('cmn_paymenttp_p');
                setCategories(data);

                const foundCategory = data.find(category => category.id === _ticDoc.paymenttp);
                const mixCategory = data.find(category => category.code === 'X');
                const cesCategory = data.find(category => category.code === 'C');
                setKesTp(cesCategory.id)
                const cardCategory = data.find(category => category.code === 'K');
                setKarticaTp(cardCategory.id)
                const celCategory = data.find(category => category.code === 'CH');
                setCekTp(celCategory.id)

                if (foundCategory) {
                    setSelectedCategory(foundCategory);
                }
                // console.log(pId, _ticDoc, "3333333333333LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL", data)
                const iznos = await ticDocService.getDocZbirniiznosP(pId);
                const stavkePlacanja = await ticDocService.getDocPaymentS(pId);
                const ukupnoPlacanje = stavkePlacanja.reduce((ukupno, stavka) => {
                    return ukupno + parseFloat(stavka.amount || 0);
                }, 0);
                if (mixCategory.id == _ticDoc.paymenttp) {
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
                }
                setZaUplatu(iznos.iznos);
                setPreostalo(iznos.iznos - ukupnoPlacanje);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchData();
    }, [props.ticDoc]);

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
        // console.log(value, "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
        if (value.code == 'X') {
            let uplaceno = kes + kartica + cek
            setIzborMesovito(true)
            if (kes > 0) {

            }
            if (kartica > 0) {

            }
            if (cek > 0) {

            }
        }
        const previousValue = ticDoc;
        const _ticDoc = { ...ticDoc };
        _ticDoc.paymenttp = value.id;
        await handleUpdateTicDoc(_ticDoc, previousValue);
        setSelectedCategory(value);
        await props.handlePlacanjetip(_ticDoc.paymenttp);
    };

    const onInputChange = (e, type, name) => {
        let val = parseFloat((e.target && e.target.value) || 0); // Parsiranje vrednosti u broj

        if (name === "kes") {
            setKes(val);
            setPreostalo(prev => zaUplatu - val - parseFloat(kartica || 0) - parseFloat(cek || 0));
        } else if (name === "kartica") {
            setKartica(val);
            setPreostalo(prev => zaUplatu - parseFloat(kes || 0) - val - parseFloat(cek || 0));
        } else {
            setCek(val);
            setPreostalo(prev => zaUplatu - parseFloat(kes || 0) - parseFloat(kartica || 0) - val);
        }
    };


    const renderMesovito = () => {
        return (
            <>
                <div className="grid">

                    <div className="col-12">
                        <div className="card">
                            <div className="p-fluid formgrid grid">
                                <div className="field col-12 md:col-7">
                                    <label htmlFor="kes">{translations[selectedLanguage].Kes}</label>
                                    <InputText id="kes" autoFocus
                                        value={kes} onChange={(e) => onInputChange(e, "text", 'kes')}
                                        disabled={ticDoc.status == 2}
                                    />
                                </div>
                                <div className="field col-12 md:col-7">
                                    <label htmlFor="kartica">{translations[selectedLanguage].Kartica}</label>
                                    <InputText
                                        id="kartica"
                                        value={kartica} onChange={(e) => onInputChange(e, "text", 'kartica')}
                                        disabled={ticDoc.status == 2}
                                    />
                                </div>
                                <div className="field col-12 md:col-7">
                                    <label htmlFor="cek">{translations[selectedLanguage].Cek}</label>
                                    <InputText
                                        id="cek"
                                        value={cek} onChange={(e) => onInputChange(e, "text", 'cek')}
                                        disabled={ticDoc.status == 2}
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
                    <div className="col-12" style={{ backgroundColor: '#f0f0f0', padding: '10px', textAlign: 'center' }}>
                        <h3>{`${translations[selectedLanguage].Select_a_Payment_Option} ... ${preostalo} od ${zaUplatu}`}</h3>
                    </div>
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
                                {izborMesovito ? renderMesovito() : null}
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
