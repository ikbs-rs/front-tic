import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Toast } from "primereact/toast";
import { TicDocsService } from '../../service/model/TicDocsService';
import { translations } from "../../configs/translations";

function TicDocsNaknadeL(props) {
    // console.log("AA EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", props.ticDoc.id)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [ticDocsNs, setTicDocsNs] = useState([]);
    const [selectedNaknade, setSelectedNaknade] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        async function fetchNaknade() {
            // setLoading(true);
            try {
                const ticDocsService = new TicDocsService();
                let data = await ticDocsService.getNaknadeListaP(props.ticDoc.id);
                // console.log(data, "00 EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", props.ticDoc.id)
                if (data) {
                    data.sort((a, b) => {
                        if (a.nevent === b.nevent) {
                            return a.nart < b.nart ? -1 : a.nart > b.nart ? 1 : 0;
                        }
                        return a.nevent < b.nevent ? -1 : 1;
                    });
                    setTicDocsNs(data);
                } else {
                    data = []
                }

                
                // console.log(data, "01 EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
            } catch (error) {
                console.error('Failed to fetch naknade:', error);
                // toast.current.show({ severity: 'error', summary: 'Error fetching data', detail: 'Failed to load Naknade.', life: 3000 });
            } finally {
                // setLoading(false);
            }
        }
        fetchNaknade();
    }, [props.ticDoc.id, props.refresh]);

    const potrazujeNaknadeTotal = () => {
        let total = ticDocsNs.reduce((acc, item) => acc + Number(item.potrazuje), 0)
        props.handleNaknadeIznos(total)
        return total;
    };


    const onRowSelect = (event) => {
        console.log('Selected Naknade:', event.data);
    };

    const footerNaknadeGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Total" colSpan={4} footerStyle={{ textAlign: 'right' }} />
                <Column footer={potrazujeNaknadeTotal()} />
            </Row>
        </ColumnGroup>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                value={ticDocsNs}
                loading={loading}
                size={"small"}
                dataKey="id"
                selectionMode="single"
                showGridlines
                selection={selectedNaknade}
                onSelectionChange={e => setSelectedNaknade(e.value)}
                onRowSelect={onRowSelect}
                scrollable
                scrollHeight="150px"
                footerColumnGroup={footerNaknadeGroup}
            >
                <Column
                    field="nevent"
                    header={translations[selectedLanguage].nevent}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="nart"
                    header={translations[selectedLanguage].nart}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="taxrate"
                    header={translations[selectedLanguage].tax}
                    sortable
                    //filter
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="output"
                    header={translations[selectedLanguage].output}
                    sortable
                    //filter
                    style={{ width: "10%" }}
                ></Column>
                {/* <Column
                    field="discount"
                    header={translations[selectedLanguage].discount}
                    sortable
                    style={{ width: "5%" }}
                ></Column> */}
                <Column
                    field="potrazuje"
                    header={translations[selectedLanguage].potrazuje}
                    sortable
                    style={{ width: "15%" }}
                ></Column>

            </DataTable>
        </div>
    );
}

export default TicDocsNaknadeL;
