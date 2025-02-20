/**
 * Argumenti respektivno koji se prosledjuju
 * 0 - modu, `adm`
 * 1 - tabela, bez prefiksa, `user`
 * 2 - id tabele
 * 3 - naziv atributa po kome se pretrazuje
 * 5 - mumericki atrinut 0 ili 1
 * 6 - vrednost atributa pokome se pretrazuje
 */
import React, { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ProgressBar } from 'primereact/progressbar';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { TicEventattsService } from '../../service/model/TicEventattsService';
import TicEventatts from './ticEventatts';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import './atts.css';
import { translations } from '../../configs/translations';
import { fetchObjData } from './customHook';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import FileService from '../../service/FileService';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { Calendar } from 'primereact/calendar';
import DateFunction from "../../utilities/DateFunction";
import TicEventattsgrpL from './ticEventattsgrpL';
import { TicEventatttpService } from '../../service/model/TicEventatttpService';
import { TicEventService } from '../../service/model/TicEventService';
import TicEventTmpL from './ticEventTmpL';
import { Tooltip } from 'primereact/tooltip';
import { ToggleButton } from 'primereact/togglebutton';

export default function TicEventattsL(props) {
    const objName = 'tic_eventatts';
    const objNameEventview = 'tic_eventview'
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [submitted, setSubmitted] = useState(false);
    const emptyTicEventatts = EmptyEntities[objName];
    const emptyTicEventview = EmptyEntities[objNameEventview];
    emptyTicEventatts.event = props.ticEvent.id;
    emptyTicEventview.event = props.ticEvent.id;
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticEventattss, setTicEventattss] = useState([]);
    const [ticEventatts, setTicEventatts] = useState(emptyTicEventatts);
    const [ticEventview, setTicEventview] = useState(emptyTicEventview);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [eventattsTip, setEventattsTip] = useState('');
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [dropdownItemText, setDropdownItemText] = useState(null);
    const [dropdownItemsText, setDropdownItemsText] = useState(null);
    const [dropdownAllItems, setDropdownAllItems] = useState(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    let [refresh, setRefresh] = useState(null);
    const [componentKey, setComponentKey] = useState(0);
    const [ticEventattsgrpLVisible, setTicEventattsgrpLVisible] = useState(false);

    const [ddTicEventatttpItem, setDdTicEventatttpItem] = useState(null);
    const [ddTicEventatttpItems, setDdTicEventatttpItems] = useState(null);
    const [ticEventatttp, setTicEventatttp] = useState({});
    const [ticEventatttps, setTicEventatttps] = useState([]);
    const [ticEventTmpLVisible, setTicEventTmpLVisible] = useState(false);

    const [checked, setChecked] = useState(false);

    let i = 0;

    const handleCancelClick =  () => {
        props.setTicEventattsLVisible(false);
    };

    const tableRef = useRef(null);

    // Funkcija za prikaz HTML-a u novom prozoru
    const openTableInNewWindow = async () => {
        if (!tableRef.current) return;

        // Dohvatanje HTML-a tabele
        const tableElement = tableRef.current.querySelector('.p-datatable-table.p-datatable-scrollable-table');
        if (!tableElement) {
            console.error("Tabela nije pronađena!");
            return;
        }

        let tableHtml = tableElement.outerHTML;
        // **Kreiramo privremeni div da manipulišemo DOM-om**
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableHtml;

        // Pronalazimo sve redove tabele
        let rows = tempDiv.querySelectorAll('tr');

        rows.forEach(row => {
            // Ako red sadrži dugme sa traženom klasom, uklanjamo ga
            // if (row.querySelector('.p-button.p-togglebutton.p-component.p-button-icon-only.toggle-button-unchecked')) {
            //     row.remove();
            //     return;
            // }

            // Pronalazimo sve ćelije (kolone) u redu
            let cells = row.querySelectorAll('th, td');

            if (cells.length > 3) {
                // Brišemo **prvu, pretposlednju i poslednju kolonu**
                cells[0].remove(); // Prva kolona
                cells[cells.length - 1].remove(); // Poslednja kolona
                // cells[cells.length - 2].remove(); // Pretposlednja kolona
            }
        });

        // Ažuriramo `tableHtml` sa filtriranim podacima
        tableHtml = tempDiv.innerHTML;

        // **Dodavanje stilova za horizontalni i vertikalni scroll**
        const tableStyle = `
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .table-container {
                    overflow-x: auto; /* Horizontalni scroll */
                    overflow-y: auto; 
                    max-width: 100%;
                    max-height: 700px; 
                    border: 1px solid #ccc;
                    padding: 10px;
                }
                table { 
                    border: 1px solid #ccc; 
                    border-collapse: collapse;
                    white-space: nowrap; /* Sprečava lomljenje teksta */
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 8px;
                    text-align: left;
                    font-size: 11px;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        `;

        // const newWindow = window.open('', '_blank');


        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
            .map(style => style.outerHTML)
            .join('\n');
        const htmlInner = `
                <html>
                    <head>
                        <title>Pregled Tabele</title>
                        ${styles}
                        ${tableStyle}
                    </head>
                    <body>
                        <div class="table-container">
                            ${tableHtml}
                        </div>
                    </body>
                </html>
            `
        const _ticEventview = { ...ticEventview }
        _ticEventview.long = htmlInner
        // console.log("LONG", _ticEventview.long)
        return _ticEventview
        // if (newWindow) {
        //     newWindow.document.write(htmlInner);
        //     newWindow.document.close();
        // }

        await openTableInNewWindow2()
    };

    // const openTableInNewWindow1 = () => {
    //     if (!tableRef.current) return;

    //     // Dohvatanje HTML-a tabele
    //     const tableElement = tableRef.current.querySelector('.p-datatable-table.p-datatable-scrollable-table');
    //     if (!tableElement) {
    //         console.error("Tabela nije pronađena!");
    //         return;
    //     }

    //     let tableHtml = tableElement.outerHTML;

    //     // **Filtriranje redova koji sadrže dugme sa specifičnom klasom**
    //     let tempDiv = document.createElement('div');
    //     tempDiv.innerHTML = tableHtml;

    //     // Pronalazimo sve redove tabele
    //     let rows = tempDiv.querySelectorAll('tr');

    //     rows.forEach(row => {
    //         // Ako red sadrži dugme sa traženom klasom, uklanjamo ga
    //         if (row.querySelector('.p-button.p-togglebutton.p-component.p-button-icon-only.toggle-button-unchecked')) {
    //             row.remove();
    //         }
    //     });

    //     // Ažuriramo `tableHtml` sa filtriranim redovima
    //     tableHtml = tempDiv.innerHTML;

    //     // **Dodavanje stilova za skrolovanje + font 11px**
    //     const tableStyle = `
    //         <style>
    //             body { font-family: Arial, sans-serif; padding: 20px; }
    //             .table-container {
    //                 overflow-x: auto; /* Horizontalni scroll */
    //                 overflow-y: auto; /* Vertikalni scroll */
    //                 max-width: 100%;
    //                 max-height: 700px; /* Visina tabele */
    //                 border: 1px solid #ccc;
    //                 padding: 10px;
    //             }
    //             table { 
    //                 border: 1px solid #ccc; 
    //                 border-collapse: collapse;
    //                 white-space: nowrap; /* Sprečava lomljenje teksta */
    //                 font-size: 11px; /* Postavlja font size na 11px */
    //             }
    //             th, td { 
    //                 border: 1px solid #ddd; 
    //                 padding: 8px;
    //                 text-align: left;
    //                 font-size: 11px; /* Postavlja font size na 11px za sav tekst */
    //             }
    //             th {
    //                 background-color: #f2f2f2;
    //             }
    //         </style>
    //     `;

    //     const newWindow = window.open('', '_blank');

    //     if (newWindow) {
    //         const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    //             .map(style => style.outerHTML)
    //             .join('\n');
    //         console.log(`
    //                 <html>
    //                     <head>
    //                         <title>Pregled Tabele</title>
    //                         ${styles}
    //                         ${tableStyle}
    //                     </head>
    //                     <body>
    //                         <div class="table-container">
    //                             ${tableHtml}
    //                         </div>
    //                     </body>
    //                 </html>
    //             `)

    //         newWindow.document.write(`
    //             <html>
    //                 <head>
    //                     <title>Pregled Tabele</title>
    //                     ${styles}
    //                     ${tableStyle}
    //                 </head>
    //                 <body>
    //                     <div class="table-container">
    //                         ${tableHtml}
    //                     </div>
    //                 </body>
    //             </html>
    //         `);
    //         newWindow.document.close();
    //     }
    // };


    const openTableInNewWindow2 = async (objData) => {
        if (!tableRef.current) return;

        // Dohvatanje HTML-a tabele
        const tableElement = tableRef.current.querySelector('.p-datatable-table.p-datatable-scrollable-table');
        if (!tableElement) {
            console.error("Tabela nije pronađena!");
            return;
        }

        let tableHtml = tableElement.outerHTML;

        // **Kreiramo privremeni div da manipulišemo DOM-om**
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableHtml;

        // Pronalazimo sve redove tabele
        let rows = tempDiv.querySelectorAll('tr');

        rows.forEach(row => {
            // Ako red sadrži dugme sa traženom klasom, uklanjamo ga
            if (row.querySelector('.p-button.p-togglebutton.p-component.p-button-icon-only.toggle-button-unchecked')) {
                row.remove();
                return;
            }

            // Pronalazimo sve ćelije (kolone) u redu
            let cells = row.querySelectorAll('th, td');

            if (cells.length > 3) {
                // Brišemo **prvu, pretposlednju i poslednju kolonu**
                cells[0].remove(); // Prva kolona
                cells[cells.length - 1].remove(); // Poslednja kolona
                cells[cells.length - 2].remove(); // Pretposlednja kolona
            }
        });

        // Ažuriramo `tableHtml` sa filtriranim podacima
        tableHtml = tempDiv.innerHTML;

        // **Dodavanje stilova za skrolovanje + font 11px**
        const tableStyle = `
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .table-container {
                    overflow-x: auto; /* Horizontalni scroll */
                    overflow-y: auto; /* Vertikalni scroll */
                    max-width: 100%;
                    max-height: 700px; /* Visina tabele */
                    border: 1px solid #ccc;
                    padding: 10px;
                }
                table { 
                    border: 1px solid #ccc; 
                    border-collapse: collapse;
                    white-space: nowrap; /* Sprečava lomljenje teksta */
                    font-size: 11px; /* Postavlja font size na 11px */
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 8px;
                    text-align: left;
                    font-size: 11px; /* Postavlja font size na 11px za sav tekst */
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        `;


        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
            .map(style => style.outerHTML)
            .join('\n');

        const htmlInner = `
                    <html>
                        <head>
                            <title>Pregled Tabele</title>
                            ${styles}
                            ${tableStyle}
                        </head>
                        <body>
                            <div class="table-container">
                                ${tableHtml}
                            </div>
                        </body>
                    </html>
                `
        const _ticEventview = { ...objData }
        _ticEventview.short = htmlInner
        
        setTicEventview(_ticEventview)
        return _ticEventview
    };

    const handleTableInNewWindow = async () => {
        try {
            // 1. Pokreni funkcije asinhrono i sačekaj rezultate
            const _ticEventview = await openTableInNewWindow();
            const _ticEventview2 = await openTableInNewWindow2(_ticEventview);
    
            console.log("222222222222", _ticEventview2.long); // Proveri da li sadrži validan HTML
    
            // 2. Otvori novi prozor pre asinhronih operacija
            const newWindow = window.open('', '_blank');
            if (!newWindow) {
                console.error("Pretraživač blokira otvaranje prozora!");
                return;
            }
    
            // 3. Osiguraj da sadržaj postoji pre nego što ga ispišemo
            if (!_ticEventview2 || !_ticEventview2.long) {
                newWindow.document.write("<h2>Greška: Nema sadržaja za prikaz!</h2>");
            } else {
                newWindow.document.write(_ticEventview2.long);
            }
    
            newWindow.document.close();
            const ticEventService = new TicEventService();
            await ticEventService.postEventview(_ticEventview2);            
        } catch (error) {
            console.error("Došlo je do greške:", error);
        }
    }

    useEffect(() => {
        async function fetchData() {

            try {
                setLoading(true);
                // console.log('Učitavanje je započeto!!!!!');
                // ++i;
                // if (i < 2) {
                const pTp = ticEventatttp ? ticEventatttp.id || "-1" : "-1";
                // console.log(ticEventatttp, "*********************emptyTicEventatts**************************", pTp)
                const ticEventattsService = new TicEventattsService();
                const data = await ticEventattsService.getListaP(props.ticEvent.id, pTp);

                // console.log(data, "*********************data**************************#####################", pTp)
                const updatedDropdownItems = { ...dropdownAllItems };

                // const promisesDD = data.map(async (row) => {
                //     if (row.inputtp === '3' && row.ddlist) {
                //         const [modul, tabela, code, modul1, tabela1, code1] = row.ddlist.split(',');
                //         let apsTabela = modul + `_` + tabela;
                //         if (code) {
                //             apsTabela = apsTabela + `_${code}`
                //         }
                //         const dataDD = await fetchObjData(modul, tabela, code, props.ticEvent);
                //         updatedDropdownItems[apsTabela] = dataDD.ddItems;

                //     }
                //     if (row.inputtp === '6' && row.ddlist) {
                //         const [modul, tabela, code, modul1, table1, code1] = row.ddlist.split(',');
                //         let apsTabela = modul + `_` + tabela;
                //         if (code) {
                //             apsTabela = apsTabela + `_${code}`
                //         }
                //         const dataDD = await fetchObjData(modul, tabela, code, props.ticEvent);
                //         updatedDropdownItems[apsTabela] = dataDD.ddItems;

                //         if (modul1) {
                //             let apsTabela1 = modul1 + `_` + table1;
                //             if (code1) {
                //                 apsTabela1 = apsTabela1 + `_${code1}`
                //             }
                //             const dataDD1 = await fetchObjData(modul1, table1, code1, props.ticEvent);
                //             updatedDropdownItems[apsTabela1] = dataDD1.ddItems;
                //         }
                //     }
                //     return { ...row, isUploadPending: false };
                // });

                const updatedData = []; // Низ за чување ажурираних података

                for (const row of data) {
                    if (row.inputtp === '3' && row.ddlist) {
                        const [modul, tabela, code, modul1, tabela1, code1] = row.ddlist.split(',');
                        let apsTabela = modul + `_` + tabela;
                        if (code) {
                            apsTabela = apsTabela + `_${code}`;
                        }
                        const dataDD = await fetchObjData(modul, tabela, code, props.ticEvent);
                        updatedDropdownItems[apsTabela] = dataDD.ddItems;
                    }

                    if (row.inputtp === '6' && row.ddlist) {
                        const [modul, tabela, code, modul1, table1, code1] = row.ddlist.split(',');
                        let apsTabela = modul + `_` + tabela;
                        if (code) {
                            apsTabela = apsTabela + `_${code}`;
                        }
                        const dataDD = await fetchObjData(modul, tabela, code, props.ticEvent);
                        updatedDropdownItems[apsTabela] = dataDD.ddItems;

                        if (modul1) {
                            let apsTabela1 = modul1 + `_` + table1;
                            if (code1) {
                                apsTabela1 = apsTabela1 + `_${code1}`;
                            }
                            const dataDD1 = await fetchObjData(modul1, table1, code1, props.ticEvent);
                            updatedDropdownItems[apsTabela1] = dataDD1.ddItems;
                        }
                    }

                    // Ажурирање реда и додавање у updatedData
                    const updatedRow = { ...row, isUploadPending: false };
                    updatedData.push(updatedRow);
                }

                setTicEventattss(updatedData); // Постављање ажурираних података у state
                setDropdownAllItems(updatedDropdownItems); // Постављање ажурираних података за dropdown


                // const updatedData = await Promise.all(promisesDD);
                // setTicEventattss(updatedData);
                // setDropdownAllItems(updatedDropdownItems);

                initFilters();
                console.log('Učitavanje je završeno!!!!');
                setLoading(false);
                console.log(ticEventattss)
                // }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }

        }


        fetchData();

    }, [refresh, componentKey]);

    // useEffect(() => {
    //     if (loading) {
    //         console.log('Učitavanje je započeto');
    //     } else {
    //         console.log('Učitavanje je završeno');
    //     }
    // }, [loading]);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticEventatttpService = new TicEventatttpService();
                const data = await ticEventatttpService.getTicEventatttps();

                const sortedData = data.sort((a, b) => a.textx.localeCompare(b.textx));

                setTicEventatttps(sortedData);

                const dataDD = sortedData.map(({ textx, id }) => ({ name: textx, code: id }));
                // const dataDD = [
                //     { code: -99, name: "Izaberi vrednost" },
                //     ...sortedData.map(({ textx, id }) => ({ name: textx, code: id }))
                // ];

                setDdTicEventatttpItems(dataDD);
                // setDdTicEventatttpItem(dataDD.find((item) => item.code == -99) || null);
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
                console.log(ticEventattss, "QQQQQ", dropdownAllItems)
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [ticEventattss]);

    const openEventattsgrp = () => {
        setTicEventattsgrpDialog();
    };


    const openEventTmp = () => {
        setTicEventTmpDialog();
    };

    const setTicEventTmpDialog = () => {
        setShowMyComponent(true);
        setTicEventTmpLVisible(true);
    };

    const setTicEventattsgrpDialog = () => {
        setShowMyComponent(true);
        setTicEventattsgrpLVisible(true);
    };

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _ticEventattss = [...ticEventattss];
        let _ticEventatts = { ...localObj.newObj.obj };
        //setSubmitted(true);
        if (localObj.newObj.eventattsTip === 'CREATE') {
            //_ticEventattss.push(_ticEventatts);
            setRefresh(newObj.id);
            setComponentKey((prevKey) => prevKey + 1);
        } else if (localObj.newObj.eventattsTip === 'UPDATE') {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticEventattss[index] = _ticEventatts;
        } else if (localObj.newObj.eventattsTip === 'DELETE') {
            _ticEventattss = ticEventattss.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventatts Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventatts ?', life: 3000 });
        }
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: `{${objName}} ${localObj.newObj.eventattsTip}`,
            life: 3000
        });
        setTicEventattss(_ticEventattss);
        setTicEventatts(emptyTicEventatts);
    };

    const onTemplateSelect = (e) => {
        console.log('onTemplateSelect');
    };

    const handleAutoInputClick = () => {
        setConfirmDialogVisible(true);
    };


    const handleTicEventattsgrpLDialogClose = (newObj) => {
        const localObj = { newObj };
        // console.log(props.ticEvent, "@@@@@@@@***********handleTicEventattsgrpLDialogClose********************@@@@@@@@@@@@@")
        setRefresh(++refresh);
    };

    const handleConfirm = async () => {
        //console.log(props.ticEvent, "***********handleConfirm********************")
        setSubmitted(true);
        const ticEventattsService = new TicEventattsService();
        await ticEventattsService.postAutoEventatts(props.ticEvent.id, ticEventatttp.id || -1);
        const data = await ticEventattsService.getLista(props.ticEvent.id);
        setTicEventattss(data);
        props.handleTicEventattsLDialogClose({ obj: props.ticEvent, docTip: 'UPDATE' });
        props.setVisible(false);
        //hideDeleteDialog();
        setConfirmDialogVisible(false);
    };

    const handleCopy = async (e, rowData) => {
        setSubmitted(true);
        const ticEventattsService = new TicEventattsService();
        const data = await ticEventattsService.postCopyEventatts(props.ticEvent.id, rowData);
        setRefresh(++refresh);
    };
    const toggleChecked = async (e, name, rowData) => {
        // console.log(name, "***type!!!********input!!!***", e, "*")
        const newCheckedState = e.value;
        // Update local state
        setChecked(newCheckedState);

        /***************************************** */


        let val = '';
        let _ticEventatts = {}
        val = newCheckedState ? 1 : 0;

        _ticEventatts = { ...rowData };
        // Update data in parent component or global store
        const updatedRows = ticEventattss.map(row => {
            if (row.id === rowData.id) {
                return { ...row, valid: newCheckedState ? 1 : 0 };
            }
            return row;
        });
        setTicEventattss(updatedRows);
        _ticEventatts[`${name}`] = val;
        setTicEventatts(_ticEventatts);
        // setTicEventattss([...ticEventattss]);
        // console.log(_ticEventatts, "=============================================================")
        await updateDataInDatabase(_ticEventatts);
    };


    const onInputChange = async (e, type, name, rowData, apsTabela) => {
        //console.log(name, "***type!!!********input!!!***", e.target.value, "*")
        let val = '';
        let _ticEventatts = {}
        if (name === 'valid') {
            rowData.valid = e.checked ? 1 : 0;
            setTicEventattss([...ticEventattss]);
            val = e.checked ? 1 : 0;
        } else if (name === 'condition') {
            val = (e.target && e.target.value) || '';
            rowData.condition = e.target.value;
            setTicEventattss([...ticEventattss]);
        } else {
            val = (e.target && e.target.value) || '';
            rowData.minfee = e.target.value;
            setTicEventattss([...ticEventattss]);
        }
        _ticEventatts = { ...ticEventatts };
        _ticEventatts[`${name}`] = val;
        setTicEventatts(_ticEventatts);
        await updateDataInDatabase(_ticEventatts);
    };

    const onInputTextChange = async (e, type, name, rowData, apsTabela) => {
        //console(type, "***name***", name, "+++apsTabela+++", apsTabela, "****rowData*****")
        let val = '';
        let _ticEventatts = {}
        switch (type) {
            case 'input':
                val = (e.target && e.target.value) || '';
                rowData.text = e.target.value;
                setTicEventattss([...ticEventattss]);
                break;
            case 'options':
                rowData.text = e.value?.code;
                val = (e.target && e.target.value && e.target.value?.code) || '';
                setDropdownItemText(e.value);
                break;
            case 'calendar':
                val = await DateFunction.formatDateToDBFormat(DateFunction.dateGetValue((e.target && e.target.value) || ''))
                rowData.text = val
                break;
            default:
                val = '';
                break;
        }
        // Napravite kopiju trenutnog niza
        const updatedTicEventattss = [...ticEventattss];

        // Pronađite indeks trenutnog reda
        const rowIndex = updatedTicEventattss.findIndex((row) => row.id === rowData.id);

        // Ažurirajte samo trenutni red sa novim podacima
        updatedTicEventattss[rowIndex] = rowData;

        // Postavljanje novog niza kao stanje za ticEventattss
        setTicEventattss(updatedTicEventattss);
        _ticEventatts = { ...ticEventatts };
        _ticEventatts[`${name}`] = val;
        setTicEventatts(_ticEventatts);
        // console.log(updatedTicEventattss[rowIndex], "*****Text**********************updatedTicEventattss***************************", _ticEventatts)
        await updateDataInDatabase(_ticEventatts);
    };

    const onInputValueChange = async (e, type, name, rowData, apsTabela) => {
        let val = '';
        let _ticEventatts = {}
        switch (type) {
            case 'input':
                val = (e.target && e.target.value) || '';
                rowData.value = e.target.value;
                await setTicEventattss([...ticEventattss]);
                break;
            case 'checkbox':
                rowData.value = e.checked ? '1' : '0';
                await setTicEventattss([...ticEventattss]);
                val = e.checked ? 1 : 0;
                break;
            case 'options':
                rowData.value = e.value?.code;
                val = (e.target && e.target.value && e.target.value?.code) || '';
                await setDropdownItem(e.value);
                break;
            case 'fileUpload':
                try {
                    // console.log('Custom upload started Bravo:', e);
                    const originalFileExtension = e.files[0].name.split('.').pop();
                    // const newFileName = `${ticEventatts.event}.${originalFileExtension}`;
                    const newFileName = `${ticEventatts.event}.jpg`;
                    // console.log('Modified file name:', newFileName);

                    rowData.isUploadPending = false;
                    const relPath = 'public/tic/event/';
                    const file = e.files[0];
                    const fileService = new FileService();
                    const data = await fileService.uploadFile(file, newFileName, relPath);
                    rowData.isUploadPending = true;
                    toast.current.show({ severity: 'success', summary: 'Success', detail: data.message });
                    e.options.clear();
                    val = relPath + newFileName;
                    rowData.value = val;
                    const rowIndex = ticEventattss.findIndex((row) => row.id === rowData.id);

                    // Ažurirajte reda sa novim podacima
                    const updatedTicEventattss = [...ticEventattss];
                    updatedTicEventattss[rowIndex] = rowData;

                    // Postavljanje novog niza kao stanje za ticEventattss
                    await setTicEventattss(updatedTicEventattss);
                    //setTicEventattss([...ticEventattss]);
                } catch (error) {
                    console.error(error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error uploading file' });
                }
                break;
            case 'calendar':
                val = await DateFunction.formatDateToDBFormat(DateFunction.dateGetValue((e.target && e.target.value) || ''))
                rowData.value = val
                break;
            default:
                val = '';
                break;
        }

        // Napravite kopiju trenutnog niza
        const updatedTicEventattss = [...ticEventattss];

        // Pronađite indeks trenutnog reda
        const rowIndex = await updatedTicEventattss.findIndex((row) => row.id === rowData.id);

        // Ažurirajte samo trenutni red sa novim podacima
        updatedTicEventattss[rowIndex] = rowData;
        // console.log(dropdownItem, "***Value********dropdownItem***", dropdownItemText, "*************updatedTicEventattss***************************", e.value)
        // Postavljanje novog niza kao stanje za ticEventattss
        await setTicEventattss(updatedTicEventattss);

        _ticEventatts = { ...ticEventatts };
        _ticEventatts[`${name}`] = val;
        await setTicEventatts(_ticEventatts);
        await updateDataInDatabase(_ticEventatts);
    };

    const updateDataInDatabase = async (rowData) => {
        try {
            // console.log(rowData, "***********updateDataInDatabase************!!!!!!!!!!!!!!!!!!!!!", rowData.value)
            const ticEventattsService = new TicEventattsService();
            await ticEventattsService.putTicEventatts(rowData);
            // Dodatno rukovanje ažuriranim podacima, ako je potrebno          
        } catch (err) {
            console.error('Error updating data:', err);
            // Dodatno rukovanje greškom, ako je potrebno
        }
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticEventattss.length; i++) {
            if (ticEventattss[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };
    const onEventatttpChange = (e) => {
        let _ticEventatts = { ...ticEventatts };
        let val = (e.target && e.target.value && e.target.value.code) || '';
        setDdTicEventatttpItem(e.value);
        const foundItem = ticEventatttps.find((item) => item.id === val);
        setTicEventatttp(foundItem || null);
        _ticEventatts.tp = val;
        emptyTicEventatts.tp = val;
        setTicEventatts(_ticEventatts);
        setRefresh(++refresh);
    }
    const openNew = () => {
        setTicEventattsDialog(emptyTicEventatts);
    };

    const onRowSelect = (event) => {
        console.log('onRowSelect');
    };

    const onRowUnselect = (event) => {
        console.log('onRowUnselect');
    };
    // <heder za filter
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ctp: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            ntp: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            valid: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        let value1 = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value1;

        setFilters(_filters);
        setGlobalFilterValue(value1);
    };

    const renderHeader = () => {
        return (
            <div className="flex card-container">
                <Button label="Snimi tabelu" icon="pi pi-external-link" onClick={handleTableInNewWindow} />
                <div className="flex flex-wrap gap-1" />
                <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div>
                {/* <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].AutoAtts} icon="pi pi-copy" severity="warning" onClick={handleAutoInputClick} text raised />
                </div> */}

                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].GroupAtts} icon="pi pi-plus-circle" severity="warning" onClick={openEventattsgrp} text raised />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Copy} icon="pi pi-copy" severity="danger" onClick={openEventTmp} text raised disabled={!props.ticEvent} />
                </div>
                <div className="flex-grow-1"></div>
                <b>{translations[selectedLanguage].EventattsList}</b>
                <div className="flex-grow-1"></div>
                <div className="flex-grow-1 ">
                    <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                    <Dropdown id="tp"
                        value={ddTicEventatttpItem}
                        options={ddTicEventatttpItems}
                        onChange={(e) => onEventatttpChange(e)}
                        showClear
                        optionLabel="name"
                        placeholder="Select One"
                    />
                </div>
                <div className="flex-grow-1"></div>
                <div className="flex flex-wrap gap-1">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={translations[selectedLanguage].KeywordSearch} />
                    </span>
                    <Button type="button" icon="pi pi-filter-slash" label={translations[selectedLanguage].Clear} outlined onClick={clearFilter} text raised />
                </div>
            </div>
        );
    };

    const validBodyTemplate = (rowData) => {
        const valid = rowData.valid == 1 ? true : false;
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': valid,
                    'text-red-500 pi-times-circle': !valid
                })}
            ></i>
        );
    };

    const cmdBodyTemplate = (rowData) => {
        const valid = rowData.valid == 1 ? true : false;
        return (
            < >
                <Button type="button" icon="pi pi-copy" severity="secondary" rounded raised
                    onClick={(e) => handleCopy(e, rowData)}
                ></Button>
            </>
        );
    };
    const toggleBodyTemplate = (rowData, name, e) => {

        const checked = rowData.valid == 1; // Pretpostavimo da 'valid' određuje da li je dugme čekirano
        const buttonClass = checked ? "toggle-button-checked" : "toggle-button-unchecked";

        return (
            <div className="flex justify-content-center" style={{ width: "18px", height: "18px", "font-size": "9px", border: 'none' }}>
                <ToggleButton
                    id={`tgl${rowData.id}`}
                    onLabel=""
                    offLabel=""
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                    checked={checked}
                    onChange={(e) => toggleChecked(e, 'valid', rowData)} // Ako treba ažurirati stanje u komponenti
                    // className={`w-9rem ${buttonClass}`}
                    className={`${buttonClass}`}
                />
            </div>
        );
    };



    const validFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="verified-filter" className="font-bold">
                    {translations[selectedLanguage].Valid}
                </label>
                <TriStateCheckbox inputId="verified-filter" value={options.value} onChange={(e) => options.filterCallback(e.value)} />
            </div>
        );
    };

    // <--- Dialog
    const setTicEventattsDialog = (ticEventatts) => {
        setVisible(true);
        setEventattsTip('CREATE');
        setTicEventatts({ ...ticEventatts });
    };
    //  Dialog --->

    const header = renderHeader();
    // heder za filter/>

    const eventattsTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Tooltip target=".eventatts-tooltip" position="top" mouseTrack mouseTrackLeft={2} mouseTrackTop={2}>
                    {rowData.description}
                </Tooltip>
                <Button
                    type="button"
                    // className="eventatts-tooltip"
                    icon="pi pi-pencil"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        setTicEventattsDialog(rowData);
                        setEventattsTip('UPDATE');
                    }}
                    text
                    raised
                ></Button>
            </div>
        );
    };

    // funkcije
    const textEditor = (rowData, field, e) => {
        // console.log(rowData, '**T_00**********************textEditor*************rowData.inputtp***************', e);
        switch (rowData.inputtp) {
            case '6':
                const [modul0, tabela0, code0, modul, tabela, code] = rowData.ddlist.split(',');
                let apsTabelaText = `${modul}_${tabela}`;
                if (code) {
                    apsTabelaText = apsTabelaText + `_${code}`
                }

                const selectedOptionsText = dropdownAllItems[apsTabelaText] || [];
                setDropdownItemsText(selectedOptionsText);
                const selectedOptionText = selectedOptionsText.find((option) => option.code === rowData.text);
                setDropdownItemText(selectedOptionText);
                return <Dropdown
                    id={rowData.id}
                    showClear
                    value={selectedOptionText}
                    options={selectedOptionsText}
                    onChange={(e) => onInputTextChange(e, 'options', 'text', rowData, apsTabelaText)}
                    placeholder="Select One"
                    optionLabel="name"
                />;
            case '8': // Za kalendar
                return (
                    <Calendar
                        showIcon
                        dateFormat="dd.mm.yy"
                        value={DateFunction.formatJsDate(props.ticEvent.begda || DateFunction.currDate())}
                        onChange={async (e) => onInputTextChange(e, 'calendar', 'text', rowData, null)} // Dodajte funkciju za rukovanje promenama na kalendaru
                    />
                );
            default:
                return <InputText value={rowData.text || ''} onChange={(e) => onInputTextChange(e, 'input', 'text', rowData, null)} />;
        }

    };
    const conditionEditor = (rowData, field, e) => {
        return <InputText
            value={rowData.condition || ''}
            onChange={(e) => onInputChange(e, 'input', 'condition', rowData, null)}
        />;

    };
    const minfeeEditor = (rowData, field, e) => {
        return <InputText
            value={rowData.minfee || ''}
            onChange={(e) => onInputChange(e, 'input', 'minfee', rowData, null)}
        />;

    };
    const validEditor = (rowData, field) => {
        return <Checkbox checked={rowData.valid === 1} onChange={(e) => onInputChange(e, 'checkbox', 'valid', rowData, null)} />;

    };

    const valueEditor = (rowData, field, e) => {
        //console.log(rowData, '************************rowData*************e***************', e);
        switch (rowData.inputtp) {
            case '4':
                return (
                    <div className="card flex justify-content-center">
                        <FileUpload
                            //mode="basic"
                            name="Fajl"
                            accept="image/*"
                            maxFileSize={1000000}
                            uploadHandler={(event) => onInputValueChange(event, 'fileUpload', 'value', rowData, null)}
                            onSelect={onTemplateSelect}
                            customUpload={true}
                            chooseLabel="Browse"
                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        />
                    </div>
                );
            case '1':
                return <InputText value={rowData.value || ''} onChange={(e) => onInputValueChange(e, 'input', 'value', rowData, null)} />;
            case '2':
                return <Checkbox checked={rowData.value === '1'} onChange={(e) => onInputValueChange(e, 'checkbox', 'value', rowData, null)} />;
            case '6':
            case '3':
                const [modul, tabela, code] = rowData.ddlist.split(',');
                let apsTabela = `${modul}_${tabela}`;
                if (code) {
                    apsTabela = apsTabela + `_${code}`
                }

                const selectedOptions = dropdownAllItems[apsTabela] || [];
                // console.log(selectedOptions, '******************selectedOptions11111*******', apsTabela, '*********WWWWW******');
                setDropdownItems(selectedOptions);

                // const selectedOption = selectedOptions.find((option) => option.code === rowData.value);
                const selectedOption = selectedOptions.length > 0
                    ? selectedOptions.find((option) => option.code === rowData.value)
                    : null;
                setDropdownItem(selectedOption);
                // console.log(selectedOption, selectedOptions, rowData, apsTabela, "*****555555********")
                return <Dropdown
                    id={rowData.id}
                    showClear
                    value={selectedOption}
                    options={selectedOptions}
                    onChange={(e) => onInputValueChange(e, 'options', 'value', rowData, apsTabela)}
                    placeholder="Select One"
                    optionLabel="name"
                />;
            case '5': // Za kalendar
            case '8': // Za kalendar
                return (
                    <Calendar
                        showIcon
                        dateFormat="dd.mm.yy"
                        value={DateFunction.formatJsDate(props.ticEvent.begda || DateFunction.currDate())}
                        onChange={async (e) => onInputValueChange(e, 'calendar', 'value', rowData, null)} // Dodajte funkciju za rukovanje promenama na kalendaru
                    />
                );
            default:
                return <InputText value={rowData.value || ''} onChange={(e) => onInputValueChange(e, 'input', 'value', rowData, null)} />;
        }
    };

    const onCellEditComplete = async (e) => {
        let { rowData, newValue, newRowData, field, originalEvent: event } = e;
        let _rowData = { ...rowData };
        let _newValue = newValue;

        switch (field) {
            case 'valid':
                if (newValue != null) _rowData[field] = _newValue;
                else event.preventDefault();
                break;
            case 'value':
                if (newValue != null) {
                    _rowData[field] = _newValue;
                    // Check if upload is pending and prevent exiting edit mode
                    if (rowData.inputtp === '4' && !_rowData.isUploadPending) {
                        event.preventDefault();
                    }
                } else event.preventDefault();
                break;
            case 'text': // Dodali smo ovu sekciju za kolonu "text"
                if (newValue != null) {
                    _rowData[field] = _newValue;
                } else event.preventDefault();
                break;
            default:
                if (newValue != null) _rowData[field] = _newValue;
                else event.preventDefault();
                break;
        }

        // Ažuriramo stanje komponente
        setTicEventattss([...ticEventattss]);
    };

    const valueTemplate = (rowData) => {

        if (((rowData.inputtp === '3') || (rowData.inputtp === '6')) && rowData.ddlist) {
            const [modul, tabela, code] = rowData.ddlist.split(',');
            let apsTabela = `${modul}_${tabela}`;
            if (code) {
                apsTabela = apsTabela + `_${code}`
            }
            const dropdownData = dropdownAllItems[apsTabela] || [];
            const dropdownValue = dropdownData.find((item) => item.code === rowData.value);
            if (dropdownValue) {
                return <span>{dropdownValue.name}</span>;
            }
        }

        if (rowData.inputtp === '2') {
            const value = rowData.value == 1 ? true : false;
            return (
                <i
                    className={classNames('pi', {
                        'text-green-500 pi-check-circle': value,
                        'text-red-500 pi-times-circle': !value
                    })}
                ></i>
            );
        }
        if ((rowData.inputtp === '5') || (rowData.inputtp === '8')) {
            let value = ''
            if (rowData.value) {
                value = DateFunction.formatDate(rowData.value)
            }
            return (
                <span>{value}</span>
            );
        }
        // if (rowData.inputtp === '1') {
        //     let val = ''
        //     if (rowData.value) {
        //         val = DateFunction.formatDate(rowData.value)
        //     }
        //     return (
        //         <span>{val}</span>
        //     );
        // }        
        return rowData.value;
    };

    const textTemplate = (rowData) => {
        if (rowData.inputtp === '6' && rowData.ddlist) {
            const [modul0, tabela0, code0, modul, tabela, code] = rowData.ddlist.split(',');
            let apsTabela = `${modul}_${tabela}`;
            if (code) {
                apsTabela = apsTabela + `_${code}`
            }
            const dropdownData = dropdownAllItems[apsTabela] || [];
            const dropdownValue = dropdownData.find((item) => item.code === rowData.text);
            if (dropdownValue) {
                return <span>{dropdownValue.name}</span>;
            }
        }
        if (rowData.inputtp === '8') {
            let text = ''
            if (rowData.text) {
                text = DateFunction.formatDate(rowData.text)
            }
            return (
                <span>{text}</span>
            );
        }
        // if (rowData.inputtp === '1') {
        //     let val = ''
        //     if (rowData.value) {
        //         val = DateFunction.formatDate(rowData.value)
        //     }
        //     return (
        //         <span>{val}</span>
        //     );
        // }          
        // Prikazujemo ili "value" ili default vrednost
        return rowData.text;
    };
    // Funkcije

    const rowClass = (rowData) => {
        // console.log(rowData.cttp, "************************************************rowData.cttp****************************************************")
        const tableRow = document.querySelectorAll('.p-datatable-tbody');
        tableRow.forEach((row) => {
            //row.classList.remove('p-datatable-tbody');
        });
        const selRow = document.querySelectorAll('.p-selectable-row');
        selRow.forEach((row) => {
            row.classList.remove('p-selectable-row');
        });

        return rowData.cttp == '01'
            ? 'highlight-row-1'
            : rowData.cttp == '02'
                ? 'highlight-row-2'
                : rowData.cttp == '03'
                    ? 'highlight-row-3'
                    : rowData.cttp == '04'
                        ? 'highlight-row-4'
                        : rowData.cttp == '05'
                            ? 'highlight-row-5'
                            : rowData.cttp == '06'
                                ? 'highlight-row-6'
                                : rowData.cttp == '07'
                                    ? 'highlight-row-7'
                                    : rowData.cttp == '08'
                                        ? 'highlight-row-8'
                                        : rowData.cttp == '09'
                                            ? 'highlight-row-9'
                                            : rowData.cttp == '10'
                                                ? 'highlight-row-10'
                                                : rowData.cttp == '11'
                                                    ? 'highlight-row-11'
                                                    : rowData.cttp == '12'
                                                        ? 'highlight-row-12'
                                                        : rowData.cttp == '13'
                                                            ? 'highlight-row-13'
                                                            : rowData.cttp == '14'
                                                                ? 'highlight-row-14'
                                                                : rowData.cttp == '15'
                                                                    ? 'highlight-row-15'
                                                                    : rowData.cttp == '16'
                                                                        ? 'highlight-row-16'
                                                                        : rowData.cttp == '17'
                                                                            ? 'highlight-row-17'
                                                                            : rowData.cttp == '18'
                                                                                ? 'highlight-row-18'
                                                                                : rowData.cttp == '19'
                                                                                    ? 'highlight-row-19'
                                                                                    : rowData.cttp == '20'
                                                                                        ? 'highlight-row-20'
                                                                                        : rowData.cttp == '21'
                                                                                            ? 'highlight-row-21'
                                                                                            : rowData.cttp == '22'
                                                                                                ? 'highlight-row-22'
                                                                                                : rowData.cttp == '23'
                                                                                                    ? 'highlight-row-23'
                                                                                                    : rowData.cttp == '24'
                                                                                                        ? 'highlight-row-24'
                                                                                                        : rowData.cttp == '25'
                                                                                                            ? 'highlight-row-25'
                                                                                                            : rowData.cttp == '26'
                                                                                                                ? 'highlight-row-26'
                                                                                                                : rowData.cttp == '27'
                                                                                                                    ? 'highlight-row-27'
                                                                                                                    : rowData.cttp == '28'
                                                                                                                        ? 'highlight-row-28'
                                                                                                                        : rowData.cttp == '29'
                                                                                                                            ? 'highlight-row-29'
                                                                                                                            : '';
    };
    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" value={props.ticEvent.code} disabled={true} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText id="text" value={props.ticEvent.textx} disabled={true} />
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div className="card">
                        <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
                    </div>
                ) : (null)}
            </div>
            <div ref={tableRef}>
                <DataTable
                    key={componentKey}
                    dataKey="id"
                    size={"small"}
                    selectionMode="single"
                    selection={ticEventatts}
                    loading={loading}
                    loadingIcon="pi pi-spin pi-spinner"
                    value={ticEventattss}
                    header={header}
                    showGridlines
                    sortField="ctp" sortOrder={1}
                    removableSort
                    //editMode="cell"
                    //rowClassName={(rowData) => ({ 'editing-row': rowData === ticEventatts })}
                    rowClassName={(rowData) => {
                        const isEditing = rowData === ticEventatts;
                        const customClass = rowClass(rowData);

                        return {
                            'editing-row': isEditing,
                            [customClass]: customClass !== '',
                        };
                    }}

                    filters={filters}
                    scrollable
                    scrollHeight="550px"
                    //virtualScrollerOptions={{ itemSize: 46 }}
                    tableStyle={{ minWidth: '50rem' }}
                    //metaKeySelection={false}
                    paginator
                    rows={125}
                    rowsPerPageOptions={[125, 150, 200]}
                    onSelectionChange={(e) => setTicEventatts(e.value)}
                    onRowSelect={onRowSelect}
                    onRowUnselect={onRowUnselect}
                >
                    <Column
                        //bodyClassName="text-center"
                        body={eventattsTemplate}
                        exportable={false}
                        headerClassName="w-10rem"
                        style={{ minWidth: '4rem' }}
                    />
                    <Column field="ctp" header={translations[selectedLanguage].Code} sortable style={{ width: '10%' }}></Column>
                    <Column field="ntp" header={translations[selectedLanguage].Text} sortable style={{ width: '25%' }}></Column>
                    <Column field="nttp" header={translations[selectedLanguage].ntp} sortable style={{ width: '25%' }}></Column>
                    <Column field="ninputtp" header={translations[selectedLanguage].inputtp} sortable style={{ width: '10%' }}></Column>
                    <Column field="ddlist" header={translations[selectedLanguage].ddlist} sortable style={{ width: '10%' }}></Column>
                    <Column
                        field="value"
                        header={translations[selectedLanguage].condition1}
                        sortable

                        style={{ width: '20%' }}
                        editor={(e) => valueEditor(e.rowData, e.field, e)} // Dodali smo editor za editiranje value
                        body={valueTemplate}
                        onCellEditComplete={onCellEditComplete} // Dodali smo onCellEditComplete za validaciju
                    ></Column>
                    <Column
                        field="text"
                        header={translations[selectedLanguage].condition2}
                        sortable

                        style={{ width: '10%' }}
                        //editor={(props) => textEditor(props.rowData, props.field)} // Koristimo textEditor za editiranje teksta
                        editor={(e) => textEditor(e.rowData, e.field, e)} // Dodali smo editor za editiranje value
                        body={textTemplate}
                        onCellEditComplete={onCellEditComplete}
                    ></Column>
                    <Column
                        field="condition"
                        header={translations[selectedLanguage].condition3}
                        sortable

                        style={{ width: '10%' }}
                        //editor={(props) => textEditor(props.rowData, props.field)} // Koristimo textEditor za editiranje teksta
                        editor={(e) => conditionEditor(e.rowData, e.field, e)} // Dodali smo editor za editiranje value
                        //body={conditionTemplate}
                        onCellEditComplete={onCellEditComplete}
                    ></Column>
                    <Column
                        field="minfee"
                        header={translations[selectedLanguage].minfee}
                        sortable

                        style={{ width: '10%' }}
                        //editor={(props) => textEditor(props.rowData, props.field)} // Koristimo textEditor za editiranje teksta
                        editor={(e) => minfeeEditor(e.rowData, e.field, e)} // Dodali smo editor za editiranje value
                        //body={conditionTemplate}
                        onCellEditComplete={onCellEditComplete}
                    ></Column>
                    {/* <Column
                    field="valid"
                    filterField="valid"
                    dataType="numeric"
                    header={translations[selectedLanguage].Valid}
                    sortable
                    filter
                    filterElement={validFilterTemplate}
                    style={{ width: '5%' }}
                    bodyClassName="text-center"
                    body={validBodyTemplate}
                    editor={(props) => validEditor(props.rowData, props.field)} // Dodali smo editor za editiranje validnosti
                    onCellEditComplete={onCellEditComplete} // Dodali smo onCellEditComplete za validaciju
                ></Column> */}
                    <Column
                        header={translations[selectedLanguage].Valid}
                        field="valid"
                        dataType="numeric"
                        style={{ width: '1%' }}
                        bodyClassName="text-center"
                        body={(e) => toggleBodyTemplate(e, `valid`)}
                        onCellEditComplete={onCellEditComplete}
                    ></Column>
                    <Column
                        //header={translations[selectedLanguage].Valid}
                        style={{ width: '5%' }}
                        bodyClassName="text-center"
                        body={cmdBodyTemplate}
                    ></Column>

                </DataTable>
            </div>

            <Dialog
                header={translations[selectedLanguage].Link}
                visible={visible}
                style={{ width: '60%' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventatts
                        parameter={'inputTextValue'}
                        ticEventatts={ticEventatts}
                        ticEvent={props.ticEvent}
                        handleDialogClose={handleDialogClose}
                        setVisible={setVisible}
                        dialog={true}
                        eventattsTip={eventattsTip}
                    />}
                <div className="p-dialog-header-icons" style={{ display: 'none' }}>
                    <button className="p-dialog-header-close p-link">
                        <span className="p-dialog-header-close-icon pi pi-times"></span>
                    </button>
                </div>
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventAttsgrpList}
                visible={ticEventattsgrpLVisible}
                style={{ width: '60%' }}
                onHide={() => {
                    setTicEventattsgrpLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventattsgrpL
                        parameter={'inputTextValue'}
                        ticEvent={props.ticEvent}
                        handleTicEventattsgrpLDialogClose={handleTicEventattsgrpLDialogClose}
                        setTicEventattsgrpLVisible={setTicEventattsgrpLVisible}
                        setVisible={setVisible}
                        dialog={true}
                        lookUp={false}
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventTmpList}
                visible={ticEventTmpLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventTmpLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventTmpL
                        parameter={'inputTextValue'}
                        ticEvent={props.ticEvent}
                        //setTicArtLVisible={setTicArtLVisible} 
                        handleTicEventattsgrpLDialogClose={handleTicEventattsgrpLDialogClose}
                        setTicEventTmpLVisible={setTicEventTmpLVisible}
                        dialog={true}
                        lookUp={true}
                        eventArt={true}
                    />}
            </Dialog>
            <ConfirmDialog visible={confirmDialogVisible} onHide={() => setConfirmDialogVisible(false)} onConfirm={handleConfirm} />
        </div>
    );
}
