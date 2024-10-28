import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { translations } from '../../configs/translations';
import DateFunction from '../../utilities/DateFunction';

const TicEventCpsL = (props) => {
    const [ticEvents, setTicEvents] = useState([]);
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    useEffect(() => {
        async function fetchData() {
            try {
                if (props.ticEvents) {
                    setTicEvents([...props.ticEvents])
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [props.ticEvents]);

    const deleteTicEvent = (rowData) => {
        props.handleDelete(rowData); // Poziva funkciju iz nadređene komponente
    };

    const formatDateColumn = (rowData, field) => {
        return DateFunction.formatDate(rowData[field]);
    };

    const formatTimeColumn = (rowData, field) => {
        return DateFunction.convertTimeToDisplayFormat(rowData[field]);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                severity="danger"
                style={{ width: '24px', height: '24px' }}
                raised
                onClick={() => deleteTicEvent(rowData)}
            />
        );
    };

    return (
        <div className="card">
            {ticEvents &&
                <DataTable 
                value={ticEvents} 
                responsiveLayout="scroll"
                sortField="endda"
                sortOrder={-1}
                scrollHeight="440px"
                >
                    <Column field="code" header={translations[selectedLanguage].Code}></Column>
                    <Column field="textx" header={translations[selectedLanguage].Text}></Column>
                    <Column field="begda" header={translations[selectedLanguage].Prodaja}
                    body={(rowData) => formatDateColumn(rowData, 'begda')}
                    ></Column>
                    <Column field="begtm" header={translations[selectedLanguage].BegTM}
                    body={(rowData) => formatTimeColumn(rowData, 'begtm')}
                    ></Column>
                    <Column field="endda" header={translations[selectedLanguage].Dogadjaj}
                    body={(rowData) => formatDateColumn(rowData, 'endda')}
                    ></Column>
                    <Column field="endtm" header={translations[selectedLanguage].BegTM}
                    body={(rowData) => formatTimeColumn(rowData, 'endtm')}
                    ></Column>
                    <Column header="Action" body={actionBodyTemplate}></Column>
                </DataTable>
            }
        </div>
    );
};

export default TicEventCpsL;
