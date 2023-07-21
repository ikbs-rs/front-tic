import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventattsService } from "../../service/model/TicEventattsService";
import { TicEventattService } from "../../service/model/TicEventattService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const TicEventatts = (props) => {
    //console.log("Props", props)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEventatts, setTicEventatts] = useState(props.ticEventatts);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicEventattsItem, setDdTicEventattsItem] = useState(null);
    const [ddTicEventattsItems, setDdTicEventattsItems] = useState(null);
    const [ticEventattsItem, setTicEventattsItem] = useState(null);
    const [ticEventattsItems, setTicEventattsItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticEventatts.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticEventatts.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticEventattService = new TicEventattService();
                const data = await ticEventattService.getTicEventatts();

                setTicEventattsItems(data)
                //console.log("******************", ticEventattsItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventattsItems(dataDD);
                setDdTicEventattsItem(dataDD.find((item) => item.code === props.ticEventatts.att) || null);
                if (props.ticEventatts.att) {
                    const foundItem = data.find((item) => item.id === props.ticEventatts.att);
                    setTicEventattsItem(foundItem || null);
                    ticEventatts.ctp = foundItem.code
                    ticEventatts.ntp = foundItem.textx
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
            ticEventatts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventatts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticEventattsService = new TicEventattsService();
            const data = await ticEventattsService.postTicEventatts(ticEventatts);
            ticEventatts.id = data
            props.handleDialogClose({ obj: ticEventatts, eventattsTip: props.eventattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventatts ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticEventatts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventatts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const ticEventattsService = new TicEventattsService();

            await ticEventattsService.putTicEventatts(ticEventatts);
            props.handleDialogClose({ obj: ticEventatts, eventattsTip: props.eventattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventatts ",
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
            const ticEventattsService = new TicEventattsService();
            await ticEventattsService.deleteTicEventatts(ticEventatts);
            props.handleDialogClose({ obj: ticEventatts, eventattsTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventatts ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdTicEventattsItem(e.value);
            const foundItem = ticEventattsItems.find((item) => item.id === val);
            setTicEventattsItem(foundItem || null);
            ticEventatts.ntp = e.value.name
            ticEventatts.ctp = foundItem.code
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            console.log(dateVal, "***********************************")
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //ticEventatts.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //ticEventatts.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        console.log(ticEventatts, "*****************ticEventatts******************")
        let _ticEventatts = { ...ticEventatts };
        _ticEventatts[`${name}`] = val;
        console.log(ticEventatts, "*****************_ticEventatts******************")
        setTicEventatts(_ticEventatts);
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
                                value={props.ticEvent.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.ticEvent.text}
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
                            <label htmlFor="att">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="att"
                                value={ddTicEventattsItem}
                                options={ddTicEventattsItems}
                                onChange={(e) => onInputChange(e, "options", 'att')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventatts.att })}
                            />
                            {submitted && !ticEventatts.att && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="value">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="value"
                                value={ticEventatts.value} onChange={(e) => onInputChange(e, "text", 'value')}
                            />
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
                            {(props.eventattsTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.eventattsTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.eventattsTip !== 'CREATE') ? (
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
                inTicEventatts="delete"
                item={ticEventatts.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEventatts;
