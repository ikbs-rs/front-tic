import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicDocpaymentService } from "../../service/model/TicDocpaymentService";
import { TicDocService } from "../../service/model/TicDocService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import AllSecurePaymentJSForm from '../custom/AllSecurePaymentJSForm';

const TicDocpayment = (props) => {
// console.log(props, "* 00 **HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH**************TicDocpayment***********************")
// console.log("---AllSecurePaymentJSForm useEffect v1 ---")
    
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticDocpayment, setTicDocpayment] = useState(props.ticDocpayment);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnPaymenttpItem, setDdCmnPaymenttpItem] = useState(null);
    const [ddCmnPaymenttpItems, setDdCmnPaymenttpItems] = useState(null);
    const [cmnPaymenttpItem, setCmnPaymenttpItem] = useState(null);
    const [cmnPaymenttpItems, setCmnPaymenttpItems] = useState(null);

    const [ddCmnCcardItem, setDdCmnCcardItem] = useState(null);
    const [ddCmnCcardItems, setDdCmnCcardItems] = useState(null);
    const [cmnCcardItem, setCmnCcardItem] = useState(null);
    const [cmnCcardItems, setCmnCcardItems] = useState(null);    
    const [zbirzbirniiznos, setZbirniiznos] = useState(null); 

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocpaymentService = new TicDocpaymentService();
                const data = await ticDocpaymentService.getCmnPaymenttpsP('cmn_paymenttp_p');

                setCmnPaymenttpItems(data)
                const pPaymentTp = props.ticDocpayment.paymenttp||props.paymentTip
                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                console.log(data,  "H**HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", dataDD)
                setDdCmnPaymenttpItems(dataDD);
                setDdCmnPaymenttpItem(dataDD.find((item) => item.code == pPaymentTp) || null);
                ticDocpayment.paymenttp = props.ticDocpayment.paymenttp||props.paymentTip
                if (props.ticDocpayment.paymenttp||props.paymentTip) {
                    const foundItem = data.find((item) => item.id === pPaymentTp);
                    // console.log("******************777777777777777777777777777777777777777", foundItem)
                    setCmnPaymenttpItem(foundItem || null);
                    ticDocpayment.paymenttp = props.ticDocpayment.paymenttp||props.paymentTip
                    ticDocpayment.begda = foundItem.begda
                    ticDocpayment.npaymenttp = foundItem.textx
                    ticDocpayment.cpaymenttp = foundItem.code
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
                const ticDocpaymentService = new TicDocpaymentService();
                const data = await ticDocpaymentService.getCmnCcards();

                setCmnCcardItems(data)
                

                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                console.log(dataDD, "**************33333333333333333333333333333333****", data)
                setDdCmnCcardItems(dataDD);
                setDdCmnCcardItem(dataDD.find((item) => item.code === props.ticDocpayment.ccard) || null);
                if (props.ticDocpayment.ccard) {
                    const foundItem = data.find((item) => item.id === props.ticDocpayment.ccard);
                    setCmnCcardItem(foundItem || null);
                    ticDocpayment.begda = foundItem.begda
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
                const ticDocService = new TicDocService();
                const data = await ticDocService.getDocZbirniiznosP(props.ticDoc?.id);
                console.log(data, "444444444444444444444444444444444444444444444444444444444444444444444444444")
                setZbirniiznos(data.iznos)
                ticDocpayment.amount =data.iznos
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [props.ticDoc?.id]);      
    // Autocomplit>

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticDocpayment.doc=props.ticDoc.id;
            const ticDocpaymentService = new TicDocpaymentService();
            const data = await ticDocpaymentService.postTicDocpayment(ticDocpayment);
            ticDocpayment.id = data
            // props.setActiveIndex(0)
            props.handleDialogClose({ obj: ticDocpayment, docpaymentTip: props.docpaymentTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocpayment ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            const ticDocpaymentService = new TicDocpaymentService();

            await ticDocpaymentService.putTicDocpayment(ticDocpayment);
            props.handleDialogClose({ obj: ticDocpayment, docpaymentTip: props.docpaymentTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocpayment ",
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
            const ticDocpaymentService = new TicDocpaymentService();
            await ticDocpaymentService.deleteTicDocpayment(ticDocpayment);
            props.handleDialogClose({ obj: ticDocpayment, docpaymentTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocpayment ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const   onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "paymenttp") {
                setDdCmnPaymenttpItem(e.value);
                const foundItem = cmnPaymenttpItems.find((item) => item.id === val);
                console.log(foundItem, "99999999999HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
                setCmnPaymenttpItem(foundItem || null);
                ticDocpayment.paymenttp = val
                // ticDocpayment.text = e.value.name
                ticDocpayment.cpaymenttp = foundItem.code
                ticDocpayment.npaymenttp = foundItem.textx  
            } else if (name == "ccard") {
                setDdCmnCcardItem(e.value);
                const foundItem = cmnCcardItems.find((item) => item.id === val);
                setCmnCcardItem(foundItem || null);                
            // }else {
            //     setDropdownItem(e.value);
            }            
                      
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticDocpayment = { ...ticDocpayment };
        _ticDocpayment[`${name}`] = val;

        setTicDocpayment(_ticDocpayment);
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
                            <label htmlFor="code">{translations[selectedLanguage].Transaction}</label>
                            <InputText id="code"
                                value={props.ticDocpayment.id}
                                disabled={true}
                            />
                        </div>
                        {/* <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.ticDocpayment.text}
                                disabled={true}
                            />
                        </div> */}
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="paymenttp">{translations[selectedLanguage].Paymenttp} *</label>
                            <Dropdown id="paymenttp"
                                value={ddCmnPaymenttpItem}
                                options={ddCmnPaymenttpItems}
                                onChange={(e) => onInputChange(e, "options", 'paymenttp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocpayment.paymenttp })}
                            />
                            {submitted && !ticDocpayment.paymenttp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="amount">{translations[selectedLanguage].Amount} *</label>
                            <InputText
                                id="amount"
                                value={ticDocpayment.amount||zbirzbirniiznos} onChange={(e) => onInputChange(e, "text", 'amount')}
                            />
                        </div>
                    </div>
                    {props.paymentTip=='2' ? (
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                        {/* <p>AllSecurePaymentJSForm</p> */}
                        {/* <AllSecurePaymentJSForm transactionId={props?.ticDoc?.id}/> */}

                            {/* <label htmlFor="ccard">{translations[selectedLanguage].ccard} *</label>
                            <Dropdown id="ccard"
                                value={ddCmnCcardItem}
                                options={ddCmnCcardItems}
                                onChange={(e) => onInputChange(e, "options", 'ccard')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocpayment.ccard })}
                            />
                            {submitted && !ticDocpayment.ccard && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>} */}
                        </div>
                    </div> 
                    ):null  }                 
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
                            {(props.docpaymentTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                       {/*      {(props.docpaymentTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.docpaymentTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Save}
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}*/}
                        </div>
                    </div> 
                </div>
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inTicDocpayment="delete"
                item={ticDocpayment.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicDocpayment;
