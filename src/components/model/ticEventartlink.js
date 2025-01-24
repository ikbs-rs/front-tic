import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventartlinkService } from "../../service/model/TicEventartlinkService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";

const TicEventartlink = (props) => {

    // console.log(props, "##########################################################################################################################")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEventartlink, setTicEventartlink] = useState(props.ticEventartlink);
    const [submitted, setSubmitted] = useState(false);

    const [ddTicEventartlinkItem, setDdTicEventartlinkItem] = useState(null);
    const [ddTicEventartlinkItems, setDdTicEventartlinkItems] = useState(null);
    const [ticEventartlinkItem, setTicEventartlinkItem] = useState(null);
    const [ticEventartlinkItems, setTicEventartlinkItems] = useState(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // const url = `${env.TIC_BACK_URL}/tic/x/art/?sl=${selectedLanguage}`;
                const url = `${env.TIC_BACK_URL}/tic/eventart/_v/lista/?stm=tic_eventartulaz_v&objid=${props.ticEventart.event}&sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.item||response.data.items;
                setTicEventartlinkItems(data)
                const dataDD = data.map(({ text, art }) => ({ name: text, code: art }));
                setDdTicEventartlinkItems(dataDD);
                setDdTicEventartlinkItem(dataDD.find((item) => item.code === props.ticEventartlink.art) || null);

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    // Autocomplit>

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);

            const ticEventartlinkService = new TicEventartlinkService();
            const data = await ticEventartlinkService.postTicEventartlink(ticEventartlink);
            ticEventartlink.id = data
            props.handleDialogClose({ obj: ticEventartlink, eventartlinkTip: props.eventartlinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventartlink ",
                detail: `${err.response.data.error}`,
                life: 2000,
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            const ticEventartlinkService = new TicEventartlinkService();
            const newTicEventobj = { ...ticEventartlink, id: null };
            const data = await ticEventartlinkService.postTicEventartlink(newTicEventobj);
            ticEventartlink.id = data;
            props.handleDialogClose({ obj: ticEventartlink, eventartlinkTip: "CREATE" });
            ticEventartlink.art = 0;
            ticEventartlink.id = null;
            //props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventartlink ",
                detail: `${err.response.data.error}`,
                life: 2000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const ticEventartlinkService = new TicEventartlinkService();

            await ticEventartlinkService.putTicEventartlink(ticEventartlink);
            props.handleDialogClose({ obj: ticEventartlink, eventartlinkTip: props.eventartlinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventartlink ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const ticEventartlinkService = new TicEventartlinkService();
            await ticEventartlinkService.deleteTicEventartlink(ticEventartlink);
            props.handleDialogClose({ obj: ticEventartlink, eventartlinkTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventartlink ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        let foundItem = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            switch (name) {
                case "art":
                    setDdTicEventartlinkItem(e.value);
                    foundItem = ticEventartlinkItems.find((item) => item.art === val);
                    setTicEventartlinkItem(foundItem || null);
                    if (foundItem) {
                        ticEventartlink.nart = e.value.name
                        ticEventartlink.cart = foundItem.code
                    }
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticEventartlink = { ...ticEventartlink };
        _ticEventartlink[`${name}`] = val;
        setTicEventartlink(_ticEventartlink);
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
                                value={props.ticEventart.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.ticEventart.text}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-8">
                            <label htmlFor="art">{translations[selectedLanguage].Art} *</label>
                            <Dropdown id="art"
                                value={ddTicEventartlinkItem}
                                options={ddTicEventartlinkItems}
                                onChange={(e) => onInputChange(e, "options", 'art')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventartlink.art })}
                            />
                            {submitted && !ticEventartlink.art && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="value">{translations[selectedLanguage].Value} *</label>
                            <InputText id="value"
                                value={ticEventartlink.value}
                                onChange={(e) => onInputChange(e, 'text', 'value')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEventartlink.value })}
                            />
                            {submitted && !ticEventartlink.value && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.eventartlinkTip === 'CREATE') ? (
                                <>
                                    <Button
                                        label={translations[selectedLanguage].Create}
                                        icon="pi pi-check"
                                        onClick={handleCreateClick}
                                        severity="success"
                                        outlined
                                    />
                                    <Button
                                        label={translations[selectedLanguage].AddNew}
                                        icon="pi pi-check"
                                        onClick={handleCreateAndAddNewClick}
                                        severity="success"
                                        outlined
                                    />
                                </>
                            ) : null}
                            {(props.eventartlinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.eventartlinkTip !== 'CREATE') ? (
                                <>
                                <Button
                                    label={translations[selectedLanguage].Save}
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                                    <Button
                                        label={translations[selectedLanguage].AddNew}
                                        icon="pi pi-check"
                                        onClick={handleCreateAndAddNewClick}
                                        severity="success"
                                        outlined
                                    />                                
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inTicEventartlink="delete"
                item={ticEventartlink.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEventartlink;
