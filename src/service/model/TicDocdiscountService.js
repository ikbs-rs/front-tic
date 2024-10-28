import axios from 'axios';
import env from '../../configs/env';
import Token from '../../utilities/Token';

export class TicDocdiscountService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/docdiscount/_v/lista/?stm=tic_docdiscount_v&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.item||response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getDiscounttpLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/docdiscount/_v/lista/?stm=tic_docdiscounttp_v&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getDiscounttpListaP(objId, signal) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.PROD_BACK_URL}/prodaja/?stm=tic_docsdiscounttp_v&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
          Authorization: tokenLocal.token
        };
    
        try {
          const response = await axios.get(url, { headers, signal, timeout: 5000 });
          return response.data.item //||response.data.items;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    
    async getTicDocdiscounts() {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/docdiscount/?sl=${selectedLanguage}`;
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

    async getTicDocdiscount(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/docdiscount/${objId}/?sl=${selectedLanguage}`;
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

    async postTicDocdiscount(newObj) {
        try {
            console.log("00555555555555555555555555555555555555555555555555", newObj)
            const selectedLanguage = localStorage.getItem('sl') || 'en';
            if (newObj.discount  === null) {
                throw new Error('Items must be filled!');
            }
            console.log("01555555555555555555555555555555555555555555555555")
            const url = `${env.TIC_BACK_URL}/tic/docdiscount/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                Authorization: tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj);
            console.log(url, "01555555555555555555555555555555555555555555555555", jsonObj)
            const response = await axios.post(url, jsonObj, { headers });
            //console.log("**************"  , response, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putTicDocdiscount(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en';
            if (newObj.art  === null || newObj.discount  === null)  {
                throw new Error('Items must be filled!');
            }
            const url = `${env.TIC_BACK_URL}/tic/docdiscount/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                Authorization: tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj);
            const response = await axios.put(url, jsonObj, { headers });
            
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteTicDocdiscount(newObj) {
        try {
            const url = `${env.TIC_BACK_URL}/tic/docdiscount/${newObj.id}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                Authorization: tokenLocal.token
            };

            const response = await axios.delete(url, { headers });
            return response.data.items;
        } catch (error) {
            throw error;
        }
    }


    async getDiscountvalue(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/docdiscount/_v/lista/?stm=tic_docdiscountvalue_v&objid=${objId}&sl=${selectedLanguage}`;
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

    async getDiscountvalueP(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.PROD3_BACK_URL}/prodaja/?stm=tic_docdiscountvalue_v&objid=${objId}&sl=${selectedLanguage}`;
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
}
