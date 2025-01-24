import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicLoclinkService } from "../../service/model/TicLoclinkService.js";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog.js';
import { translations } from "../../configs/translations.js";
import { Dropdown } from 'primereact/dropdown';
//import { TicLoclinkService } from "../../service/model/CmnObjattService"
import { InputSwitch } from "primereact/inputswitch";
import env from "../../configs/env.js"
import axios from 'axios';
import Token from "../../utilities/Token.js";
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction.js"
import CmnLocL from './cmn/cmnLocL';
import { Dialog } from 'primereact/dialog';

const TicLoclink = (props) => {
    console.log(props, "@@@@@********************TicLoclink********************")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticLoclink, setTicLoclink] = useState(props.ticLoclink);
    const [submitted, setSubmitted] = useState(false);
    const [cmnLoctpItem, setCmnLoctp1Item] = useState(null);
    const [cmnLoctp1Items, setCmnLoctp1Items] = useState(null);
    const [cmnLoc1Item, setCmnLoc1Item] = useState(null);
    const [cmnLoc1Items, setCmnLoc1Items] = useState(null);
    const [ddLocTp1Item, setDdLocTp1Item] = useState(props.cmnLoctpId);
    const [ddLocTp1Items, setDdLocTp1Items] = useState(null);
    const [ddLoc1Item, setDdLoc1Item] = useState(null);
    const [ddLoc1Items, setDdLoc1Items] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticLoclink.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticLoclink.endda || '99991231')))
    const [onoff, setOnoff] = useState(props.ticLoclink.onoff == 1);
    const [hijerarhija, setHijerarhija] = useState(props.ticLoclink.hijerarhija == 1);

    const [cmnLocLVisible, setCmnLocLVisible] = useState(false);
    const [cmnLocRemoteLVisible, setCmnLocRemoteLVisible] = useState(false);
    const [cmnLoc, setCmnLoc] = useState(null);
    const [showMyComponent, setShowMyComponent] = useState(true);

    const calendarRef = useRef(null);
    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.CMN_BACK_URL}/cmn/x/loctp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;

                const loctpID = props.ticLoclink.loctp1 == null ? props.cmnLoctpId : props.ticLoclink.loctp1
                setCmnLoctp1Items(data);
                const _cmnLoctp1 = data.find((item) => item.id === loctpID) || null
                // console.log(_cmnLoctp1,"####################################################################################", data)
                setCmnLoctp1Item(_cmnLoctp1);

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdLocTp1Items(dataDD);
                setDdLocTp1Item(dataDD.find((item) => item.code === loctpID) || null);
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
                //const tp = ticLoclink.loctp1 || -1
                const tp = ticLoclink.loctp1 == null ? props.cmnLoctpId : ticLoclink.loctp1
                const url = `${env.CMN_BACK_URL}/cmn/x/loc/getall/tp/${tp}/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };
                const response = await axios.get(url, { headers });
                const data = response.data.item;
                setCmnLoc1Items(data);
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdLoc1Items(dataDD);
                setDdLoc1Item(dataDD.find((item) => item.code === props.ticLoclink.loc1) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [ticLoclink.loctp1, props.cmnLoctpId]);
    // Autocomplit>

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            setSubmitted(true);
            ticLoclink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticLoclink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const ticLoclinkService = new TicLoclinkService();
            const data = await ticLoclinkService.postTicLoclink(ticLoclink);
            ticLoclink.id = data
            props.handleDialogClose({ obj: ticLoclink, loclinkTip: props.loclinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicLoclink ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            setSubmitted(true);
            ticLoclink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticLoclink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const ticLoclinkService = new TicLoclinkService();
            const data = await ticLoclinkService.postTicLoclink(ticLoclink);
            ticLoclink.id = data;

            // Očisti ticLoclink.id i ticLoclink.loc1
            const newTicLoclink = { ...ticLoclink, id: null, loc1: null };
            setDdLoc1Item(null)

            props.handleDialogClose({ obj: newTicLoclink, loclinkTip: props.loclinkTip });
            // Ne postavljaj setVisible(false) kako bi ostao otvoren za dodavanje novog unosa
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicLoclink ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {


            ticLoclink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticLoclink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticLoclinkService = new TicLoclinkService();

            await ticLoclinkService.putTicLoclink(ticLoclink);
            props.handleDialogClose({ obj: ticLoclink, loclinkTip: props.loclinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicLoclink ",
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
            const ticLoclinkService = new TicLoclinkService();
            await ticLoclinkService.deleteTicLoclink(ticLoclink);
            props.handleDialogClose({ obj: ticLoclink, loclinkTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicLoclink ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };
/*********************************************************** */
    const setCmnLocRemoteDialog = () => {
        setCmnLocRemoteLVisible(true);
    };
    
    const setCmnlocDialog = (destination) => {
        setCmnLocLVisible(true);
    };
    
    const handleLocClick = async (e, destination) => {
        try {
            if (destination === 'local') setCmnlocDialog();
            else setCmnLocRemoteDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch cmnLoc data',
                life: 3000
            });
        }
    };

    const handleCmnLocLDialogClose = (newObj) => {
        console.log(newObj, "11111111111111111111111111111111qqq1111111111111111111111111111111", newObj)
        setCmnLoc(newObj);
        let _ticLoclink = {...ticLoclink}
        _ticLoclink.loc1 = newObj.id;
        _ticLoclink.nloc1 = newObj.text;
        _ticLoclink.cloc1 = newObj.code;   
        ticLoclink.loc1 = newObj.id;
        ticLoclink.nloc1 = newObj.text;
        ticLoclink.cloc1 = newObj.code; 
        //ticEventart.price = newObj.price;
        //ticEventart.loc = newObj.loc1;
        setTicLoclink(_ticLoclink)
        //ticEventart.potrazuje = newObj.cena * ticEventart.output;
        setCmnLocLVisible(false);
    };    
/************************************************************ */
    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            let foundItem = null
            val = (e.target && e.target.value && e.target.value.code) || '';
            switch (name) {
                case "loctp1":
                    setDdLocTp1Item(e.value);
                    foundItem = cmnLoctp1Items.find((item) => item.id === val);
                    setCmnLoctp1Item(foundItem || null);
                    ticLoclink.cloctp1 = foundItem.code
                    ticLoclink.nloctp1 = e.value.name
                    break;
                case "loc1":
                    setDdLoc1Item(e.value);
                    foundItem = cmnLoc1Items.find((item) => item.id === val);
                    setCmnLoc1Item(foundItem || null);
                    ticLoclink.cloc1 = foundItem.code
                    ticLoclink.nloc1 = e.value.name
                    ticLoclink.cloctp1 = ticLoclink.cloctp1||props.loctpCode
                    ticLoclink.nloctp1 = ticLoclink.nloctp1||cmnLoctpItem.text
                    
                    break;
                default:
                    console.error("Pogresan naziv options polja")
            }
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    ticLoclink.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    ticLoclink.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
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
        let _ticLoclink = { ...ticLoclink };
        _ticLoclink[`${name}`] = val;
        console.log(_ticLoclink, "--------------------------name------------------------------", name)
        setTicLoclink(_ticLoclink);
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
                                value={props.ticEventloc.cloc}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={props.ticEventloc.textx}
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
                            <label htmlFor="loctp1">{translations[selectedLanguage].LoctpText} *</label>
                            <Dropdown id="loctp1"
                                value={ddLocTp1Item}
                                options={ddLocTp1Items}
                                onChange={(e) => onInputChange(e, "options", 'loctp1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticLoclink.loctp1 })}
                            />
                            {submitted && !ticLoclink.loctp1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        <div className="field col-12 md:col-5">
                            <label htmlFor="cloc1">{translations[selectedLanguage].cloc}</label>
                            <div className="p-inputgroup flex-1">
                                <InputText id="cloc1" value={ticLoclink.cloc1}
                                    onChange={(e) => onInputChange(e, 'text', 'cloc1')}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !ticLoclink.cloc1 })} />
                                <Button icon="pi pi-search" onClick={(e) => handleLocClick(e, 'local')} className="p-button" />
                                {/*<Button icon="pi pi-search" onClick={(e) => handleArtClick(e, 'remote')} className="p-button-success" />*/}
                            </div>
                            {submitted && !ticLoclink.cloc1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="nloc1">{translations[selectedLanguage].nloc}</label>
                            <InputText id="nloc1" 
                                value={ticLoclink.nloc1} 
                                onChange={(e) => onInputChange(e, 'text', 'nloc1')} 
                                required 
                                className={classNames({ 'p-invalid': submitted && !ticLoclink.nloc1 })} 
                            />
                            {submitted && !ticLoclink.nloc1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
{/* 
                        <div className="field col-12 md:col-7">
                            <label htmlFor="loc1">{translations[selectedLanguage].LocText} *</label>
                            <Dropdown id="loc1"
                                value={ddLoc1Item}
                                options={ddLoc1Items}
                                onChange={(e) => onInputChange(e, "options", 'loc1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticLoclink.loc1 })}
                            />
                            {submitted && !ticLoclink.loc1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div> 
*/}


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
                </div>
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="val">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="val"
                                value={ticLoclink.val} onChange={(e) => onInputChange(e, "text", 'val')}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
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
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                                <Calendar
                                    value={endda}
                                    onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                    showIcon
                                    dateFormat="dd.mm.yy"
                                />
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
                            {(props.loclinkTip === 'CREATE') ? (
                                <>
                                    <Button
                                        label={translations[selectedLanguage].Create}
                                        icon="pi pi-check"
                                        onClick={handleCreateClick}
                                        severity="success"
                                        outlined
                                    />
                                    <Button
                                        label={translations[selectedLanguage].CreateAndAddNew}
                                        icon="pi pi-plus"
                                        onClick={handleCreateAndAddNewClick}
                                        severity="success"
                                        outlined
                                    />
                                </>
                            ) : null}
                            {(props.loclinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.loclinkTip !== 'CREATE') ? (
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
                inTicLoclink="delete"
                item={ticLoclink.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
            <Dialog
                header={translations[selectedLanguage].LocList}
                visible={cmnLocLVisible}
                style={{ width: '90%', height: '1400px' }}
                onHide={() => {
                    setCmnLocLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {cmnLocLVisible &&
                    <CmnLocL
                        parameter={'inputTextValue'}
                        loctpId={ticLoclink.cloctp1}
                        onTaskComplete={handleCmnLocLDialogClose}
                        setCmnLocLVisible={setCmnLocLVisible}
                        dialog={true}
                        lookUp={true}
                    />}
            </Dialog>            
        </div>
    );
};

export default TicLoclink;
