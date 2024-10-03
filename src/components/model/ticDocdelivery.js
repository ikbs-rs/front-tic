import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicDocdeliveryService } from "../../service/model/TicDocdeliveryService";
import { TicDocService } from "../../service/model/TicDocService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"
import { CmnParService } from "../../service/model/cmn/CmnParService";
import CmnPar from "./cmn/cmnPar";
import { Dialog } from 'primereact/dialog';


const TicDocdelivery = (props) => {
    // console.log(props, "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const userId = localStorage.getItem('userId')
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticDocdelivery, setTicDocdelivery] = useState(props.ticDocdelivery);
    const [submitted, setSubmitted] = useState(false);
    const [showMyComponent, setShowMyComponent] = useState(false);
    const [ddCmnSpedicijaItem, setDdCmnSpedicijaItem] = useState(null);
    const [ddCmnSpedicijaItems, setDdCmnSpedicijaItems] = useState(null);
    const [cmnSpedicijaItem, setCmnSpedicijaItem] = useState(null);
    const [cmnSpedicijaItems, setCmnSpedicijaItems] = useState(null);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [cmnPar, setCmnPar] = useState(null);
    const [ticDoc, setTicDoc] = useState(null);
    const [dat, setDate] = useState(new Date(DateFunction.formatJsDate(props.ticDocdelivery.dat || DateFunction.currDate())));
    const [datdelivery, setDatdelivery] = useState(new Date(DateFunction.formatJsDate(props.ticDocdelivery.datdelivery || DateFunction.currDate())));
    const [cmnParVisible, setCmnParVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [openDialog, setOpenDialog] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [zaUplatu, setZauplatu] = useState(0);

    const statusItems = [
        { name: `${translations[selectedLanguage].ForDelivery}`, code: '0' },
        { name: `${translations[selectedLanguage].InDelivery}`, code: '1' },
        { name: `${translations[selectedLanguage].Paid}`, code: '2' },
        { name: `${translations[selectedLanguage].Canceled}`, code: '3' }
    ];
    useEffect(() => {
        async function fetchData() {
          try {
              const ticDocService = new TicDocService();
              const data = await ticDocService.getTicDoc(props.ticDocdelivery?.doc||-1);
              const dataIznos = await ticDocService.getDocZbirniiznos(props.ticDoc?.id);
              setZauplatu(dataIznos.iznos)
              console.log(dataIznos, "B--BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", props.ticDocdelivery?.doc, props.ticDoc?.id)
              setTicDoc(data);
              setRefresh(prev => prev + 1)
          } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
          }
        }
        fetchData();
      }, [props.ticDoc]);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnParService = new CmnParService();
                // console.log(ticDoc, "EXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
                if (ticDoc?.usr) {
                    const data = await cmnParService.getCmnPar(ticDoc?.usr);
                    const [firstname, lastname] = data.textx.split(' ');
                    const _cmnPar = { ...data, firstname: firstname, lastname: lastname }
                    // console.log(_cmnPar, "0000-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", data)
                    setCmnPar(_cmnPar);
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [ticDoc, refresh]);

    useEffect(() => {
        let _ticDocdelivery = { ...ticDocdelivery }
        _ticDocdelivery.adress = ticDocdelivery?.adress || props.cmnPar?.address
        _ticDocdelivery.city = ticDocdelivery?.city || props.cmnPar?.place
        _ticDocdelivery.country = ticDocdelivery?.country || props.cmnPar?.country
        _ticDocdelivery.amount = ticDocdelivery?.amount || ticDoc?.tickettotal
        _ticDocdelivery.tel = ticDocdelivery?.tel || props.cmnPar?.tel
        setTicDocdelivery({ ..._ticDocdelivery })
    }, []);

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticDocdelivery.status));
    }, []);

    useEffect(() => {
        setDropdownItems(statusItems);
    }, []);

    const findDropdownItemByCode = (code) => {
        return statusItems.find((item) => item.code === code) || null;
    };

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocService = new TicDocService();
                const data = await ticDocService.getTicListaByItem('docdelivery', 'listabytxt', 'cmn_spedicija_v', 'aa.code', 'SHP');

                setCmnSpedicijaItems(data)

                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                setDdCmnSpedicijaItems(dataDD);
                setDdCmnSpedicijaItem(dataDD.find((item) => item.code === props.ticDocdelivery.courier) || null);
                if (props.ticDocdelivery.courier) {
                    const foundItem = data.find((item) => item.id === props.ticDocdelivery.courier);
                    setCmnSpedicijaItem(foundItem || null);
                    //ticDocdelivery.begda = foundItem.begda
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
        props.setTicDocdeliveryVisible(false)
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticDocdelivery.dat = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(dat));
            ticDocdelivery.datdelivery = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(datdelivery));
            ticDocdelivery.tmrec = DateFunction.currDatetime();
            ticDocdelivery.usr = userId;

            const ticDocdeliveryService = new TicDocdeliveryService();
            const data = await ticDocdeliveryService.postTicDocdelivery(ticDocdelivery);
            ticDocdelivery.id = data
            props.handleDialogClose({ obj: ticDocdelivery, docdeliveryTip: props.docdeliveryTip });
            props.setVisible(false);
            props.setTicDocdeliveryVisible(false)
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocdelivery ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            // let pTmcour = ""
            // pTmcour = ticDocdelivery.tmcour
            ticDocdelivery.dat = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(dat));
            ticDocdelivery.datdelivery = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(datdelivery));
            const ticDocdeliveryService = new TicDocdeliveryService();
            // console.log(ticDocdelivery, "R--00--RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", pTmcour)
            if (ticDocdelivery.status=='1' && !ticDocdelivery?.tmcour ) {
                //ticDocdelivery = {...ticDocdelivery, tmcour: DateFunction.currDatetime()}
                ticDocdelivery.tmcour = DateFunction.currDatetime();
            }
            if (ticDocdelivery.status>'1' && !ticDocdelivery?.tmbck ) {
                //ticDocdelivery = {...ticDocdelivery, tmcour: DateFunction.currDatetime()}
                ticDocdelivery.tmbck = DateFunction.currDatetime();
            }
            console.log(ticDocdelivery, "R--01--RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
            await ticDocdeliveryService.putTicDocdelivery(ticDocdelivery);
            props.handleDialogClose({ obj: ticDocdelivery, docdeliveryTip: props.docdeliveryTip });
            props.setVisible(false);
            props.setTicDocdeliveryVisible(false)
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocdelivery ",
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
            const ticDocdeliveryService = new TicDocdeliveryService();
            await ticDocdeliveryService.deleteTicDocdelivery(ticDocdelivery);
            props.handleDialogClose({ obj: ticDocdelivery, docdeliveryTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
            props.setTicDocdeliveryVisible(false)
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocdelivery ",
                detail: `${err.response.data.error}`,
                life: 1000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "courier") {
                setDdCmnSpedicijaItem(e.value);
                const foundItem = cmnSpedicijaItems.find((item) => item.id === val);
                setCmnSpedicijaItem(foundItem || null);
                ticDocdelivery.ncourier = e.value.name
                ticDocdelivery.code = foundItem.code
            } else {
                setDropdownItem(e.value);
            }
        } else if (type === "Calendar") {
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "dat":
                    setDate(e.value)
                    break;
                case "datdelivery":
                    setDatdelivery(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticDocdelivery = { ...ticDocdelivery };
        _ticDocdelivery[`${name}`] = val;

        setTicDocdelivery(_ticDocdelivery);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };
    /************************************************************************************ */
    const handleCmnParLDialogClose = (newObj) => {
        setCmnParVisible(false)
    };
    const handleDialogClose = (newObj) => {
        const localObj = { newObj };
    }
    const handleParClick = async (e) => {
        setOpenDialog("PAR")
        setCmnParVisible(true);

    };
    /************************************************************************************ */
    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="code">{translations[selectedLanguage].Transaction}</label>
                            <InputText id="code"
                                value={props.ticDocdelivery?.doc || ticDoc.id}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="npar">{translations[selectedLanguage].npar}</label>
                            <InputText id="npar"
                                value={props.ticDocdelivery?.npar || cmnPar?.textx || ticDoc?.npar}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-2">
                          <Button
                            label={translations[selectedLanguage].Detalj}
                            icon="pi pi-spin pi-cog"
                            className="p-button-warning"
                            onClick={handleParClick}
                            severity="success"
                            raised
                          />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="paymenttp">{translations[selectedLanguage].Courier} *</label>
                            <Dropdown id="courier"
                                value={ddCmnSpedicijaItem}
                                options={ddCmnSpedicijaItems}
                                onChange={(e) => onInputChange(e, "options", 'courier')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocdelivery.courier })}
                            />
                            {submitted && !ticDocdelivery.courier && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="adress">{translations[selectedLanguage].address} *</label>
                            <InputText
                                id="adress"
                                value={ticDocdelivery.adress}
                                onChange={(e) => onInputChange(e, "text", 'adress')}
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">

                        <div className="field col-12 md:col-4">
                            <label htmlFor="city">{translations[selectedLanguage].place} *</label>
                            <InputText
                                id="city"
                                value={ticDocdelivery.city}
                                onChange={(e) => onInputChange(e, "text", 'city')}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="country">{translations[selectedLanguage].country} *</label>
                            <InputText
                                id="country"
                                value={ticDocdelivery.country}
                                onChange={(e) => onInputChange(e, "text", 'country')}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="tel">{translations[selectedLanguage].tel} *</label>
                            <InputText
                                id="tel"
                                value={ticDocdelivery.tel}
                                onChange={(e) => onInputChange(e, "text", 'tel')}
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="amount">{translations[selectedLanguage].Amount} *</label>
                            <InputText
                                id="amount"
                                value={ticDocdelivery.amount||zaUplatu} onChange={(e) => onInputChange(e, "text", 'amount')}
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="dat">{translations[selectedLanguage].dat} *</label>
                            <Calendar
                                value={dat}
                                onChange={(e) => onInputChange(e, "Calendar", 'dat', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="datdelivery">{translations[selectedLanguage].datdelivery} *</label>
                            <Calendar
                                value={datdelivery}
                                onChange={(e) => onInputChange(e, "Calendar", 'datdelivery', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="status">{translations[selectedLanguage].status} *</label>
                            <Dropdown id="status"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'status')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocdelivery.status })}
                            />
                            {submitted && !ticDocdelivery.status && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                            <label htmlFor="note">{translations[selectedLanguage].note} *</label>
                            <InputText
                                id="note"
                                value={ticDocdelivery.note} onChange={(e) => onInputChange(e, "text", 'note')}
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="tmrec">{translations[selectedLanguage].tmrec} *</label>
                            <InputText
                                id="tmrec"
                                value={ticDocdelivery.tmrec ? DateFunction.formatDatetime(ticDocdelivery.tmrec) : ''}
                                onChange={(e) => onInputChange(e, "text", 'tmrec')}
                                disabled={true}
                            />
                        </div>
                        {/* <div className="field col-12 md:col-3">
                            <label htmlFor="tmship">{translations[selectedLanguage].tmship} *</label>
                            <InputText
                                id="tmship"
                                value={ticDocdelivery.tmship} onChange={(e) => onInputChange(e, "text", 'tmship')}
                            />
                        </div> */}
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="tmcour">{translations[selectedLanguage].tmcour} *</label>
                            <InputText
                                id="tmcour"
                                // value={ticDocdelivery.tmcour} 
                                value={ticDocdelivery.tmcour ? DateFunction.formatDatetime(ticDocdelivery.tmcour) : ''}
                                onChange={(e) => onInputChange(e, "text", 'tmcour')}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="tmbck">{translations[selectedLanguage].tmbck} *</label>
                            <InputText
                                id="tmbck"
                                // value={ticDocdelivery.tmbck} 
                                value={ticDocdelivery.tmbck ? DateFunction.formatDatetime(ticDocdelivery.tmbck) : ''}
                                onChange={(e) => onInputChange(e, "text", 'tmbck')}
                                disabled={true}
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
                            {(props.docdeliveryTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.docdeliveryTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.docdeliveryTip !== 'CREATE') ? (
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
                inTicDocdelivery="delete"
                item={ticDocdelivery.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
            <Dialog
                header={
                    <div className="grid" style={{ paddingTop: 0, paddingBottom: 0 }}>
                        <div className="field col-12 md:col-5" style={{ paddingTop: 0, paddingBottom: 0 }}>
                            <Button
                                label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                                onClick={() => {
                                    setCmnParVisible(false);
                                }}
                                severity="secondary" raised
                            />
                        </div>
                        <div className="field col-12 md:col-5" style={{ paddingTop: 0, paddingBottom: 0 }}>
                            <span>{translations[selectedLanguage].Par}</span>
                        </div>
                    </div>
                }
                visible={cmnParVisible}
                style={{ width: '70%' }}
                onHide={() => {
                    setCmnParVisible(false);
                    setVisible(false);
                    // setShowMyComponent(false);
                }}
            >
                {cmnParVisible && (
                    <CmnPar
                        parameter={"inputTextValue"}
                        ticDoc={ticDoc}
                        cmnPar={cmnPar}
                        handleCmnParLDialogClose={handleCmnParLDialogClose}
                        handleDialogClose={handleDialogClose}
                        setCmnParVisible={setCmnParVisible}
                        setVisible={setVisible}
                        remote={false}
                        dialog={true}
                        lookUp={true}
                        parTip={"UPDATE"}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default TicDocdelivery;
