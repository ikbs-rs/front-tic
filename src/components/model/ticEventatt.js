import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventattService } from '../../service/model/TicEventattService';
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from '../../configs/translations';

const TicEventatt = (props) => {
    console.log(props);
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [ticEventatt, setTicEventatt] = useState(props.ticEventatt);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnInputtp, setDdCmnInputtpItem] = useState(null);
    const [ddCmnInputtps, setDdCmnInputtpItems] = useState(null);
    const [cmnInputtpItem, setCmnInputtpItem] = useState(null);
    const [cmnInputtpItems, setCmnInputtpItems] = useState(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticEventatt.valid));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticEventattService = new TicEventattService();
                const data = await ticEventattService.getCmnInputtps();

                setCmnInputtpItems(data);
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnInputtpItems(dataDD);
                setDdCmnInputtpItem(dataDD.find((item) => item.code === props.ticEventatt.inputtp) || null);
                if (props.ticEventatt.att) {
                    const foundItem = data.find((item) => item.id === props.ticEventatt.inputtp);
                    setCmnInputtpItem(foundItem || null);
                    ticEventatt.ctp = foundItem.code;
                    ticEventatt.ntp = foundItem.textx;
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
            const ticEventattService = new TicEventattService();
            const data = await ticEventattService.postTicEventatt(ticEventatt);
            ticEventatt.id = data;
            props.handleDialogClose({ obj: ticEventatt, eventattTip: props.eventattTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const ticEventattService = new TicEventattService();
            await ticEventattService.putTicEventatt(ticEventatt);
            props.handleDialogClose({ obj: ticEventatt, eventattTip: props.eventattTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
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
            const ticEventattService = new TicEventattService();
            await ticEventattService.deleteTicEventatt(ticEventatt);
            props.handleDialogClose({ obj: ticEventatt, eventattTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = '';
        if (type === 'options') {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == 'inputtp') {
                setDdCmnInputtpItem(e.value);
                ticEventatt.cinputtp = e.value.code;
                ticEventatt.ninputtp = e.value.name;
            } else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticEventatt = { ...ticEventatt };
        _ticEventatt[`${name}`] = val;
        if (name === `textx`) _ticEventatt[`text`] = val;

        setTicEventatt(_ticEventatt);
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
                        <div className="field col-12 md:col-7">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus value={ticEventatt.code} onChange={(e) => onInputChange(e, 'text', 'code')} required className={classNames({ 'p-invalid': submitted && !ticEventatt.code })} />
                            {submitted && !ticEventatt.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText id="textx" value={ticEventatt.textx} onChange={(e) => onInputChange(e, 'text', 'textx')} required className={classNames({ 'p-invalid': submitted && !ticEventatt.textx })} />
                            {submitted && !ticEventatt.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="inputtp">{translations[selectedLanguage].inputtp} *</label>
                            <Dropdown
                                id="inputtp"
                                value={ddCmnInputtp}
                                options={ddCmnInputtps}
                                onChange={(e) => onInputChange(e, 'options', 'inputtp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventatt.inputtp })}
                            />
                            {submitted && !ticEventatt.inputtp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="ddlist">{translations[selectedLanguage].ddlist}</label>
                            <InputText 
                                id="ddlist" 
                                value={ticEventatt.ddlist} 
                                onChange={(e) => onInputChange(e, 'text', 'ddlist')} 
                                />
                        </div>                        
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown
                                id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, 'options', 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventatt.valid })}
                            />
                            {submitted && !ticEventatt.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={handleCancelClick} outlined /> : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {props.eventattTip === 'CREATE' ? <Button label={translations[selectedLanguage].Create} icon="pi pi-check" onClick={handleCreateClick} severity="success" outlined /> : null}
                            {props.eventattTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Delete} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" outlined /> : null}
                            {props.eventattTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Save} icon="pi pi-check" onClick={handleSaveClick} severity="success" outlined /> : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog visible={deleteDialogVisible} inAction="delete" item={ticEventatt.text} onHide={hideDeleteDialog} onDelete={handleDeleteClick} />
        </div>
    );
};

export default TicEventatt;
