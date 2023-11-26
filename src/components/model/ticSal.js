import React from 'react';
import { translations } from '../../configs/translations';

const SalPage = () => {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <iframe
                            src="https://82.117.213.106/sal/"
                            title="Sal iframe"
                            width="100%"
                            height="760px"
                            frameBorder="0"
                            // scrolling="no"
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SalPage;