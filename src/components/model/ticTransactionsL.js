import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import moment from 'moment'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicDocService } from "../../service/model/TicDocService";
import { TicDocsService } from "../../service/model/TicDocsService";
import TicDocs from './ticDocs';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import { AutoComplete } from "primereact/autocomplete";
import CmnParL from './cmn/cmnParL';
import { CmnParService } from "../../service/model/cmn/CmnParService";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from 'primereact/dropdown';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { ToggleButton } from 'primereact/togglebutton';

export default function TicTransactionsL(props) {
    // console.log(props, "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
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

    const [ticDoc, setTicDoc] = useState(_doc);
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
    let [refresh, setRefesh] = useState(0)

    /************************AUTOCOMPLIT**************************** */
    const [cmnParLVisible, setCmnParLVisible] = useState(false);
    const [allPara, setAllPars] = useState([]);
    const [parValue, setParValue] = useState(props.ticDoc?.cpar);
    const [filteredPars, setFilteredPars] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [selectedPar, setSelectedPar] = useState(null);
    /************************AUTOCOMPLIT**************************** */

    const [checkedRezervacija, setCheckedRezervacija] = useState(ticDoc?.status == "1" || false);
    const [checkedIsporuka, setCheckedIsporuka] = useState(props.ticDoc?.delivery == "1" || false);
    const [ddPaymenttpItem, setDdPaymenttpItem] = useState({});
    const [ddPaymenttpItems, setDdPaymenttpItems] = useState([{}]);
    const [ddChannellItem, setDdChannellItem] = useState({});
    const [ddChannellItems, setDdChannellItems] = useState([{}]);
    const [channellItem, setChannellItem] = useState({});

    const [checked, setChecked] = useState(false);

    let i = 0
    const handleCancelClick = () => {
        props.setTicDocsLVisible(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const ticDocsService = new TicDocsService();
                    const data = await ticDocsService.getArtikliLista(props.ticDoc?.id);
                    // //console.log(data, "---------------------------------AAAAAAAA--------------------------------------")
                    setTicDocss(data);
                    initFilters();
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
                // ++i
                // if (i < 2) {
                const ticDocsService = new TicDocsService();
                const data = await ticDocsService.getNaknadeLista(props.ticDoc?.id);
                // //console.log(data, "---------------------------------AAAAAAAA--------------------------------------")
                setTicDocsNs(data);
                initFilters();
                // }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [refresh]);

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const cmnParService = new CmnParService();
                    const data = await cmnParService.getCmnPar(props.ticDoc?.usr);
                    // //console.log(data, "---------------------------------AAAAAAAA--------------------------------------")
                    setCmnPar(data);
                    ticDoc.npar = data.tex;
                    ticDoc.cpar = data.code;
                    setTicDoc(ticDoc)
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

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

    const openNew = () => {
        setTicDocsDialog(emptyTicDocs);
    };

    const onRowSelect = (event) => {
        props.handleFirstColumnClick(event.data)
    };

    const onRowUnselect = (event) => {
        onRowSelect(event)
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

    const renderHeader = () => {
        return (
            <div className="flex card-container">
                <div className="flex flex-wrap gap-1" />
                <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
                />
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div>
                <div className="flex-grow-1"></div>
                <b>{translations[selectedLanguage].RollsList}</b>
                <div className="flex-grow-1"></div>
                <div className="flex flex-wrap gap-1">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder={translations[selectedLanguage].KeywordSearch}
                        />
                    </span>
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label={translations[selectedLanguage].Clear}
                        outlined
                        onClick={clearFilter}
                        text raised
                    />
                </div>
            </div>
        );
    };

    const formatDateColumn = (rowData, field) => {
        return DateFunction.formatDate(rowData[field]);
    };

    // <--- Dialog
    const setTicDocsDialog = (ticDocs) => {
        setVisible(true)
        setObjattsTip("CREATE")
        setTicDocs({ ...ticDocs });
    }
    //  Dialog --->

    const header = renderHeader();
    // heder za filter/>

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

    /*************************AUTOCOMPLIT************************************PAR************* */
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
        await ticDocService.putTicDoc(ticDoc);

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
    // Interna komponenta DocZaglavlje

    /***************************************************************************************** */

    /********************************************************************************/

    const handleChangeIsporuka = async (value) => {
        setCheckedIsporuka(value);
        let _ticDoc = { ...ticDoc }
        value ? _ticDoc.status = `1` : _ticDoc.status = `0`
        _ticDoc.channel = ddChannellItem.code

        setTicDoc(_ticDoc)
        await handleUpdateIspTicDoc(_ticDoc)
    };

    const handleChangeRezervacija = async (value) => {
        const previousValue = checkedRezervacija;

        let _ticDoc = { ...ticDoc }
        const pStatus = _ticDoc.status
        value ? _ticDoc.status = `1` : _ticDoc.status = `0`
        _ticDoc.reservation = _ticDoc.status
        setCheckedRezervacija(value);
        setTicDoc(_ticDoc)
        await handleUpdateRezTicDoc(_ticDoc, pStatus, previousValue)
    };

    const handleUpdateIspTicDoc = async (newObj) => {
        try {
            console.log(newObj, "handleUpdateTicDoc 4444444444444444444444444444444444444444444444444")
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
    const handleUpdateRezTicDoc = async (newObj, pStatus, previousValue) => {
        try {
            // //console.log(newObj, "handleUpdateTicDoc ** 00 ***************************************************####################")
            const ticDocService = new TicDocService();
            await ticDocService.obradaProdajeRezervacija(newObj, 'RZV');
        } catch (err) {
            // //console.log(newObj, "ERRRRORRR ** 00 ***************************************************####################")
            const _ticDoc = { ...newObj }
            _ticDoc.status = pStatus
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
    /********************************************************************************/


    /***************************************************************************************** */
    const DocZaglavlje = () => {
        return (
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
        setRefesh(++refresh)

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
                const data = await ticDocsService.getCmnObjByTpCode('t.code', 'XTCTP');
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
            console.log(rowData, "***********updateDataInDatabase************!!!!!!!!!!!!!!!!!!!!!", rowData.value)
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
        setRefesh(++refresh)
    };

    /*********************************************************************************** */
    return (
        <div className="card">
            <Toast ref={toast} />
            <DocZaglavlje />
            <DataTable
                dataKey="id"
                size={"small"}
                selectionMode="single"
                selection={ticDocs}
                loading={loading}
                value={ticDocss}
                footerColumnGroup={footerArtikalGroup}
                showGridlines
                removableSort
                scrollable
                scrollHeight="350px"
                tableStyle={{ minWidth: "50rem" }}
                metaKeySelection={false}
                rows={10}
                onSelectionChange={(e) => setTicDocs(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                <Column
                    field="nevent"
                    header={translations[selectedLanguage].nevent}
                    // sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="row"
                    header={translations[selectedLanguage].red}
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="seat"
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="nart"
                    header={translations[selectedLanguage].nart}
                    // sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="price"
                    header={translations[selectedLanguage].price}
                    // sortable
                    style={{ width: "7%" }}
                ></Column>
                <Column
                    field="output"
                    header={translations[selectedLanguage].outputL}
                    // sortable
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="discount"
                    header={translations[selectedLanguage].discount}
                    // sortable
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="potrazuje"
                    header={translations[selectedLanguage].potrazuje}
                    // sortable
                    style={{ width: "8%" }}
                ></Column>
                <Column
                    field="tickettp"
                    header={translations[selectedLanguage].tickettp}
                    style={{ width: '8%' }}
                    editor={(e) => valueEditor(e.rowData, e.field, e)}
                    body={valueTemplate}
                    onCellEditComplete={onCellEditComplete}
                ></Column>
                {/* <Column
                    header={translations[selectedLanguage].delivery}
                    field="delivery"
                    dataType="numeric"
                    style={{ width: '1%' }}
                    bodyClassName="text-center"
                    body={(e) => toggleBodyTemplate(e, `delivery`)}
                    onCellEditComplete={onCellEditComplete}
                ></Column>                 */}
            </DataTable>

            <span>Naknade:</span>

            <DataTable
                dataKey="id"
                size={"small"}
                selectionMode="single"
                selection={ticDocsN}
                footerColumnGroup={footerNaknadeGroup}
                loading={loading}
                value={ticDocsNs}
                showGridlines
                removableSort
                scrollable
                scrollHeight="350px"
                tableStyle={{ minWidth: "50rem" }}
                metaKeySelection={false}
                rows={10}
                onSelectionChange={(e) => setTicDocsN(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                <Column
                    field="nevent"
                    header={translations[selectedLanguage].nevent}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="nart"
                    header={translations[selectedLanguage].nart}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="taxrate"
                    header={translations[selectedLanguage].taxrate}
                    sortable
                    //filter
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="output"
                    header={translations[selectedLanguage].output}
                    sortable
                    //filter
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="discount"
                    header={translations[selectedLanguage].discount}
                    sortable
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="potrazuje"
                    header={translations[selectedLanguage].potrazuje}
                    sortable
                    style={{ width: "15%" }}
                ></Column>

            </DataTable>


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

        </div>
    );
}
