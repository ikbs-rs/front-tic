import React, { useRef, useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import EmpA from "./components/model/empA"

const AppRightMenu = (props) => {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(window.innerWidth);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        window.addEventListener('resize', updateWidth);
        updateWidth(); // Poziva se odmah kako bi se dobila početna širina

        return () => window.removeEventListener('resize', updateWidth);
    }, []); 
    return (
        <div className={classNames('layout-right-panel', { 'layout-right-panel-active': props.rightPanelMenuActive })} onClick={props.onRightMenuClick}>
            <TabView>
                <TabPanel header="Opcije">
                <EmpA containerWidth={"150"} />
                </TabPanel>

                <TabPanel header="Messages">
                    <div className="messages-title">
                        <span>November 13, 2018</span>
                    </div>
                    <div className="messages-content grid col">
                        <div className="time col-4">00:00 GMT+03:00</div>
                        <div className="message-1 col-8">All systems reporting at 100%</div>
                    </div>

                    <div className="messages-title">
                        <span>November 12, 2018</span>
                    </div>
                    <div className="messages-content grid col">
                        <span className="time col-4">00:00 GMT+03:00</span>
                        <span className="message-1 col-8">All systems reporting at 100%</span>
                    </div>

                    <div className="messages-title">
                        <span>November 7, 2018</span>
                    </div>
                    <div className="messages-content grid col">
                        <span className="time col-4">09:23 GMT+03:00</span>
                        <span className="message-1 col-8">Everything operating normally.</span>

                        <span className="time col-4">08:58 GMT+03:00</span>
                        <span className="message-2 col-8">We're investigating delays inupdates to PrimeFaces.org.</span>

                        <span className="time col-4">08:50 GMT+03:00</span>
                        <span className="message-2 col-8">We are investigating reports of elevated error rates.</span>
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default AppRightMenu;
