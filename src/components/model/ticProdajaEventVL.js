import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Toast } from "primereact/toast";
import { TicEventService } from '../../service/model/TicEventService';
import { translations } from "../../configs/translations";

function TicProdajaEventVL(props) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [ticEventsNs, setTicDocsNs] = useState([]);
    const [selectedNaknade, setSelectedNaknade] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        async function fetchNaknade() {
            setLoading(true);
            try {
                const ticEventService = new TicEventService();
                const data = await ticEventService.getEventPregledVLista(props.ticEvent.id);
                // if (data) {
                    data.sort((a, b) => {
                        if (a.nevent === b.nevent) {
                            return a.nart < b.nart ? -1 : a.nart > b.nart ? 1 : 0;
                        }
                        return a.nevent < b.nevent ? -1 : 1;
                    });
                // }
                setTicDocsNs(data);
            } catch (error) {
                console.error('Failed to fetch naknade:', error);
                // toast.current.show({ severity: 'error', summary: 'Error fetching data', detail: 'Failed to load Naknade.', life: 3000 });
            } finally {
                setLoading(false);
            }
        }
        fetchNaknade();
    }, [props.ticEvent.id, props.refresh]);

    const calculateTotal = (field) => {
        return ticEventsNs.reduce((acc, item) => acc + (Number(item[field]) || 0), 0);
    };

    const footerNaknadeGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Total" colSpan={2} footerStyle={{ textAlign: 'right' }} />
                <Column footer={calculateTotal('uprodaji')} />
                <Column footer={calculateTotal('nabvrednost')} />
                <Column footer={calculateTotal('prodato')} />
                <Column footer={calculateTotal('iznos')} />
                <Column footer={calculateTotal('slobodno')} />
            </Row>
        </ColumnGroup>
    );


    const onRowSelect = (event) => {
        console.log('Selected Naknade:', event.data);
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                value={ticEventsNs}
                loading={loading}
                size={"small"}
                dataKey="id"
                selectionMode="single"
                showGridlines
                selection={selectedNaknade}
                onSelectionChange={e => setSelectedNaknade(e.value)}
                onRowSelect={onRowSelect}
                scrollable
                footerColumnGroup={footerNaknadeGroup}
            >
                <Column
                    field="nart"
                    header={translations[selectedLanguage].nart}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="sector"
                    header={translations[selectedLanguage].Sektor}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="uprodaji"
                    header={translations[selectedLanguage].uprodaji}
                    sortable
                    //filter
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="nabvrednost"
                    header={translations[selectedLanguage].nabvrednost}
                    sortable
                    //filter
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="prodato"
                    header={translations[selectedLanguage].prodato}
                    sortable
                    style={{ width: "5%" }}
                ></Column>
                <Column
                    field="iznos"
                    header={translations[selectedLanguage].iznos}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="slobodno"
                    header={translations[selectedLanguage].slobodno}
                    sortable
                    style={{ width: "15%" }}
                ></Column>
            </DataTable>
        </div>
    );
}

export default TicProdajaEventVL;
