import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmUserPermissService } from "../../service/model/AdmUserPermissService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { Dropdown } from 'primereact/dropdown';
import { AdmUserService } from "../../service/model/AdmUserService";
import { translations } from "../../configs/translations";

const AdmUserPermissU = (props) => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admUserPermissU, setAdmUserPermissU] = useState(props.admUserpermissU);
    const [submitted, setSubmitted] = useState(false);
    const [ddUserItem, setDdUserItem] = useState(null);
    const [ddUserItems, setDdUserItems] = useState(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const admUserService = new AdmUserService();
                const data = await admUserService.getAdmUserV();
                const dataDD = data.map(({ mail, id }) => ({ name: mail, code: id }));
                setDdUserItems(dataDD);
                setDdUserItem(dataDD.find((item) => item.code === props.admUserpermissU.usr) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const admUserPermissUService = new AdmUserPermissService();
            const data = await admUserPermissUService.postAdmUserPermiss(admUserPermissU);
            admUserPermissU.id = data
            props.handleDialogClose({ obj: admUserPermissU, userpermisUTip: props.userpermisUTip });
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
            const admUserPermissUService = new AdmUserPermissService();
            await admUserPermissUService.putAdmUserPermiss(admUserPermissU);
            props.handleDialogClose({ obj: admUserPermissU, userpermisUTip: props.userpermisUTip });
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
            const admUserPermissUService = new AdmUserPermissService();
            await admUserPermissUService.deleteAdmUserPermiss(admUserPermissU);
            props.handleDialogClose({ obj: admUserPermissU, userpermisUTip: 'DELETE' });
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

    const onInputChange = async (e, type, name) => {
        let val = ''
        if (type === "options") {
            setDdUserItem(e.value);
            admUserPermissU.mail= e.value.name
            admUserPermissU.usr= e.value.code
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }


        const admUserService = new AdmUserService();
        const data = await admUserService.getAdmUser(admUserPermissU.usr);

        admUserPermissU.username = data.username
        admUserPermissU.firstname = data.firstname
        admUserPermissU.lastname = data.lastname
        let _admUserPermissU = { ...admUserPermissU };
        _admUserPermissU[`${name}`] = val;

        setAdmUserPermissU(_admUserPermissU);
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
                        <div className="field col-12 md:col-6">
                            <label htmlFor="usr">{translations[selectedLanguage].User} *</label>
                            <Dropdown id="usr"
                                value={ddUserItem}
                                options={ddUserItems}
                                onChange={(e) => onInputChange(e, "options", 'usr')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admUserPermissU.usr })}
                            />
                            {submitted && !admUserPermissU.usr && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.userpermisUTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.userpermisUTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.userpermisUTip !== 'CREATE') ? (
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
                item={admUserPermissU.usr}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmUserPermissU;
