import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmUserPermissService } from "../../service/model/AdmUserPermissService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { Dropdown } from 'primereact/dropdown';
import { AdmRollService } from "../../service/model/AdmRollService";
import { translations } from "../../configs/translations";

const AdmUserPermiss = (props) => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admUserPermiss, setAdmUserPermiss] = useState(props.admUserPermiss);
    const [submitted, setSubmitted] = useState(false);
    const [ddRollItem, setDdRollItem] = useState(null);
    const [ddRollItems, setDdRollItems] = useState(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const admRollService = new AdmRollService();
                const data = await admRollService.getAdmRollX();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdRollItems(dataDD);
                setDdRollItem(dataDD.find((item) => item.code === props.admUserPermiss.roll) || null);
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
            const admUserPermissService = new AdmUserPermissService();
            const data = await admUserPermissService.postAdmUserPermiss(admUserPermiss);
            admUserPermiss.id = data
            props.handleDialogClose({ obj: admUserPermiss, userPermissTip: props.userPermissTip });
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
            const admUserPermissService = new AdmUserPermissService();
            await admUserPermissService.putAdmUserPermiss(admUserPermiss);
            props.handleDialogClose({ obj: admUserPermiss, userPermissTip: props.userPermissTip });
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
            const admUserPermissService = new AdmUserPermissService();
            await admUserPermissService.deleteAdmUserPermiss(admUserPermiss);
            props.handleDialogClose({ obj: admUserPermiss, userPermissTip: 'DELETE' });
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
            setDdRollItem(e.value);
            admUserPermiss.rtext= e.value.name
            admUserPermiss.rcode= e.value.code
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _admUserPermiss = { ...admUserPermiss };
        _admUserPermiss[`${name}`] = val;

        setAdmUserPermiss(_admUserPermiss);
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
                        <div className="field col-12 md:col-12">
                            <label htmlFor="code">{translations[selectedLanguage].Username}</label>
                            <InputText id="code"
                                value={props.admUser.username}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Mail}</label>
                            <InputText
                                id="mail"
                                value={props.admUser.mail}
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
                            <label htmlFor="roll">{translations[selectedLanguage].Roll} *</label>
                            <Dropdown id="roll"
                                value={ddRollItem}
                                options={ddRollItems}
                                onChange={(e) => onInputChange(e, "options", 'roll')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admUserPermiss.roll })}
                            />
                            {submitted && !admUserPermiss.roll && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.userPermissTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.userPermissTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.userPermissTip !== 'CREATE') ? (
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
                item={admUserPermiss.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmUserPermiss;
