import React, { useRef, useState, useEffect } from 'react';
import { translations } from '../configs/translations';
import EmpA from "../components/model/empA"

const EmptyPage = () => {
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
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="cardhome">
                        <h5>{translations[selectedLanguage].Ticketing_system} </h5>
                        <p>{translations[selectedLanguage]._eptyPage}</p>
                    </div>
                </div>
            </div>
            <div>
                <EmpA containerWidth={containerWidth} />
            </div>
        </>
    );
};

export default EmptyPage;
