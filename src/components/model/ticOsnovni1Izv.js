import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import TicTransactionL from "./ticTransactionL";

const TicTransactionTabs = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="card">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Tab 1">
                    <TicTransactionL tabIndex={0} />
                </TabPanel>
                <TabPanel header="Tab 2">
                    <TicTransactionL tabIndex={1} />
                </TabPanel>
                <TabPanel header="Tab 3">
                    <TicTransactionL tabIndex={2} />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default TicTransactionTabs;
