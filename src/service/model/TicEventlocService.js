import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicEventlocService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/eventloc/_v/lista/?stm=tic_eventloc_v&objid=${objId}&sl=${selectedLanguage}`;
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

      async getListaTp(objId, id) {
        console.log(objId, "@@@@@@@@@@@@@@@@@@@- getListaTp -@@@@@@@@@@@@@@@@@@@@@", id, "###########")
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/eventloc/_v/lista/?stm=tic_eventloctp_v&objid=${objId}&par1=${id}&sl=${selectedLanguage}`;
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

    async getTicEventlocs() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/eventloc/?sl=${selectedLanguage}`;
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

    async getTicEventloc(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/eventloc/${objId}/?sl=${selectedLanguage}`;
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

    async postTicEventloc(newObj) {
        try {            
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/eventloc/?sl=${selectedLanguage}`;
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

    async postTpEventloc(eventId, tpId) {
        try {            
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (eventId === null ) {
                throw new Error(
                    "objId must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/eventloc/_s/param/?stm=tic_tpeventloc_s&objId1=${eventId}&par1=${tpId}&sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            console.log(eventId, "@@@@@@@@@@@@@@@@@@@@@@@@ postGrpEventatts @@@@@@@@@@@@@@@@@@@@@", url)
            const response = await axios.post(url, {}, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putTicEventloc(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null)  {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/eventloc/?sl=${selectedLanguage}`;
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

    async deleteTicEventloc(newObj) {
        try {
            const url = `${env.TIC_BACK_URL}/tic/eventloc/${newObj.id}`;
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

    async postGrpEventloc(obj, newObj, addItems) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (obj.id === null ) {
                throw new Error(
                    "objId must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/eventloc/_s/param/?stm=tic_grpeventloc_s&objId1=${obj.id}&par1=${addItems}&par2=${obj.loc}&par3=${obj.tploc}&begda=${obj.begda}&endda=${obj.endda}&sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            console.log(newObj, "@@@@@@***************************postGrpEventatts*******************************@@@@@@@@@@@", url)
            const response = await axios.post(url, {jsonObj}, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    } 
    
    async postGrpLoclink(obj,newObj, addItems, begda, enda) {
        try {
            console.log(addItems, "********************    ***postGrpEventattsk9999999999")
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (obj.id===null) {
                throw new Error(
                    "obj must be filled!"
                );
            }
            const url = `${env.CMN_BACK_URL}/cmn/loclink/_s/param/?stm=cmn_grploclink_s&table=${JSON.stringify(obj)}&par1=${addItems}&begda=${begda}&endda=${enda}&sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            
            const response = await axios.post(url, {jsonObj}, { headers });
            console.log(response.data, "***************************postGrpEventatts*******************************", url)
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }    
}

