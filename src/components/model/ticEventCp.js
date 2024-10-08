import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventService } from "../../service/model/TicEventService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction"
import { Calendar } from "primereact/calendar";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Divider } from 'primereact/divider';
import ConfirmDialog from '../dialog/ConfirmDialog';
import TicEventCpsL from './ticEventCpsL';




const TicEventCp = (props) => {
    console.log(props, "************************************TicEvent*****************************************")
    const [i, setI] = useState(1)
    const selectedLanguage = localStorage.getItem('sl') || 'en'

    const [ticEvent, setTicEvent] = useState(props.ticEvent);
    const [ticEvents, setTicEvents] = useState([]);

    const [submitted, setSubmitted] = useState(false);

    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    /************************AUTOCOMPLIT**************************** */

    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticEvent.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticEvent.endda || DateFunction.currDate())))

    const toast = useRef(null);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleSaveClickNext = async () => {
        try {
            console.log(ticEvent, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
            const _ticEvent = { ...ticEvent }
            setI(prev => prev + 1)
            _ticEvent.event = ticEvent.id
            _ticEvent.id = i
            _ticEvent.code = `${_ticEvent.code}-${i}`
            // Dodaj novi događaj u niz
            setTicEvents([...ticEvents, _ticEvent]);
            // props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const handleDelete = (ticEventToDelete) => {
        setTicEvents(ticEvents.filter(event => event.id !== ticEventToDelete.id));
    };

    const handleCopyClick = () => {
        setConfirmDialogVisible(true);
    };

    const handleConfirm = async () => {
        try {
            console.log(ticEvents, "***********handleConfirm********************")
            setSubmitted(true);

            const ticEventService = new TicEventService();
            console.log('*00********************handleCopyClick*************************')
            await ticEventService.postTicEventCopyS(ticEvents);
            const _ticEvent = { ...ticEvent };
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Догађај успешно копиран ?', life: 3000 });
            props.handleDialogClose({ obj: _ticEvent, eventTip: props.eventTip });
            setConfirmDialogVisible(false);
            setVisible(false);
            props.setVisible(false);

        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = ''
        let _ticEvent = { ...ticEvent };
        let dateVal = ''
        if (type === "Calendar") {
            dateVal = DateFunction.dateGetValue(e.value)
            val = DateFunction.formatDateToDBFormat(dateVal|| '');
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    _ticEvent.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    _ticEvent.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
console.log(val, dateVal, "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", DateFunction.formatDateToDBFormat(dateVal))

        _ticEvent[`${name}`] = val;
        if (name === `textx`) _ticEvent[`text`] = val

        setTicEvent(_ticEvent);
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={ticEvent.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvent.code })}
                            />
                            {submitted && !ticEvent.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={ticEvent.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvent.textx })}
                            />
                            {submitted && !ticEvent.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                    </div>
                    <div className="p-fluid formgrid grid">

                        <div className="field col-12 md:col-3">
                            <label htmlFor="begda">{translations[selectedLanguage].DatProd} *</label>
                            <Calendar
                                value={begda}
                                onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />

                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="begtm">{translations[selectedLanguage].TmProd}</label>
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
                        <div className="field col-12 md:col-3">
                            <label htmlFor="roenddal">{translations[selectedLanguage].DatEvent} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="endtm">{translations[selectedLanguage].TmEvent}</label>
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
                        <Divider>
                            <div className="inline-flex align-items-center" style={{ borderColor: 'blue' }}>
                                <i className="pi pi-tags mr-2"></i>
                            </div>
                        </Divider>

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
                                <Button
                                    label={translations[selectedLanguage].SaveNext}
                                    icon="pi pi-check"
                                    onClick={handleSaveClickNext}
                                    severity="success"
                                    outlined
                                />
                                <Button
                                    label={translations[selectedLanguage].Copy}
                                    icon="pi pi-check"
                                    onClick={handleCopyClick}
                                    severity="warning"
                                    raised
                                />

                            </div>
                        </div>
                    </div>
                    <div className="flex-grow-1">

                        <TicEventCpsL ticEvents={ticEvents} handleDelete={handleDelete} />
                    </div>
                    <ConfirmDialog
                        visible={confirmDialogVisible}
                        onHide={() => setConfirmDialogVisible(false)}
                        onConfirm={handleConfirm}
                        uPoruka={'Kopiranje događaja, da li ste sigurni?'}
                    />
                </div>
            </div>


        </div>
    );
};

export default TicEventCp;
