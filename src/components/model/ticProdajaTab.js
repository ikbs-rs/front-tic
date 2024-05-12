import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import TicEventProdajaL from './ticEventProdajaL';
import AA from './AA';

import { TabView, TabPanel } from 'primereact/tabview';
import { Avatar } from 'primereact/avatar';

export default function TicProdajaTab(props) {
    console.log(props, "******************@@@@@@@@@@@@@@@@@@@@@@@*******************************", props.ticDoc)
    const selectedLanguage = localStorage.getItem('sl') || 'en'

    const [key, setKey] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [ticDoc, setTicDoc] = useState();
    const [inputValueI1, setInputValueI1] = useState("");
    const [inputValueI2, setInputValueI2] = useState("");
    const [triggerA2, setTriggerA2] = useState(false);


    const toast = useRef(null);


    return (
        <div key={key}>
            <div className="card">
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Преглед догађаја">
                        <TicEventProdajaL
                            ticDoc={ticDoc}
                            propsParent={props}
                        />
                    </TabPanel>
                    <TabPanel
                        header="Избор седишта"
                        headerClassName="flex align-items-center"
                    >
                    </TabPanel>
                    <TabPanel header="Header III" headerClassName="flex align-items-center">
                        <AA
                            setInputValueInParent={setInputValueI2}
                            setMessageInParent={(msg) => console.log(msg)}
                            externalInputValue={inputValueI2}
                            triggerA2Action={triggerA2}
                        />
                    </TabPanel>
                    <TabPanel header="Header IV" headerClassName="flex align-items-center">
                        <input
                            type="text"
                            value={inputValueI1}
                            onChange={(e) => setInputValueI1(e.target.value)}
                            placeholder="Unesite vrednost I1..."
                        />
                        <Button onClick={() => console.log("Akcija dugmeta A1")}>A1</Button>
                        <Button onClick={() => {
                            setInputValueI2(inputValueI1); // Postavljanje I2 u AA komponenti
                            setTriggerA2(prev => !prev); // Triggerovanje A2 akcije
                        }}>B1</Button>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
}
