import React, { useState, useRef, useEffect } from 'react';
import { TicDocsService } from '../../service/model/TicDocsService';
import { TicDocsdiscountService } from '../../service/model/TicDocsdiscountService';
import { TicDocdiscountService } from '../../service/model/TicDocdiscountService';

import { EmptyEntities } from '../../service/model/EmptyEntities';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { translations } from "../../configs/translations";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';

const TicDocsdiscountL = (props) => {

    const objName = "tic_docsdiscount";
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicDocsdiscount = EmptyEntities[objName];

    let [ticDocsdiscount, setTicDocsdiscount] = useState({...emptyTicDocsdiscount});
    const [ticDocsdiscounts, setTicDocsdiscounts] = useState([]);
    const [showDiscount, setShowDiscount] = useState(false);

    const [cmnDiscounts, setCmnDiscounts] = useState([]);
    const [ddDiscountItem, setDdDiscountItem] = useState(null);
    const [ddDiscountItems, setDdDiscountItems] = useState(null);

    const [ddTicDocsdiscountItem, setDdTicDocsdiscountItem] = useState(null);
    const [ddTicDocsdiscountItems, setDdTicDocsdiscountItems] = useState(null);
    const [ticDocsdiscountItem, setTicDocsdiscountItem] = useState(null);
    const [ticDocsdiscountItems, setTicDocsdiscountItems] = useState(null);
    const [checked, setChecked] = useState(false);
    const [discountKey, setDiscountKey] = useState(0);
    let [refresh, setRefesh] = useState(0)

    const data = [{ code: 1, text: 'eqweqw' }, { code: 2, text: 'werwerw' }]
    let i = 0
    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocsService = new TicDocsService();
                const data = await ticDocsService.getHaveDiscount(props.item.docs);
                // console.log(data, "**###HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH$$$%%%***!!!---+++///((({{{}}})))")
                setShowDiscount(data.count == 0 ? false : true);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [props.item, refresh]);

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const ticDocsdiscountService = new TicDocsdiscountService();
                    const data = await ticDocsdiscountService.getTicDocsdiscountLista(props.item.docs);
                    // console.log(data, "555555555555555555555555555555555555555555555555555555555555555555555")
                    setTicDocsdiscounts(data);
                    // initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [props.item, refresh]);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocsdiscountService = new TicDocsdiscountService();
                const data = await ticDocsdiscountService.getDiscounttpListaP(props.item.docs);
                setTicDocsdiscountItems(data)
                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                setDdTicDocsdiscountItems(dataDD);
                // setDdTicDocsdiscountItem(dataDD.find((item) => item.code === props.ticDocsdiscount.discount) || null);
                // if (props.ticDocsdiscount.discount) {
                //     const foundItem = data.find((item) => item.id === props.ticDocsdiscount.discount);
                //     setTicDocsdiscountItem(foundItem || null);
                // }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        // console.log("## 1 HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH #############################################")
        fetchData();
    }, [props.item]);
    const updateDataInDatabase = async (rowData) => {
        try {
            // console.log(rowData, "00***********updateDataInDatabase************!!!!!!!!!!!!!!!!!!!!!", rowData.value)
            rowData.vreme = null;
            const ticDocsdiscountService = new TicDocsdiscountService();
            await ticDocsdiscountService.putTicDocsdiscount(rowData);
            // Dodatno rukovanje ažuriranim podacima, ako je potrebno          
        } catch (err) {
            console.error('Error updating data:', err);
            // Dodatno rukovanje greškom, ako je potrebno
        }
    };

    const deleteDataInDatabase = async (rowData) => {
        try {
            console.log(rowData, "00***********updateDataInDatabase************!!!!!!!!!!!!!!!!!!!!!", rowData.value)
            rowData.vreme = null;
            const ticDocsdiscountService = new TicDocsdiscountService();
            await ticDocsdiscountService.deleteTicDocsdiscount(rowData);
            // Dodatno rukovanje ažuriranim podacima, ako je potrebno          
        } catch (err) {
            console.error('Error updating data:', err);
            // Dodatno rukovanje greškom, ako je potrebno
        }
    };
    /*********************************************************************************** */

    const onInputChange = async (e, type, name, rowData) => {
        let val = (e.target && e.target.value) || '';
        let _ticDocsdiscount = emptyTicDocsdiscount
        setTicDocsdiscounts([...ticDocsdiscounts]);
        console.log(rowData, `**********`, val, `# 00 ## 00 ################################################################################`, _ticDocsdiscount)
        if (name == 'eksternibroj') {
            rowData.eksternibroj = val;
        } else if (name == 'procenat') {
            rowData.procenat = val;
        } else if (name == 'iznos') {
            rowData.iznos = val;
        }
        _ticDocsdiscount = { ...ticDocsdiscount };
        _ticDocsdiscount[`${name}`] = val;
        setTicDocsdiscount=(_ticDocsdiscount);
        await updateDataInDatabase(_ticDocsdiscount);
        // console.log(updatedTicDocsdiscounts, "****************HHHHHS***************", val, "##########")
        // updatedTicDocsdiscounts[rowIndex][`${name}`] = val;
        // _ticDocsdiscount[`${name}`] = val;
        // setTicDocsdiscounts([...updatedTicDocsdiscounts])
        // setTicDocsdiscount(_ticDocsdiscount)
        // console.log(ticDocsdiscounts, "*******************************", updatedTicDocsdiscounts[rowIndex])
        
        
        // const rowIndex = await ticDocsdiscounts.findIndex((row) => row.id === rowData.id);
        // updatedTicDocsdiscounts[rowIndex][`${name}`] = val;
        // setTicDocsdiscounts([...updatedTicDocsdiscounts])
        // setTicDocsdiscount(_ticDocsdiscount)
        setRefesh(++refresh)
        // setDiscountKey(++refresh)
    };
    // const onCellEditComplete = async (e) => {
    //     console.log("+++++++++++++++++++++++++++++++++++++++++")
    //     let { rowData, newValue, field, originalEvent: event } = e;
    //     if (newValue !== null) {
    //         rowData[field] = newValue;
    //         setTicDocsdiscounts([...ticDocsdiscounts]);
    //     } else {
    //         event.preventDefault();
    //     }
    // };
    const onCellEditComplete = async (e) => {
        // console.log(e.rowData, "55555555555555555555555555555555555555555555555555555")
        let { rowData, newValue, field } = e;
        if (newValue !== rowData[field]) {
            rowData[field] = newValue;
            await updateDataInDatabase(rowData);
            // fetchDataAgain();  // Ova funkcija treba ponovo da učita podatke iz baze
        }
        await updateDataInDatabase(e.rowData);
        setRefesh(++refresh)
        
    };

    /**************************************************************************************************** */

    const onDDValueChange = async (e, type, name, rowData) => {
        let val = '';

        rowData.discount = e.value?.code;

        val = (e.target && e.target.value && e.target.value?.code) || '';
        console.log(e.value, "44444444444444444444444444444444444444444444444")
        await setDdDiscountItem(e.value);

        const updatedTicDocsdiscounts = [...ticDocsdiscounts];
        
        const rowIndex = await updatedTicDocsdiscounts.findIndex((row) => row.id === rowData.id);
        updatedTicDocsdiscounts[rowIndex][`${name}`] = val;
        await updateDataInDatabase(updatedTicDocsdiscounts[rowIndex]);
        setRefesh(++refresh)
        // const rowIndex = await updatedTicDocss.findIndex((row) => row.id === rowData.id);
        // rowData.tickettp = e.value?.code;
        // const tip = e.value?.name.slice(0, 1)


        // val = (e.target && e.target.value && e.target.value?.code) || '';
        // await setDdTickettpItem(e.value);

        // const updatedTicDocss = [...ticDocss];

        // const rowIndex = await updatedTicDocss.findIndex((row) => row.id === rowData.id);

        // updatedTicDocss[rowIndex][`${name}`] = val;
        // delete updatedTicDocss[rowIndex].vreme;
        // if (tip == 'R') {
        //     updatedTicDocss[rowIndex][`print`] = 1
        //     rowData.print = 1
        // } else {
        //     updatedTicDocss[rowIndex][`print`] = 0
        //     rowData.print = 0
        // }
        // console.log(updatedTicDocss[rowIndex], "777777777777777777777777777777777777777777777777777777")
        // await updateDataInDatabase(updatedTicDocss[rowIndex]);
        // setRefesh(++refresh)
        // props.remoteRefresh()
        // props.remoteRefresh()

    };

    /**************************************************************************************************** */
    const eksternibrojEditor = (options) => {
        console.log(options.value, "################### AAA ######################")
        return <InputText
            value={options.value}
            onChange={(e) => onInputChange(e, 'input', 'eksternibroj', options.rowData)}
        />;
    };
    const procenatEditor = (options) => {
        console.log(options.rowData.procenat, "################### AAA ######################")
        return <InputText
            value={options.value}
            onChange={(e) => onInputChange(e, 'input', 'procenat', options.rowData)}
        />;
    };
    const iznosEditor = (rowData, field, e) => {
        return <InputText
            value={rowData.iznos}
            onChange={(e) => onInputChange(e, 'input', field, rowData)}
        />;
    };

    const discountEditor = (rowData, field, e) => {
        const selectedOptions = ddTicDocsdiscountItems;
        console.log(selectedOptions, "3333333333333333333333333333333333333333333")
        const selectedOption = selectedOptions.find((option) => option.code === rowData.discount);
        console.log(selectedOption, "02-3333333333333333333333333333333333333333333")
        return <Dropdown
            id={rowData.id}
            showClear
            value={selectedOption}
            options={selectedOptions}
            onChange={(e) => onDDValueChange(e, 'options', 'discount', rowData)}
            placeholder="Select One"
            optionLabel="name"
        />;
    };
    const discountTemplate = (rowData) => {
        // const dropdownData = ddTickettpItems
        if (ddTicDocsdiscountItems) {
            const dropdownValue = ddTicDocsdiscountItems?.find((item) => item.code == rowData.discount);
            if (dropdownValue) {
                return <span>{dropdownValue.name}</span>;
            }
        }
        return rowData.tickettp;
    };
    /***************************************************************************************** */
    const toggleBodyTemplate = (rowData, name, e) => {

        const checked = rowData[name] == 1; // Pretpostavimo da 'valid' određuje da li je dugme čekirano
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
                    onChange={(e) => toggleChecked(e, name, rowData)} // Ako treba ažurirati stanje u komponenti
                    // className={`w-9rem ${buttonClass}`}
                    className={`${buttonClass}`}
                />
            </div>
        );
    };
    const toggleChecked = async (e, name, rowData) => {
        const newCheckedState = e.value;
        setChecked(newCheckedState);
        let val = '';
        let _ticDocsdiscount = {}
        val = newCheckedState ? 1 : 0;
        _ticDocsdiscount = { ...rowData };
        // Update data in parent component or global store

        const updatedTicDocsdiscounts = [...ticDocsdiscounts];

        const rowIndex = await updatedTicDocsdiscounts.findIndex((row) => row.id === rowData.id);

        updatedTicDocsdiscounts[rowIndex][`${name}`] = val;
        delete updatedTicDocsdiscounts[rowIndex].vreme;
        if (name == 'del') {
            await deleteDataInDatabase(updatedTicDocsdiscounts[rowIndex]);
        } else {
            await updateDataInDatabase(updatedTicDocsdiscounts[rowIndex]);
        }
        setRefesh(++refresh)
        // props.remoteRefresh(++refresh)
    };
    /***************************************************************************************** */

    const fetchDataAgain = async () => {
        try {
            const data = await new TicDocsdiscountService().getTicDocsdiscountLista(props.item.docs);
            setTicDocsdiscounts(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        showDiscount ?
            <DataTable
                key={discountKey}
                value={ticDocsdiscounts}
                selection={ticDocsdiscount}
                size={"small"}
                rowClassName="custom-row-color"
                stripedRows
                showGridlines
                responsiveLayout="scroll"
                selectionMode="single"
                sortField="id" sortOrder={-1}
            // showHeaders={false}
            >
                <Column
                    field="eksternibroj"
                    header={translations[selectedLanguage].Code}
                    editor={eksternibrojEditor}
                    onCellEditComplete={onCellEditComplete}
                />
                <Column
                    field="discount"
                    header={translations[selectedLanguage].Tip}
                    // editor={discountEditor}
                    editor={(e) => discountEditor(e.rowData, e.field, e)}
                    body={discountTemplate}
                    onCellEditComplete={onCellEditComplete}
                />
                <Column
                    field="procenat"
                    header={translations[selectedLanguage].procenat}
                    editor={procenatEditor} // Ovako bi trebalo da izgleda poziv
                    onCellEditComplete={onCellEditComplete}
                />

                <Column
                    field="iznos"
                    header={translations[selectedLanguage].apsolut}
                    // editor={iznosEditor}
                    editor={(e) => iznosEditor(e.rowData, e.field, e)}
                    onCellEditComplete={onCellEditComplete}
                />
                <Column
                    field="discountvalue"
                    header={translations[selectedLanguage].discountvalue}
                />
                <Column
                    field="proc"
                    header={translations[selectedLanguage].proc}
                    style={{ width: '1%' }}
                    bodyClassName="text-center"
                    body={(e) => toggleBodyTemplate(e, `proc`)}
                    onCellEditComplete={onCellEditComplete}
                />
                <Column
                    field="allitem"
                    header={translations[selectedLanguage].allitem}
                    style={{ width: '1%' }}
                    bodyClassName="text-center"
                    body={(e) => toggleBodyTemplate(e, `allitem`)}
                    onCellEditComplete={onCellEditComplete}
                />
                <Column
                    header={translations[selectedLanguage].del}
                    field="del"
                    // dataType="numeric"
                    style={{ width: '1%' }}
                    bodyClassName="text-center"
                    body={(e) => toggleBodyTemplate(e, `del`)}
                    onCellEditComplete={onCellEditComplete}
                ></Column>
            </DataTable>
            : null

    );
};

export default TicDocsdiscountL;
