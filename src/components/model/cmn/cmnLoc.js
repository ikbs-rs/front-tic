import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnLocService } from '../../../service/model/cmn/CmnLocService';
import { CmnLoctpService } from '../../../service/model/cmn/CmnLoctpService';
import LoclinkL from './cmnLoclinkL';
import SalPlace from './cmnSalPlace';
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../../dialog/DeleteDialog';
import { translations } from '../../../configs/translations';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from 'primereact/calendar';
import DateFunction from '../../../utilities/DateFunction';
// import { ColorPicker } from 'primereact/colorpicker';
import { Panel } from "primereact/panel";
import { Fieldset } from 'primereact/fieldset';
import { TabView, TabPanel } from 'primereact/tabview';
import CustomColorPicker from "../../custom/CustomColorPicker.js"
import TicVenueL from './ticVenueL.js';
import CmnLocvenueL from './cmnLocvenueL.js';

const CmnLoc = (props) => {

    console.log(props, "****$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$###########$$$$$$$$$$$$$$$##############################", props.loctpCode == "XSC")
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const SECTOR_CODE = 'XSCT'
    const SEAT_CODE = 'XSB'
    const SEATBLOCK_CODE = 'XSSB'
    const LABEL_CODE = 'XLBT'
    const SCENA_CODE = 'XSC'
    const VIEW_CODE = 'XVW'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnLoc, setCmnLoc] = useState(props.cmnLoc);
    const [cmnLocgrp, setCmnLocgrp] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnLocItem, setDdCmnLocItem] = useState(props.cmnLoc?.cmnLoctpId||props.cmnLoctpId);
    const [ddCmnLocItems, setDdCmnLocItems] = useState(null);
    const [ddCmnLocgrpItem, setDdCmnLocgrpItem] = useState(null);
    const [ddCmnLocgrpItems, setDdCmnLocgrpItems] = useState(null);
    const [cmnLocItem, setCmnLocItem] = useState(null);
    const [cmnLocItems, setCmnLocItems] = useState(null);
    const [cmnLocgrpItem, setCmnLocgrpItem] = useState(null);
    const [cmnLocgrpItems, setCmnLocgrpItems] = useState(null);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [locTip, setLocTip] = useState(props.locTip);
    const [cmnSectorId, setCmnSectorId] = useState(null);
    const [cmnSeatblockId, setCmnSeatblockId] = useState(null);
    const [cmnSeatId, setCmnSeatId] = useState(null);
    const [cmnLabelId, setCmnLabelId] = useState(null);
    const [cmnViewId, setCmnViewId] = useState(null);

    const calendarRef = useRef(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.cmnLoc.valid));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnLoctpService = new CmnLoctpService();
                const data = await cmnLoctpService.getCmnLoctps();

                setCmnLocItems(data);
                //console.log("******************", cmnLocItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnLocItems(dataDD);
                const loctpID = props.cmnLoc.tp == null ? props.cmnLoctpId : props.cmnLoc.tp
                setDdCmnLocItem(dataDD.find((item) => item.code === loctpID) || null);
                const _cmnLoc = { ...cmnLoc }
                _cmnLoc.tp = loctpID
                setCmnLoc(_cmnLoc)
                //console.log(cmnLoc, "************_cmnLoc****************", _cmnLoc, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", loctpID)
                if (loctpID) {
                    const foundItem = data.find((item) => item.id === loctpID);
                    //console.log(foundItem, "$$$$$$$$$$$$$$$$$$$$$$$$$foundItem$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", loctpID)
                    setCmnLocItem(foundItem || null);
                    if (foundItem) {
                        cmnLoc.ctp = foundItem.code || null;
                        cmnLoc.ntp = foundItem.textx || null;
                    }
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
                const cmnLocService = new CmnLocService();
                const data = await cmnLocService.getListaCtp('XV');

                setCmnLocgrpItems(data);
                //console.log("******************", cmnLocItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnLocgrpItems(dataDD);
                setDdCmnLocgrpItem(dataDD.find((item) => item.code === cmnLoc?.grp) || null);
                const _cmnLocgrp = { ...cmnLocgrp }
                setCmnLocgrp(_cmnLocgrp)
                //console.log(cmnLoc, "************_cmnLoc****************", _cmnLoc, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", loctpID)
                if (cmnLoc?.grp) {
                    const foundItem = data.find((item) => item.id === cmnLoc.grp);
                    //console.log(foundItem, "$$$$$$$$$$$$$$$$$$$$$$$$$foundItem$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", loctpID)
                    setCmnLocgrpItem(foundItem || null);
                    if (foundItem) {
                        cmnLoc.cgrp = foundItem.code || null;
                        cmnLoc.ngrp = foundItem.textx || null;
                    }
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
                const cmnLoctpService = new CmnLoctpService();
                //console.log("***cmnLocL*******CmnLoctpService************&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                const data = await cmnLoctpService.getIdByItem(SECTOR_CODE);

                setCmnSectorId(data.id);
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
                const cmnLoctpService = new CmnLoctpService();
                //console.log("***cmnLocL*******CmnLoctpService************&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                const data = await cmnLoctpService.getIdByItem(LABEL_CODE);

                setCmnLabelId(data.id);
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
                const cmnLoctpService = new CmnLoctpService();
                //console.log("***cmnLocL*******CmnLoctpService************&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                const data = await cmnLoctpService.getIdByItem(SEATBLOCK_CODE);

                setCmnSeatblockId(data.id);
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
                const cmnLoctpService = new CmnLoctpService();
                //console.log("***cmnLocL*******CmnLoctpService************&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                const data = await cmnLoctpService.getIdByItem(SEAT_CODE);

                setCmnSeatId(data.id);
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
                const cmnLoctpService = new CmnLoctpService();
                //console.log("***cmnLocL*******CmnLoctpService************&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                const data = await cmnLoctpService.getIdByItem(VIEW_CODE);

                setCmnViewId(data.id);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

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
            const cmnLocService = new CmnLocService();
            const data = await cmnLocService.postCmnLoc(cmnLoc);

            cmnLoc.id = data.id;
            if (cmnLoc.code == "" || !cmnLoc.code) {
                cmnLoc.code = data.code
            }

            cmnLoc.grp = data.grp
            const foundItem = cmnLocgrpItems.find((item) => item.id === cmnLoc.grp);
            if (foundItem?.text || foundItem?.text=="") {
            cmnLoc.ngrp = foundItem?.text;  
            } else {
                cmnLoc.ngrp = cmnLoc.text
            }          
            props.handleDialogClose({ obj: cmnLoc, locTip: locTip });
            props.setVisible(false);
            setLocTip("UPDATE")
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CmnLoc ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            const cmnLocService = new CmnLocService();
            const newCmnLoclink = { ...cmnLoc, id: null };
            const data = await cmnLocService.postCmnLoc(newCmnLoclink);
            console.log(data, "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL", data.code)
            cmnLoc.id = data.id;
            if (cmnLoc.code == "" || !cmnLoc.code) {
                cmnLoc.code = data.code
            }
            cmnLoc.grp = data.grp
            const foundItem = cmnLocgrpItems.find((item) => item.id === cmnLoc.grp);
            cmnLoc.ngrp = foundItem.text;             
            props.handleDialogClose({ obj: cmnLoc, locTip: locTip });
            cmnLoc.code = ""
            cmnLoc.id = null
            //props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CmnLoc ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };
    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const cmnLocService = new CmnLocService();

            await cmnLocService.putCmnLoc(cmnLoc);
            props.handleDialogClose({ obj: cmnLoc, locTip: locTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CmnLoc ',
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
            const cmnLocService = new CmnLocService();
            await cmnLocService.deleteCmnLoc(cmnLoc);
            props.handleDialogClose({ obj: cmnLoc, locTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CmnLoc ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const onColorChange = (newColor) => {
        const updatedCmnLoc = { ...cmnLoc, color: newColor };
        setCmnLoc(updatedCmnLoc); // Ažuriranje ticEventobj sa novom bojom
    };

    const onInputChange = (e, type, name, a) => {
        let val = '';

        if (type === 'options') {
            val = (e.target && e.target.value && e.target.value.code) || null;
            if (name == 'tp') {
                setDdCmnLocItem(e.value);
                const foundItem = cmnLocItems.find((item) => item.id === val);
                setCmnLocItem(foundItem || null);
                cmnLoc.ntp = e.value?.name;
                cmnLoc.ctp = foundItem?.code;
            } else if (name == 'grp') {
                setDdCmnLocgrpItem(e.value);
                const foundItem = cmnLocgrpItems.find((item) => item.id === val);
                setCmnLocgrpItem(foundItem || null);
                cmnLoc.ngrp = e.value?.name;
                cmnLoc.cgrp = foundItem?.code;
            } else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnLoc = { ...cmnLoc };
        _cmnLoc[`${name}`] = val;
        console.log(e, "******************************onInputChange**********************************", _cmnLoc)
        setCmnLoc(_cmnLoc);
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
                        <div className="field col-12 md:col-3">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus value={cmnLoc.code} onChange={(e) => onInputChange(e, 'text', 'code')}
                                required
                            // className={classNames({ 'p-invalid': submitted && !cmnLoc.code })} 
                            />
                            {/* {submitted && !cmnLoc.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>} */}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText id="text" value={cmnLoc.text} onChange={(e) => onInputChange(e, 'text', 'text')} required className={classNames({ 'p-invalid': submitted && !cmnLoc.text })} />
                            {submitted && !cmnLoc.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="grp">{translations[selectedLanguage].Group} *</label>
                            <Dropdown
                                id="grp"
                                value={ddCmnLocgrpItem}
                                options={ddCmnLocgrpItems}
                                onChange={(e) => onInputChange(e, 'options', 'grp')}
                                required
                                showClear
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLoc.grp })}
                            />
                        </div>                        
                        <div className="field col-12 md:col-3">
                            <div className="flex-1 flex flex-column align-items-left">
                                <label htmlFor="color">{translations[selectedLanguage].color}</label>
                                <CustomColorPicker
                                    color={cmnLoc.color || '#ffffff'}
                                    onChange={onColorChange}
                                />
                                {/* <ColorPicker format="hex" id="color" value={cmnLoc.color} onChange={(e) => onInputChange(e, 'text', 'color')} className="mb-3" /> */}
                            </div>

                        </div>
                    </div>



                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-2">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown
                                id="tp"
                                value={ddCmnLocItem}
                                options={ddCmnLocItems}
                                onChange={(e) => onInputChange(e, 'options', 'tp')}
                                required
                                showClear
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLoc.tp })}
                            />
                            {submitted && !cmnLoc.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="longtext">{translations[selectedLanguage].Value}</label>
                            <InputText id="longtext" value={cmnLoc.longtext} onChange={(e) => onInputChange(e, 'text', 'longtext')} />
                        </div>

                        <div className="field col-12 md:col-2">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown
                                id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, 'options', 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLoc.valid })}
                            />
                            {submitted && !cmnLoc.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>


                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={handleCancelClick} outlined /> : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {locTip === 'CREATE' ?
                                <>
                                    <Button label={translations[selectedLanguage].Create}
                                        icon="pi pi-check"
                                        onClick={handleCreateClick}
                                        severity="success"
                                        outlined />
                                    <Button label={translations[selectedLanguage].CreateAndAddNew}
                                        icon="pi pi-plus"
                                        onClick={handleCreateAndAddNewClick}
                                        severity="success"
                                        outlined />
                                </>
                                : null}
                            {locTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Delete} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" outlined /> : null}
                            {locTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Save} icon="pi pi-check" onClick={handleSaveClick} severity="success" outlined /> : null}
                        </div>

                    </div>
                </div>
                {cmnLoc.id && (
                    <div className="card">

                        <TabView>
                            {props.loctpCode == "XV" && (
                                <TabPanel header={translations[selectedLanguage].LocationsScena}>
                                    <LoclinkL key={"XV"} locId={cmnLoc.id} cmnLoc={cmnLoc} cmnLoctpId={cmnSeatId} TabView={true} dialog={false} loctpCode={SCENA_CODE} />
                                </TabPanel>
                            )}
                            {props.loctpCode == "XSC" && (

                                <TabPanel header={translations[selectedLanguage].LocationsSector}>
                                    <LoclinkL key={"XSCT"} locId={cmnLoc.id} cmnLoc={cmnLoc} cmnLoctpId={cmnSectorId} TabView={true} dialog={false} loctpCode={SECTOR_CODE} />
                                </TabPanel>
                            )}

                            {props.loctpCode == "XSC" && (
                                <TabPanel header={translations[selectedLanguage].XVW}>
                                    <LoclinkL key={"XVW"} locId={cmnLoc.id} cmnLoc={cmnLoc} cmnLoctpId={cmnViewId} TabView={true} dialog={false} loctpCode={VIEW_CODE} />
                                </TabPanel>
                            )}
                            {props.loctpCode == "XSC" && (
                                <TabPanel header={translations[selectedLanguage].XLBT}>
                                    <LoclinkL key={"XLBT"} locId={cmnLoc.id} cmnLoc={cmnLoc} cmnLoctpId={cmnLabelId} TabView={true} dialog={false} loctpCode={LABEL_CODE} />
                                </TabPanel>
                            )}
                            {props.loctpCode == "XSC" && (
                                <TabPanel header={translations[selectedLanguage].LocationsEntrance}>
                                    <LoclinkL key={"XSB"} locId={cmnLoc.id} cmnLoc={cmnLoc} cmnLoctpId={cmnSeatId} TabView={true} dialog={false} loctpCode={SEAT_CODE} />
                                </TabPanel>
                            )}
                            {props.loctpCode == "XSC" && (
                                <TabPanel header={translations[selectedLanguage].LocationsSeatBlock}>
                                    <LoclinkL key={"XSSB"} locId={cmnLoc.id} cmnLoc={cmnLoc} cmnLoctpId={cmnSeatblockId} TabView={true} dialog={false} loctpCode={SEATBLOCK_CODE} />
                                </TabPanel>
                            )}
                            <TabPanel header={translations[selectedLanguage].Locations}>
                                <LoclinkL key={"III"} locId={cmnLoc.id} cmnLoc={cmnLoc} cmnLoctpId={null} TabView={true} dialog={false} loctpCode={"-1"} />
                            </TabPanel>
                            <TabPanel header={translations[selectedLanguage].Venue}>
                                <CmnLocvenueL key={"IV"} locId={cmnLoc.id} cmnLoc={cmnLoc} cmnLoctpId={null} venue_id={null} TabView={true} dialog={false} loctpCode={"-1"} />
                            </TabPanel>
                            {/* <TabPanel header={translations[selectedLanguage].drawing}>
                                <SalPlace key={"IV"} locId={cmnLoc.id} cmnLoc={cmnLoc} cmnLoctpId={null} venue_id={null} TabView={true} dialog={false} loctpCode={"-1"} />
                            </TabPanel> */}
                        </TabView>
                    </div>
                )}
                {false && (
                    <Fieldset legend={translations[selectedLanguage].Gafic} toggleable collapsed="true">
                        {/* <Panel header={translations[selectedLanguage].Gafic} toggleable collapsed="true"> */}
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor="graftp">{translations[selectedLanguage].graftp}</label>
                                <InputText id="graftp" value={cmnLoc.graftp} onChange={(e) => onInputChange(e, 'text', 'graftp')} />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor="radius">{translations[selectedLanguage].radius}</label>
                                <InputText id="radius" value={cmnLoc.radius} onChange={(e) => onInputChange(e, 'text', 'radius')} />
                            </div>
                        </div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-10">
                                <label htmlFor="latlongs">{translations[selectedLanguage].latlongs}</label>
                                <InputTextarea id="latlongs" value={cmnLoc.latlongs} onChange={(e) => onInputChange(e, 'text', 'latlongs')} rows={2} />
                            </div>
                        </div>

                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor="fillcolor">{translations[selectedLanguage].fillcolor}</label>
                                <InputText id="fillcolor" value={cmnLoc.fillcolor} onChange={(e) => onInputChange(e, 'text', 'fillcolor')} />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor="originfillcolor">{translations[selectedLanguage].originfillcolor}</label>
                                <InputText id="originfillcolor" value={cmnLoc.originfillcolor} onChange={(e) => onInputChange(e, 'text', 'originfillcolor')} />
                            </div>

                        </div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor="rownum">{translations[selectedLanguage].rownum}</label>
                                <InputText id="rownum" value={cmnLoc.rownum} onChange={(e) => onInputChange(e, 'text', 'rownum')} />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor="seatnum">{translations[selectedLanguage].seatnum}</label>
                                <InputText id="seatnum" value={cmnLoc.seatnum} onChange={(e) => onInputChange(e, 'text', 'seatnum')} />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor="icon">{translations[selectedLanguage].icon}</label>
                                <InputText id="icon" value={cmnLoc.icon} onChange={(e) => onInputChange(e, 'text', 'icon')} />
                            </div>
                        </div>
                        {/* </Panel> */}
                    </Fieldset>
                )}

            </div>
            <DeleteDialog visible={deleteDialogVisible} inCmnLoc="delete" item={cmnLoc.roll} onHide={hideDeleteDialog} onDelete={handleDeleteClick} />
        </div>
    );
};

export default CmnLoc;
