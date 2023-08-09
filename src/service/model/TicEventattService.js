import axios from 'axios';
import env from '../../configs/env';
import Token from '../../utilities/Token';

export class TicEventattService {
    async getTicEventatts() {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/eventatt/?sl=${selectedLanguage}`;
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

    async getTicEventatt(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/eventatt/${objId}/?sl=${selectedLanguage}`;
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

    async postTicEventatt(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en';
            if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
                throw new Error('Items must be filled!');
            }
            const url = `${env.TIC_BACK_URL}/tic/x/eventatt/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                Authorization: tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj);
            const response = await axios.post(url, jsonObj, { headers });
            //console.log("**************"  , response, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putTicEventatt(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en';
            if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
                throw new Error('Items must be filled!');
            }
            const url = `${env.TIC_BACK_URL}/tic/x/eventatt/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                Authorization: tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj);
            const response = await axios.put(url, jsonObj, { headers });
            //console.log("**************"  , response, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteTicEventatt(newObj) {
        try {
            const url = `${env.TIC_BACK_URL}/tic/x/eventatt/${newObj.id}`;
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

    async getCmnInputtps() {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.CMN_BACK_URL}/cmn/x/inputtp/?sl=${selectedLanguage}`;
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
}
