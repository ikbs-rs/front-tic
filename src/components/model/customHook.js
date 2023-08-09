/**
 * Argumenti respektivno koji se prosledjuju
 * 0 - modu, `adm`
 * 1 - tabela, bez prefiksa, `user`
 * 2 - id tabele
 * 3 - naziv atributa po kome se pretrazuje
 * 5 - mumericki atrinut 0 ili 1
 * 6 - vrednost atributa pokome se pretrazuje
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import env from '../../configs/env';
import Token from '../../utilities/Token';
import { translations } from "../../configs/translations";

export const useFetchObjData = (...args) => {
    const [ddItems, setDdItems] = useState(null);
    const [ddItem, setDdItem] = useState(null);
    const [items, setItems] = useState(null);
    const [item, setItem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let backend = '';
                switch (args[0]) {
                    case 'adm':
                        backend = env.ADM_BACK_URL;
                        break;
                    case 'cmn':
                        backend = env.CMN_BACK_URL;
                        break;
                    case 'tic':
                        backend = env.TIC_BACK_URL;
                        break;
                    default:
                        console.error('Pogresan naziv polja');
                }
                const selectedLanguage = localStorage.getItem('sl') || 'en';
                const url = `${backend}/${args[0]}/x/${args[1]}/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };
                const response = await axios.get(url, { headers });
                const datas = response.data.items;
                setItems(datas);
                const data = datas.find((item) => item.id === args[2]);
                setItem(data || null);

                const dataDDs = datas.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdItems(dataDDs);
                if (data) {
                    const dataDD = { code: data.id, textx: data.itextxd };
                    setDdItem(dataDD || null);
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        };
        fetchData();
    }, []);
    return { ddItems, ddItem, items, item };
};

export const useDropdown = (...args) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [ddItems, setDdItems] = useState(null);
    const [ddItem, setDdItem] = useState(null);

    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];
    const findDropdownItem = (code) => {    
      return items.find((item) => item.code == code) || null;
    };

    useEffect(() => {
        // Ovdje napišite kod koji želite da se izvrši kada se komponenta montira
        const fetchData = async () => {
            try {                
                const ddItem = findDropdownItem(args[0]);
                setDdItems(items);
                setDdItem(ddItem);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return { ddItems, ddItem };
};

export async function fetchObjData(...args) {
    try {
        let backend = '';
        switch (args[0]) {
            case 'adm':
                backend = env.ADM_BACK_URL;
                break;
            case 'cmn':
                backend = env.CMN_BACK_URL;
                break;
            case 'tic':
                backend = env.TIC_BACK_URL;
                break;
            default:
                console.error('Pogresan naziv polja');
        }

        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${backend}/${args[0]}/x/${args[1]}/?sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };
        const response = await axios.get(url, { headers });        
        const datas = response.data.items;

        const items = datas.map(({ textx, id }) => ({ name: textx, code: id }));

        const data = datas.find((item) => item.id === args[2]);

        let ddItems = null;
        let ddItem = null;
        if (data) {
            const dataDD = { code: data.id, textx: data.itextxd };
            ddItem = dataDD;
        }
        ddItems = items;

        return { ddItems, ddItem, items: datas, item: data || null };
    } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
        return { ddItems: null, ddItem: null, items: null, item: null };
    }
}

