import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import TicIzvOsnovni1L from "./ticIzvOsnovni1L";

const TicTransactionTabs = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="card">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Tab 1">
                    <TicIzvOsnovni1L tabIndex={0} />
                </TabPanel>
                <TabPanel header="Tab 2">
                    <TicIzvOsnovni1L tabIndex={1} />
                </TabPanel>
                <TabPanel header="Tab 3">
                    <TicIzvOsnovni1L tabIndex={2} />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default TicTransactionTabs;
