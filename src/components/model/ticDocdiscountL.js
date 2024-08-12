import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { TicDocdiscountService } from '../../service/model/TicDocdiscountService.js';
import TicDocdiscount from './ticDocdiscount';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";

import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

import { Button } from "primereact/button";
import DeleteDialog from '../dialog/DeleteDialog';

export default function TicDocdiscountL(props) {
    // console.log(props, "00-TicDocdiscountL-000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
    const _doc = { ...props.ticDoc }
    if (_doc.usr == '1') _doc.usr = null

    const objName = "tic_docdiscount"
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicDocdiscount = EmptyEntities[objName]
    emptyTicDocdiscount.doc = props.ticDoc?.id
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticDocdiscounts, setTicDocdiscounts] = useState([]);
    const [ticDocdiscount, setTicDocdiscount] = useState(emptyTicDocdiscount);

    const [cmnTickettps, setCmnTickettps] = useState([]);
    const [ddTickettpItems, setDdTickettpItems] = useState(null);

    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [docdiscountTip, setDocdiscountTip] = useState('');

    const [ticDocdiscountVisible, setTicDocdiscountVisible] = useState(false)
    const [akcija, setAkcija] = useState(null);
    const [karteIznos, setKarteIznos] = useState(props.karteIznos||0);

    let i = 0
    const handleCancelClick = () => {
        props.setTicDocdiscountLVisible(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const ticDocdiscountService = new TicDocdiscountService();
                    const data = await ticDocdiscountService.getLista(props.ticDoc?.id);

                    setTicDocdiscounts(data);
                    // initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [props.refresh]);


    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _ticDocdiscounts = [...ticDocdiscounts];
        let _ticDocdiscount = { ...localObj.newObj.obj };
        //setSubmitted(true);
        if (localObj.newObj.docdiscountTip === "CREATE") {
            _ticDocdiscounts.push(_ticDocdiscount);
        } else if (localObj.newObj.docdiscountTip === "UPDATE") {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticDocdiscounts[index] = _ticDocdiscount;
        } else if ((localObj.newObj.docdiscountTip === "DELETE")) {
            _ticDocdiscounts = ticDocdiscounts.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocdiscount Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocdiscount ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docdiscountTip}`, life: 3000 });
        setTicDocdiscounts(_ticDocdiscounts);
        setTicDocdiscount(emptyTicDocdiscount);
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticDocdiscounts.length; i++) {
            if (ticDocdiscounts[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    // <--- Dialog
    const setTicDocdiscountDialog = (ticDocdiscount) => {
        setVisible(true)
        setDocdiscountTip("CREATE")
        setTicDocdiscount({ ...ticDocdiscount });
    }
    /********************************************************************************/
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    /********************************************************************************/

    useEffect(() => {
        async function fetchData() {
            try {

                const ticDocdiscountService = new TicDocdiscountService();
                const data = await ticDocdiscountService.getCmnObjByTpCode('t.code', 'XTCTP');
                setCmnTickettps(data);
                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                setDdTickettpItems(dataDD);

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const handleStornoClose = (newObj) => {
        setTicDocdiscountVisible(false);
    }

    const openNew = () => {
        setTicDocdiscountDialog(emptyTicDocdiscount);
    };

    const renderHeader = () => {
        return (
            <div className="flex card-container">
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div>
                <div className="flex-grow-1" />
                <b>{translations[selectedLanguage].DiscountList}</b>
                <div className="flex-grow-1"></div>
            </div>
        );
    };

    const header = renderHeader();

    const newTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
            </div>
        );
    };
    const actionTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">

                <Button
                    type="button"
                    icon="pi pi-pencil"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        setTicDocdiscountDialog(rowData)
                        setDocdiscountTip("UPDATE")
                    }}
                    text
                    raised ></Button>

            </div>
        );
    };
    /*********************************************************************************** */
    const popustTotal = () => {
        let total = 0;

        for (let stavka of ticDocdiscounts) {
            let iznos = Number(stavka.iznos); // ili parseFloat(stavka.potrazuje)
            if (!isNaN(iznos)) {
                total += iznos;
            }
        }
        props.handlePopustIznos(total)
        return total;
    };
    const footerArtikalGroup = (
        <ColumnGroup>
            <Row>
                <Column footer={translations[selectedLanguage].Total} colSpan={4} footerStyle={{ textAlign: 'right' }} />
                <Column footer={popustTotal} />
            </Row>
        </ColumnGroup>
    );    
    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                dataKey="id"
                size={"small"}
                selectionMode="single"
                // header={header}
                footerColumnGroup={footerArtikalGroup}
                selection={ticDocdiscount}
                loading={loading}
                value={ticDocdiscounts}
                showGridlines
                removableSort
                scrollable
                scrollHeight="350px"
                tableStyle={{ minWidth: "50rem" }}
                metaKeySelection={false}
                rows={20}
                onSelectionChange={(e) => setTicDocdiscount(e.value)}
            >
                <Column
                    //bodyClassName="text-center"
                    body={actionTemplate}
                    exportable={false}
                    // headerClassName="w-10rem"
                    header={newTemplate}
                    style={{ minWidth: '4rem' }}
                />
                <Column
                    field="text"
                    header={translations[selectedLanguage].Popust}
                    sortable
                    style={{ width: "25%" }}
                ></Column>
                <Column
                    field="eksternibroj"
                    header={translations[selectedLanguage].Code}
                    style={{ width: "15%" }}
                    sortable
                ></Column>
                <Column
                    field="procenat"
                    header={translations[selectedLanguage].Procenat}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="iznos"
                    header={translations[selectedLanguage].Value}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="postavka"
                    header={translations[selectedLanguage].Postavka}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
            </DataTable>

            <Dialog
                header={translations[selectedLanguage].Docdiscount}
                visible={visible}
                style={{ width: '60%' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                    <TicDocdiscount
                        parameter={"inputTextValue"}
                        ticDocdiscount={ticDocdiscount}
                        ticDoc={props.ticDoc}
                        handleDialogClose={handleDialogClose}
                        setVisible={setVisible}
                        dialog={true}
                        docdiscountTip={docdiscountTip}
                        karteIznos={props.karteIznos}
                    />
                )}
            </Dialog>

            <Dialog
                header={
                    <div className="dialog-header">
                        <Button
                            label={translations[selectedLanguage].Cancel} icon="pi pi-times"
                            onClick={() => {
                                setTicDocdiscountVisible(false);
                            }}
                            severity="secondary" raised
                        />
                    </div>
                }
                visible={ticDocdiscountVisible}
                style={{ width: '80%' }}
                onHide={() => {
                    setTicDocdiscountVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                    <TicDocdiscount
                        parameter={"inputTextValue"}
                        ticDocdiscount={ticDocdiscount}
                        ticDoc={props.ticDoc}
                        handleStornoClose={handleStornoClose}
                        dialog={true}
                        akcija={akcija}
                        karteIznos={props.karteIznos}
                    />
                )}
            </Dialog>
            <DeleteDialog visible={deleteDialogVisible} inAction="delete" onHide={hideDeleteDialog} />
        </div>
    );
}
