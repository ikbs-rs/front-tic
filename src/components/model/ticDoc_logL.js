import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TicDocService } from "../../service/model/TicDocService";

const TicDoc_LogTable = (props) => {

  const [ticDoc_logs, setTicDoc_logs] = useState([]);
  let i = 0

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticDocService = new TicDocService();
          const data = await ticDocService.getDoc_LogLista(props.table1, props.tableid, props.table2);
          setTicDoc_logs(data);

        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  return (
    <DataTable value={ticDoc_logs} paginator rows={100} rowsPerPageOptions={[100, 250, 500]} tableStyle={{ minWidth: '50rem' }}>
      <Column field="id" header="ID"></Column>
      <Column field="table_name" header="table_name"></Column>
      <Column field="operation" header="Operation"></Column>
      <Column field="change_time" header="change_time"></Column>
      <Column field="usr" header="usr"></Column>
      <Column
        field="changed_data"
        header="Changed Data"
        body={(rowData) => JSON.stringify(rowData.changed_data, null, 2)}
      ></Column>
    </DataTable>
  );
};

export default TicDoc_LogTable;