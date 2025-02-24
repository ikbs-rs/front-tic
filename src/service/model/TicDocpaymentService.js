import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";
import DateFunction from '../../utilities/DateFunction';

export class TicDocpaymentService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/docpayment/_v/lista/?stm=tic_docpayment_v&objid=${objId}&sl=${selectedLanguage}`;
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

    async getTicDocpayments() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/docpayment/?sl=${selectedLanguage}`;
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

    async getCmnPaymenttps() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/x/paymenttp/?sl=${selectedLanguage}`;
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
    async getCmnPaymenttpsP(uName) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.PROD_BACK_URL}/prodaja/?stm=${uName}&sl=${selectedLanguage}`;
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
      async getChCmnPaymenttpsP(uEvent, uChanel, uAttCode) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.PROD_BACK_URL}/prodaja/?stm=tic_eventattscodechvaluel_v&objid=${uEvent}&par1=${uAttCode}&par2=${uChanel}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
          Authorization: tokenLocal.token
        };
    
        try {
          // console.log(url, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", uEvent, uChanel, uAttCode)
          const response = await axios.get(url, { headers });
          return response.data.item //response.data.items;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
      async getPtCmnPaymenttpsP(uEvent, uPt, uAttCode) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.PROD_BACK_URL}/prodaja/?stm=tic_eventattscodechvaluel_v&objid=${uEvent}&par1=${uAttCode}&par2=${uPt}&sl=${selectedLanguage}`;
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

    async getCmnCcards() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/x/ccard/?sl=${selectedLanguage}`;
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

    async getTicDocpayment(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/docpayment/${objId}/?sl=${selectedLanguage}`;
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

    async postTicDocpayments(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
      
            const url = `${env.TIC_BACK_URL}/tic/docpayment/_s/param/?stm=tic_docpayments_s&sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            // console.log(newObj, "10.1 PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_PLACAM_", jsonObj)
            const response = await axios.post(url, jsonObj, { headers });
      
            return response.data.items;
          } catch (error) {
            console.error(error);
            throw error;
          }
      
    }

    async postTicDocpayment(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            const userId = localStorage.getItem('userId')
            newObj.usr = userId
            newObj.tm = DateFunction.currDatetime()
            const url = `${env.TIC_BACK_URL}/tic/docpayment/?sl=${selectedLanguage}`;
            
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            
            const jsonObj = JSON.stringify(newObj)
            // console.log(jsonObj, "00000LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
            const response = await axios.post(url, jsonObj, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putTicDocpayment(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            // if (newObj.action === null || newObj.roll === null)  {
            //     throw new Error(
            //         "Items must be filled!"
            //     );
            // }
            const url = `${env.TIC_BACK_URL}/tic/docpayment/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            // console.log(newObj, "**********************************newObj*************************************")
            const response = await axios.put(url, jsonObj, { headers });
            //console.log("**************"  , response, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async deleteTicDocpayment(newObj) {
        try {
            const url = `${env.TIC_BACK_URL}/tic/docpayment/${newObj.id}`;
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


    async getTicListaByItem(tab, route, view, item, objId) {
    
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/${tab}/_v/${route}/?stm=${view}&item=${item}&id=${objId}&sl=${selectedLanguage}`;
        // console.log(url, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", route)
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
          
}

