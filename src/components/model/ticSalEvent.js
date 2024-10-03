import React from 'react';
import { translations } from '../../configs/translations';
import env from '../../configs/env';

const ticSalEvent = (props) => {

    console.log(props, "++++++++++++++++++++++++++ticSalEvent++++++++++++++++++++++++")
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <iframe
                            src={`${env.DOMEN}/sal/wizard/${props.ticEvent.loc}/${props.ticEvent.id}?parent=ADM`}
                            title="Sal iframe2"
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

export default ticSalEvent;