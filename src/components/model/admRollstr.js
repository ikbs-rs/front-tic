import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmRollstrService } from "../../service/model/AdmRollstrService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from "primereact/inputswitch";
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";

const AdmRollstr = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admRollstr, setAdmRollstr] = useState(props.admRollstr);
    const [submitted, setSubmitted] = useState(false);
    const [ddObjTpItem, setDdObjTpItem] = useState(null);
    const [ddObjTpItems, setDdObjTpItems] = useState(null);
    const [ddObjItem, setDdObjItem] = useState(null);
    const [ddObjItems, setDdObjItems] = useState(null);
    const [onoff, setOnoff] = useState(props.admRollstr.onoff == 1);
    const [hijerarhija, setHijerarhija] = useState(props.admRollstr.hijerarhija == 1);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.CMN_BACK_URL}/cmn/x/objtp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdObjTpItems(dataDD);
                setDdObjTpItem(dataDD.find((item) => item.code === props.admRollstr.objtp) || null);
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
                const tp = admRollstr.objtp||-1
                const url = `${env.CMN_BACK_URL}/cmn/x/obj/getall/tp/${tp}/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };
                const response = await axios.get(url, { headers });
                const data = response.data.item;
                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                setDdObjItems(dataDD);
                setDdObjItem(dataDD.find((item) => item.code === props.admRollstr.obj) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [admRollstr.objtp]);    

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            admRollstr.onoff = onoff ? 1 : 0;
            admRollstr.hijerarhija = hijerarhija ? 1 : 0;
            const admRollstrService = new AdmRollstrService();
            const dataId = await admRollstrService.postAdmRollstr(admRollstr);
            admRollstr.id = dataId
            props.handleDialogClose({ obj: admRollstr, rollstrTip: props.rollstrTip });
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
            admRollstr.onoff = onoff ? 1 : 0;
            admRollstr.hijerarhija = hijerarhija ? 1 : 0;
            const admRollstrService = new AdmRollstrService();
            await admRollstrService.putAdmRollstr(admRollstr);
            props.handleDialogClose({ obj: admRollstr, rollstrTip: props.rollstrTip });
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
            const admRollstrService = new AdmRollstrService();
            await admRollstrService.deleteAdmRollstr(admRollstr);
            props.handleDialogClose({ obj: admRollstr, rollstrTip: 'DELETE' });
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
            switch (name) {
                case "objtp":
                    setDdObjTpItem(e.value);
                    admRollstr.objtp= e.value.code
                    admRollstr.nobjtp= e.value.name
                    admRollstr.ocode= e.value.code
                    admRollstr.otext= e.value.name
                    break;
                case "obj":
                    setDdObjItem(e.value);
                    admRollstr.obj = e.value.code
                    admRollstr.nobj = e.value.name
                    admRollstr.o1code= e.value.code
                    admRollstr.o1text= e.value.name                    
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }            
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else if (type === "inputSwitch") {
            val = (e.target && e.target.value) ? 1 : 0
            switch (name) {
                case "onoff":
                    setOnoff(e.value)
                    break;
                case "hijerarhija":
                    setHijerarhija(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _admRollstr = { ...admRollstr };
        _admRollstr[`${name}`] = val;
        setAdmRollstr(_admRollstr);
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
                        <div className="field col-12 md:col-5">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code"
                                value={props.admRoll.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={props.admRoll.textx}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="objtp">{translations[selectedLanguage].ObjtpText} *</label>
                            <Dropdown id="objtp"
                                value={ddObjTpItem}
                                options={ddObjTpItems}
                                onChange={(e) => onInputChange(e, "options", 'objtp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admRollstr.objtp })}
                            />
                            {submitted && !admRollstr.objtp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="obj">{translations[selectedLanguage].ObjText} *</label>
                            <Dropdown id="obj"
                                value={ddObjItem}
                                options={ddObjItems}
                                onChange={(e) => onInputChange(e, "options", 'obj')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admRollstr.obj })}
                            />
                            {submitted && !admRollstr.obj && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                        
                    </div>

                    <div className="flex flex-wrap gap-1">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].On_off}</label>
                                <InputSwitch inputId="onoff" checked={onoff} onChange={(e) => onInputChange(e, "inputSwitch", 'onoff')} />
                            </div>
                        </div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].Hijerarhija}</label>
                                <InputSwitch inputId="hijerarhija" checked={hijerarhija} onChange={(e) => onInputChange(e, "inputSwitch", 'hijerarhija')} />
                            </div>
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
                            {(props.rollstrTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.rollstrTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.rollstrTip !== 'CREATE') ? (
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
                item={admRollstr.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmRollstr;
