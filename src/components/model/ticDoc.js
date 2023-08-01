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

const TicDoc = (props) => {
    console.log("***********************************", props, "***********************************")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [ticDoc, setTicDoc] = useState(props.ticDoc);
    const [submitted, setSubmitted] = useState(false);

    const [ddCmnCurrItem, setDdCmnCurrItem] = useState(null);
    const [ddCmnCurrItems, setDdCmnCurrItems] = useState(null);
    const [cmnCurrItem, setCmnCurrItem] = useState(null);
    const [cmnCurrItems, setCmnCurrItems] = useState(null);    

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticDoc.valid));
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

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
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
                        <div className="field col-12 md:col-2">
                            <label htmlFor="year">{translations[selectedLanguage].year}</label>
                            <InputText id="year" 
                                value={ticDoc.year} onChange={(e) => onInputChange(e, "text", 'year')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDoc.year })}
                            />
                            {submitted && !ticDoc.year && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="broj">{translations[selectedLanguage].broj}</label>
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

                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="cpar">{translations[selectedLanguage].cpar}</label>
                            <div className="p-inputgroup flex-1">
                                <InputText id="cpar" autoFocus
                                    value={ticDoc.cpar} onChange={(e) => onInputChange(e, "text", 'cpar')}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !ticDoc.cpar })}
                                />
                                <Button icon="pi pi-search" className="p-button" />
                            </div>
                            {submitted && !ticDoc.cpar && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-8">
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
                        <div className="field col-12 md:col-3">
                            <label htmlFor="currrate">{translations[selectedLanguage].currrate}</label>
                            <InputText
                                id="currrate"
                                value={ticDoc.currrate} onChange={(e) => onInputChange(e, "text", 'currrate')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDoc.currrate })}
                            />
                            {submitted && !ticDoc.currrate && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="status">{translations[selectedLanguage].status}</label>
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
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={ticDoc.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicDoc;
