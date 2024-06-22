import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { TicDocsService } from "../../service/model/TicDocsService";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import { Dropdown } from 'primereact/dropdown';


export default function TicTransactionsL(props) {
    // console.log(props, "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
    const _doc = { ...props.ticDoc }
    if (_doc.usr == '1') _doc.usr = null

    const objName = "tic_docs"
    const parTp = '-1'
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicDocs = EmptyEntities[objName]
    emptyTicDocs.doc = props.ticDoc?.id

    const [ticDocss, setTicDocss] = useState([]);
    const [ticDocs, setTicDocs] = useState(emptyTicDocs);

    const [ticDocsNs, setTicDocsNs] = useState([]);
    const [ticDocsN, setTicDocsN] = useState(emptyTicDocs);

  

    const [cmnTickettps, setCmnTickettps] = useState([]);
    const [ddTickettpItem, setDdTickettpItem] = useState(null);
    const [ddTickettpItems, setDdTickettpItems] = useState(null);

    const [loading, setLoading] = useState(false);
    const toast = useRef(null);



    let i = 0

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const ticDocsService = new TicDocsService();
                    const data = await ticDocsService.getArtikliLista(props.ticDoc?.id);
                    // //console.log(data, "---------------------------------AAAAAAAA--------------------------------------")
                    setTicDocss(data);
                    initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    /*********************************************************************************** */
    /*********************************************************************************** */
    const onInputValueChange = async (e, type, name, rowData) => {
        let val = '';
        let _ticEventatts = {}
        switch (type) {
            case 'options':
                rowData.value = e.value?.code;
                val = (e.target && e.target.value && e.target.value?.code) || '';
                await setDropdownItem(e.value);
                break;
            default:
                val = '';
                break;
        }

        const updatedTicDocss = [...ticDocss];

        const rowIndex = await updatedTicDocss.findIndex((row) => row.id === rowData.id);

        updatedTicDocss[rowIndex] = rowData;

        // Postavljanje novog niza kao stanje za ticEventattss
        await setTicEventattss(updatedTicDocss);

        _ticDocs = { ...ticDocs };
        _ticDocs[`${name}`] = val;
        await setTicEventatts(_ticDocs);
        await updateDataInDatabase(_ticDocs);
    };

    const valueEditor = (rowData, field, e) => {
        //console.log(rowData, '************************rowData*************e***************', e);
        const [modul, tabela, code] = rowData.ddlist.split(',');
        let apsTabela = `${modul}_${tabela}`;
        if (code) {
            apsTabela = apsTabela + `_${code}`
        }

        const selectedOptions = dropdownAllItems[apsTabela] || [];
        //console.log(selectedOptions, '******************selectedOptions11111*******', apsTabela, '*********WWWWW******');
        setDropdownItems(selectedOptions);
        const selectedOption = dropdownAllItems[apsTabela].find((option) => option.code === rowData.value);
        setDropdownItem(selectedOption);
        // console.log(selectedOption, selectedOptions, rowData, apsTabela, "*****555555********")
        return <Dropdown
            id={rowData.id}
            showClear
            value={selectedOption}
            options={selectedOptions}
            onChange={(e) => onInputValueChange(e, 'options', 'value', rowData)}
            placeholder="Select One"
            optionLabel="name"
        />;
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
        if ((rowData.inputtp === '5') || (rowData.inputtp === '8')) {
            let value = ''
            if (rowData.value) {
                value = DateFunction.formatDate(rowData.value)
            }
            return (
                <span>{value}</span>
            );
        }
        return rowData.value;
    };
    const onCellEditComplete = async (e) => {
        let { rowData, newValue, newRowData, field, originalEvent: event } = e;
        let _rowData = { ...rowData };
        let _newValue = newValue;

        if (newValue != null) {
            _rowData[field] = _newValue;
            // Check if upload is pending and prevent exiting edit mode
            if (rowData.inputtp === '4' && !_rowData.isUploadPending) {
                event.preventDefault();
            }
        } else event.preventDefault();

        // Ažuriramo stanje komponente
        setTicEventattss([...ticEventattss]);
    };

    /*********************************************************************************** */
    /*********************************************************************************** */
    useEffect(() => {
        async function fetchData() {
            try {

                const ticDocsService = new TicDocsService();
                const data = await ticDocsService.getCmnObjByTpCode('t.code', 'XTCTP');
                setCmnTickettps(data);
                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                setTickettps(dataDD);
                setTickettp(dataDD.find((item) => item.code === props.ticEvent.ctg) || null);                


            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    /*********************************************************************************** */
    /*********************************************************************************** */
    return (
        <div className="card">
            <Toast ref={toast} />
            <DocZaglavlje />
            <DataTable
                dataKey="id"
                size={"small"}
                selectionMode="single"
                selection={ticDocs}
                loading={loading}
                value={ticDocss}
                showGridlines
                removableSort
                scrollable
                scrollHeight="350px"
                tableStyle={{ minWidth: "50rem" }}
                metaKeySelection={false}
                rows={10}
                editMode="cell"
            >
                <Column
                    field="nevent"
                    header={translations[selectedLanguage].nevent}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="row"
                    header={translations[selectedLanguage].red}
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="seat"
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="nart"
                    header={translations[selectedLanguage].nart}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="price"
                    header={translations[selectedLanguage].price}
                    sortable
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="output"
                    header={translations[selectedLanguage].outputL}
                    sortable
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="discount"
                    header={translations[selectedLanguage].discount}
                    sortable
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="potrazuje"
                    header={translations[selectedLanguage].potrazuje}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="value"
                    header={translations[selectedLanguage].condition1}
                    sortable
                    filter
                    style={{ width: '10%' }}
                    editor={(e) => valueEditor(e.rowData, e.field, e)}
                    body={valueTemplate}
                    onCellEditComplete={onCellEditComplete}
                ></Column>
            </DataTable>


        </div>
    );
}
