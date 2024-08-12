import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicDocdiscountService } from '../../service/model/TicDocdiscountService.js';
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from '../../configs/translations';
import { InputTextarea } from 'primereact/inputtextarea';


const TicDocdiscount = (props) => {
    console.log(props, "9999999999999999999999999999999999999999999999999");
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [ticDocdiscount, setTicDocdiscount] = useState(props.ticDocdiscount);
    const [submitted, setSubmitted] = useState(false);

    const [ddTicDocdiscountItem, setDdTicDocdiscountItem] = useState(null);
    const [ddTicDocdiscountItems, setDdTicDocdiscountItems] = useState(null);
    const [ticDocdiscountItem, setTicDocdiscountItem] = useState(null);
    const [ticDocdiscountItems, setTicDocdiscountItems] = useState(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];
    const linktpValues = [
        { name: `${translations[selectedLanguage].No_connection}`, code: '0' },
        { name: `${translations[selectedLanguage].Paymenttp}`, code: '1' },
        { name: `${translations[selectedLanguage].Sales_channels}`, code: '2' }
        //  { name: 'Option 3', code: '3' }
    ];


    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocdiscountService = new TicDocdiscountService();
                const data = await ticDocdiscountService.getDiscounttpLista(props.ticDoc.id);
                // console.log(data, "###############################################")
                setTicDocdiscountItems(data)

                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                setDdTicDocdiscountItems(dataDD);
                setDdTicDocdiscountItem(dataDD.find((item) => item.code === props.ticDocdiscount.discount) || null);
                if (props.ticDocdiscount.tp) {
                    const foundItem = data.find((item) => item.id === props.ticDocdiscount.discount);
                    setTicDocdiscountItem(foundItem || null);
                    ticDocdiscount.ctp = foundItem.code
                    ticDocdiscount.ntp = foundItem.text
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            console.log(ticDocdiscount, "01-55555555555555555555555555555555555555555555####")
            const ticDocdiscountService = new TicDocdiscountService();
            const data = await ticDocdiscountService.postTicDocdiscount(ticDocdiscount);
            ticDocdiscount.id = data;
            props.handleDialogClose({ obj: ticDocdiscount, docdiscountTip: props.docdiscountTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                detail: `${err.response.data.error}`,
                life: 1000
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const ticDocdiscountService = new TicDocdiscountService();
            await ticDocdiscountService.putTicDocdiscount(ticDocdiscount);
            props.handleDialogClose({ obj: ticDocdiscount, docdiscountTip: props.docdiscountTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                detail: `${err.response.data.error}`,
                life: 1000
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const ticDocdiscountService = new TicDocdiscountService();
            await ticDocdiscountService.deleteTicDocdiscount(ticDocdiscount);
            props.handleDialogClose({ obj: ticDocdiscount, docdiscountTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                detail: `${err.response.data.error}`,
                life: 1000
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = '';
        if (type === 'options') {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == 'discount') {
                setDdTicDocdiscountItem(e.value);
                ticDocdiscount.discount = e.value.code;
                ticDocdiscount.text = e.value.name;
                const foundItem = ticDocdiscountItems.find((item) => item.id == e.value.code);
                ticDocdiscount.postavka = foundItem.condition;
                if (typeof foundItem.condition === 'string' && foundItem.condition.endsWith('%')) {
                    ticDocdiscount.procenat = foundItem.condition.slice(0, -1);
                    ticDocdiscount.iznos = Math.round((foundItem.condition.slice(0, -1)*0.01)*props.karteIznos);
                } else {
                    ticDocdiscount.iznos = foundItem.condition;
                }
            }  else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticDocdiscount = { ...ticDocdiscount };
        _ticDocdiscount[`${name}`] = val;
        if (name === `text`) _ticDocdiscount[`text`] = val;

        setTicDocdiscount(_ticDocdiscount);
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
                        <div className="field col-12 md:col-10">
                            <label htmlFor="discount">{translations[selectedLanguage].Discount} *</label>
                            <Dropdown id="discount"
                                value={ddTicDocdiscountItem}
                                options={ddTicDocdiscountItems}
                                onChange={(e) => onInputChange(e, "options", 'discount')}
                                required
                                optionLabel="name"
                                autoFocus
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocdiscount.discount })}
                            />
                            {submitted && !ticDocdiscount.discount && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="postavka">{translations[selectedLanguage].Postavka}</label>
                            <InputText id="postavka"  value={ticDocdiscount.postavka} 
                             disabled={true}
                            />
                        </div>                        
                        <div className="field col-12 md:col-3">
                            <label htmlFor="eksternibroj">{translations[selectedLanguage].Code}</label>
                            <InputText id="eksternibroj"  value={ticDocdiscount.eksternibroj} 
                            onChange={(e) => onInputChange(e, 'text', 'eksternibroj')} 
                            className={classNames({ 'p-invalid': submitted && !ticDocdiscount.eksternibroj })}
                            />
                            {submitted && !ticDocdiscount.eksternibroj && 
                            <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>
                            }
                        </div>                        
                        <div className="field col-12 md:col-2">
                            <label htmlFor="procenat">{translations[selectedLanguage].Procenat}</label>
                            <InputText id="procenat"  value={ticDocdiscount.procenat} 
                            onChange={(e) => onInputChange(e, 'text', 'procenat')} 
                            className={classNames({ 'p-invalid': submitted && !ticDocdiscount.procenat })}
                            />
                            {submitted && !ticDocdiscount.procenat && 
                            <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>
                            }
                        </div> 
                        <div className="field col-12 md:col-4">
                            <label htmlFor="iznos">{translations[selectedLanguage].Value}</label>
                            <InputText id="iznos"  value={ticDocdiscount.iznos} 
                            onChange={(e) => onInputChange(e, 'text', 'iznos')} 
                            className={classNames({ 'p-invalid': submitted && !ticDocdiscount.iznos })}
                            />
                            {submitted && !ticDocdiscount.iznos && 
                            <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>
                            }
                        </div> 
                    </div>
                    <div className="field col-12 md:col-12">
                        <label htmlFor="opis">{translations[selectedLanguage].Description}</label>
                        <InputTextarea
                            id="opis"
                            rows={5}
                            autoResize
                            style={{ width: '100%' }}
                            // cols={100}
                            value={ticDocdiscount.opis}
                            onChange={(e) => onInputChange(e, 'text', 'opis')}
                        />
                    </div>
                    <div className="field col-12 md:col-12">
                        <label htmlFor="napomena">{translations[selectedLanguage].Napomena}</label>
                        <InputTextarea
                            id="napomena"
                            rows={5}
                            autoResize
                            style={{ width: '100%' }}
                            // cols={100}
                            value={ticDocdiscount.napomena}
                            onChange={(e) => onInputChange(e, 'text', 'napomena')}
                        />
                    </div>                    
                    {/* <InputTextarea value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} /> */}

                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={handleCancelClick} outlined /> : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {props.docdiscountTip === 'CREATE' ? <Button label={translations[selectedLanguage].Create} icon="pi pi-check" onClick={handleCreateClick} severity="success" outlined /> : null}
                            {props.docdiscountTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Delete} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" outlined /> : null}
                            {props.docdiscountTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Save} icon="pi pi-check" onClick={handleSaveClick} severity="success" outlined /> : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog visible={deleteDialogVisible} inAction="delete" item={ticDocdiscount.text} onHide={hideDeleteDialog} onDelete={handleDeleteClick} />
        </div>
    );
};

export default TicDocdiscount;
