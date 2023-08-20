/**
 * Argumenti respektivno koji se prosledjuju
 * 0 - modu, `adm`
 * 1 - tabela, bez prefiksa, `user`
 * 2 - id tabele
 * 3 - naziv atributa po kome se pretrazuje
 * 5 - mumericki atrinut 0 ili 1
 * 6 - vrednost atributa pokome se pretrazuje
 */
import React, {useState, useEffect, useRef} from 'react';
import {classNames} from 'primereact/utils';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {FilterMatchMode, FilterOperator} from 'primereact/api';
import {TriStateCheckbox} from 'primereact/tristatecheckbox';
import {Checkbox} from 'primereact/checkbox';
import {Toast} from 'primereact/toast';
import {TicEventattsService} from '../../service/model/TicEventattsService';
import TicEventatts from './ticEventatts';
import {EmptyEntities} from '../../service/model/EmptyEntities';
import {Dialog} from 'primereact/dialog';
import './index.css';
import {translations} from '../../configs/translations';
import {fetchObjData} from './customHook';
import {Dropdown} from 'primereact/dropdown';
import {FileUpload} from 'primereact/fileupload';
import FileService from '../../service/FileService';
import ConfirmDialog from '../dialog/ConfirmDialog';

export default function TicEventattsL(props) {
    const objName = 'tic_eventatts';
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const emptyTicEventatts = EmptyEntities[objName];
    emptyTicEventatts.event = props.ticEvent.id;
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticEventattss, setTicEventattss] = useState([]);
    const [ticEventatts, setTicEventatts] = useState(emptyTicEventatts);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [eventattsTip, setEventattsTip] = useState('');
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [dropdownAllItems, setDropdownAllItems] = useState(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

    let i = 0;

    const handleCancelClick = () => {
        props.setTicEventattsLVisible(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i;
                if (i < 2) {
                    let updatedData = {};
                    const ticEventattsService = new TicEventattsService();
                    const data = await ticEventattsService.getLista(props.ticEvent.id);
                    // Proširivanje dropdownData niza za svaki red sa inputtp === "3"
                    const updatedDropdownItems = {...dropdownAllItems};
                    updatedData = await Promise.all(
                        data.map(async (row) => {
                            if (row.inputtp === '3' && row.ddlist) {
                                const [modul, tabela] = row.ddlist.split(',');
                                const apsTabela = modul + `_` + tabela;
                                const dataDD = await fetchObjData(modul, tabela); // Sačekaj izvršenje
                                updatedDropdownItems[apsTabela] = dataDD.ddItems;
                            }
                            return {...row, isUploadPending: false}; // Dodaj novu kolonu sa statusom
                        })
                    );
                    setTicEventattss(updatedData);
                    setDropdownAllItems(updatedDropdownItems);

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
        const localObj = {newObj};

        let _ticEventattss = [...ticEventattss];
        let _ticEventatts = {...localObj.newObj.obj};
        //setSubmitted(true);
        if (localObj.newObj.eventattsTip === 'CREATE') {
            _ticEventattss.push(_ticEventatts);
        } else if (localObj.newObj.eventattsTip === 'UPDATE') {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticEventattss[index] = _ticEventatts;
        } else if (localObj.newObj.eventattsTip === 'DELETE') {
            _ticEventattss = ticEventattss.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'TicEventatts Delete', life: 3000});
        } else {
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'TicEventatts ?', life: 3000});
        }
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: `{${objName}} ${localObj.newObj.eventattsTip}`,
            life: 3000
        });
        setTicEventattss(_ticEventattss);
        setTicEventatts(emptyTicEventatts);
    };

    const onTemplateSelect = (e) => {
        console.log('onTemplateSelect');
        console.log('File name:' + e.files[0].name);
    };


    const handleAutoInputClick = () => {
        setConfirmDialogVisible(true);
    };
    
    const handleConfirm = () => {
        // Ovde pozovite vašu funkciju autoInput
        // autoInput();
        setConfirmDialogVisible(false);
    };
    
    // const handleDropdownChange = async (e, rowData, apsTabela) => {
    //     rowData.value = e.value.code;
    //     const val = (e.target && e.target.value && e.target.value.code) || '';
    //     setDropdownItem(e.value);

    //     let _ticEventatts = { ...ticEventatts };
    //     _ticEventatts[`value`] = val;
    //     setTicEventatts(_ticEventatts);
    //     // Ažuriramo podatke u bazi bez submita
    //     await updateDataInDatabase(_ticEventatts);
    // };

    const onInputChange = async (e, type, name, rowData, apsTabela) => {
        let val = '';
        if (name === 'value') {
            switch (type) {
                case 'input':
                    val = (e.target && e.target.value) || '';
                    rowData.value = e.target.value;
                    setTicEventattss([...ticEventattss]);
                    break;
                case 'checkbox':
                    rowData.value = e.checked ? '1' : '0';
                    setTicEventattss([...ticEventattss]);
                    val = e.checked ? 1 : 0;
                    break;
                case 'options':
                    rowData.value = e.value.code;
                    val = (e.target && e.target.value && e.target.value.code) || '';
                    setDropdownItem(e.value);
                    break;
                case 'fileUpload':
                    try {
                        console.log('Custom upload started Bravo:', e);
                        console.log('Custom upload started File name:', e.files[0].name);
                        rowData.isUploadPending = false;
                        const file = e.files[0];
                        const fileService = new FileService();
                        const data = await fileService.uploadFile(file, e.files[0].name);
                        rowData.isUploadPending = true;
                        toast.current.show({severity: 'success', summary: 'Success', detail: data.message});
                        e.options.clear();
                    } catch (error) {
                        console.error(error);
                        toast.current.show({severity: 'error', summary: 'Error', detail: 'Error uploading file'});
                    }

                    break;
                default:
                    val = '';
                    break;
            }
        } else if (name === 'valid') {
            rowData.valid = e.checked ? 1 : 0;
            setTicEventattss([...ticEventattss]);
            val = e.checked ? 1 : 0;
        } else if (name === 'text') {
            val = (e.target && e.target.value) || '';
            rowData.text = e.target.value;
            setTicEventattss([...ticEventattss]);
        }

        let _ticEventatts = {...ticEventatts};
        _ticEventatts[`${name}`] = val;
        setTicEventatts(_ticEventatts);
        await updateDataInDatabase(_ticEventatts);
    };

    const updateDataInDatabase = async (rowData) => {
        try {
            const ticEventattsService = new TicEventattsService();
            await ticEventattsService.putTicEventatts(rowData);
            // Dodatno rukovanje ažuriranim podacima, ako je potrebno
        } catch (err) {
            console.error('Error updating data:', err);
            // Dodatno rukovanje greškom, ako je potrebno
        }
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticEventattss.length; i++) {
            if (ticEventattss[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const openNew = () => {
        setTicEventattsDialog(emptyTicEventatts);
    };

    const onRowSelect = (event) => {
        //ticEventatts.begda = event.data.begda
        if (toast.current.show != null) {
            toast.current.show({
                severity: 'info',
                summary: 'Action Selected',
                detail: `Id: ${event.data.id} Name: ${event.data.text}`,
                life: 3000
            });
        }
    };

    const onRowUnselect = (event) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Action Unselected',
            detail: `Id: ${event.data.id} Name: ${event.data.text}`,
            life: 3000
        });
    };
    // <heder za filter
    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            ctp: {
                operator: FilterOperator.AND,
                constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
            },
            ntp: {
                operator: FilterOperator.AND,
                constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
            },
            valid: {value: null, matchMode: FilterMatchMode.EQUALS}
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        let value1 = e.target.value;
        let _filters = {...filters};

        _filters['global'].value = value1;

        setFilters(_filters);
        setGlobalFilterValue(value1);
    };

    const renderHeader = () => {
        return (
            <div className="flex card-container">
                <div className="flex flex-wrap gap-1"/>
                <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick}
                        text raised/>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success"
                            onClick={openNew} text raised/>
                </div>
                <div className="flex flex-wrap gap-1">
<<<<<<< HEAD
                    <Button label={translations[selectedLanguage].AutoAtts} icon="pi pi-copy" onClick={handleAutoInputClick} text raised />
=======
                    <Button label={translations[selectedLanguage].AutoAtts} icon="pi pi-copy" onClick={openNew} text
                            raised/>
>>>>>>> 792e22929df70f9a5f31de0dacc0e0d3e57c275a
                </div>
                <div className="flex-grow-1"></div>
                <b>{translations[selectedLanguage].EventattsList}</b>
                <div className="flex-grow-1"></div>
                <div className="flex flex-wrap gap-1">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search"/>
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange}
                                   placeholder={translations[selectedLanguage].KeywordSearch}/>
                    </span>
                    <Button type="button" icon="pi pi-filter-slash" label={translations[selectedLanguage].Clear}
                            outlined onClick={clearFilter} text raised/>
                </div>
            </div>
        );
    };

    const validBodyTemplate = (rowData) => {
        const valid = rowData.valid == 1 ? true : false;
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': valid,
                    'text-red-500 pi-times-circle': !valid
                })}
            ></i>
        );
    };

    const validFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="verified-filter" className="font-bold">
                    {translations[selectedLanguage].Valid}
                </label>
                <TriStateCheckbox inputId="verified-filter" value={options.value}
                                  onChange={(e) => options.filterCallback(e.value)}/>
            </div>
        );
    };

    // <--- Dialog
    const setTicEventattsDialog = (ticEventatts) => {
        setVisible(true);
        setEventattsTip('CREATE');
        setTicEventatts({...ticEventatts});
    };
    //  Dialog --->

    const header = renderHeader();
    // heder za filter/>

    const eventattsTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-pencil"
                    style={{width: '24px', height: '24px'}}
                    onClick={() => {
                        setTicEventattsDialog(rowData);
                        setEventattsTip('UPDATE');
                    }}
                    text
                    raised
                ></Button>
            </div>
        );
    };

    // funkcije
    const textEditor = (rowData, field) => {
        return <InputText value={rowData.text || ''}
                          onChange={(e) => onInputChange(e, 'text', 'text', rowData, null)}/>;
    };

    const validEditor = (rowData, field) => {
        return <Checkbox checked={rowData.valid === 1}
                         onChange={(e) => onInputChange(e, 'checkbox', 'valid', rowData, null)}/>;
    };

    const valueEditor = (rowData, field) => {
        switch (rowData.inputtp) {
            case '4':
                return (
                    <div className="card flex justify-content-center">
                        <Toast ref={toast}></Toast>
                        <FileUpload
                            //mode="basic"
                            name="Fajl"
                            accept="image/*"
                            maxFileSize={1000000}
                            uploadHandler={(event) => onInputChange(event, 'fileUpload', 'value', rowData, null)}
                            onSelect={onTemplateSelect}
                            customUpload={true}
                            chooseLabel="Browse"
                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        />
                    </div>
                );
            case '1':
                return <InputText value={rowData.value || ''}
                                  onChange={(e) => onInputChange(e, 'input', 'value', rowData, null)}/>;
            case '2':
                return <Checkbox checked={rowData.value === '1'}
                                 onChange={(e) => onInputChange(e, 'checkbox', 'value', rowData, null)}/>;
            case '3':
                const [modul, tabela] = rowData.ddlist.split(',');
                const apsTabela = `${modul}_${tabela}`;

                const selectedOptions = dropdownAllItems[apsTabela] || [];
                setDropdownItems(selectedOptions);
                const selectedOption = dropdownAllItems[apsTabela].find((option) => option.code === rowData.value);
                setDropdownItem(selectedOption);

                return <Dropdown id={rowData.id} value={selectedOption} options={selectedOptions}
                                 onChange={(e) => onInputChange(e, 'options', 'value', rowData, apsTabela)}
                                 placeholder="Select One" optionLabel="name"/>;
            default:
                return <InputText value={rowData.value || ''}
                                  onChange={(e) => onInputChange(e, 'input', 'value', rowData, null)}/>;
        }
    };

    const onCellEditComplete = async (e) => {
        let {rowData, newValue, newRowData, field, originalEvent: event} = e;
        let _rowData = {...rowData};
        let _newValue = newValue;

        switch (field) {
            case 'valid':
                if (newValue != null) _rowData[field] = _newValue;
                else event.preventDefault();
                break;
            case 'value':
                if (newValue != null) {
                    _rowData[field] = _newValue;
                    // Check if upload is pending and prevent exiting edit mode
                    if (rowData.inputtp === '4' && !_rowData.isUploadPending) {
                        event.preventDefault();
                    }
                } else event.preventDefault();
                break;
            case 'text': // Dodali smo ovu sekciju za kolonu "text"
                if (newValue != null) {
                    _rowData[field] = _newValue;
                } else event.preventDefault();
                break;
            default:
                if (newValue != null) _rowData[field] = _newValue;
                else event.preventDefault();
                break;
        }

        // Ažuriramo stanje komponente
        setTicEventattss([...ticEventattss]);
    };

    const valueTemplate = (rowData) => {
        /*
        if (rowData.inputtp === '4') {

            return (
                <div className="card flex justify-content-center">
                    <Toast ref={toast}></Toast>
                    <FileUpload
                        name="Fajl"
                        accept="image/*"
                        maxFileSize={1000000}
                        uploadHandler={handleCustomUpload}
                        onSelect={onTemplateSelect}
                        customUpload={true}
                        chooseLabel="Browse"
                        emptyTemplate={
                            <p className="m-0">Drag and drop files to here to upload.</p>
                        }
                    />
                </div>
            );
        }
*/
        if (rowData.inputtp === '3' && rowData.ddlist) {
            const [modul, tabela] = rowData.ddlist.split(',');
            const apsTabela = `${modul}_${tabela}`;
            const dropdownData = dropdownAllItems[apsTabela] || [];
            const dropdownValue = dropdownData.find((item) => item.code === rowData.value);
            if (dropdownValue) {
                return <span>{dropdownValue.name}</span>;
            }
        }

        if (rowData.inputtp === '2') {
            const value = rowData.value == 1 ? true : false;
            return (
                <i
                    className={classNames('pi', {
                        'text-green-500 pi-check-circle': value,
                        'text-red-500 pi-times-circle': !value
                    })}
                ></i>
            );
        }

        // Prikazujemo ili "value" ili default vrednost
        return rowData.value;
    };

    // Funkcije

    return (
        <div className="card">
            <Toast ref={toast}/>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" value={props.ticEvent.code} disabled={true}/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText id="text" value={props.ticEvent.textx} disabled={true}/>
                        </div>
                    </div>
                </div>
            </div>
            <DataTable
                dataKey="id"
                selectionMode="single"
                selection={ticEventatts}
                loading={loading}
                value={ticEventattss}
                header={header}
                showGridlines
                removableSort
                //editMode="cell"
                rowClassName={(rowData) => ({'editing-row': rowData === ticEventatts})}
                filters={filters}
                scrollable
                scrollHeight="550px"
                virtualScrollerOptions={{itemSize: 46}}
                tableStyle={{minWidth: '50rem'}}
                //metaKeySelection={false}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onSelectionChange={(e) => setTicEventatts(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                <Column
                    //bodyClassName="text-center"
                    body={eventattsTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{minWidth: '4rem'}}
                />
                <Column field="ctp" header={translations[selectedLanguage].Code} sortable filter
                        style={{width: '10%'}}></Column>
                <Column field="ntp" header={translations[selectedLanguage].Text} sortable filter
                        style={{width: '25%'}}></Column>
                <Column field="ninputtp" header={translations[selectedLanguage].inputtp} sortable filter
                        style={{width: '10%'}}></Column>
                <Column field="ddlist" header={translations[selectedLanguage].ddlist} sortable filter
                        style={{width: '10%'}}></Column>
                <Column
                    field="value"
                    header={translations[selectedLanguage].Value}
                    sortable
                    filter
                    style={{width: '20%'}}
                    editor={(props) => valueEditor(props.rowData, props.field)} // Dodali smo editor za editiranje value
                    body={valueTemplate}
                    onCellEditComplete={onCellEditComplete} // Dodali smo onCellEditComplete za validaciju
                ></Column>
                <Column
                    field="text"
                    header={translations[selectedLanguage].Descript}
                    sortable
                    filter
                    style={{width: '10%'}}
                    editor={(props) => textEditor(props.rowData, props.field)} // Koristimo textEditor za editiranje teksta
                    onCellEditComplete={onCellEditComplete}
                ></Column>

                <Column
                    field="valid"
                    filterField="valid"
                    dataType="numeric"
                    header={translations[selectedLanguage].Valid}
                    sortable
                    filter
                    filterElement={validFilterTemplate}
                    style={{width: '10%'}}
                    bodyClassName="text-center"
                    body={validBodyTemplate}
                    editor={(props) => validEditor(props.rowData, props.field)} // Dodali smo editor za editiranje validnosti
                    onCellEditComplete={onCellEditComplete} // Dodali smo onCellEditComplete za validaciju
                ></Column>
            </DataTable>
            <Dialog
                header={translations[selectedLanguage].Link}
                visible={visible}
                style={{width: '60%'}}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventatts parameter={'inputTextValue'} ticEventatts={ticEventatts} ticEvent={props.ticEvent}
                                  handleDialogClose={handleDialogClose} setVisible={setVisible} dialog={true}
                                  eventattsTip={eventattsTip}/>}
                <div className="p-dialog-header-icons" style={{display: 'none'}}>
                    <button className="p-dialog-header-close p-link">
                        <span className="p-dialog-header-close-icon pi pi-times"></span>
                    </button>
                </div>
            </Dialog>
            <ConfirmDialog 
                visible={confirmDialogVisible} 
                onHide={() => setConfirmDialogVisible(false)} 
                onConfirm={handleConfirm} 
            />
        </div>
    );
}
