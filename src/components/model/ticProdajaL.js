import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Toast } from 'primereact/toast';
import './index.css';
import { TicEventService } from '../../service/model/TicEventService';
import TicEvent from './ticEvent';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from '../../configs/translations';
import DateFunction from '../../utilities/DateFunction';
import env from '../../configs/env';
import WebMap from './remoteComponentContainer';
import WebSalMap from './ticDocW';
import { Dropdown } from 'primereact/dropdown';
import { TicCenatpService } from "../../service/model/TicCenatpService";
import { TicDocService } from "../../service/model/TicDocService";
import TicProdajaEventVL from './ticProdajaEventVL';

export default function TicProdajaL(props) {
    //console.log(props, '+++++++++++++++++++++++++++++++++++TicProdajaL+++++++++++++++++++++++++++++++++++++++++++++++');
    let i = 0;

    const objDoc = "tic_docs"
    const userId = localStorage.getItem('userId') || -1
    const emptyTicDoc = EmptyEntities[objDoc]
    emptyTicDoc.id = -1
    const [ticDoc, setTicDokument] = useState(props?.ticDoc || emptyTicDoc)

    const objName = 'tic_event';
    const docId = props.ticDoc?.id || 1
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const emptyTicEvent = EmptyEntities[objName];
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticEvents, setTicEvents] = useState([]);
    const [ticEvent, setTicEvent] = useState(emptyTicEvent);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [eventTip, setEventTip] = useState('');
    const [webMapVisible, setWebMapVisible] = useState(false);
    const [eventPregledVVisible, setEventPregledVVisible] = useState(false);


    let [numberChannell, setNumberChannell] = useState(0)
    let [channells, setChannells] = useState([{}])
    let [channell, setChannell] = useState(null)


    const generateImageUrl = (id, relpath, selectedLanguage) => {
        return `${env.IMG_BACK_URL}/public/tic/l_${id}.jpg/?relpath=${relpath}&sl=${selectedLanguage}`;
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i;
                if (i < 2) {
                    const relPath = 'public/tic/event/';
                    const ticEventService = new TicEventService();
                    const data = await ticEventService.getProdajaListaP();

                    const updatedData = data.map((obj) => {
                        return {
                            ...obj,
                            imageUrl: generateImageUrl(obj.id, relPath, selectedLanguage)
                        };
                    });
                    setTicEvents(updatedData);
                    initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);


    const handleCancelClick = () => {
        props.setTicEventProdajaLVisible(false);
    };

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _ticEvents = [...ticEvents];
        let _ticEvent = { ...localObj.newObj.obj };

        //setSubmitted(true);
        if (localObj.newObj.eventTip === 'CREATE') {
            _ticEvents.push(_ticEvent);
        } else if (localObj.newObj.eventTip === 'UPDATE') {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticEvents[index] = _ticEvent;
        } else if (localObj.newObj.eventTip === 'DELETE') {
            _ticEvents = ticEvents.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEvent Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEvent ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventTip}`, life: 3000 });
        setTicEvents(_ticEvents);
        setTicEvent(emptyTicEvent);
    };

    const handleTaskComplete = () => {
        //console.log(ticEvent, '**********************handleTaskComplete**************************');
        if (ticEvent) {
            props.onTaskComplete(ticEvent);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'No row selected', life: 3000 });
        }
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticEvents.length; i++) {
            if (ticEvents[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const openNew = () => {
        setTicEventDialog(emptyTicEvent);
    };

    const onRowSelect = (event) => {
        /*
            setTicEventDialog(event.data);
            setEventTip('UPDATE');  
        */
        toast.current.show({
            severity: 'info',
            summary: 'Action Selected',
            detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
            life: 3000
        });
    };

    const onRowUnselect = (event) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Action Unselected',
            detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
            life: 3000
        });
    };
    // <heder za filter
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            code: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            textx: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            status: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        let value1 = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value1;

        setFilters(_filters);
        setGlobalFilterValue(value1);
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        val = (e.target && e.target.value) || '';
    };

    const renderHeader = () => {
        return (
            <div className="flex card-container">
                {props.dialog && <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />}


                <div className="flex flex-wrap gap-1">
                    {props.dialog && <Button label={translations[selectedLanguage].Confirm} icon="pi pi-table" onClick={handleTaskComplete} severity="info" text raised disabled={!ticEvent} />}
                </div>
                <div className="flex-grow-1" />
                <b>{translations[selectedLanguage].EventsList}</b>
                <div className="flex-grow-1"></div>
                <div className="flex flex-wrap gap-1">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={translations[selectedLanguage].KeywordSearch} />
                    </span>
                    <Button type="button" icon="pi pi-filter-slash" label={translations[selectedLanguage].Clear} outlined onClick={clearFilter} text raised />
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

    const statusBodyTemplate = (rowData) => {
        const status = rowData.status == 1 ? true : false;
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': status,
                    'text-red-500 pi-times-circle': !status
                })}
            ></i>
        );
    };

    const statusFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="verified-filter" className="font-bold">
                    {translations[selectedLanguage].Valid}
                </label>
                <TriStateCheckbox inputId="verified-filter" value={options.value} onChange={(e) => options.filterCallback(e.value)} />
            </div>
        );
    };

    // <--- Dialog
    const setTicEventDialog = (ticEvent) => {
        setVisible(true);
        setEventTip('CREATE');
        setTicEvent({ ...ticEvent });
    };

    /*
    Web Map *********************************************************************************************************
    */
    /**************************************************************************** */
    /**************************************************************************** */

    const createDoc = async (channel) => {
        try {
            //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@createDoc@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
            ticDoc.id = null
            ticDoc.tm = DateFunction.currDatetime();
            ticDoc.timecreation = ticDoc.tm
            ticDoc.date = DateFunction.currDate();
            ticDoc.year = DateFunction.currYear()
            ticDoc.usr = 1;
            ticDoc.docvr = 22;
            ticDoc.usersys = localStorage.getItem('userId')
            ticDoc.curr = 1;
            ticDoc.currrate = 1;
            ticDoc.storno = 0;
            ticDoc.channel = channel.id;
            ticDoc.status = 0;
            ticDoc.provera = 'PROVERA'

            const ticDocService = new TicDocService();
            const row = await ticDocService.postTicDoc(ticDoc);
            //console.log(row, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
            ticDoc.id = row.id
            ticDoc.broj = row.id
            setTicDokument({ ...ticDoc });
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };
    /**************************************************************************** */
    /**************************************************************************** */

    const getChannell = async (rowData) => {
        try {
            //console.log(rowData, "######################################################################################", userId)
            const ticEventService = new TicEventService();
            const data = await ticEventService.getTicEventchpermissL(rowData.id, userId);
            // console.log(data, " KANALI KORISNIKA/EVENT $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", userId)
            if (data && data.length > 0) {
                setNumberChannell(data.length);
                setChannells(data);
                setChannell(data[0]);
                // await createDoc(data[0])

            } else {
                // Prikazuje obaveštenje korisniku
                toast.current.show({
                    severity: "warn",
                    summary: "Obaveštenje",
                    detail: "Nemate pravo na channell",
                    life: 3000,
                });
                throw new Error("Nemate pravo na channell"); // Izaziva grešku
            }
        } catch (err) {
            // Logovanje greške
            console.error("Error fetching channel permissions:", err.message);
            // Obrada greške koja se može prikazati korisniku ili dalje logovati
            throw err; // Propagira grešku dalje ako je potrebno
        }
    };


    const handleWebMapClick = async (rowData) => {
        try {
            await getChannell(rowData)
            //console.log(rowData, "#########################@@@@@@@@@@@@@@@@@@@@@@@@@@@@##################################")
            setTicEvent(rowData)
            setWebMapDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch Channell data',
                life: 3000
            });
        }
    };

    const handleEventPregledVClick = async (rowData) => {
        try {
            await getChannell(rowData)
            //console.log(rowData, "#########################@@@@@@@@@@@@@@@@@@@@@@@@@@@@##################################")
            setTicEvent(rowData)
            setEventPregledVDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch Channell data',
                life: 3000
            });
        }
    };
    const setWebMapDialog = () => {
        setWebMapVisible(true);
    };
    const handleWebMapDialogClose = (newObj) => {
        setWebMapVisible(false);
    };

    const setEventPregledVDialog = () => {
        setEventPregledVVisible(true);
    };
    const handleEventPregledVDialogClose = (newObj) => {
        setEventPregledVVisible(false);
    };


    //  Dialog -------------------------------------------------------------------------------------------------------->

    const header = renderHeader();
    // heder za filter/>

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.imageUrl} alt={rowData.textx} className="w-6rem shadow-2 border-round" />;
    };
    const pregledTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                    <Button
                        type="button"
                        icon="pi pi-users"
                        style={{ width: '24px', height: '24px' }}
                        className="p-button-danger"
                        onClick={() => {
                            props.handleEventProdaja(rowData, false, 1)
                        }}
                        raised
                        tooltip={translations[selectedLanguage].MasovnaProdaja}
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    ></Button>
                    <Button
                        type="button"
                        icon="pi pi-chart-line"
                        style={{ width: '24px', height: '24px' }}
                        className="p-button-outlined p-button-danger"
                        onClick={() => {
                            handleEventPregledVClick(rowData)
                        }}
                        text
                        raised
                    ></Button>
                </div>
        );
    };
    const actionTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-map"
                    style={{ width: '24px', height: '24px' }}
                    className="p-button-outlined p-button-danger"
                    onClick={() => {
                        //setTicEventDialog(rowData);
                        handleWebMapClick(rowData)
                        setEventTip('SAL');
                    }}
                    text
                    raised
                ></Button>
            </div>
        );
    };
    const newTemplate = (rowData) => {
        const handleNewClick = () => {
            // console.log("Ikona je kliknuta!");
            // Ovde možeš dodati bilo koju akciju koju želiš pokrenuti
        };
        return (
            <div className="flex flex-wrap gap-1">
                {/* <Button
                    type="button"
                    icon="pi pi-plus"
                    style={{ width: '36px', height: '26px' }}
                    className="p-button-danger"
                    onClick={() => {
                        props.handleEventProdaja(rowData, true)
                    }}
                    raised
                    tooltip={translations[selectedLanguage].NovaTransakcija}
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                ></Button> */}

                <Button
                    type="button"
                    icon="pi pi-cart-plus"
                    style={{ width: '36px', height: '26px' }}
                    className="p-button-success"
                    onClick={() => {
                        props.handleEventProdaja(rowData, false, 0)
                    }}
                    raised
                    tooltip={translations[selectedLanguage].DodajDogadja}
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                ></Button>
                {/* <Button
                    type="button"
                    icon="pi pi-users"
                    style={{ width: '36px', height: '26px' }}
                    className="p-button-danger"
                    onClick={() => {
                        props.handleEventProdaja(rowData, false)
                    }}
                    raised
                    tooltip={translations[selectedLanguage].MasovnaProdaja}
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                ></Button> */}
            </div>
        );
    };
    const webTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-palette"
                    style={{ width: '24px', height: '24px' }}
                    className="p-button-warning"
                    onClick={() => {
                        //setTicEventDialog(rowData);
                        handleWebMapClick(rowData)
                        setEventTip('WEB');
                    }}
                    text
                    raised
                ></Button>
            </div>
        );
    };

    return (
        <>
            <div className="card">
                <Toast ref={toast} />
                <DataTable
                    dataKey="id"
                    selectionMode="single"
                    selection={ticEvent}
                    loading={loading}
                    value={ticEvents}
                    header={header}
                    //showGridlines
                    removableSort
                    filters={filters}
                    scrollable
                    sortField="endda"
                    sortOrder={-1}
                    scrollHeight="665px"
                    // virtualScrollerOptions={{ itemSize: 46 }}
                    tableStyle={{ minWidth: '50rem' }}
                    metaKeySelection={false}
                    paginator
                    rows={50}
                    rowsPerPageOptions={[50, 100, 250, 500]}
                    onSelectionChange={(e) => setTicEvent(e.value)}
                    onRowSelect={onRowSelect}
                    onRowUnselect={onRowUnselect}
                >
                    <Column
                        //bodyClassName="text-center"
                        body={newTemplate}
                        exportable={false}
                        // headerClassName="w-10rem"
                        style={{ width: '5%' }}
                    />
                    {/* <Column
                    //bodyClassName="text-center"
                    body={actionTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                />
 */}
                    <Column field="text" header={translations[selectedLanguage].event} sortable filter style={{ width: '12%' }}></Column>
                    <Column field="npar" header={translations[selectedLanguage].Organizer} sortable filter style={{ width: '12%' }}></Column>
                    <Column field="nloc" header={translations[selectedLanguage].Scena} sortable filter style={{ width: '10%' }}></Column>
                    <Column body={imageBodyTemplate} header={translations[selectedLanguage].Image} style={{ width: '16%' }}></Column>
                    <Column field="nctg" header={translations[selectedLanguage].ctg} sortable filter style={{ width: '10%' }}></Column>
                    <Column field="ntp" header={translations[selectedLanguage].Type} sortable filter style={{ width: '10%' }}></Column>
                    {/* <Column field="begda" header={translations[selectedLanguage].Begda} sortable filter style={{ width: '7%' }} body={(rowData) => formatDateColumn(rowData, 'begda')}></Column> */}
                    <Column field="endda" header={translations[selectedLanguage].DatEvent} sortable filter style={{ width: '7%' }} body={(rowData) => formatDateColumn(rowData, 'endda')}></Column>
                    {/* <Column field="begtm" header={translations[selectedLanguage].BegTM} sortable filter style={{ width: '7%' }} body={(rowData) => formatTimeColumn(rowData, 'begtm')}></Column> */}
                    <Column field="endtm" header={translations[selectedLanguage].TmEvent} sortable filter style={{ width: '5%' }} body={(rowData) => formatTimeColumn(rowData, 'endtm')}></Column>
                    <Column
                        //bodyClassName="text-center"
                        body={pregledTemplate}
                        exportable={false}
                        // headerClassName="w-20rem"
                        style={{ width: '6%' }}
                    />
                    {/* <Column
                        //bodyClassName="text-center"
                        body={webTemplate}
                        exportable={false}
                        headerClassName="w-10rem"
                        style={{ minWidth: '4rem' }}
                    /> */}
                </DataTable>

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
                            {/* <p>{translations[selectedLanguage].Doc}</p>                         */}
                        </div>
                    }
                    visible={visible}
                    style={{ width: '50%' }}
                    onHide={() => {
                        setVisible(false);
                        setShowMyComponent(false);
                    }}
                >
                    {showMyComponent &&
                        <TicEvent
                            parameter={'inputTextValue'}
                            ticEvent={ticEvent}
                            handleDialogClose={handleDialogClose}
                            setVisible={setVisible}
                            dialog={true}
                            eventTip={eventTip}
                        />}
                </Dialog>
                <Dialog
                    header={
                        <div className="dialog-header">
                            <Button
                                label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                                onClick={() => {
                                    setWebMapVisible(false);
                                    // setShowMyComponent(false);
                                }}
                                severity="secondary" raised
                            />
                            {/* <span>"webMap"</span>                         */}
                        </div>
                    }
                    visible={webMapVisible}
                    style={{ width: '90%', height: '1100px' }}
                    onHide={() => {
                        setWebMapVisible(false);
                        setShowMyComponent(false);
                    }}
                >
                    {webMapVisible && (
                        <WebSalMap
                            parameter={'inputTextValue'}
                            ticEvent={ticEvent}
                            handleDialogClose={handleDialogClose}
                            setVisible={setVisible}
                            dialog={true}
                            eventTip={eventTip}
                            ticDoc={ticDoc}
                            onTaskComplete={handleWebMapDialogClose}
                            numberChannell={numberChannell}
                            channells={channells}
                            channell={channell}
                        />
                    )}
                    {/* {webMapVisible && (
                    <WebMap
                        remoteUrl= {`http://ws11.ems.local:3000/#/seatmap/${ticEvent.id}?docid=${docId}&sl=sr_cyr`}
                        queryParams={{ sl: 'sr_cyr', lookUp: false, dialog: false, ticDoc: props.ticDoc, parentOrigin: 'http://192.168.72.96:8354' }} // Dodajte ostale parametre po potrebi
                        onTaskComplete={handleWebMapDialogClose}
                        originUrl="http://192.168.72.96:8353"
                    />
                )} */}
                </Dialog>
                <Dialog
                    header={
                        <div className="dialog-header">
                            <Button
                                label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                                onClick={() => {
                                    setEventPregledVVisible(false);
                                }}
                                severity="secondary" raised
                            />
                        </div>
                    }
                    visible={eventPregledVVisible}
                    style={{ width: '50%' }}
                    onHide={() => {
                        setVisible(false);
                    }}
                >
                    {eventPregledVVisible &&
                        <TicProdajaEventVL
                            parameter={'inputTextValue'}
                            ticEvent={ticEvent}
                            handleDialogClose={handleEventPregledVDialogClose}
                            setVisible={setEventPregledVVisible}
                            dialog={true}
                            eventTip={eventTip}
                        />}
                </Dialog>
            </div>
        </>
    );
}
