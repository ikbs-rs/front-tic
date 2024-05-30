import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
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

export default function TicTransactionsL(props) {
    console.log(props, "@@ PROPS @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
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

    const [ticDoc, setTicDoc] = useState(_doc);
    const [ticDocItems, setTicDocItems] = useState(null);

    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [docsTip, setObjattsTip] = useState('');
    const [refresh, setRefesh] = useState(0)

    /************************AUTOCOMPLIT**************************** */
    const [cmnParLVisible, setCmnParLVisible] = useState(false);
    const [allPara, setAllPars] = useState([]);
    const [parValue, setParValue] = useState(props.ticEvent?.cpar);
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
                    const data = await ticDocsService.getLista(props.ticDoc?.id);
                    console.log(data, "---------------------------------AAAAAAAA--------------------------------------")
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
                    console.log(e.target, "###########################-auto-###########################setDebouncedSearch###", e.target.value)
                    ticDoc.par = e.target.value.id
                    ticDoc.npar = e.target.value.textx
                    ticDoc.cpar = e.target.value.code
                    // Postavite debouncedSearch nakon 1 sekunde neaktivnosti unosa
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
            //setParValue(data.find((item) => item.id === props.ticDoc.par) || null);
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
            alert(parValue, "Izmena")
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
        ticDoc.par = newObj.id;
        ticDoc.npar = newObj.textx;
        ticDoc.cpar = newObj.code;
        setTicDoc(ticDoc)
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
            // console.log(newObj, "handleUpdateTicDoc *****************************************************####################")
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
            // console.log(newObj, "handleUpdateTicDoc ** 00 ***************************************************####################")
            const ticDocService = new TicDocService();
            await ticDocService.obradaProdajeRezervacija(newObj, 'RZV');
        } catch (err) {
            // console.log(newObj, "ERRRRORRR ** 00 ***************************************************####################")
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
                <div className="field col-12 md:col-4">
                    <label htmlFor="par">{translations[selectedLanguage].Kupac} *</label>
                    <div className="p-inputgroup flex-1">
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
                    </div>
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="par">{translations[selectedLanguage].KupacNaziv}</label>
                    <div className="p-inputgroup flex-1">
                        <InputText
                            id="npar"
                            value={props.ticDoc?.npar || ticDoc.npar}
                            required
                        />
                    </div>
                </div>
                <>
                    <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                        <b>
                            <label htmlFor="rezervacija" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Rezervacija}</label>
                        </b>
                        <InputSwitch id="rezervacija" checked={checkedRezervacija} onChange={(e) => handleChangeRezervacija(e.value)} />
                    </div>
                    <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }}>
                        <b>
                            <label htmlFor="isporuka" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Isporuka}</label>
                        </b>
                        <InputSwitch id="isporuka" checked={checkedIsporuka} onChange={(e) => handleChangeIsporuka(e.value)} />
                    </div>
                    <>
                        <div className="fieldH flex align-items-center"><b>
                            <label htmlFor="myDropdown" style={{ marginRight: '1em' }}>{translations[selectedLanguage].Izaberite_kanal}</label>
                        </b>
                            <Dropdown id="paymenttp"
                                value={ddPaymenttpItem}
                                options={ddPaymenttpItems}
                                onChange={(e) => onInputChange(e, "options", 'paymenttp')}
                                optionLabel="name"
                                placeholder="Select One"

                            />
                        </div>

                    </>

                </>

            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            {/* <div className="grid">
                <div className="field col-12 md:col-4">
                    <label htmlFor="par">{translations[selectedLanguage].Kupac} *</label>
                    <div className="p-inputgroup flex-1">
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
                    </div>
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="par">{translations[selectedLanguage].KupacNaziv}</label>
                    <div className="p-inputgroup flex-1">
                        <InputText
                            id="npar"
                            value={props.ticDoc?.npar||ticDoc.npar}
                            required
                        />
                    </div>
                </div>

            </div> */}

            <DocZaglavlje />
            <DataTable
                dataKey="id"
                size={"small"}
                selectionMode="single"
                selection={ticDocs}
                loading={loading}
                value={ticDocss}
                // header={header}
                showGridlines
                removableSort
                // filters={filters}
                scrollable
                scrollHeight="350px"
                // virtualScrollerOptions={{ itemSize: 46 }}
                tableStyle={{ minWidth: "50rem" }}
                metaKeySelection={false}
                // paginator
                rows={10}
                // rowsPerPageOptions={[5, 10, 25, 50]}
                onSelectionChange={(e) => setTicDocs(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                {/* <Column
                    //bodyClassName="text-center"
                    body={docsTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                /> */}
                <Column
                    field="nevent"
                    header={translations[selectedLanguage].nevent}
                    sortable
                    // body={(rowData) => <span onClick={() => props.handleFirstColumnClick(rowData)}>{rowData.nevent}</span>}
                    //filter
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="seat"
                    header={translations[selectedLanguage].nloc}
                    sortable
                    //filter
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="nart"
                    header={translations[selectedLanguage].nart}
                    sortable
                    //filter
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="price"
                    header={translations[selectedLanguage].price}
                    sortable
                    //filter
                    style={{ width: "10%" }}
                ></Column>
                {/* <Column
          field="taxrate"
          header={translations[selectedLanguage].taxrate}
          sortable
          //filter
          style={{ width: "5%" }}
        ></Column>   */}
                <Column
                    field="fee"
                    header={translations[selectedLanguage].fee}
                    sortable
                    //filter
                    style={{ width: "5%" }}
                ></Column>
                {/*     <Column
          field="input"
          header={translations[selectedLanguage].input}
          sortable
          filter
          style={{ width: "10%" }}
  ></Column>  */}
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
                    // filter
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="potrazuje"
                    header={translations[selectedLanguage].potrazuje}
                    sortable
                    //filter
                    style={{ width: "15%" }}
                ></Column>
                {/* <Column
                    field="begtm"
                    header={translations[selectedLanguage].begtm}
                    sortable
                    //filter
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="endtm"
                    header={translations[selectedLanguage].endtm}
                    sortable
                    //filter
                    style={{ width: "10%" }}
                ></Column> */}
            </DataTable>
            {/* <div className="card"> */}

            {/* </div> */}

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
