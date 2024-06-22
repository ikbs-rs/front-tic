import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TicDocsuidService } from "../../service/model/TicDocsuidService";
import { EmptyEntities } from '../../service/model/EmptyEntities';

export default function TicDocsuidProdajaL(props) {
    const objName = "tic_docsuid";
    const emptyTicEvent = EmptyEntities[objName];
    const [ticDocsuids, setTicDocsuids] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocsuidService = new TicDocsuidService();
                const data = await ticDocsuidService.getProdajaLista(props.ticDoc.id);
                console.log("555555555555555555555555555555555555555555555555555555555555**WWW****************", data, "**WWW****************");
                setTicDocsuids(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [props.ticDoc.id]);

    const handleClick = (item, e) => {
        console.log("777777777777777777777777777777777**WWW****************", item, "**WWW****************");
    };

    const onInputChange = (e, field, index, item) => {
        const value = e.target.value;
        const _ticDocsuids = [...ticDocsuids];
        console.log(value, "**WWW****************", _ticDocsuids, "**WWW****************#######################################", index);
        // _ticDocsuids[index][field] = value;
        // setFormData(newFormData);
    };

    return (
        <div className="card  scrollable-content">
            {ticDocsuids.map((item) => (
                <div key={item.docsid} className="card">
                    <div className="grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor={`first-${item.id}`}>First</label>
                            <InputText
                                id={`first-${item.id}`}
                                value={item.first}
                                onChange={(e) => onInputChange(e, 'first', item.docsid, item)}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor={`last-${item.id}`}>Last</label>
                            <InputText
                                id={`last-${item.id}`}
                                value={item.last}
                                onChange={(e) => onInputChange(e, 'last', item.docsid, item)}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor={`uid-${item.id}`}>Uid</label>
                            <InputText
                                id={`uid-${item.id}`}
                                value={item.uid}
                                onChange={(e) => onInputChange(e, 'uid', item.docsid, item)}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor={`adress-${item.id}`}>Adress</label>
                            <InputText
                                id={`adress-${item.id}`}
                                value={item.adress}
                                onChange={(e) => onInputChange(e, 'adress', item.docsid, item)}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <Button
                                icon="pi pi-user-plus"
                                className="p-button"
                                onClick={(e) => handleClick(item, e)}
                            ></Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
