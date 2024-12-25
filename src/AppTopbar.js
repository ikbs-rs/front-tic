import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { translations } from "./configs/translations";
import { AdmUserService } from "./service/model/cmn/AdmUserService";
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import env from './configs/env';

const AppTopbar = (props) => {
    const navigate = useNavigate();
    let i = 0
    const b =  `${env.DOMEN}/btic/assets/img/zap/1774496601038262272.jpg`
    const selectedLanguage = localStorage.getItem('sl') || 'sr_cyr'
    const userId = localStorage.getItem('userId') || -1
    const link = `/tic/?sl=${selectedLanguage}#/`
    console.log(link, "#######################################")
    const [user, setUser] = useState({});
    const [slika, setSlika] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const admUserService = new AdmUserService();
                    const data = await admUserService.getAdmUser(userId);
                    // console.log(data, "/////////////////////////////////////////////////////////////getListaLL////////////////////////////////////////////////////////////////////////")
                    setUser(data);
                    setSlika(`${env.DOMEN}/btic/assets/img/zap/${data.id}.jpg`)
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const onTopbarItemClick = (event, item) => {
        if (props.onTopbarItemClick) {
            props.onTopbarItemClick({
                originalEvent: event,
                item: item
            });
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        sessionStorage.setItem('isLoggedIn', 'false');
        navigate('/login');
    };
    return (
        <div className="layout-topbar" >
            <button type="button" className="p-link layout-right-panel-button layout-topbar-icon" onClick={props.onRightMenuButtonClick}>
                <i className="pi pi-ellipsis-v" style={{ fontSize: 16 }}></i>
            </button>

            <button type="button" className="p-link layout-menu-button layout-topbar-icon" onClick={props.onMenuButtonClick}>
                <i className="pi pi-bars" style={{ fontSize: 20 }}></i>
            </button>

            {/* <button type="button" className="p-link layout-topbar-logo" onClick={() => navigate('/')}>
                <span className="layout-profile-name" style={{ color: "#ffffff", fontSize: 16 }}>{translations[selectedLanguage].Ticketing_system}</span>
            </button> */}
<a
    href={link}
    target="_self"
    className="p-link layout-topbar-logo"
    onClick={(e) => {
        e.preventDefault();
        navigate('/');
    }}
    // onContextMenu={(e) => {
    //     e.preventDefault();
    //     window.open('/tic', '_blank');
    // }}
>
    <span className="layout-profile-name" style={{ color: "#ffffff", fontSize: 16 }}>
        {translations[selectedLanguage].Ticketing_system}
    </span>
</a>


            <ul className="topbar-menu" style={{ paddingTop: '9px' }}>
                <li className={classNames('user-profile', { 'active-topmenuitem fadeInDown': props.activeTopbarItem === 'profile' })}>
                    {!props.inlineUser && (
                        <button type="button" className="p-link" onClick={(e) => onTopbarItemClick(e, 'profile')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', "padding-right": "20px", "padding-top": "0px" }}>
                                <span style={{ color: "#fff" }}>{`${user?.firstname} ${user?.lastname || ''}`}</span>

                                <Avatar size="large" icon="pi pi-user" shape="circle" className="p-overlay-badge" image={slika} >
                                    <Badge value="4" severity="danger" />
                                </Avatar>
                            </div>
                        </button>
                    )}

                    <ul className="fadeInDown">
                        {/* <li role="menuitem">
                            <button type="button" className="p-link">
                                <i className="pi pi-fw pi-user"></i>
                                <span>Profile</span>
                            </button>
                        </li>
                        <li role="menuitem">
                            <button type="button" className="p-link">
                                <i className="pi pi-fw pi-cog"></i>
                                <span>Settings</span>
                            </button>
                        </li>
                        <li role="menuitem">
                            <button type="button" className="p-link">
                                <i className="pi pi-fw pi-envelope"></i>
                                <span>Messages</span>
                            </button>
                        </li>
                        <li role="menuitem">
                            <button type="button" className="p-link">
                                <i className="pi pi-fw pi-bell"></i>
                                <span>Notifications</span>
                            </button>
                        </li> */}
                        <li role="menuitem">
                            <button type="button" className="p-link" onClick={handleLogout}>
                                <i className="pi pi-fw pi-sign-out"></i>
                                <span>Logout</span>
                            </button>
                        </li>                        
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default AppTopbar;
