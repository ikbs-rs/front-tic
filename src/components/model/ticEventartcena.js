import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventartcenaService } from "../../service/model/TicEventartcenaService";
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

const TicEventartcena = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEventartcena, setTicEventartcena] = useState(props.ticEventartcena);
    const [submitted, setSubmitted] = useState(false);

    const [ddTicEventartcenaItem, setDdTicEventartcenaItem] = useState(null);
    const [ddTicEventartcenaItems, setDdTicEventartcenaItems] = useState(null);
    const [ticEventartcenaItem, setTicEventartcenaItem] = useState(null);
    const [ticEventartcenaItems, setTicEventartcenaItems] = useState(null);

    const [ddTicEventartcenaterrItem, setDdTicEventartcenaterrItem] = useState(null);
    const [ddTicEventartcenaterrItems, setDdTicEventartcenaterrItems] = useState(null);
    const [ticEventartcenaterrItem, setTicEventartcenaterrItem] = useState(null);
    const [ticEventartcenaterrItems, setTicEventartcenaterrItems] = useState(null);

    const [ddTicEventartcenacurrItem, setDdTicEventartcenacurrItem] = useState(null);
    const [ddTicEventartcenacurrItems, setDdTicEventartcenacurrItems] = useState(null);
    const [ticEventartcenacurrItem, setTicEventartcenacurrItem] = useState(null);
    const [ticEventartcenacurrItems, setTicEventartcenacurrItems] = useState(null);

    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticEventartcena.begda || props.ticEventart.begda)));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticEventartcena.endda || props.ticEventart.endda)))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.TIC_BACK_URL}/tic/x/cena/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                setTicEventartcenaItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventartcenaItems(dataDD);
                setDdTicEventartcenaItem(dataDD.find((item) => item.code === props.ticEventartcena.cena) || null);
                if (props.ticEventartcena.cena) {
                    const foundItem = data.find((item) => item.id === props.ticEventartcena.cena);
                    setTicEventartcenaItem(foundItem || null);
                    ticEventartcena.ccena = foundItem.code
                    ticEventartcena.ncena = foundItem.textx
                }

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
                const url = `${env.CMN_BACK_URL}/cmn/x/terr/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                setTicEventartcenaterrItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventartcenaterrItems(dataDD);
                setDdTicEventartcenaterrItem(dataDD.find((item) => item.code === props.ticEventartcena.terr) || null);
                if (props.ticEventartcena.terrv) {
                    const foundItem = data.find((item) => item.id === props.ticEventartcena.terr);
                    setTicEventartcenaterrItem(foundItem || null);
                    ticEventartcena.cterr = foundItem.code
                    ticEventartcena.vterr = foundItem.textx
                }

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
                const url = `${env.CMN_BACK_URL}/cmn/x/curr/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                setTicEventartcenacurrItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventartcenacurrItems(dataDD);
                setDdTicEventartcenacurrItem(dataDD.find((item) => item.code === props.ticEventartcena.curr) || null);
                if (props.ticEventartcena.curr) {
                    const foundItem = data.find((item) => item.id === props.ticEventartcena.curr);
                    setTicEventartcenacurrItem(foundItem || null);
                    ticEventartcena.ccurr = foundItem.code
                    ticEventartcena.ncurr = foundItem.textx
                }

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
            ticEventartcena.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventartcena.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticEventartcenaService = new TicEventartcenaService();
            const data = await ticEventartcenaService.postTicEventartcena(ticEventartcena);
            ticEventartcena.id = data
            props.handleDialogClose({ obj: ticEventartcena, eventartcenaTip: props.eventartcenaTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventartcena ",
                detail: `${err.response.data.error}`,
                life: 2000,
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            ticEventartcena.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventartcena.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticEventartcenaService = new TicEventartcenaService();
            const newTicEventobj = { ...ticEventartcena, id: null };
            const data = await ticEventartcenaService.postTicEventartcena(newTicEventobj);
            ticEventartcena.id = data;
            props.handleDialogClose({ obj: ticEventartcena, eventartcenaTip: "CREATE" });
            ticEventartcena.cena = 0;
            //props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventartcena ",
                detail: `${err.response.data.error}`,
                life: 2000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticEventartcena.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventartcena.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticEventartcenaService = new TicEventartcenaService();

            await ticEventartcenaService.putTicEventartcena(ticEventartcena);
            props.handleDialogClose({ obj: ticEventartcena, eventartcenaTip: props.eventartcenaTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventartcena ",
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
            const ticEventartcenaService = new TicEventartcenaService();
            await ticEventartcenaService.deleteTicEventartcena(ticEventartcena);
            props.handleDialogClose({ obj: ticEventartcena, eventartcenaTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventartcena ",
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
                case "cena":
                    setDdTicEventartcenaItem(e.value);
                    foundItem = ticEventartcenaItems.find((item) => item.id === val);
                    setTicEventartcenaItem(foundItem || null);
                    ticEventartcena.ncena = e.value.name
                    ticEventartcena.ccena = foundItem.code
                    break;
                case "terr":
                    setDdTicEventartcenaterrItem(e.value);
                    foundItem = ticEventartcenaterrItems.find((item) => item.id === val);
                    setTicEventartcenaterrItem(foundItem || null);
                    ticEventartcena.nterr = e.value.name
                    ticEventartcena.cterr = foundItem.code
                    break;
                case "curr":
                    setDdTicEventartcenacurrItem(e.value);
                    foundItem = ticEventartcenacurrItems.find((item) => item.id === val);
                    setTicEventartcenacurrItem(foundItem || null);
                    ticEventartcena.ncurr = e.value.name
                    ticEventartcena.ccurr = foundItem.code
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    break;
                case "endda":
                    setEndda(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticEventartcena = { ...ticEventartcena };
        _ticEventartcena[`${name}`] = val;
        setTicEventartcena(_ticEventartcena);
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
                        <div className="field col-12 md:col-5">
                            <label htmlFor="cena">{translations[selectedLanguage].Cena} *</label>
                            <Dropdown id="cena"
                                value={ddTicEventartcenaItem}
                                options={ddTicEventartcenaItems}
                                onChange={(e) => onInputChange(e, "options", 'cena')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventartcena.cena })}
                            />
                            {submitted && !ticEventartcena.cena && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="terr">{translations[selectedLanguage].Terr} *</label>
                            <Dropdown id="terr"
                                value={ddTicEventartcenaterrItem}
                                options={ddTicEventartcenaterrItems}
                                onChange={(e) => onInputChange(e, "options", 'terr')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventartcena.terr })}
                            />
                            {submitted && !ticEventartcena.terr && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="curr">{translations[selectedLanguage].Curr} *</label>
                            <Dropdown id="curr"
                                value={ddTicEventartcenacurrItem}
                                options={ddTicEventartcenacurrItems}
                                onChange={(e) => onInputChange(e, "options", 'curr')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventartcena.curr })}
                            />
                            {submitted && !ticEventartcena.curr && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="value">{translations[selectedLanguage].Value} *</label>
                            <InputText id="value"
                                value={ticEventartcena.value}
                                onChange={(e) => onInputChange(e, 'text', 'value')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEventartcena.value })}
                            />
                            {submitted && !ticEventartcena.value && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar
                                value={begda}
                                onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />

                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
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
                            {(props.eventartcenaTip === 'CREATE') ? (
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
                            {(props.eventartcenaTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.eventartcenaTip !== 'CREATE') ? (
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
                inTicEventartcena="delete"
                item={ticEventartcena.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEventartcena;
