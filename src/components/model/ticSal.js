import React from 'react';
import { translations } from '../../configs/translations';
import env from '../../configs/env';

const SalPage = () => {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <iframe
                            src={`${env.DOMEN}/sal/`}
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