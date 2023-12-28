import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventartService } from '../../service/model/TicEventartService';
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from '../../configs/translations';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import DateFunction from '../../utilities/DateFunction';
import env from '../../configs/env';
import axios from 'axios';
import Token from '../../utilities/Token';
import TicArtL from './ticArtL';
import { Dialog } from 'primereact/dialog';

const TicEventart = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEventart, setTicEventart] = useState(props.ticEventart);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicEventartItem, setDdTicEventartItem] = useState(null);
    const [ddTicEventartItems, setDdTicEventartItems] = useState(null);
    const [ticEventartItem, setTicEventartItem] = useState(null);
    const [ticEventartItems, setTicEventartItems] = useState(null);

    const [ticArtLVisible, setTicArtLVisible] = useState(false);
    const [ticArtRemoteLVisible, setTicArtRemoteLVisible] = useState(false);
    const [ticArt, setTicArt] = useState(null);
    const [showMyComponent, setShowMyComponent] = useState(true);
    
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticEventart.begda || props.ticEvent.begda)));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticEventart.endda || props.ticEvent.endda)));

    const calendarRef = useRef(null);

    const toast = useRef(null);

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const url = `${env.TIC_BACK_URL}/tic/x/art/?sl=${selectedLanguage}`;
    //             const tokenLocal = await Token.getTokensLS();
    //             const headers = {
    //                 Authorization: tokenLocal.token
    //             };

    //             const response = await axios.get(url, { headers });
    //             const data = response.data.items;
    //             setTicEventartItems(data);
    //             const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
    //             setDdTicEventartItems(dataDD);
    //             setDdTicEventartItem(dataDD.find((item) => item.code === props.ticEventart.art) || null);
    //             if (props.ticEventart.art) {
    //                 const foundItem = data.find((item) => item.id === props.ticEventart.art);
    //                 setTicEventartItem(foundItem || null);
    //                 ticEventart.cart = foundItem.code;
    //                 ticEventart.nart = foundItem.textx;
    //             }
    //         } catch (error) {
    //             console.error(error);
    //             // Obrada greške ako je potrebna
    //         }
    //     }
    //     fetchData();
    // }, []);
    // Autocomplit>

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticEventart.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventart.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticEventartService = new TicEventartService();
            const data = await ticEventartService.postTicEventart(ticEventart);
            ticEventart.id = data;
            props.handleDialogClose({ obj: ticEventart, eventartTip: props.eventartTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'TicEventart ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            ticEventart.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventart.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const ticEventartService = new TicEventartService();
            const newTicEventobj = { ...ticEventart, id: null, products: {} };

            const data = await ticEventartService.postTicEventart(newTicEventobj);
            newTicEventobj.id = data;

            props.handleDialogClose({ obj: newTicEventobj, eventartTip: "CREATE" });
            //props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventobj ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticEventart.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventart.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticEventartService = new TicEventartService();

            await ticEventartService.putTicEventart(ticEventart);
            props.handleDialogClose({ obj: ticEventart, eventartTip: props.eventartTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'TicEventart ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const ticEventartService = new TicEventartService();
            await ticEventartService.deleteTicEventart(ticEventart);
            props.handleDialogClose({ obj: ticEventart, eventartTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'TicEventart ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };
/************************************ */

const setTicArtRemoteDialog = () => {
    setTicArtRemoteLVisible(true);
};

const setTicArtDialog = (destination) => {
    setTicArtLVisible(true);
};

const handleArtClick = async (e, destination) => {
    try {
        if (destination === 'local') setTicArtDialog();
        else setTicArtRemoteDialog();
    } catch (error) {
        console.error(error);
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch ticArt data',
            life: 3000
        });
    }
};
const handleTicArtLDialogClose = (newObj) => {
    console.log(newObj, "11111111111111111111111111111111qqq1111111111111111111111111111111", newObj)
    setTicArt(newObj);
    let _ticEventart = {...ticEventart}
    _ticEventart.art = newObj.id;
    _ticEventart.nart = newObj.text;
    _ticEventart.cart = newObj.code;   
    //ticEventart.price = newObj.price;
    //ticEventart.loc = newObj.loc1;
    setTicEventart(_ticEventart)
    //ticEventart.potrazuje = newObj.cena * ticEventart.output;
    setTicArtLVisible(false);
};
/************************************ */
    const onInputChange = (e, type, name, a) => {
        let val = '';

        if (type === 'options') {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdTicEventartItem(e.value);
            const foundItem = ticEventartItems.find((item) => item.id === val);
            setTicEventartItem(foundItem || null);
            ticEventart.nart = e.value.name;
            ticEventart.cart = foundItem.code;
        } else if (type === 'Calendar') {
            //const dateVal = DateFunction.dateGetValue(e.value);
            console.log(e.value, "**************")
            val = (e.target && e.target.value) || '';
            switch (name) {

                case 'begda':
                    setBegda(e.value);
                    break;
                case 'endda':
                    setEndda(e.value);
                    break;
                default:
                    console.error('Pogresan naziv polja');
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticEventart = { ...ticEventart };
        _ticEventart[`${name}`] = val;
        setTicEventart(_ticEventart);
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
                            <InputText id="code" value={props.ticEvent.code} disabled={true} />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText id="text" value={props.ticEvent.text} disabled={true} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="cart">{translations[selectedLanguage].cart}</label>
                            <div className="p-inputgroup flex-1">
                                <InputText id="cart" value={ticEventart.cart}
                                    onChange={(e) => onInputChange(e, 'text', 'cart')}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !ticEventart.cart })} />
                                <Button icon="pi pi-search" onClick={(e) => handleArtClick(e, 'local')} className="p-button" />
                                {/*<Button icon="pi pi-search" onClick={(e) => handleArtClick(e, 'remote')} className="p-button-success" />*/}
                            </div>
                            {submitted && !ticEventart.cart && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="nart">{translations[selectedLanguage].nart}</label>
                            <InputText id="nart" 
                                value={ticEventart.nart} 
                                onChange={(e) => onInputChange(e, 'text', 'nart')} 
                                required 
                                className={classNames({ 'p-invalid': submitted && !ticEventart.nart })} 
                            />
                            {submitted && !ticEventart.nart && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        {/* <div className="field col-12 md:col-7">
                            <label htmlFor="art">{translations[selectedLanguage].Art} *</label>
                            <Dropdown
                                id="art"
                                value={ddTicEventartItem}
                                options={ddTicEventartItems}
                                onChange={(e) => onInputChange(e, 'options', 'art')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventart.art })}
                            />
                            {submitted && !ticEventart.art && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div> */}
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="discount">{translations[selectedLanguage].discount} *</label>
                            <InputText id="discount" value={ticEventart.discount} onChange={(e) => onInputChange(e, 'text', 'discount')} required className={classNames({ 'p-invalid': submitted && !ticEventart.discount })} />
                            {submitted && !ticEventart.discount && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="descript">{translations[selectedLanguage].Description}</label>
                            <InputText id="descript" value={ticEventart.descript} onChange={(e) => onInputChange(e, 'text', 'descript')} />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar value={begda} onChange={(e) => onInputChange(e, 'Calendar', 'begda', this)} showIcon dateFormat="dd.mm.yy" />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                            <Calendar value={endda} onChange={(e) => onInputChange(e, 'Calendar', 'endda')} showIcon dateFormat="dd.mm.yy" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={handleCancelClick} outlined /> : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {props.eventartTip === 'CREATE' ?
                                <>
                                    <Button label={translations[selectedLanguage].Create}
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
                                : null}
                            {props.eventartTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Delete} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" outlined /> : null}
                            {props.eventartTip !== 'CREATE' ?
                                <>
                                    <Button label={translations[selectedLanguage].Save}
                                        icon="pi pi-check"
                                        onClick={handleSaveClick}
                                        severity="success"
                                        outlined />
                                    <Button label={translations[selectedLanguage].AddNew}
                                        icon="pi pi-check"
                                        onClick={handleCreateAndAddNewClick}
                                        severity="success"
                                        outlined />
                                </>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog visible={deleteDialogVisible} inTicEventart="delete" item={ticEventart.roll} onHide={hideDeleteDialog} onDelete={handleDeleteClick} />
            <Dialog
                header={translations[selectedLanguage].ArtList}
                visible={ticArtLVisible}
                style={{ width: '90%', height: '1400px' }}
                onHide={() => {
                    setTicArtLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticArtLVisible &&
                    <TicArtL
                        parameter={'inputTextValue'}
                        ticEventart={ticEventart}
                        ticEvent={props.ticEvent}
                        onTaskComplete={handleTicArtLDialogClose}
                        setTicArtLVisible={setTicArtLVisible}
                        dialog={true}
                        lookUp={true}
                    />}
            </Dialog>
        </div>
    );
};

export default TicEventart;
