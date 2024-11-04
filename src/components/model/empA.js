import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { DataView } from 'primereact/dataview';
import { translations } from '../../configs/translations';
import Event from './ticEventProdajaL';
import Doc from './ticDocL';
import { TicDocService } from "../../service/model/TicDocService";

export default function EmpA(props) {
    let i = 0
    const PRODAJNI_KANAL = 'XPK';
    const WEB = 'WEB';
    const BLAGAJNA = 'PCTC00';
    const PRODAJNO_MESTO = 'PCPM';
    const ORGANIZATOR = 'PK00';
    const navigate = useNavigate();
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [products, setProducts] = useState([]);
    const [channells, setChannells] = useState([]);
    const [layout] = useState('grid');
    const rootDir = '/tic'


    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const ticDocService = new TicDocService();
                    const data = await ticDocService.getTicListaByItem('doc', 'listabytxt', 'cmn_channel_v', 'aa.code', PRODAJNI_KANAL);
                    setChannells(data);
                    console.log(data, "@@ CHANNEL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const localProducts = [
        // {
        //     id: 1,
        //     name: 'WEB',
        //     image: 'rez.jpg'
        // },
        {
            id: 2,
            name: 'Продајноместо',
            image: 'rac.png'
        },
        {
            id: 3,
            name: 'Благајна',
            image: 'prod.jpg'
        }
        ,
        {
            id: 4,
            name: 'Трансакција',
            image: 'tmp.jpg'
        }
        ,
        {
            id: 5,
            name: 'WEB',
            image: 'web.jpg'
        }
        ,
        {
            id: 6,
            name: 'Организатор',
            image: 'org.jpg'
        }
    ];

    useEffect(() => {
        setProducts(localProducts);
    }, []);

    const f1 = (param) => {
        let _channel = {}
        let user = {}
        console.log('Funkcija f1 je pozvana sa parametrom:', param);
        switch (param) {
            case 6:
                navigate('/salO', { state: { channel: channells.find(obj => obj.code == ORGANIZATOR) } });
                break;            
            case 5:
                _channel = channells.find(obj => obj.code == WEB)
                user = JSON.parse(localStorage.getItem('user'))
                user.kanal = _channel.id
                localStorage.setItem('user', JSON.stringify(user));                
                navigate('/sal');
                break;
            case 4:
                navigate('/transactionf');
                break;
            case 3:
                navigate('/salB', { state: { channel: channells.find(obj => obj.code == BLAGAJNA) } });
                break;
            case 2:                
                navigate('/salPM', { state: { channel: channells.find(obj => obj.code == PRODAJNO_MESTO) } });
                break;
            // case 1:
            //     navigate('/salW', { state: { channel: channells.find(obj => obj.code == WEB) } });
            //     break;
            // case 1:
            //     navigate('/doc?docVr=RZ');
            //     break;
            default:
                break;
        }
    };

    const gridItem = (product) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-2 p-1 clickable-item" onClick={() => f1(product.id)}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-column align-items-center gap-1 py-0">
                        <img className="w-9 shadow-2 custom-border-round" src={`${rootDir}/images/${product.image}`} alt={product.name}  />
                        <div className="text-2xl font-bold" style={{ color: "#8b8b90" }}>{translations[selectedLanguage]?.[product.name] || product.name}</div>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }
        return gridItem(product);
    };

    return (
        <>
            <div className="cardhome" style={{ height: '685px', overflowY: 'auto', margin: '0', padding: '0', border: 'none' }}>
                <DataView value={products} itemTemplate={itemTemplate} layout={layout} />
                <style jsx>{`
                    .clickable-item {
                        cursor: pointer;
                    }
                    .clickable-item:hover img,
                    .clickable-item:hover .text-2xl {
                        opacity: 0.6;
                    }
                `}</style>
            </div>

            <div className="layout-content">
                <Routes>
                    <Route path="/eventprodaja" element={<Event />} />
                    <Route path="/doc" element={<Doc />} />
                </Routes>
            </div>
        </>
    );
}
