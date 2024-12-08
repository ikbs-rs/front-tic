import React, { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { CmnParService } from "../../service/model/cmn/CmnParService";
import { translations } from "../../configs/translations";

export default function AutoParAddress(props) {
// console.log(props, "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(props.ticDocdelivery.adress || null)
    const [filteredItems, setFilteredItems] = useState([]);

    const search = (event) => {
        setTimeout(() => {
            let _filteredItems;

            if (!event.query.trim().length) {
                _filteredItems = [...items];
            } else {
                _filteredItems = items.filter((item) => {
                    const adresa = item?.adresa || ""; 
                    return adresa.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredItems(_filteredItems);
        }, 300);
    };
    useEffect(() => {
        async function fetchData() {
            try {
                    const cmnParService = new CmnParService();
                    const data = await cmnParService.getAddressAll(props.ticDoc?.usr||-1);
                    console.log(data, "---------------------------------AAAAAAAA--------------------------------------", props.ticDoc)
                    setItems(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [props.ticDoc]);

    const handleItemSelect = (value) => {
        setSelectedItem(value)
        props.onItemSelect(value)
    }

    return (
        <div className=" p-fluid justify-content-center">
            <label htmlFor="adresa">{translations[selectedLanguage].address}</label> 
            <AutoComplete
                field="adresa"
                value={selectedItem}
                suggestions={filteredItems}
                completeMethod={search}
                dropdown 
                onChange={(e) => handleItemSelect(e.value)}  // Poziv funkcije iz nadređene komponente
                disabled={props.ticDoc.statuspayment == 1}
            />
        </div>
    );
}
