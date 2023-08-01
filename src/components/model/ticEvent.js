import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventService } from "../../service/model/TicEventService";
import { TicEventsService } from "../../service/model/TicEventsService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction"
import InputMask from 'react-input-mask';
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";
import { Calendar } from "primereact/calendar";
import TicEvents from './ticEvents';
import TicEventctg from './ticEventctg';
import { EmptyEntities } from '../../service/model/EmptyEntities';


const TicEvent = (props) => {
    let i = 0
    const objName = "tic_events"
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicEvents = EmptyEntities[objName]
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [ticEvent, setTicEvent] = useState(props.ticEvent);
    const [ticEvents, setTicEvents] = useState(emptyTicEvents);

    const [submitted, setSubmitted] = useState(false);
    const [ddTpItem, setDdTpItem] = useState(null);
    const [ddTpItems, setDdTpItems] = useState(null);
    const [ddCtgItem, setDdCtgItem] = useState(null);
    const [ddCtgItems, setDdCtgItems] = useState(null);
    const [eventsTip, setEventsTip] = useState(false);
    const [ddLocItem, setDdLocItem] = useState(null);
    const [ddLocItems, setDdLocItems] = useState(null);   
    const [ddEventItem, setDdEventItem] = useState(null);
    const [ddEventItems, setDdEventItems] = useState(null);       

    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticEvent.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticEvent.endda || DateFunction.currDate())))

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Active}`, code: '1' },
        { name: `${translations[selectedLanguage].Inactive}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticEvent.status));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.TIC_BACK_URL}/tic/x/eventtp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTpItems(dataDD);
                setDdTpItem(dataDD.find((item) => item.code === props.ticEvent.tp) || null);
                setEventsTip(true)
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
                const url = `${env.TIC_BACK_URL}/tic/x/eventctg/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCtgItems(dataDD);
                setDdCtgItem(dataDD.find((item) => item.code === props.ticEvent.ctg) || null);
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
                    const ticEventsService = new TicEventsService();
                    const data = await ticEventsService.getTicEvents(props.ticEvent.id);
                    if (data) {
                        setTicEvents(data)
                        updateEventsTip(true)
                    } else {
                        emptyTicEvents.id = null
                        setTicEvents(emptyTicEvents)
                        updateEventsTip(false)
                    }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [props.ticEvent, eventsTip]);

    useEffect(() => {
        async function fetchData() {
          try { 
            const objId = 'MO' // Mesto odrzavanja, scena, hala ... - treba ubaciti u DB parametre
            const ticEventService = new TicEventService();
            const data = await ticEventService.getCmnListaByItem('loc', 'listabytxt', 'cmn_locbytxt_v', 't.code', objId);
            const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
            console.log(dataDD,"+++++++++++++++++++++++++++", props.ticEvent.loc)
            setDdLocItems(dataDD);
            setDdLocItem(dataDD.find((item) => item.code === props.ticEvent.loc) || null);
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
            const ticEventService = new TicEventService();
            const data = await ticEventService.getLista();
            const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
            setDdEventItems(dataDD);
            setDdEventItem(dataDD.find((item) => item.code === props.ticEvent.event) || null);            
            setTicEvents(data);
          } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
          }
        }
        fetchData();
      }, []);      

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    const updateEventsTip = (value) => {
        setEventsTip(value);
      };

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticEvent.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEvent.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            ticEvent.begtm = DateFunction.convertTimeToDBFormat(ticEvent.begtm)
            ticEvent.endtm = DateFunction.convertTimeToDBFormat(ticEvent.endtm)
            const ticEventService = new TicEventService();
            const data = await ticEventService.postTicEvent(ticEvent);
            ticEvent.id = data
            props.handleDialogClose({ obj: ticEvent, eventTip: props.eventTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticEvent.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEvent.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            ticEvent.begtm = DateFunction.convertTimeToDBFormat(ticEvent.begtm)
            ticEvent.endtm = DateFunction.convertTimeToDBFormat(ticEvent.endtm)
            const ticEventService = new TicEventService();
            await ticEventService.putTicEvent(ticEvent);
            props.handleDialogClose({ obj: ticEvent, eventTip: props.eventTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const ticEventService = new TicEventService();
            await ticEventService.deleteTicEvent(ticEvent);
            props.handleDialogClose({ obj: ticEvent, eventTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = ''
        if (type === "options") {
            if (name == "tp") {
                setDdTpItem(e.value);
                ticEvent.ctp = e.value.code
                ticEvent.ntp = e.value.name
            } else if (name == "ctg") {
                setDdCtgItem(e.value);
                ticEvent.cctg = e.value.code
                ticEvent.nctg = e.value.name
            } else if (name == "loc") {
                setDdLocItem(e.value);
                ticEvent.cloc = e.value.code
                ticEvent.nloc = e.value.name
            } else if (name == "event") {
                setDdEventItem(e.value);
                ticEvent.cevent = e.value.code
                ticEvent.nevent = e.value.name
            }else {
                setDropdownItem(e.value);
            }
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    ticEvent.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    ticEvent.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticEvent = { ...ticEvent };
        _ticEvent[`${name}`] = val;
        if (name === `textx`) _ticEvent[`text`] = val

        setTicEvent(_ticEvent);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-10">
                            <label htmlFor="event">{translations[selectedLanguage].ParentEvent}</label>
                            <Dropdown id="event"
                                value={ddEventItem}
                                options={ddEventItems}
                                onChange={(e) => onInputChange(e, "options", 'event')}
                                filter
                                optionLabel="name"
                                placeholder="Select One"
                            />
                        </div>                         
                        <div className="field col-12 md:col-4">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={ticEvent.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvent.code })}
                            />
                            {submitted && !ticEvent.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-8">
                            <label htmlFor="loc">{translations[selectedLanguage].Location} *</label>
                            <Dropdown id="loc"
                                value={ddLocItem}
                                options={ddLocItems}
                                onChange={(e) => onInputChange(e, "options", 'loc')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.loc })}
                            />
                            {submitted && !ticEvent.loc && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                        
                        <div className="field col-12 md:col-12">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={ticEvent.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvent.textx })}
                            />
                            {submitted && !ticEvent.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="descript">{translations[selectedLanguage].Descript}</label>
                            <InputText
                                id="descript"
                                value={ticEvent.descript} onChange={(e) => onInputChange(e, "text", 'descript')}
                                required
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="ctg">{translations[selectedLanguage].ctg} *</label>
                            <Dropdown id="ctg"
                                value={ddCtgItem}
                                options={ddCtgItems}
                                onChange={(e) => onInputChange(e, "options", 'ctg')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.ctg })}
                            />
                            {submitted && !ticEvent.ctg && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="tp">{translations[selectedLanguage].EventTp} *</label>
                            <Dropdown id="tp"
                                value={ddTpItem}
                                options={ddTpItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                filter
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.tp })}
                            />
                            {submitted && !ticEvent.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar
                                value={begda}
                                onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />

                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="begtm">{translations[selectedLanguage].BegTM}</label>
                            <InputText
                                id="begtm"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticEvent.begtm)} onChange={(e) => onInputChange(e, "text", 'begtm')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvent.begtm })}
                            />
                            {submitted && !ticEvent.begtm && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="endtm">{translations[selectedLanguage].EndTM}</label>
                            <InputText
                                id="endtm"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticEvent.endtm)} onChange={(e) => onInputChange(e, "text", 'endtm')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvent.endtm })}
                            />
                            {submitted && !ticEvent.endtm && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="note">{translations[selectedLanguage].Note}</label>
                            <InputText
                                id="note"
                                value={ticEvent.note} onChange={(e) => onInputChange(e, "text", 'note')}
                            />
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="status">{translations[selectedLanguage].Status}</label>
                            <Dropdown id="status"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'status')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEvent.status })}
                            />
                            {submitted && !ticEvent.status && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    {/**/}
                    <div className="card">
                        <div className="flex flex-wrap gap-1">
                            {props.dialog ? (
                                <Button
                                    label={translations[selectedLanguage].Cancel}
                                    icon="pi pi-times"
                                    className="p-button-outlined p-button-secondary"
                                    onClick={handleCancelClick}
                                    outlined
                                />
                            ) : null}
                            <div className="flex-grow-1"></div>
                            <div className="flex flex-wrap gap-1">
                                {(props.eventTip === 'CREATE') ? (
                                    <Button
                                        label={translations[selectedLanguage].Create}
                                        icon="pi pi-check"
                                        onClick={handleCreateClick}
                                        severity="success"
                                        outlined
                                    />
                                ) : null}
                                {(props.eventTip !== 'CREATE') ? (
                                    <Button
                                        label={translations[selectedLanguage].Delete}
                                        icon="pi pi-trash"
                                        onClick={showDeleteDialog}
                                        className="p-button-outlined p-button-danger"
                                        outlined
                                    />
                                ) : null}
                                {(props.eventTip !== 'CREATE') ? (
                                    <Button
                                        label={translations[selectedLanguage].Save}
                                        icon="pi pi-check"
                                        onClick={handleSaveClick}
                                        severity="success"
                                        outlined
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {/**/}
                    {showMyComponent && (
                        <TicEvents
                            parameter={"inputTextValue"}
                            ticEvent={ticEvent}
                            ticEvents={ticEvents}
                            updateEventsTip={updateEventsTip}
                            //handleDialogClose={handleDialogClose}
                            setVisible={true}
                            dialog={false}
                            eventsTip={eventsTip}
                        />
                    )}
                </div>
            </div>


            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={ticEvent.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEvent;
