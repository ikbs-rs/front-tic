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
import TicEventProdajaL from './ticEventProdajaL';

export default function TicTransactionL(props) {
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

    const [ticEventProdajaLVisible, setTicEventProdajaLVisible] = useState(false);
    let i = 0;

    const handleCancelClick = () => {
        props.setTicEventattsLVisible(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const ticDocService = new TicDocService();
                    const data = await ticDocService.getTransactionLista();
                    setTicDocs(data);
                    initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [ddTicDocvrItem, ticDoc, componentKey]);

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
                                                                                                                            : '';
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            {/* <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" value={props.ticEvent.code} disabled={true} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText id="text" value={props.ticEvent.textx} disabled={true} />
                        </div>
                    </div>
                </div>
            </div> */}
            <DataTable
                key={componentKey}
                dataKey="id"
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
                scrollHeight="750px"
                virtualScrollerOptions={{ itemSize: 46 }}
                tableStyle={{ minWidth: "50rem" }}
                metaKeySelection={false}
                paginator
                rows={125}
                rowsPerPageOptions={[125, 150, 200]}
                onSelectionChange={(e) => setTicDoc(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            // rowClassName={(rowData) => {
            //     const isEditing = rowData === ticEventatts;
            //     const customClass = rowClass(rowData);

            //     return {
            //         'editing-row': isEditing,
            //         [customClass]: customClass !== '',
            //     };
            // }}
            //virtualScrollerOptions={{ itemSize: 46 }}
            //metaKeySelection={false}
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
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="ndocvr"
                    header={translations[selectedLanguage].ndocvr}
                    sortable
                    filter
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="npar"
                    header={translations[selectedLanguage].npar}
                    sortable
                    filter
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="nevent"
                    header={translations[selectedLanguage].nevent}
                    sortable
                    filter
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="status"
                    filterField="status"
                    dataType="numeric"
                    header={translations[selectedLanguage].status}
                    sortable
                    filter
                    filterElement={stornoFilterTemplate}
                    style={{ width: "5%" }}
                    bodyClassName="text-center"
                    body={stornoBodyTemplate}
                ></Column>
                <Column
                    field="begda"
                    header={translations[selectedLanguage].date}
                    sortable
                    filter
                    style={{ width: "10%" }}
                    body={(rowData) => formatDateColumn(rowData, "begda")}
                ></Column>
                <Column
                    field="tm"
                    header={translations[selectedLanguage].tm}
                    sortable
                    filter
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="no_tick"
                    header={translations[selectedLanguage].no_tick}
                    sortable
                    filter
                    style={{ width: "15%" }}
                ></Column>
            </DataTable>
            <DeleteDialog visible={deleteDialogVisible} inAction="delete" onHide={hideDeleteDialog} />
            <Dialog
                // header={translations[selectedLanguage].Doc}
                header={
                    <div className="dialog-header">
                        <Button 
                            label={translations[selectedLanguage].Cancel} icon="pi pi-times" 
                            onClick={() => {
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
                    />
                )}
            </Dialog>
            <Dialog
                // header={translations[selectedLanguage].EventList}
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
