import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicDocService } from "../../service/model/TicDocService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"
import TicDocsL from './ticDocsL';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
//import CmnParL from './cmnParL';
import CmnParL from './remoteComponentContainer';

const TicDoc = (props) => {
    //console.log("***********************************", props, "***********************************")
    const objName = "tic_docs"
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicEvents = EmptyEntities[objName]
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [ticDoc, setTicDoc] = useState(props.ticDoc);
    const [ticDocs, setTicDocs] = useState(props.ticDocs);
    const [submitted, setSubmitted] = useState(false);

    const [ddCmnCurrItem, setDdCmnCurrItem] = useState(null);
    const [ddCmnCurrItems, setDdCmnCurrItems] = useState(null);
    const [cmnCurrItem, setCmnCurrItem] = useState(null);
    const [cmnCurrItems, setCmnCurrItems] = useState(null);
    const [cmnParLVisible, setCmnParLVisible] = useState(false);
    const [cmnPar, setCmnPar] = useState(null);


    const [date, setDate] = useState(new Date(DateFunction.formatJsDate(props.ticDoc.date || DateFunction.currDate())));
    const [tm, setTm] = useState(DateFunction.formatDatetime(props.ticDoc.tm || DateFunction.currDatetime()));

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Active}`, code: '1' },
        { name: `${translations[selectedLanguage].Inactive}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticDoc.status));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocService = new TicDocService();
                const data = await ticDocService.getCmnCurrs();

                setCmnCurrItems(data)
                //console.log("******************", cmnCurrItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnCurrItems(dataDD);
                setDdCmnCurrItem(dataDD.find((item) => item.code === props.ticDoc.curr) || null);
                if (props.ticDoc.tp) {
                    const foundItem = data.find((item) => item.id === props.ticDoc.curr);
                    setCmnCurrItem(foundItem || null);
                    ticDoc.ccurr = foundItem.code
                    ticDoc.ncurr = foundItem.textx
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleParClick = async () => {
        try {
            // const cmnParCode = ticDoc.cpar; // Pretpostavljamo da je ovde kod za cmnPar
            // const ticDocService = new TicDocService();
            // const cmnParData = await ticDocService.getCmnPar(cmnParCode);
            setCmnParDialog()
            // setCmnPar(cmnParData);
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch cmnPar data",
                life: 3000,
            });
        }
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticDoc.date = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(date));
            ticDoc.tm = DateFunction.formatDateTimeToDBFormat(tm);
            const ticDocService = new TicDocService();
            const data = await ticDocService.postTicDoc(ticDoc);
            ticDoc.id = data
            props.handleDialogClose({ obj: ticDoc, docTip: props.docTip });
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
            ticDoc.date = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(date));
            ticDoc.tm = DateFunction.formatDateTimeToDBFormat(tm);
            const ticDocService = new TicDocService();
            await ticDocService.putTicDoc(ticDoc);
            props.handleDialogClose({ obj: ticDoc, docTip: props.docTip });
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
            const ticDocService = new TicDocService();
            await ticDocService.deleteTicDoc(ticDoc);
            props.handleDialogClose({ obj: ticDoc, docTip: 'DELETE' });
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
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "curr") {
                setDdCmnCurrItem(e.value);
                const foundItem = cmnCurrItems.find((item) => item.id === val);
                setCmnCurrItem(foundItem || null);
                ticDoc.ncurr = e.value.name
                ticDoc.ccurr = foundItem.code
            } else if (type === "Calendar") {
                const dateVal = DateFunction.dateGetValue(e.value)
                val = (e.target && e.target.value) || '';
                switch (name) {
                    case "date":
                        setDate(e.value)
                        ticDoc.date = DateFunction.formatDateToDBFormat(dateVal)
                        break;
                    default:
                        console.error("Pogresan naziv polja")
                }
            } else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticDoc = { ...ticDoc };
        _ticDoc[`${name}`] = val;
        if (name === `textx`) _ticDoc[`text`] = val

        setTicDoc(_ticDoc);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    const handleCmnParLDialogClose = (newObj) => {
        //const localObj = { newObj };
        setCmnPar(newObj.obj);
        ticDoc.usr = newObj.obj.id
        ticDoc.npar = newObj.obj.text
        ticDoc.cpar = newObj.obj.code
    };

    // <--- Dialog
    const setCmnParDialog = () => {
        setCmnParLVisible(true)
    }
    //  Dialog --->
    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="text">{translations[selectedLanguage].docvr}</label>
                            <InputText
                                id="text"
                                value={props.ticDocvr.text}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="ndocobj">{translations[selectedLanguage].ndocobj}</label>
                            <InputText
                                id="ndocobj"
                                value={props.ticDoc.ndocobj}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-1">
                            <label htmlFor="year">{translations[selectedLanguage].year} *</label>
                            <InputText id="year"
                                value={ticDoc.year} onChange={(e) => onInputChange(e, "text", 'year')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDoc.year })}
                            />
                            {submitted && !ticDoc.year && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-1">
                            <label htmlFor="broj">{translations[selectedLanguage].broj} *</label>
                            <InputText id="broj"
                                value={ticDoc.broj} onChange={(e) => onInputChange(e, "text", 'broj')}
                            />
                        </div>
                        <div className="field col-12 md:col-1">
                            <label htmlFor="storno">{translations[selectedLanguage].storno}</label>
                            <InputText
                                id="text"
                                value={props.ticDoc.storno}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="date">{translations[selectedLanguage].date} *</label>
                            <Calendar
                                value={date}
                                onChange={(e) => onInputChange(e, "Calendar", 'date', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                    </div>
                    {/** 
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                */}
                    <div className="p-fluid formgrid grid">

                        <div className="field col-12 md:col-4">
                            <label htmlFor="event">{translations[selectedLanguage].Event} *</label>
                            <Dropdown id="event"
                                //value={ddTicEventlinkItem}
                                // options={ddTicEventlinkItems}
                                onChange={(e) => onInputChange(e, "options", 'event')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                            //className={classNames({ 'p-invalid': submitted && !ticDoc.event })}
                            />
                            {/*submitted && !ticDoc.event && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>*/}
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="cpar">{translations[selectedLanguage].cpar} *</label>
                            <div className="p-inputgroup flex-1">
                                <InputText id="cpar" autoFocus
                                    value={ticDoc.cpar} onChange={(e) => onInputChange(e, "text", 'cpar')}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !ticDoc.cpar })}
                                />
                                <Button icon="pi pi-search" onClick={handleParClick} className="p-button" />
                            </div>
                            {submitted && !ticDoc.cpar && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="npar">{translations[selectedLanguage].npar}</label>
                            <InputText
                                id="npar"
                                value={props.ticDoc.npar}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="curr">{translations[selectedLanguage].curr} *</label>
                            <Dropdown id="curr"
                                value={ddCmnCurrItem}
                                options={ddCmnCurrItems}
                                onChange={(e) => onInputChange(e, "options", 'curr')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDoc.curr })}
                            />
                            {submitted && !ticDoc.curr && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="currrate">{translations[selectedLanguage].currrate} *</label>
                            <InputText
                                id="currrate"
                                value={ticDoc.currrate} onChange={(e) => onInputChange(e, "text", 'currrate')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDoc.currrate })}
                            />
                            {submitted && !ticDoc.currrate && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="status">{translations[selectedLanguage].status} *</label>
                            <Dropdown id="status"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'status')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDoc.status })}
                            />
                            {submitted && !ticDoc.status && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="tm">{translations[selectedLanguage].tm}</label>
                            <InputText
                                id="tm"
                                value={tm}
                                disabled={true}
                            />
                        </div>

                        <div className="field col-12 md:col-12">
                            <label htmlFor="opis">{translations[selectedLanguage].opis}</label>
                            <InputText
                                id="opis"
                                value={ticDoc.opis} onChange={(e) => onInputChange(e, "text", 'opis')}
                            />
                        </div>
                    </div>

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
                            {(props.docTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.docTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.docTip !== 'CREATE') ? (
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
                <div className="flex-grow-1">

                    {showMyComponent && (
                        <TicDocsL
                            parameter={"inputTextValue"}
                            ticDoc={ticDoc}
                            ticDocs={ticDocs}
                            //updateEventsTip={updateEventsTip}
                            ////handleDialogClose={handleDialogClose}
                            setVisible={true}
                            dialog={false}
                            docTip={props.docTip}
                        />
                    )}
                </div>

            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={ticDoc.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
            {/*
            <Dialog
                header={translations[selectedLanguage].ParList}
                visible={cmnParLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setCmnParLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {cmnParLVisible && (
                    <CmnParL
                        parameter={"inputTextValue"}
                        cmnPar={cmnPar}
                        handleCmnParLDialogClose={handleCmnParLDialogClose}
                        setCmnParLVisible={setCmnParLVisible}
                        dialog={true}
                        lookUp={true}
                    />
                )}
            </Dialog>
            */}
            <Dialog
                header={translations[selectedLanguage].ParList}
                visible={cmnParLVisible}
                style={{ width: '90%', height: '1400px' }}
                onHide={() => {
                    setCmnParLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {cmnParLVisible && (
                    <CmnParL
                        remoteUrl="http://ws10.ems.local:8353/?endpoint=parend&sl=sr_cyr"
                        queryParams={{ sl: 'sr_cyr', lookUp: true, dialog: true, ticDoc: ticDoc }} // Dodajte ostale parametre po potrebi
                        onTaskComplete={handleCmnParLDialogClose}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default TicDoc;
