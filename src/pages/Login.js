import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { useNavigate } from 'react-router-dom';
import { Toast } from "primereact/toast";
import axios from 'axios';
import env from "../configs/env"
import { useDispatch } from 'react-redux';
import { setLanguage } from '../store/actions';
// import ReCAPTCHA from 'react-google-recaptcha';
//import https from 'https'

export const Login = () => {
    console.log(env.REACT_APP_SITE_KEY, "****************************************")
    const [checked, setChecked] = useState(true);
    const [success, setSuccess] = useState(true);


    let [numberChannell, setNumberChannell] = useState(0)
    let [channells, setChannells] = useState([{}])
    let [channell, setChannell] = useState(null)

    const toast = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const search = window.location.search;    
    // const params = new URLSearchParams(search);
    let sl = localStorage.getItem('sl') || 'sr_cyr' //params.get('sl');   

    const onInputChange = (e, name) => {
        sl = e.target.value
        // setCurrentLanguage(sl)
        dispatch(setLanguage(sl));
    }

    const onChange = (e) => {
        setSuccess(true)
    }

    const onExpired = (e) => {
        setSuccess(false)
    }

    const createJson = async (id, admin, username, channels) => {
        // Kreiramo objekat koji odgovara željenoj strukturi
        let channel = null
        if (channels[0]){
            channel = channels[0].id
        }
        const jsonObject = {
            id: id,
            admin: admin,
            username: username,
            kanal: channel,
            channels: channels.map(channel => ({
                id: channel.id,
                text: channel.text
            }))
        };

        return JSON.stringify(jsonObject);
    }

    const handleButtonClick = async (parameter) => {

        const usernameInput = document.getElementById("input").value;
        const passwordInput = document.getElementById("password-input").value;

        const requestData = {
            username: usernameInput,
            password: passwordInput
        };
        const url = `${env.JWT_BACK_URL}/adm/services/sign/in`;
        // const url = `https://dev.app.ems.rs/badm/adm/services/sign/in`;
        // console.log(url, requestData, "*****333333333333333333333333333333333333333333**************")

        // Postavljanje opcija zahteva za onemogućavanje provere validnosti sertifikata
        // const axiosOptions = {
        //     httpsAgent: new https.Agent({
        //     rejectUnauthorized: false, // Postavljanje na `false` onemogućava proveru validnosti sertifikata
        //     }),7
        // };        
        try {
            if (success) {
                console.log(url, requestData, "*****************url*********************", env.JWT_BACK_URL)
                const response = await axios.post(url, requestData);
                if (response.status === 200) {

                    const usrUrl = `${env.ADM_BACK_URL}/adm/user/${response.data.userId}`; 
                    const urlCh = `${env.ADM_BACK_URL}/adm/user/_v/lista/?stm=adm_userchannel_v&objid=${response.data.userId}`;                   
                    const headers = {
                        Authorization: response.data.token
                    };
                    console.log(usrUrl, "***************************************************", urlCh)                     
                    const rezultatUsr = await axios.get(usrUrl, { headers });  
                    const objUsr = rezultatUsr.data.item;
                    console.log(objUsr, "* 00**************************************************")                     
                    const rezultat = await axios.get(urlCh, { headers });
                    const objChannel =  rezultat.data.item; 
                    console.log(objChannel, "* 01**************************************************")                                                    

                    setNumberChannell(objChannel.length);
                    setChannells(objChannel);

                    const userJson = await createJson(objUsr.id, objUsr.admin, objUsr.username, objChannel);
                    console.log(userJson, "* 02**************************************************") 

                    localStorage.setItem('user', userJson);
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    localStorage.setItem('userId', response.data.userId);
                    sessionStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('sl', sl || "sr_cyr");
                    navigate('/');
                } else {
                    console.log("******************response.login********************")
                    navigate('/login');
                }
                console.log("******************kraj********************")
                navigate('/');
            } else {
                console.error("******************reChepcha********************")
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Greška prilikom logovanja na sistem. ",
                detail: `Neispravan username ili password!`,
                life: 5000,
            });            
            // Handle error and possibly navigate back to login
            navigate('/login');
        }

        //dispatch(setLanguage(sl)); // Postavite željeni jezik umesto 'en'
        /*
                axios
                 .post(`${env.JWT_BACK_URL}/adm/services/sign/in`, requestData)
                 .then((response) => {
                   isLoggedIn = response.status === 200; // Ako je status 200, isLoggedIn će biti true
                   if (isLoggedIn) {
                     //TODO idi na pocetnu stranicu
                     localStorage.setItem('token', response.data.token);
                     localStorage.setItem('refreshToken', response.data.refreshToken);
                     sessionStorage.setItem('isLoggedIn', 'true');
                     localStorage.setItem('sl', sl||"en");
                     navigate(`/login}`);
                     //const newUrl = `${window.location.pathname}?sl=${sl||"en"}`;
                     //window.location.replace(newUrl);
                     //dispatch(setLanguage(sl));
        
                    navigate('/');
                   } else {
                     //TODO vrati se na login
                     navigate(`/login}`);
                   }
                 })
                 .catch((error) => {
                    console.log(`${env.JWT_BACK_URL}/adm/services/sign/in`, "*-*-*-*-*-*-*-*ERROR-*-*-*-*-*-*-*-*", error)
                   console.error(error);
                   isLoggedIn = false; // Ako se dogodila pogreška, isLoggedIn će biti false
                   //TODO vrati se na login
                 }); 
                 */
    }

    return (
        <div className="login-body">
            <Toast ref={toast} />
            <div className="card login-panel p-fluid">
                <div className="login-panel-content">
                    <div className="grid">
                        <div className="col-12 sm:col-6 md:col-6 logo-container">
                            <img src="assets/layout/images/logo-tl.png" alt="Ticketline" style={{ width: "155.88px", height: "46.25px" }} />
                            <span className="guest-sign-in">Welcome, please use the form to sign-in Ticketline network</span>
                        </div>
                        <div className="col-12 username-container">
                            <label>Username</label>
                            <div className="login-input">
                                <InputText id="input" type="text" />
                            </div>
                        </div>
                        <div className="col-12 password-container">
                            <label>Password</label>
                            <div className="login-input">
                                <InputText id="password-input" type="password" />
                            </div>
                        </div>
                        <div className="col-12 language-container">
                            <label>Language</label>
                            <div className="login-input">
                                <select id="language-input" onChange={(e) => onInputChange(e, 'language-input')} defaultValue={sl || "en"}>
                                    <option value="en">English</option>
                                    <option value="sr_cyr">Српски (ћирилица)</option>
                                    <option value="sr_lat">Srpski (latinica)</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    {/* Dodajte ostale jezike po potrebi */}
                                </select>
                            </div>
                        </div>
                        {/* <div className="col-12 sm:col-6 md:col-6 rememberme-container">
                            <Checkbox checked={checked} onChange={(e) => setChecked(e.checked)} />
                            <label> Remember me</label>
                        </div> */}

                        {/* <div className="col-12 sm:col-6 md:col-6 forgetpassword-container">
                            <a href="/" className="forget-password">
                                Forget Password
                            </a>
                        </div> */}

                        <div className="col-12 sm:col-6 md:col-6">
                            <Button label="Sign In" icon="pi pi-check" onClick={() => handleButtonClick('app')} />
                        </div>
                        {/* <ReCAPTCHA
                            sitekey={env.REACT_APP_SITE_KEY}
                            onChange={onChange}
                            onExpired={onExpired}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};
