import axios from 'axios';
import env from "../../../configs/env"
import Token from "../../../utilities/Token";

const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};
function isValidDate(date, format) {
    const day = parseInt(date.substring(0, 2));
    const month = parseInt(date.substring(2, 4));
    const year = parseInt(date.substring(4, 8));
  
    // Provera datuma (osnovna provera bez dodatnih biblioteka)
    const dateObj = new Date(year, month - 1, day);
    return dateObj && (dateObj.getMonth() + 1) === month && dateObj.getDate() === day;
}

const proveriJMBG = async (uJMBG) => {
    // console.log(uJMBG, "01-##############################################################################################################################")
    let A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13;
    let pKontrolniBroj, pIzlaz = false;
    let pYY;
  

  
    if (uJMBG != null && uJMBG.length === 13) {
        // console.log(uJMBG, "02-##############################################################################################################################")
        if (uJMBG.charAt(4) === '0') {
            pYY = '20';
        } else {
            pYY = '1' + uJMBG.charAt(4);
        }
        // Validacija datuma (DDMMYYYY)
        let datum = uJMBG.substring(0, 4) + pYY + uJMBG.substring(5, 7);
        if (isValidDate(datum, 'DDMMYYYY')) {
            A1 = parseInt(uJMBG.charAt(0));
            A2 = parseInt(uJMBG.charAt(1));
            A3 = parseInt(uJMBG.charAt(2));
            A4 = parseInt(uJMBG.charAt(3));
            A5 = parseInt(uJMBG.charAt(4));
            A6 = parseInt(uJMBG.charAt(5));
            A7 = parseInt(uJMBG.charAt(6));
            A8 = parseInt(uJMBG.charAt(7));
            A9 = parseInt(uJMBG.charAt(8));
            A10 = parseInt(uJMBG.charAt(9));
            A11 = parseInt(uJMBG.charAt(10));
            A12 = parseInt(uJMBG.charAt(11));
            A13 = parseInt(uJMBG.charAt(12));
  
            pKontrolniBroj = (A1 * 7 + A2 * 6 + A3 * 5 + A4 * 4 + A5 * 3 + A6 * 2 +
                              A7 * 7 + A8 * 6 + A9 * 5 + A10 * 4 + A11 * 3 + A12 * 2) % 11;
  
            if (pKontrolniBroj > 1) {
                if (11 - pKontrolniBroj === A13) {
                    pIzlaz = true;
                }
            } else {
                if (pKontrolniBroj === A13) {
                    pIzlaz = true;
                }
            }
        }
    }
  
    return pIzlaz;
  }
  
export class CmnParService {

    async getAddressAll(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/x/par/_v/lista/?stm=cmn_paraddressall_v&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            //   const response = await axios.get(url, { headers, timeout: 10000 });
            const response = await axios.get(url, { headers });
            //    console.log(url,"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", response.data.item)
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/x/par/_v/lista/?stm=cmn_par_v&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            //   const response = await axios.get(url, { headers, timeout: 10000 });
            const response = await axios.get(url, { headers });
            //   console.log(url,"?????????????????????????????getLista??????????????????????????????????", response)
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getListaP(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.PROD_BACK_URL}/prodaja/?stm=cmn_par_v&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            //   const response = await axios.get(url, { headers, timeout: 10000 });
            const response = await axios.get(url, { headers });
            //   console.log(url,"?????????????????????????????getLista??????????????????????????????????", response)
            return response.data.item //||response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getCmnPars() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/x/par/?sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getCmnParP(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.PROD1_BACK_URL}/prodaja/?stm=cmn_par&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.item //response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getCmnPar(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/x/par/${objId}/?sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.items || response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async postCmnPar(newObj) {
        try {
            console.log(newObj, "6666666666666666666666666666666666")
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }

            const url = `${env.CMN_BACK_URL}/cmn/x/par/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            console.log("*-*-*-*-*", url, newObj, jsonObj)
            const response = await axios.post(url, jsonObj, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putCmnPar(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            // if (!validateEmail(newObj.email)) {
            //     throw new Error(
            //         "Neispravan format email-a!"
            //     );  
            // }
            // if (!proveriJMBG(newObj.idnum) && newObj.idnum == 2) {
            //     throw new Error(
            //         "Neispravan JMBG!"
            //     );  
            // }            
            const url = `${env.CMN_BACK_URL}/cmn/x/par/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            const response = await axios.put(url, jsonObj, { headers });
            // console.log("@@@@@@@@@@@@@@@@@**************", response.data, "****************@@@@@@@@@@@@@@@@@@@@@@@@@@")
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async deleteCmnPar(newObj) {
        try {
            const url = `${env.CMN_BACK_URL}/cmn/x/par/${newObj.id}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Authorization': tokenLocal.token
            };

            const response = await axios.delete(url, { headers });
            return response.data.items;
        } catch (error) {
            throw error;
        }

    }
}

