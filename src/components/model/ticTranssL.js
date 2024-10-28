import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { Column } from "primereact/column";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { TicDocService } from "../../service/model/TicDocService";
import { TicDocsService } from "../../service/model/TicDocsService";
import TicDocs from './ticDocs';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import { InputTextarea } from 'primereact/inputtextarea';
import { CmnParService } from "../../service/model/cmn/CmnParService";
import { Dropdown } from 'primereact/dropdown';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { ToggleButton } from 'primereact/togglebutton';
import TicDocsNaknadeL from './ticDocsNaknadeL'
import TicDocsKarteL from './ticDocsKarteL'
import TicDocDiscountL from './ticDocdiscountL'
import { Divider } from 'primereact/divider'
import { TicDocpaymentService } from "../../service/model/TicDocpaymentService";
import { TicDocdiscountService } from "../../service/model/TicDocdiscountService";

export default function TicTransactionsL(props) {
    console.log(props.ticDoc)
    const objectString = String(props.ticDoc);

    // console.log("99999999999999999999999999999999999999999999999999999999999")
    const _doc = { ...props.ticDoc }
    if (_doc.usr == '1') _doc.usr = null

    const objName = "tic_docs"
    const parTp = '-1'
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicDocs = EmptyEntities[objName]
    emptyTicDocs.doc = props.ticDoc?.id
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticDocss, setTicDocss] = useState([]);
    const [ticDocs, setTicDocs] = useState(emptyTicDocs);

    const [ticDocsNs, setTicDocsNs] = useState([]);
    const [ticDocsN, setTicDocsN] = useState(emptyTicDocs);

    const [ticDoc, setTicDoc] = useState(null);
    const [cmnPar, setCmnPar] = useState(props.cmnPar);
    const [ticDocItems, setTicDocItems] = useState(null);

    const [cmnTickettps, setCmnTickettps] = useState([]);
    const [ddTickettpItem, setDdTickettpItem] = useState(null);
    const [ddTickettpItems, setDdTickettpItems] = useState(null);

    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [docsTip, setObjattsTip] = useState('');
    let [refresh, setRefresh] = useState(1)


    const [cmnParLVisible, setCmnParLVisible] = useState(false);


    const [checkedRezervacija, setCheckedRezervacija] = useState(props.ticDoc?.status == "1" || false);
    const [checkedIsporuka, setCheckedIsporuka] = useState(props.ticDoc?.delivery == "1" || false);
    const [ddPaymenttpItem, setDdPaymenttpItem] = useState({});
    const [ddPaymenttpItems, setDdPaymenttpItems] = useState([{}]);
    const [ddChannellItem, setDdChannellItem] = useState({});
    const [ddChannellItems, setDdChannellItems] = useState([{}]);
    const [channellItem, setChannellItem] = useState({});

    const [checked, setChecked] = useState(false);
    let [refreshKey, setRefreshKey] = useState(0);
    let [refreshKeyK, setRefreshKeyK] = useState(1000);
    let [refreshKeyN, setRefreshKeyN] = useState(10000);
    const [zaUplatu, setZaUplatu] = useState(0);
    const [karteIznos, setKarteIznos] = useState(0);
    const [naknadeIznos, setNaknadeIznos] = useState(0);
    const [popustIznos, setPopustIznos] = useState(0);

    const [ddCmnPaymenttpItem, setDdCmnPaymenttpItem] = useState(null);
    const [ddCmnPaymenttpItems, setDdCmnPaymenttpItems] = useState(null);
    const [cmnPaymenttpItem, setCmnPaymenttpItem] = useState(null);
    const [cmnPaymenttpItems, setCmnPaymenttpItems] = useState(null);
    const [paymentCode, setPaymentCode] = useState('XXX');
    const [pBroj, setPBroj] = useState(null);


    const remoteRefresh = () => {
        setRefresh(++refresh)
    }

    let i = 0
    const handleCancelClick = () => {
        props.setTicDocsLVisible(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                if (i <= 2) {
                    const ticDocService = new TicDocService();
                    const data = await ticDocService.getTicDocP(props.ticDoc?.id);
                    // const data = await ticDocService.getTicDoc(props.ticDoc?.id);
                    if (!pBroj) {
                        setPBroj(props.ticDoc?.broj)
                    }
                    // console.log(data, "-555555555555555555555555------------------------------HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH------------------------", props.ticDoc)
                    setTicDoc(data);
                    // ticDoc.npar = data.tex;
                    // ticDoc.cpar = data.code;
                    // setTicDoc(ticDoc)
                    ++i
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [props.ticDoc?.broj]);

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const cmnParService = new CmnParService();
                    const data = await cmnParService.getCmnParP(props.ticDoc?.usr);
                    // //console.log(data, "---------------------------------AAAAAAAA--------------------------------------")
                    setCmnPar(data);
                    const _ticDoc = ticDoc
                    const _npar = data.tex;
                    const _cpar = data.code;
                    setTicDoc({ ..._ticDoc, npar: _npar, _cpar: _cpar })
                }
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
                const ticDocpaymentService = new TicDocpaymentService();
                const data = await ticDocpaymentService.getCmnPaymenttpsP('cmn_paymenttp_p');
console.log(data, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                const excludedIds = ['1', '2', '5', '6', '7', '1761685492354912256'];
                const filteredData = data.filter(item => !excludedIds.includes(item.id));

                setCmnPaymenttpItems(filteredData)


                const dataDD = filteredData.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnPaymenttpItems(dataDD);
                setDdCmnPaymenttpItem(dataDD.find((item) => item.code == ticDoc?.paymenttp) || null);
                // ticDoc.paymenttp = props.ticDoc.paymenttp
                // const pPaymentTp = ticDoc.paymenttp
                // console.log(ticDoc.paymenttp, "7777777777777777", ddCmnPaymenttpItem)
                if (ticDoc?.paymenttp) {
                    const foundItem = filteredData.find((item) => item.id === ticDoc.paymenttp);

                    setCmnPaymenttpItem(foundItem || null);
                    ticDoc.paymenttp = ticDoc?.paymenttp
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
            // console.log("##################################################################ticDocdiscountService>>#", props.ticDoc)
            try {
                const ticDocdiscountService = new TicDocdiscountService();
                const data = await ticDocdiscountService.getDiscountvalueP(props.ticDoc.id);

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const handlePopustIznos = (iznos) => {
        // setPopustIznos(iznos);
        // handleZaUplatu(karteIznos + naknadeIznos - popustIznos)
    };

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _ticDocss = [...ticDocss];
        let _ticDocs = { ...localObj.newObj.obj };
        //setSubmitted(true);
        if (localObj.newObj.docsTip === "CREATE") {
            _ticDocss.push(_ticDocs);
        } else if (localObj.newObj.docsTip === "UPDATE") {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticDocss[index] = _ticDocs;
        } else if ((localObj.newObj.docsTip === "DELETE")) {
            _ticDocss = ticDocss.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocs Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocs ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docsTip}`, life: 3000 });
        setTicDocss(_ticDocss);
        setTicDocs(emptyTicDocs);
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticDocss.length; i++) {
            if (ticDocss[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    // <heder za filter
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ocode: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            otext: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            cre_action: { value: null, matchMode: FilterMatchMode.EQUALS },
            upd_action: { value: null, matchMode: FilterMatchMode.EQUALS },
            del_action: { value: null, matchMode: FilterMatchMode.EQUALS },
            exe_action: { value: null, matchMode: FilterMatchMode.EQUALS },
            all_action: { value: null, matchMode: FilterMatchMode.EQUALS },
        });
        setGlobalFilterValue("");
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        let value1 = e.target.value
        let _filters = { ...filters };

        _filters["global"].value = value1;

        setFilters(_filters);
        setGlobalFilterValue(value1);
    };


    // <--- Dialog
    const setTicDocsDialog = (ticDocs) => {
        setVisible(true)
        setObjattsTip("CREATE")
        setTicDocs({ ...ticDocs });
    }


    const docsTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">

                <Button
                    type="button"
                    icon="pi pi-pencil"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        setTicDocsDialog(rowData)
                        setObjattsTip("UPDATE")
                    }}
                    text
                    raised ></Button>

            </div>
        );
    };


    const handleChangeIsporuka = async (value) => {
        setCheckedIsporuka(value);
        let _ticDoc = { ...ticDoc }
        value ? _ticDoc.status = `1` : _ticDoc.status = `0`
        _ticDoc.channel = ddChannellItem.code

        setTicDoc(_ticDoc)
        await handleUpdateIspTicDoc(_ticDoc)
    };


    const handleUpdateIspTicDoc = async (newObj) => {
        try {
            // console.log(newObj, "handleUpdateTicDoc 4444444444444444444444444444444444444444444444444")
            const ticDocService = new TicDocService();
            await ticDocService.putTicDoc(newObj);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    }

    /********************************************************************************/
    const handleUpdateNapDoc = async (newObj) => {
        try {
            // console.log(newObj, "handleUpdateTicDoc ** 00 ***************************************************####################")
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

    /********************************************************************************/
    const handleUpdatePaymenttpDoc = async (newObj) => {
        try {
            setTicDoc(newObj)
            // console.log(newObj, "PAYMENT ** 00 ***************************************************####################")
            const ticDocService = new TicDocService();
            await ticDocService.postTicDocSetValue('tic_doc', 'paymenttp', newObj.paymenttp, newObj.id);
            setRefreshKey(prev => prev + 1)
            setRefreshKeyK(prev => prev + 1)
            setRefreshKeyN(prev => prev + 1)
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
    /***************************************************************************************** */
    function formatNumberAsText(iznos) {
        // console.log(iznos, "************************************************")
        if (!iznos) {
            return ''; // ili vratite neki podrazumevani tekst, npr. '0.00'
        }
        const parts = iznos.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }
    const formattedZaUplatu = formatNumberAsText(zaUplatu);

    const DocZaglavlje = (props) => {
        return (
            <div className="grid">
                <div className="col-12">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">

                            {/* <label htmlFor="iznos">{translations[selectedLanguage].KarteI}</label> */}
                            <p>

                            </p>
                        </div>

                        {/*
                        <div className="field col-12 md:col-4">

                            <label htmlFor="iznos">{translations[selectedLanguage].NaknadeI}</label>
                            <p>
                                {props.ticDoc?.npar || ticDoc.npar}
                            </p>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="iznos">{translations[selectedLanguage].PopustI}</label>
                            <p>
                                {props.ticDoc?.npar || ticDoc.npar}
                            </p>
                        </div> */}
                        <div className="field col-12 md:col-4">
                            <label htmlFor="iznos">{translations[selectedLanguage].ZaUplatu}:</label>
                            <b><p>
                                <span style={{ fontSize: '20px' }}>
                                    {formattedZaUplatu}
                                </span>
                            </p>
                            </b>
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="broj">{translations[selectedLanguage].Transakcija}:</label>
                            <b><p>
                                <span style={{ fontSize: '20px' }}>
                                    {pBroj || ticDoc?.broj || props.ticDoc?.broj}
                                </span>
                            </p>
                            </b>
                        </div>
                        {/* <div className="field col-12 md:col-3">
                            <label htmlFor="paymenttp">{translations[selectedLanguage].Paymenttp} *</label>
                            <Dropdown id="paymenttp"
                                value={ddCmnPaymenttpItem}
                                options={ddCmnPaymenttpItems}
                                onChange={(e) => onInputChange(e, "options", 'paymenttp')}
                                required
                                showClear
                                optionLabel="name"
                                placeholder="Select One"
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        );
    };
    /*********************************************************************************** */
    const potrazujeTotal = () => {
        let total = 0;

        for (let stavka of ticDocss) {
            let potrazuje = Number(stavka.potrazuje); // ili parseFloat(stavka.potrazuje)
            if (!isNaN(potrazuje)) {
                total += potrazuje;
            }
        }

        return total;
    };
    const footerArtikalGroup = (
        <ColumnGroup>
            <Row>
                <Column footer={translations[selectedLanguage].Total} colSpan={7} footerStyle={{ textAlign: 'right' }} />
                <Column footer={potrazujeTotal} />
            </Row>
        </ColumnGroup>
    );
    /*********************************************************************************** */
    const potrazujeNaknadeTotal = () => {
        let total = 0;

        for (let stavka of ticDocsNs) {
            let potrazuje = Number(stavka.potrazuje); // ili parseFloat(stavka.potrazuje)
            if (!isNaN(potrazuje)) {
                total += potrazuje;
            }
        }

        return total;
    };
    const footerNaknadeGroup = (
        <ColumnGroup>
            <Row>
                <Column footer={translations[selectedLanguage].Total} colSpan={5} footerStyle={{ textAlign: 'right' }} />
                <Column footer={potrazujeNaknadeTotal} />
            </Row>
        </ColumnGroup>
    );
    /*********************************************************************************** */
    const onDDValueChange = async (e, type, name, rowData) => {
        let val = '';
        rowData.tickettp = e.value?.code;
        val = (e.target && e.target.value && e.target.value?.code) || '';
        await setDdTickettpItem(e.value);

        const updatedTicDocss = [...ticDocss];

        const rowIndex = await updatedTicDocss.findIndex((row) => row.id === rowData.id);

        updatedTicDocss[rowIndex][`${name}`] = val;
        delete updatedTicDocss[rowIndex].vreme;

        await updateDataInDatabase(updatedTicDocss[rowIndex]);
        setRefresh(++refresh)

    };

    const valueEditor = (rowData, field, e) => {
        const selectedOptions = ddTickettpItems;
        const selectedOption = selectedOptions.find((option) => option.code === rowData.tickettp);
        return <Dropdown
            id={rowData.id}
            showClear
            value={selectedOption}
            options={selectedOptions}
            onChange={(e) => onDDValueChange(e, 'options', 'tickettp', rowData)}
            placeholder="Select One"
            optionLabel="name"
        />;
    };
    const valueTemplate = (rowData) => {
        // const dropdownData = ddTickettpItems
        if (ddTickettpItems) {
            const dropdownValue = ddTickettpItems?.find((item) => item.code == rowData.tickettp);
            if (dropdownValue) {
                return <span>{dropdownValue.name}</span>;
            }
        }
        return rowData.tickettp;
    };

    const onCellEditComplete = async (e) => {
        let { rowData, newValue, newRowData, field, originalEvent: event } = e;
        let _rowData = { ...rowData };
        let _newValue = newValue;

        if (newValue != null) {
            _rowData[field] = _newValue;
            // Check if upload is pending and prevent exiting edit mode
            if (rowData.inputtp === '4' && !_rowData.isUploadPending) {
                event.preventDefault();
            }
        } else event.preventDefault();

        // Ažuriramo stanje komponente
        setTicDocss([...ticDocss]);
    };

    /*********************************************************************************** */
    /*********************************************************************************** */
    useEffect(() => {
        async function fetchData() {
            try {

                const ticDocsService = new TicDocsService();
                const data = await ticDocsService.getCmnObjByTpCodeP('t.code', 'XTCTP');
                setCmnTickettps(data);
                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                setDdTickettpItems(dataDD);

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const updateDataInDatabase = async (rowData) => {
        try {
            // console.log(rowData, "***********updateDataInDatabase************!!!!!!!!!!!!!!!!!!!!!", rowData.value)
            const ticDocsService = new TicDocsService();
            await ticDocsService.putTicDocs(rowData);
            // Dodatno rukovanje ažuriranim podacima, ako je potrebno          
        } catch (err) {
            console.error('Error updating data:', err);
            // Dodatno rukovanje greškom, ako je potrebno
        }
    };

    /*********************************************************************************** */
    const toggleBodyTemplate = (rowData, name, e) => {

        const checked = rowData.delivery == 1; // Pretpostavimo da 'valid' određuje da li je dugme čekirano
        const buttonClass = checked ? "toggle-button-checked" : "toggle-button-unchecked";

        return (
            <div className="flex justify-content-center" style={{ width: "18px", height: "18px", "font-size": "9px", border: 'none' }}>
                <ToggleButton
                    id={`tgl${rowData.id}`}
                    onLabel=""
                    offLabel=""
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                    checked={checked}
                    onChange={(e) => toggleChecked(e, 'delivery', rowData)} // Ako treba ažurirati stanje u komponenti
                    // className={`w-9rem ${buttonClass}`}
                    className={`${buttonClass}`}
                />
            </div>
        );
    };
    const toggleChecked = async (e, name, rowData) => {
        const newCheckedState = e.value;
        setChecked(newCheckedState);
        let val = '';
        let _ticDocs = {}
        val = newCheckedState ? 1 : 0;
        _ticDocs = { ...rowData };
        // Update data in parent component or global store

        const updatedTicDocss = [...ticDocss];

        const rowIndex = await updatedTicDocss.findIndex((row) => row.id === rowData.id);

        updatedTicDocss[rowIndex][`${name}`] = val;
        delete updatedTicDocss[rowIndex].vreme;

        await updateDataInDatabase(updatedTicDocss[rowIndex]);
        setRefresh(++refresh)
    };
    const onInputChange = async (e, type, name) => {
        let val = ''
        if (type === "options") {
            // setDropdownItem(e.value);
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "paymenttp") {
                setDdCmnPaymenttpItem(e.value);
                const foundItem = cmnPaymenttpItems.find((item) => item.id === val);
                // console.log(foundItem, "99999999999")
                setCmnPaymenttpItem(foundItem || null);
                ticDoc.paymenttp = val
                setPaymentCode(foundItem?.code || null)
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticDoc = { ...ticDoc };
        _ticDoc[`${name}`] = val;
        if (name === `textx`) _ticDoc[`text`] = val

        if (name == 'paymenttp') {
            await handleUpdatePaymenttpDoc(_ticDoc)
        }

        setTicDoc(_ticDoc);
    };


    const handleNapomenaClick = async () => {

        let _ticDoc = { ...ticDoc || props.ticDoc }
        setTicDoc(_ticDoc)
        await handleUpdateNapDoc(_ticDoc)
        // remountStavke();
    };
    const handleZaUplatu = (iznos) => {
        // setZaUplatu(iznos);
    };
    const handleKarteIznos = (iznos) => {
        setZaUplatu(iznos + naknadeIznos);
    };

    const handleNetoIznos = (iznos) => {
    };

    const handleBrojIznos = (iznos) => {
    };

    const handleNaknadeIznos = (iznos) => {
        setNaknadeIznos(iznos);
        // handleZaUplatu(karteIznos + naknadeIznos - popustIznos)
    };

    /*********************************************************************************** */
    return (
        <div className="fixed-height-tabpanel" style={{ height: "790px" }}>
            <Toast ref={toast} />
            <DocZaglavlje

            />
            {(props.mapa != 1 && 0 == 1) && (
                <div className="flex-grow-1">
                    <TicDocDiscountL
                        key={refreshKey}
                        parameter={"inputTextValue"}
                        ticDoc={ticDoc || props.ticDoc}
                        ticDocs={ticDocs}
                        cmnPar={cmnPar}
                        setVisible={true}
                        dialog={false}
                        docTip={props.docTip}
                        remoteRefresh={remoteRefresh}
                        refresh={refresh}
                        parentC={"BL"}
                        handlePopustIznos={handlePopustIznos}
                        karteIznos={karteIznos}
                    />
                </div>
            )}
            <Divider />
            <div className="flex-grow-1">
                <TicDocsKarteL
                    key={refreshKeyK}
                    parameter={"inputTextValue"}
                    ticDoc={ticDoc || props.ticDoc}
                    ticDocs={ticDocs}
                    cmnPar={cmnPar}
                    setVisible={true}
                    dialog={false}
                    docTip={props.docTip}
                    remoteRefresh={remoteRefresh}
                    refresh={refresh}
                    parentC={"BL"}
                    handleFirstColumnClick={props.handleFirstColumnClick}
                    handleKarteIznos={handleKarteIznos}
                    handlePopustIznos={handlePopustIznos}
                    handleNetoIznos={handleNetoIznos}
                    handleBrojIznos={handleBrojIznos}
                    zaUplatu={zaUplatu}
                    mapa={props.mapa}
                />
            </div>

            <div className="flex-grow-1">
                <TicDocsNaknadeL
                    key={refreshKeyN}
                    parameter={"inputTextValue"}
                    ticDoc={ticDoc || props.ticDoc}
                    ticDocs={ticDocs}
                    cmnPar={cmnPar}
                    setVisible={true}
                    dialog={false}
                    docTip={props.docTip}
                    refresh={refresh}
                    handleNaknadeIznos={handleNaknadeIznos}
                />
            </div>
            {(props.mapa != 1) && (
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">

                            <label htmlFor="napomena">{translations[selectedLanguage].Napomena}</label>
                            <InputTextarea
                                id="opis"
                                rows={5}
                                autoResize
                                style={{ width: '100%' }}
                                // cols={100}
                                value={ticDoc?.opis || props.ticDoc?.opis}
                                onChange={(e) => onInputChange(e, 'text', 'opis')}
                            />
                            <Button icon="pi pi-save"
                                onClick={handleNapomenaClick}
                                className="p-button" />
                        </div>
                    </div>
                </div>
            )}
            <Dialog
                header={translations[selectedLanguage].Objatts}
                visible={visible}
                style={{ width: '60%' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                    <TicDocs
                        parameter={"inputTextValue"}
                        ticDocs={ticDocs}
                        ticDoc={props.ticDoc}
                        handleDialogClose={handleDialogClose}
                        setVisible={setVisible}
                        dialog={true}
                        docsTip={docsTip}
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
