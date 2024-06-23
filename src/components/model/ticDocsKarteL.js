import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { TicDocService } from "../../service/model/TicDocService";
import { TicDocsService } from "../../service/model/TicDocsService";
import TicDocs from './ticDocs';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import CmnParL from './cmn/cmnParL';
import { Dropdown } from 'primereact/dropdown';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from "primereact/button";
import DeleteDialog from '../dialog/DeleteDialog';

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

    const [ticDoc, setTicDoc] = useState(_doc);
    const [cmnPar, setCmnPar] = useState(props.cmnPar);
    const [ticDocItems, setTicDocItems] = useState(null);

    const [cmnTickettps, setCmnTickettps] = useState([]);
    const [ddTickettpItem, setDdTickettpItem] = useState(null);
    const [ddTickettpItems, setDdTickettpItems] = useState(null);

    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [docsTip, setObjattsTip] = useState('');
    let [refresh, setRefesh] = useState(0)

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
                    const sortedData = data.sort((a, b) => {
                        if (a.nevent !== b.nevent) {
                            return a.nevent.localeCompare(b.nevent);
                        } else if (a.nart !== b.nart) {
                            return a.nart.localeCompare(b.nart);
                        } else if (a.row !== b.row) {
                            return a.row.localeCompare(b.row);
                        } else {
                            return a.seat.localeCompare(b.seat);
                        }
                    });

                    setTicDocss(sortedData);
                    // initFilters();
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

    const formatDateColumn = (rowData, field) => {
        return DateFunction.formatDate(rowData[field]);
    };

    // <--- Dialog
    const setTicDocsDialog = (ticDocs) => {
        setVisible(true)
        setObjattsTip("CREATE")
        setTicDocs({ ...ticDocs });
    }
    /********************************************************************************/
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };
    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

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
        props.remoteRefresh()

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
    const renderHeader = () => {
        return (
            <div className="flex card-container">
                <div className="flex flex-wrap gap-1" />
                {(props.dialog) ? (<Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />) : null}
                {/* <div className="flex flex-wrap gap-1">
              <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
            </div> */}
                {/* {
            <div className="flex flex-wrap gap-1">
                <Button label={translations[selectedLanguage].web} icon="pi pi-table" onClick={handleWebMapClick} severity="info" text raised />
            </div>
            } */}

                {/* <div className="flex flex-wrap gap-1">
                <Button label={translations[selectedLanguage].selection} icon="pi pi-table" onClick={handleEventProdajaClick} severity="info" text raised />
            </div>   */}

                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].afterSales} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-warning" raised />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Storno} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" raised />
                </div>
                <div className="flex-grow-1"></div>
                <b>{translations[selectedLanguage].DocsList}</b>
                <div className="flex-grow-1"></div>
            </div>
        );
    };
    const header = renderHeader();
    /*********************************************************************************** */
    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                dataKey="id"
                size={"small"}
                selectionMode="single"
                header={header}
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
            >
                <Column
                    field="nevent"
                    header={translations[selectedLanguage].nevent}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="row"
                    header={translations[selectedLanguage].red}
                    style={{ width: "5%" }}
                    sortable
                ></Column>
                <Column
                    field="seat"
                    style={{ width: "5%" }}
                    sortable
                ></Column>
                <Column
                    field="nart"
                    header={translations[selectedLanguage].nart}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="price"
                    header={translations[selectedLanguage].price}
                    sortable
                    style={{ width: "7%" }}
                ></Column>
                <Column
                    field="output"
                    header={translations[selectedLanguage].outputL}
                    sortable
                    style={{ width: "5%" }}
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
                <Column
                    header={translations[selectedLanguage].delivery}
                    field="delivery"
                    dataType="numeric"
                    style={{ width: '1%' }}
                    bodyClassName="text-center"
                    body={(e) => toggleBodyTemplate(e, `delivery`)}
                    onCellEditComplete={onCellEditComplete}
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
            <DeleteDialog visible={deleteDialogVisible} inAction="delete"  onHide={hideDeleteDialog}  />
        </div>
    );
}
