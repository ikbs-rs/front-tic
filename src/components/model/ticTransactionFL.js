/**
 * Argumenti respektivno koji se prosledjuju
 * 0 - modu, `adm`
 * 1 - tabela, bez prefiksa, `user`
 * 2 - id tabele
 * 3 - naziv atributa po kome se pretrazuje
 * 5 - mumericki atrinut 0 ili 1
 * 6 - vrednost atributa pokome se pretrazuje
 */
import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import './index.css';
import { TicDocService } from "../../service/model/TicDocService";
import { TicDocvrService } from "../../service/model/TicDocvrService";
import TicTransaction from './ticTransaction';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction"
import { Dropdown } from 'primereact/dropdown';
import { useSearchParams } from 'react-router-dom';
import DeleteDialog from '../dialog/DeleteDialog';
import TicEventProdajaL from './ticProdajaTab';
import { ToggleButton } from 'primereact/togglebutton';

export default function TicTransactionFL(props) {
    const [searchParams] = useSearchParams();
    const docVr = searchParams.get('docVr');
    const objName = 'tic_doc';
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [submitted, setSubmitted] = useState(false);
    const emptyTicDoc = EmptyEntities[objName]

    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticDocs, setTicDocs] = useState([]);
    const [ticDoc, setTicDoc] = useState(emptyTicDoc);

    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [docTip, setDocTip] = useState('');

    const [ticDocvrs, setTicDocvrs] = useState([]);
    const [ticDocvr, setTicDocvr] = useState(null);
    const [ddTicDocvrItem, setDdTicDocvrItem] = useState(null);
    const [ddTicDocvrItems, setDdTicDocvrItems] = useState(null);

    const [ticDocobjs, setTicDocobjs] = useState([]);
    const [ticDocobj, setTicDocobj] = useState(null);
    const [ddTicDocobjItem, setDdTicDocobjItem] = useState(null);
    const [ddTicDocobjItems, setDdTicDocobjItems] = useState(null);
    const [componentKey, setComponentKey] = useState(0);
    let [refresh, setRefresh] = useState(0);

    const [ticEventProdajaLVisible, setTicEventProdajaLVisible] = useState(false);

    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(true);
    const [checked3, setChecked3] = useState(false);
    const [checked4, setChecked4] = useState(false);
    const [checked5, setChecked5] = useState(false);
    const [checked6, setChecked6] = useState(false);

    let i = 0;

    const handleCancelClick = () => {
        props.setTicEventattsLVisible(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2 || refresh > 0) {
                    const ticDocService = new TicDocService();
                    const data = await ticDocService.getTransactionFLista(checked1, checked2, checked3, checked4, checked5, checked6);
                    console.log(data, "**###$$$%%%***!!!---+++///((({{{}}})))")
                    setTicDocs(data);
                    initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [refresh, checked1, checked2, checked3, checked4, checked5, checked6]);



    async function fetchDoc(rowData) {
        try {
            const ticDocService = new TicDocService();
            const data = await ticDocService.getTicDoc(rowData.id);
            //console.log(uId, "*-*-*************fetchDoc*************-*", data)
            Object.assign(data, rowData);
            return data;
        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }


    // const rowClass = (rowData) => {
    //     const tableRow = document.querySelectorAll('.p-datatable-tbody');
    //     tableRow.forEach((row) => {
    //       row.classList.remove('p-datatable-tbody');
    //     });
    //     const selRow = document.querySelectorAll('.p-selectable-row');
    //     selRow.forEach((row) => {
    //       console.log("*-*-*************row.row.classList*************-*", row.classList)
    //       row.classList.remove('p-selectable-row');
    //     });   

    //     //console.log(rowData.docvr == '1683550594276921344', "****************rowData************************", rowData)
    //     return rowData.docvr == '1683550594276921344'
    //       ? 'highlight-row-blue'
    //       : rowData.docvr == '1683550132932841472'
    //       ? 'highlight-row-green'
    //       : '';
    //   };


    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocvrService = new TicDocvrService();
                const data = await ticDocvrService.getTicDocvrs();

                setTicDocvrs(data)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicDocvrItems(dataDD);

                if (docVr) {
                    const foundItem = data.find((item) => item.code === docVr);
                    emptyTicDoc.docvr = foundItem.id;
                    setDdTicDocvrItem(dataDD.find((item) => item.code === foundItem.id) || null);
                    setTicDocvr(foundItem || null);
                }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [docVr]);

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _ticDocs = [...ticDocs];
        let _ticDoc = { ...localObj.newObj.obj };

        //setSubmitted(true);
        if (localObj.newObj.docTip === "CREATE") {
            _ticDocs.push(_ticDoc);
        } else if (localObj.newObj.docTip === "UPDATE") {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticDocs[index] = _ticDoc;
        } else if ((localObj.newObj.docTip === "DELETE")) {
            _ticDocs = ticDocs.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDoc Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDoc ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docTip}`, life: 3000 });
        setTicDocs(_ticDocs);
        setTicDoc(emptyTicDoc);
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticDocs.length; i++) {
            if (ticDocs[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const openNew = () => {
        setTicDocDialog(emptyTicDoc);
    };
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };
    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    const onRowSelect = (doc) => {
        toast.current.show({
            severity: "info",
            summary: "Action Selected",
            detail: `Id: ${doc.data.id} Name: ${doc.data.broj}`,
            life: 3000,
        });
    };

    const onRowUnselect = (doc) => {
        toast.current.show({
            severity: "warn",
            summary: "Action Unselected",
            detail: `Id: ${doc.data.id} Name: ${doc.data.textx}`,
            life: 3000,
        });
    };
    const onInputChange = (e, type, name) => {
        let val = '';
        if (type === "options") {
            let _ticDoc = { ...ticDoc };
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "docvr") {
                setDdTicDocvrItem(e.value);
                const foundItem = ticDocvrs.find((item) => item.id === val);
                setTicDocvr(foundItem || null);
                _ticDoc.docvr = val;
                emptyTicDoc.docvr = val;
            } else if (name == "docobj") {
                setDdTicDocobjItem(e.value);
                const foundItem = ticDocobjs.find((item) => item.id === val);
                setTicDocobj(foundItem || null);
                _ticDoc.docobj = val;
                emptyTicDoc.docobj = val;
            }
            setTicDoc(_ticDoc);
        }
    }
    // <heder za filter
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            code: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            textx: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            storno: { value: null, matchMode: FilterMatchMode.EQUALS },
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

    const handleEventProdajaClick = async (e, destination) => {
        try {
            setTicEventProdajaLDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch ticArt data',
                life: 3000
            });
        }
    };

    const setTicEventProdajaLDialog = (destination) => {
        setTicEventProdajaLVisible(true);
    };

    const handleTicEventProdajaLDialogClose = (newObj) => {
        setTicEventProdajaLVisible(false);
    };

    const renderHeader = () => {
        return (
            <div className="flex card-container">

                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].selection} icon="pi pi-table" onClick={handleEventProdajaClick} severity="info" text raised />
                </div>
                <div className="flex-grow-1" />
                <b>{translations[selectedLanguage].TransactionList}</b>
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

    const formatTimeColumn = (rowData, field) => {
        return DateFunction.convertTimeToDisplayFormat(rowData[field]);
    };

    const formatDatetime = (rowData, field) => {
        if (rowData[field]) {
            return DateFunction.formatDatetime(rowData[field]);
        }
    };

    const stornoBodyTemplate = (rowData) => {
        const storno = rowData.storno == 1 ? true : false
        return (
            <i
                className={classNames("pi", {
                    "text-green-500 pi-check-circle": storno,
                    "text-red-500 pi-times-circle": !storno
                })}
            ></i>
        );
    };

    const stornoFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="verified-filter" className="font-bold">
                    {translations[selectedLanguage].Valid}
                </label>
                <TriStateCheckbox
                    inputId="verified-filter"
                    value={options.value}
                    onChange={(e) => options.filterCallback(e.value)}
                />
            </div>
        );
    };

    // <--- Dialog
    const setTicDocDialog = (ticDoc) => {
        setVisible(true)
        setDocTip("CREATE")
        setTicDoc({ ...ticDoc });
    }
    //  Dialog --->

    const header = renderHeader();
    // heder za filter/>

    const actionTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">

                <Button
                    type="button"
                    icon="pi pi-pencil"
                    style={{ width: '24px', height: '24px' }}
                    onClick={async () => {
                        const rowDoc = await fetchDoc(rowData)
                        //console.log(rowData, "***************rowData****************", rowDoc)
                        setTicDocDialog(rowDoc)
                        setDocTip("UPDATE")
                        setTicDocobj(rowDoc.docobj)
                        setTicDocvr(rowDoc.docvr)
                    }}
                    text
                    raised ></Button>

            </div>
        );
    };

    const rowClass = (rowData) => {
        // console.log(rowData.trtp, "************************************************rowData.trtp****************************************************")
        const tableRow = document.querySelectorAll('.p-datatable-tbody');
        tableRow.forEach((row) => {
            //row.classList.remove('p-datatable-tbody');
        });
        const selRow = document.querySelectorAll('.p-selectable-row');
        selRow.forEach((row) => {
            row.classList.remove('p-selectable-row');
        });

        return rowData.trtp == '01'
            ? 'highlight-row-1'
            : rowData.trtp == '02'
                ? 'highlight-row-2'
                : rowData.trtp == '03'
                    ? 'highlight-row-3'
                    : rowData.trtp == '04'
                        ? 'highlight-row-4'
                        : rowData.trtp == '05'
                            ? 'highlight-row-5'
                            : rowData.trtp == '06'
                                ? 'highlight-row-6'
                                : rowData.trtp == '07'
                                    ? 'highlight-row-7'
                                    : rowData.trtp == '08'
                                        ? 'highlight-row-8'
                                        : rowData.trtp == '09'
                                            ? 'highlight-row-9'
                                            : rowData.trtp == '10'
                                                ? 'highlight-row-10'
                                                : rowData.trtp == '11'
                                                    ? 'highlight-row-11'
                                                    : rowData.trtp == '12'
                                                        ? 'highlight-row-12'
                                                        : rowData.trtp == '13'
                                                            ? 'highlight-row-13'
                                                            : rowData.trtp == '14'
                                                                ? 'highlight-row-14'
                                                                : rowData.trtp == '15'
                                                                    ? 'highlight-row-15'
                                                                    : rowData.trtp == '16'
                                                                        ? 'highlight-row-16'
                                                                        : rowData.trtp == '17'
                                                                            ? 'highlight-row-17'
                                                                            : rowData.trtp == '18'
                                                                                ? 'highlight-row-18'
                                                                                : rowData.trtp == '19'
                                                                                    ? 'highlight-row-19'
                                                                                    : rowData.trtp == '20'
                                                                                        ? 'highlight-row-20'
                                                                                        : rowData.trtp == '21'
                                                                                            ? 'highlight-row-21'
                                                                                            : rowData.trtp == '22'
                                                                                                ? 'highlight-row-22'
                                                                                                : rowData.trtp == '23'
                                                                                                    ? 'highlight-row-23'
                                                                                                    : rowData.trtp == '24'
                                                                                                        ? 'highlight-row-24'
                                                                                                        : rowData.trtp == '25'
                                                                                                            ? 'highlight-row-25'
                                                                                                            : rowData.trtp == '26'
                                                                                                                ? 'highlight-row-26'
                                                                                                                : rowData.trtp == '27'
                                                                                                                    ? 'highlight-row-27'
                                                                                                                    : rowData.trtp == '28'
                                                                                                                        ? 'highlight-row-28'
                                                                                                                        : rowData.trtp == '29'
                                                                                                                            ? 'highlight-row-29'
                                                                                                                            : rowData.canceled < '0'
                                                                                                                                ? 'highlight-row-36 '
                                                                                                                                : rowData.paid
                                                                                                                                    ? 'highlight-row-31'
                                                                                                                                    : rowData.istekla == true
                                                                                                                                        ? 'highlight-row-30'
                                                                                                                                        : '';
    };

    const neventTemplate = (rowData) => {
        // Proveri da li postoji niz proizvoda
        console.log(rowData.nevent, "rowData*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*-*", JSON.parse(rowData.nevent))

        const nizObjekata = JSON.parse(rowData.nevent)

        if (nizObjekata && nizObjekata.length > 0) {
            console.log(nizObjekata.length, "nizObjekata.length*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*-*", JSON.parse(rowData.nevent))
            return (
                <div>
                    <table className="p-datatable" style={{ minWidth: "20rem" }}>
                        <tbody>
                            {nizObjekata.map((item) => (
                                <tr key={item.starttm}>
                                    <td style={{ width: '60%' }}>{item.text}</td>
                                    <td style={{ width: '20%' }}>{DateFunction.formatDate(item.startda)}</td>
                                    <td style={{ width: '20%' }}>{DateFunction.formatTimeMin(item.starttm)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            // Ako nema proizvoda, možete prikazati odgovarajuću poruku ili ništa
            return null;
        }
    }

    const buttonClassCustom1 = checked1 ? "toggle-button-checked" : "toggle-button-unchecked";
    const buttonClassCustom2 = checked2 ? "toggle-button-checked" : "toggle-button-unchecked";
    const buttonClassCustom3 = checked3 ? "toggle-button-checked" : "toggle-button-unchecked";
    const buttonClassCustom4 = checked4 ? "toggle-button-checked" : "toggle-button-unchecked";
    const buttonClassCustom5 = checked5 ? "toggle-button-checked" : "toggle-button-unchecked";
    const buttonClassCustom6 = checked6 ? "toggle-button-checked" : "toggle-button-unchecked";

    const paidBodyTemplate = (rowData) => {
        const setParentTdBackground = (element, paid) => {
            const parentTd = element?.parentNode;
            if (parentTd) {
                console.log(paid, "######################################################################")
                if (paid == false) {
                    parentTd.style.backgroundColor = "red";
                } else {
                    parentTd.style.backgroundColor = "green";
                }
            }
        };

        return (
            <div ref={(el) => setParentTdBackground(el, rowData.paid)} />
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-1">

                    <ToggleButton
                        id={`tgAll}`}
                        onLabel="All"
                        offLabel="All"
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        checked={checked2}
                        onChange={(e) => setChecked2(e.value)}
                        className={`${buttonClassCustom2} custom2 w-9rem`}
                    />

                </div>
                <div className="field col-12 md:col-1">

                    <ToggleButton
                        id={`tglInDelivery}`}
                        onLabel="InDelivery"
                        offLabel="InDelivery"
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        checked={checked3}
                        onChange={(e) => setChecked3(e.value)}
                        className={`${buttonClassCustom3} custom3 w-9rem`}
                    />

                </div>
                <div className="field col-12 md:col-1">

                    <ToggleButton
                        id={`tglForDelivery`}
                        onLabel="ForDelivery"
                        offLabel="ForDelivery"
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        checked={checked1}
                        onChange={(e) => setChecked1(e.value)}
                        className={`${buttonClassCustom1} custom1 w-9rem`}
                    />

                </div>
                <div className="field col-12 md:col-1">

                    <ToggleButton
                        id={`tglPaid`}
                        onLabel="Paid"
                        offLabel="Paid"
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        checked={checked5}
                        onChange={(e) => setChecked5(e.value)}
                        className={`${buttonClassCustom5} custom5 w-9rem`}
                    />

                </div>
                <div className="field col-12 md:col-1">

                    <ToggleButton
                        id={`tglExpired`}
                        onLabel="Expired"
                        offLabel="Expired"
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        checked={checked4}
                        onChange={(e) => setChecked4(e.value)}
                        className={`${buttonClassCustom4} custom4 w-9rem`}
                    />

                </div>
                <div className="field col-12 md:col-1">
                    <ToggleButton
                        id={`tglCanceled}`}
                        onLabel="Canceled"
                        offLabel="Canceled"
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        checked={checked6}
                        onChange={(e) => setChecked6(e.value)}
                        className={`${buttonClassCustom6} custom6 w-9rem`}
                    />
                </div>
            </div>

            <DataTable
                key={componentKey}
                dataKey="ide"
                size={"small"}
                rowClassName={rowClass}
                selectionMode="single"
                selection={ticDoc}
                loading={loading}
                value={ticDocs}
                header={header}
                showGridlines
                removableSort
                filters={filters}
                scrollable
                sortField="date"
                sortOrder={1}
                scrollHeight="616px"
                tableStyle={{ minWidth: "50rem" }}
                metaKeySelection={false}
                paginator
                rows={125}
                rowsPerPageOptions={[125, 150, 200]}
                onSelectionChange={(e) => setTicDoc(e.value)}
            >
                {/* <Column
                    //bodyClassName="text-center"
                    body={eventattsTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                /> */}
                <Column
                    //bodyClassName="text-center"
                    body={actionTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                />
                <Column
                    field="id"
                    header={translations[selectedLanguage].Transaction}
                    sortable
                    filter
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="text"
                    header={translations[selectedLanguage].nevent}
                    // body={neventTemplate}
                    sortable
                    filter
                    style={{ width: "30%" }}
                ></Column>
                <Column
                    field="venue"
                    header={translations[selectedLanguage].hall}
                    sortable
                    filter
                    style={{ width: "20%" }}
                ></Column>
                <Column
                    field="startda"
                    header={translations[selectedLanguage].begda}
                    body={(rowData) => formatDateColumn(rowData, "startda")}
                    sortable
                    filter
                    style={{ width: "20%" }}
                ></Column>
                <Column
                    field="starttm"
                    header={translations[selectedLanguage].begtm}
                    body={(rowData) => formatTimeColumn(rowData, "starttm")}
                    sortable
                    filter
                    style={{ width: "20%" }}
                ></Column>
                <Column
                    field="npar"
                    header={translations[selectedLanguage].npar}
                    sortable
                    filter
                    style={{ width: "20%" }}
                ></Column>
                <Column
                    field="tmreserv"
                    header={translations[selectedLanguage].tmreserv}
                    sortable
                    filter
                    style={{ width: "10%" }}
                    body={(rowData) => formatDatetime(rowData, "tmreserv")}
                ></Column>
                <Column
                    field="tm"
                    header={translations[selectedLanguage].tm}
                    sortable
                    filter
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="potrazuje"
                    header={translations[selectedLanguage].Amount}
                    sortable
                    filter
                    style={{ width: "10%" }}
                    bodyStyle={{ textAlign: 'right' }}
                ></Column>
                <Column
                    field="output"
                    header={translations[selectedLanguage].brojkarti}
                    sortable
                    filter
                    style={{ width: "5%" }}
                    bodyStyle={{ textAlign: 'center' }}
                ></Column>
                <Column
                    field="paid"
                    header={translations[selectedLanguage].paid}
                    body={paidBodyTemplate}
                    style={{ width: "5%" }}
                    paidBodyTemplate
                    bodyStyle={{ textAlign: 'center' }}
                ></Column>
                {/* <Column
                    field="istekla"
                    header={translations[selectedLanguage].Istekle}
                    style={{ width: "5%" }}
                    bodyStyle={{ textAlign: 'center' }}
                ></Column> */}
                <Column
                    field="delivery"
                    header={translations[selectedLanguage].Delivery}
                    sortable
                    filter
                    style={{ width: "5%" }}
                    bodyStyle={{ textAlign: 'center' }}
                ></Column>
                {/* <Column
                    field="canceled"
                    header={translations[selectedLanguage].Canceled}
                    sortable
                    filter
                    style={{ width: "5%" }}
                    bodyStyle={{ textAlign: 'center' }}
                ></Column> */}
            </DataTable>
            <DeleteDialog visible={deleteDialogVisible} inAction="delete" onHide={hideDeleteDialog} />
            <Dialog
                // header={translations[selectedLanguage].Doc}
                header={
                    <div className="dialog-header">
                        <Button
                            label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                            onClick={() => {
                                ++refresh
                                console.log(refresh, "########################")
                                setRefresh(refresh)
                                setVisible(false);
                                // setShowMyComponent(false);
                            }}
                            severity="secondary" raised
                        />
                        {/* <span>{translations[selectedLanguage].Doc}</span>                         */}
                    </div>
                }
                visible={visible}
                style={{ width: '95%', height: '1400px' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                    <TicTransaction
                        parameter={"inputTextValue"}
                        ticDoc={ticDoc}
                        handleDialogClose={handleDialogClose}
                        setVisible={setVisible}
                        dialog={true}
                        ticDocvr={ticDocvr}
                        ticDocobj={ticDocobj}
                        docTip={docTip}
                        eventTip={"SAL"}
                    />
                )}
            </Dialog>
            <Dialog
                header={
                    <div className="dialog-header">
                        <Button
                            label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                            onClick={() => {
                                ++refresh
                                console.log(refresh, "########################")
                                setRefresh(refresh)
                                setTicEventProdajaLVisible(false);
                                // setShowMyComponent(false);
                            }}
                            severity="secondary" raised
                        />
                        {/* <span>{translations[selectedLanguage].Doc}</span>                         */}
                    </div>
                }
                visible={ticEventProdajaLVisible}
                style={{ width: '95%', height: '1400px' }}
                onHide={() => {
                    setTicEventProdajaLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticEventProdajaLVisible &&
                    <TicEventProdajaL
                        parameter={'inputTextValue'}
                        ticDocs={ticDocs}
                        ticDoc={props.ticDoc}
                        onTaskComplete={handleTicEventProdajaLDialogClose}
                        setTicEventProdajaLVisible={setTicEventProdajaLVisible}
                        dialog={true}
                        lookUp={true}
                    />}
            </Dialog>
            {/* <ConfirmDialog visible={confirmDialogVisible} onHide={() => setConfirmDialogVisible(false)} onConfirm={handleConfirm} /> */}
        </div>
    );
}
