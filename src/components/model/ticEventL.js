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
import TicEventCp from './ticEventCp';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from '../../configs/translations';
import DateFunction from '../../utilities/DateFunction';
import TicEventlinkL from './ticEventlinkL';
import TicEventattsL from './ticEventattsL';
import TicEventagendaL from './ticEventagendaL';
import TicEventlocL from './ticEventlocL';
import { SplitButton } from 'primereact/splitbutton';
import TicEventrtL from './ticEventartL';
import TicEventcenatpL from './ticEventcenatpL';
import TicEventobjL from './ticEventobjL';
import TicEventWL from './ticEventWL';
import TicEventTmpL from './ticEventTmpL';
import TicPrintGrpL from './ticPrintGrpL';
import ConfirmDialog from '../dialog/ConfirmDialog';
import SaleEvent from './ticSalEvent'

export default function TicEventL(props) {
    console.log(props, '**************************-ticEventL-****************************')

    let i = 0;
    const objName = 'tic_event';
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const emptyTicEvent = EmptyEntities[objName];
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticEvents, setTicEvents] = useState([]);
    const [ticEvent, setTicEvent] = useState(null);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [cpVisible, setCpVisible] = useState(false);
    const [eventTip, setEventTip] = useState('');
    const [ticEventattsLVisible, setTicEventattsLVisible] = useState(false);
    const [ticEventlinkLVisible, setTicEventlinkLVisible] = useState(false);
    const [ticEventagendaLVisible, setTicEventagendaLVisible] = useState(false);
    const [ticEventlocLVisible, setTicEventlocLVisible] = useState(false);
    const [ticEventcenatpLVisible, setTicEventcenatpLVisible] = useState(false);
    const [ticEventartLVisible, setTicEventartLVisible] = useState(false);
    const [drowingVisible, setDrowingVisible] = useState(false);

    const [ticEventobjLVisible, setTicEventobjLVisible] = useState(false);
    const [ticEventWLVisible, setTicEventWLVisible] = useState(false);
    const [ticEventTmpLVisible, setTicEventTmpLVisible] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [ticPrintGrpLVisible, setTicPrintGrpLVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const copyItems = [
        {
            label: `${translations[selectedLanguage].Obj}`,
            icon: 'pi pi-map',
            command: () => openEventloc()
        },
        {
            label: `${translations[selectedLanguage].Template}`,
            icon: 'pi pi-copy',
            command: () => openEventloc()
        }
    ];

    /*
    const finItems = [
      {
          label: `${translations[selectedLanguage].Cenatp}`,
          icon: 'pi pi-map',
          command: () => openEventcenatp()
      },
      {
          label: `${translations[selectedLanguage].Arts}`,
          icon: 'pi pi-copy',
          command: () => openEventart()
      }
  ]; 
  */
    useEffect(() => {
        async function fetchData() {
            try {
                ++i;
                if (i < 2) {
                    const ticEventService = new TicEventService();
                    const data = await ticEventService.getLista();
                    setTicEvents(data);
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
        console.log(localObj, "88888888888888888888888888888888888888888888")
        let _ticEvents = [...ticEvents];
        let _ticEvent = { ...localObj.newObj.obj };

        //setSubmitted(true);
        if (localObj.newObj.eventTip === 'CREATE') {
            _ticEvents.push(_ticEvent);
        } else if (localObj.newObj.eventTip === 'COPY') {
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

    const handleTicEventlinkLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const handleTicEventattsLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const handleTicEventagendaLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const handleTicEventlocLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const handleTicEventcenatpLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const setTicArtLVisible = (newObj) => {
        const localObj = { newObj };
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


    const handleActivationClick = () => {
        setConfirmDialogVisible(true);
    };

    const handleConfirm = async () => {
        console.log(ticEvent, "***********handleConfirm********************")
        setSubmitted(true);
        const ticEventService = new TicEventService();
        await ticEventService.postActivateEvent(ticEvent.id);
        //props.handleTicEventattsLDialogClose({ obj: props.ticEvent, docTip: 'UPDATE' });
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Догађај успешно активиран ?', life: 3000 });
        setVisible(false);
        setConfirmDialogVisible(false);
    };

    const openNew = () => {
        setEventTip('CREATE');
        setTicEventDialog(emptyTicEvent);
    };

    const openEventlink = () => {
        setTicEventlinkDialog();
    };

    const openEventatts = () => {
        setTicEventattsDialog();
    };

    const openEventagenda = () => {
        setTicEventagendaDialog();
    };

    const openEventloc = () => {
        console.log("**********openEventloc************")
        setTicEventlocDialog();
    };

    const setTicPrintGrpDialog = () => {
        setTicPrintGrpLVisible(true)
    }

    const openPrintGrpL = () => {
        setTicPrintGrpDialog();
    };

    const openEventcenatp = () => {
        setTicEventcenatpDialog();
    };

    const openEventart = () => {
        setTicEventartDialog();
    };

    const openDrowing = () => {
        setDrowingDialog();
    };

    const openEventobj = () => {
        setTicEventobjDialog();
    };

    const openEventW = () => {
        setTicEventoWDialog();
    };

    const openEventTmp = () => {
        setTicEventTmpDialog();
    };
    const onRowSelect = (event) => {
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

    const renderHeader = () => {
        return (
            <div className="flex card-container">
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Preparation} icon="pi pi-map" onClick={openEventW} severity="info" text raised disabled={!ticEvent} />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Channels} icon="pi pi-map" onClick={openEventobj} severity="info" text raised disabled={!ticEvent} />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].EventLoc} icon="pi pi-building" onClick={openEventloc} severity="info" text raised disabled={!ticEvent} />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Setings} icon="pi pi-table" onClick={openEventatts} severity="info" text raised disabled={!ticEvent} />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Art} icon="pi pi-apple" onClick={openEventart} severity="info" raised text disabled={!ticEvent} />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].drawing} icon="pi pi-palette" onClick={openDrowing} severity="info" raised text disabled={!ticEvent} />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Agenda} icon="pi pi-shield" onClick={openEventagenda} severity="info" text raised disabled={!ticEvent} />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Links} icon="pi pi-sitemap" onClick={openEventlink} severity="info" text raised disabled={!ticEvent} />
                </div>
                {/* <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Print} icon="pi pi-print" severity="warning" onClick={openPrintGrpL} text raised />
                </div> */}
                {/*
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Cenatp} icon="pi pi-dollar" onClick={openEventloc} text raised disabled={!ticEvent} />
                </div>
                    
                <div className="flex flex-wrap gap-1">
                    <SplitButton label={translations[selectedLanguage].Copy} /*icon="pi pi-copy" onClick={openEventloc}* model={copyItems} severity="info" raised text disabled={!ticEvent} />
                </div> 
            */}
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Copy} icon="pi pi-copy" severity="warning" onClick={openEventTmp} text raised disabled={!ticEvent} />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Activation} icon="pi pi-caret-right" severity="danger" onClick={handleActivationClick} text raised disabled={!ticEvent} />
                </div>
                {/*        
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].CopyTemp} icon="pi pi-copy" onClick={openEventloc} text raised disabled={!ticEvent} />
                </div>
        */}
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
    const setTicEventCpDialog = (ticEvent) => {
        console.log("Dosao u SETOVANJE")
        setShowMyComponent(true);
        setCpVisible(true);
        // setEventTip('CREATE');
        setTicEvent({ ...ticEvent });
    };
    const setTicEventDialog = (ticEvent) => {
        setVisible(true);
        // setEventTip('CREATE');
        setTicEvent({ ...ticEvent });
    };

    const setTicEventlinkDialog = () => {
        setShowMyComponent(true);
        setTicEventlinkLVisible(true);
    };

    const setTicEventattsDialog = () => {
        setShowMyComponent(true);
        setTicEventattsLVisible(true);
    };

    const setTicEventagendaDialog = () => {
        setShowMyComponent(true);
        setTicEventagendaLVisible(true);
    };

    const setTicEventlocDialog = () => {
        setShowMyComponent(true);
        setTicEventlocLVisible(true);
    };

    const setTicEventcenatpDialog = () => {
        setShowMyComponent(true);
        setTicEventcenatpLVisible(true);
    };

    const setTicEventartDialog = () => {
        setShowMyComponent(true);
        setTicEventartLVisible(true);
    };
    const setDrowingDialog = () => {
        setShowMyComponent(true);
        setDrowingVisible(true);
    };

    const setTicEventobjDialog = () => {
        setShowMyComponent(true);
        setTicEventobjLVisible(true);
    };

    const setTicEventoWDialog = () => {
        setShowMyComponent(true);
        setTicEventWLVisible(true);
    };

    const setTicEventTmpDialog = () => {
        setShowMyComponent(true);
        setTicEventTmpLVisible(true);
    };


    const handleWebMapDialogClose = (newObj) => {
        setTicEventWLVisible(false);
    };

    const handleTicPrintGrpLDialogClose = (newObj) => {
        const localObj = { newObj };
    };
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
                    onClick={() => {
                        setTicEventDialog(rowData);
                        setEventTip('UPDATE');
                    }}
                    text
                    raised
                ></Button>
            </div>
        );
    };

    const actionTemplateC = (rowData) => {
        return (

            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-copy"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        setTicEventDialog(rowData);
                        setEventTip('COPY');
                    }}
                    severity="warning"
                    raised
                ></Button>
            </div>

        );
    };
    const actionTemplateC2 = (rowData) => {
        return (

            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-copy"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        setTicEventCpDialog(rowData);
                        setEventTip('COPY');
                    }}
                    severity="danger"
                    raised
                ></Button>
            </div>
        );
    };
    return (
        <div className="card" style={{ height: "855px" }}>
            <Toast ref={toast} />
            <DataTable
                dataKey="id"
                size={"small"}
                selectionMode="single"
                selection={ticEvent}
                loading={loading}
                value={ticEvents}
                header={header}
                showGridlines
                removableSort
                filters={filters}
                scrollable
                sortField="tm"
                sortOrder={-1}
                scrollHeight="690px"
                virtualScrollerOptions={{ itemSize: 46 }}
                tableStyle={{ minWidth: '50rem' }}
                metaKeySelection={false}
                paginator
                rows={125}
                rowsPerPageOptions={[125, 250, 500, 1000]}
                onSelectionChange={(e) => setTicEvent(e.value)}
            // onRowSelect={onRowSelect}
            // onRowUnselect={onRowUnselect}
            >
                <Column
                    //bodyClassName="text-center"
                    body={actionTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                />
                <Column field="npar" header={translations[selectedLanguage].Organizer} sortable filter style={{ width: '20%' }}></Column>
                {/* <Column field="code" header={translations[selectedLanguage].Code} sortable filter style={{ width: '10%' }}></Column> */}
                <Column field="text" header={translations[selectedLanguage].Dogadjaj} sortable filter style={{ width: '20%' }}></Column>
                <Column field="nmesto" header={translations[selectedLanguage].Mesto} sortable filter style={{ width: '20%' }}></Column>
                <Column field="nloc" header={translations[selectedLanguage].Scena} sortable filter style={{ width: '20%' }}></Column>
                <Column field="nctg" header={translations[selectedLanguage].ctg} sortable filter style={{ width: '10%' }}></Column>
                <Column field="ntp" header={translations[selectedLanguage].Type} sortable filter style={{ width: '10%' }}></Column>
                <Column field="tm" header={translations[selectedLanguage].Kreiran}
                    sortable
                    // filter 
                    style={{ width: '7%' }}></Column>
                <Column field="begda" header={translations[selectedLanguage].Prodaja}
                    // sortable 
                    filter style={{ width: '7%' }} body={(rowData) => formatDateColumn(rowData, 'begda')}></Column>
                <Column field="begtm" header={translations[selectedLanguage].BegTM}
                    // sortable filter 
                    style={{ width: '7%' }} body={(rowData) => formatTimeColumn(rowData, 'begtm')}></Column>
                <Column field="endda" header={translations[selectedLanguage].Dogadjaj}
                    // sortable 
                    filter style={{ width: '7%' }} body={(rowData) => formatDateColumn(rowData, 'endda')}></Column>
                <Column field="endtm" header={translations[selectedLanguage].BegTM}
                    // sortable filter 
                    style={{ width: '10%' }} body={(rowData) => formatTimeColumn(rowData, 'endtm')}></Column>
                <Column
                    field="status"
                    filterField="status"
                    dataType="numeric"
                    header={translations[selectedLanguage].Status}
                    // sortable
                    // filter
                    filterElement={statusFilterTemplate}
                    style={{ width: '5%' }}
                    bodyClassName="text-center"
                    body={statusBodyTemplate}
                ></Column>
                <Column
                    //bodyClassName="text-center"
                    body={actionTemplateC}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '1rem' }}
                />
                <Column
                    //bodyClassName="text-center"
                    body={actionTemplateC2}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '1rem' }}
                />
            </DataTable>
            <Dialog
                header={translations[selectedLanguage].Event}
                visible={visible}
                style={{ width: '60%' }}
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
                header={translations[selectedLanguage].Event}
                visible={cpVisible}
                style={{ width: '70%' }}
                onHide={() => {
                    setCpVisible(false);
                }}
            >
                {cpVisible &&
                    <TicEventCp
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        handleDialogClose={handleDialogClose}
                        setVisible={setCpVisible}
                        dialog={true}
                        eventTip={eventTip}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventlinkLista}
                visible={ticEventlinkLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventlinkLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && <TicEventlinkL parameter={'inputTextValue'} ticEvent={ticEvent} handleTicEventlinkLDialogClose={handleTicEventlinkLDialogClose} setTicEventlinkLVisible={setTicEventlinkLVisible} dialog={true} lookUp={false} />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventAttsList}
                visible={ticEventattsLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventattsLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventattsL
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        handleTicEventattsLDialogClose={handleTicEventattsLDialogClose}
                        setTicEventattsLVisible={setTicEventattsLVisible}
                        setVisible={setVisible}
                        dialog={true}
                        lookUp={false}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventagendaList}
                visible={ticEventagendaLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventagendaLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                    <TicEventagendaL parameter={'inputTextValue'} ticEvent={ticEvent} handleTicEventagendaLDialogClose={handleTicEventagendaLDialogClose} setTicEventagendaLVisible={setTicEventagendaLVisible} dialog={true} lookUp={false} />
                )}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventlocList}
                visible={ticEventlocLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventlocLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventlocL
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        handleTicEventlocLDialogClose={handleTicEventlocLDialogClose}
                        setTicEventlocLVisible={setTicEventlocLVisible}
                        dialog={true}
                        lookUp={false}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventcenatpList}
                visible={ticEventcenatpLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventcenatpLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventcenatpL
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        handleTicEventcenatpLDialogClose={handleTicEventcenatpLDialogClose}
                        setTicEventcenatpLVisible={setTicEventcenatpLVisible}
                        dialog={true}
                        lookUp={false}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventartList}
                visible={ticEventartLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventartLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventrtL
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        //setTicArtLVisible={setTicArtLVisible} 
                        setTicEventartLVisible={setTicEventartLVisible}
                        dialog={true}
                        lookUp={true}
                        eventArt={true}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventobjList}
                visible={ticEventobjLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventobjLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventobjL
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        //setTicArtLVisible={setTicArtLVisible} 
                        setTicEventobjLVisible={setTicEventobjLVisible}
                        dialog={true}
                        lookUp={true}
                        eventArt={true}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventWList}
                visible={ticEventWLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventWLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventWL
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        //setTicArtLVisible={setTicArtLVisible} 
                        setTicEventWLVisible={setTicEventWLVisible}
                        setTicEventobjLVisible={setTicEventobjLVisible}
                        setTicEventartLVisible={setTicEventartLVisible}
                        setTicEventattsLVisible={setTicEventattsLVisible}
                        dialog={true}
                        lookUp={true}
                        eventArt={true}
                        onTaskComplete={handleWebMapDialogClose}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventTmpList}
                visible={ticEventTmpLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventTmpLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventTmpL
                        parameter={'inputTextValue'}
                        ticEvent={ticEvent}
                        //setTicArtLVisible={setTicArtLVisible} 
                        setTicEventTmpLVisible={setTicEventTmpLVisible}
                        dialog={true}
                        lookUp={true}
                        eventArt={true}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].PrintGrp}
                visible={ticPrintGrpLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicPrintGrpLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                    <TicPrintGrpL
                        parameter={"inputTextValue"}
                        ticEvent={ticEvent}
                        handleTicPrintGrpLDialogClose={handleTicPrintGrpLDialogClose}
                        setTicPrintGrpLVisible={setTicPrintGrpLVisible}
                        dialog={true}
                    />
                )}
            </Dialog>
            <ConfirmDialog
                visible={confirmDialogVisible}
                onHide={() => setConfirmDialogVisible(false)}
                onConfirm={handleConfirm}
                uPoruka={'Aktivacija događaja, da li ste sigurni?'}
            />
            <Dialog
                header={
                    <div className="dialog-header">
                        <Button
                            label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                            onClick={() => {
                                setDrowingVisible(false);
                            }}
                            severity="secondary" raised
                        />
                    </div>
                }
                visible={drowingVisible}
                style={{ width: '98%' }}
                onHide={() => {
                    setDrowingVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                    <SaleEvent key={"II"}
                        ticEvent={ticEvent}
                        TabView={true}
                        dialog={true}
                        setDrowingVisible={setDrowingVisible}
                    />
                )}
            </Dialog>
        </div>
    );
}
