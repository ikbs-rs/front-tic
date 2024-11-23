import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicEventattsService {

    async getLista(objId, par1) {
        // console.log(objId, par1, "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/eventatts/_v/lista/?stm=tic_eventattstp_v&objid=${objId}&par1=${par1}&sl=${selectedLanguage}`;
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

    async getCodeValueListaP(objId, par1) {
        // console.log(objId, par1, "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.PROD2_BACK_URL}/prodaja/?stm=tic_eventattscodevaluel_v&objid=${objId}&par1=${par1}&sl=${selectedLanguage}`;
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

    async getListaP(objId, par1) {
        // console.log(objId, par1, "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.PROD2_BACK_URL}/prodaja/?stm=tic_eventattstp_v&objid=${objId}&par1=${par1}&sl=${selectedLanguage}`;
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

    async getEventAttsDD(objId, par1, par2) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/eventatts/_v/lista/?stm=tic_eventattsdd_v&objid=${objId}&par1=${par1}&par2=${par2}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            console.log(objId, par1, par2, "G888888888888888888888888888888888GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG", response.data)
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTicEventatts11L(objId, par1) {
        // console.log(objId, par1, "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/eventatts/_v/lista/?stm=tic_eventatts11l_v&objid=${objId}&par1=${par1}&sl=${selectedLanguage}`;
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

    async getTicEventatts11LP(objId, par1) {
        // console.log(objId, par1, "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.PROD3_BACK_URL}/prodaja/?stm=tic_eventatts11l_v&objid=${objId}&par1=${par1}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.item //||response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTicEventattss() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/eventatts/?sl=${selectedLanguage}`;
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

    async getTicEventatts(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/eventatts/${objId}/?sl=${selectedLanguage}`;
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


    async postTicEventatts(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/eventatts/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            const response = await axios.post(url, jsonObj, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async postAutoEventatts(objId) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (objId === null) {
                throw new Error(
                    "objId must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/eventatts/_s/param/?stm=tic_autoeventatts_s&objId1=${objId}&sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            //const jsonObj = JSON.stringify(newObj)
            const response = await axios.post(url, {}, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async postGrpEventatts(objId, newObj, addItems) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (objId === null) {
                throw new Error(
                    "objId must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/eventatts/_s/param/?stm=tic_grpeventatts_s&objId1=${objId}&par1=${addItems}&sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            console.log(jsonObj, "***************************postGrpEventatts*******************************", url)
            const response = await axios.post(url, { jsonObj }, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async postCopyEventatts(objId, newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (objId === null) {
                throw new Error(
                    "objId must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/eventatts/_s/param/?stm=tic_copyeventatts_s&objId1=${objId}&sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            console.log(jsonObj, "***************************postGrpEventatts*******************************", url)
            const response = await axios.post(url, { jsonObj }, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putTicEventatts(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/eventatts/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            const response = await axios.put(url, jsonObj, { headers });
            //console.log("**************"  , response, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async deleteTicEventatts(newObj) {
        try {
            const url = `${env.TIC_BACK_URL}/tic/eventatts/${newObj.id}`;
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

