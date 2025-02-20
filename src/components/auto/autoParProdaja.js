import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { CmnParService } from "../../service/model/cmn/CmnParService";
import { translations } from "../../configs/translations";
import { Toast } from "primereact/toast";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import CmnParL from '../model/cmn/cmnParL';
import { TicDocService } from "../../service/model/TicDocService";


const AutoParProdaja = (props) => {
    // console.log(props, "a30-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const _ticDoc = { ...props.ticDoc }
    _ticDoc.cpar = props.cmnPar?.code
    _ticDoc.npar = props.cmnPar?.textx
    const [ticDoc, setTicDoc] = useState(_ticDoc);
    const [filteredPars, setFilteredPars] = useState([]);
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [parValue, setParValue] = useState(ticDoc?.cpar);
    const [cmnPars, setCmnPars] = useState([]);
    const [cmnPar, setCmnPar] = useState(props.cmnPar);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [selectedPar, setSelectedPar] = useState(null);
    const toast = useRef(null);

    const [cmnParLVisible, setCmnParLVisible] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnParService = new CmnParService();
                const data = await cmnParService.getCmnPars();
                setCmnPars(data);
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
                // console.log(cmnPar, "08-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa", data[0])
                setCmnPar({ ...data[0], text: data.textx });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    /**************** */
    useEffect(() => {
        if (debouncedSearch && selectedPar === null) {
            // Filtrirajte podatke na osnovu trenutnog unosa
            // console.log("9999999999999999999999999debouncedLocSearch9999999999999999999999999999", debouncedSearch, "=============================")
            const query = debouncedSearch.toLowerCase();
            const filtered = cmnPars.filter(
                (item) =>
                    item.textx.toLowerCase().includes(query) ||
                    item.code.toLowerCase().includes(query) ||
                    item.email?.toLowerCase().includes(query) ||
                    item.address?.toLowerCase().includes(query) ||
                    item.idnum?.toLowerCase().includes(query) ||
                    item.birthday?.toLowerCase().includes(query)
            );

            setSelectedPar(null);
            setFilteredPars(filtered);
        }
    }, [debouncedSearch, cmnPars]);
    /*** */
    const onInputChange = (e, type, name) => {
        let val = ''
        let timeout = null
        if (name == 'par') {
            if (selectedPar === null) {
                setParValue(e.target.value.textx || e.target.value);
            } else {
                setSelectedPar(null);
                setParValue(e.target.value.textx || e.target.value.textx);
            }
            console.log(e.target.value, "aa03-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
            ticDoc.usr = e.target.value.id
            cmnPar.npar = e.target.value.textx
            cmnPar.cpar = e.target.value.code
            // Postavite debouncedSearch nakon 1 sekunde neaktivnosti unosa
            clearTimeout(searchTimeout);
            timeout = setTimeout(() => {
                setDebouncedSearch(e.target.value);
            }, 400);
        } else {
            val = (e.target && e.target.value) || '';
            console.log(val, "*******************", e.target)

            let _cmnPar = null;
            if (cmnPar[0]) {
                _cmnPar = { ...cmnPar[0] };
            } else {
                _cmnPar = { ...cmnPar };
            }
            _cmnPar.text = val;
            _cmnPar.textx = val;
            // console.log(cmnPar, "05-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", _cmnPar, "---", val)
            setCmnPar({ ..._cmnPar });
            props.handleAutoParProdaja(ticDoc, { ..._cmnPar })
        }
    }

    const handleSelect = async (e) => {
        let _ticDoc = { ...ticDoc }
        // console.log(cmnPar, "03-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa", _ticDoc)
        const _cmnPar = { ...e.value }
        _ticDoc.cpar = _cmnPar.code
        _ticDoc.npar = _cmnPar.textx
        _cmnPar.text = _cmnPar.textx;

        setTicDoc(_ticDoc)
        setCmnPar(e.value)
        setSelectedPar(e.value.code);
        setParValue(e.value.code);
        const ticDocService = new TicDocService();
        await ticDocService.putTicDocSet(_ticDoc);
        // console.log(_ticDoc, "APP-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        props.setAutoParaddressKey1(prev => prev + 1)
        props.handleAction(_ticDoc)
        props.setRefresh(prev => prev + 1)
        props.handleAutoParProdaja(_ticDoc, _cmnPar)
    };
    const handleParLClick = async (e, destination) => {
        try {
            // console.log(destination, "*********************handleParLClick****************************")
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
        let _ticDoc = { ...ticDoc }
        const _cmnPar = { ...newObj }
        _cmnPar.text = _cmnPar.textx;
        if (_cmnPar.ctp === 'XFL') {
            const parts = _cmnPar.text.split(' ');
            _cmnPar.first = parts.slice(0, 1)[0];
            _cmnPar.last = parts.slice(1).join(' ');
        }

        setParValue(_cmnPar.code);
        _ticDoc.usr = _cmnPar.id;
        _ticDoc.npar = _cmnPar.textx;
        _ticDoc.cpar = _cmnPar.code;
        // console.log(cmnPar, "07-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa", _cmnPar)
        setCmnPar({ ..._cmnPar })
        setTicDoc(_ticDoc)
        setSelectedPar(newObj.code);
        const ticDocService = new TicDocService();
        await ticDocService.putTicDocSet(_ticDoc);
        // console.log(_ticDoc, "APP0-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        props.setAutoParaddressKey1(prev => prev + 1)
        props.handleAction(_ticDoc)
        props.setRefresh(prev => prev + 1)
        props.handleAutoParProdaja(_ticDoc, _cmnPar)
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
                <div>
                    {item.idnum}
                    {` `}
                    {item.birthday}
                </div>
            </>
        );
    };
    return (
        <>
            {/* <div className="grid"> */}
            <Toast ref={toast} />
            {/* <div className="col-12">
                    <div className="card">
                        <div className="p-fluid formgrid grid"></div> */}
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-4">
                    <label htmlFor="par">{translations[selectedLanguage].Code} *</label>
                    <div className="p-inputgroup flex-1">
                        <AutoComplete
                            value={parValue}
                            suggestions={filteredPars}
                            completeMethod={() => { }}
                            onSelect={handleSelect}
                            onChange={(e) => onInputChange(e, "auto", 'par')}
                            itemTemplate={itemTemplate}
                            placeholder="Pretraži"
                            disabled={ticDoc.statuspayment == 1 || props.parTip == "UPDATE"}
                        />
                        <Button icon="pi pi-search" onClick={(e) => handleParLClick(e, "local")} className="p-button" disabled={ticDoc.statuspayment == 1} />
                    </div>
                </div>
                <div className="field col-12 md:col-8">
                    <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                    <InputText
                        id="text"
                        value={cmnPar?.text}
                        onChange={(e) => onInputChange(e, "auto", 'text')}
                        required
                        disabled={ticDoc.statuspayment == 1 || props.parTip == "EDIT"}
                    />
                </div>
            </div>
            {/* </div> */}
            {/* </div > */}
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
};

export default AutoParProdaja;
