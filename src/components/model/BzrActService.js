import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class BzrActService {
  async getLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.BZR_BACK_URL}/bzr/act_v/lista/?stm=bzr_doc_v&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********BzrActService*************",url)
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTransactionLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.BZR_BACK_URL}/bzr/act_v/lista/?stm=bzr_transaction_v&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********BzrActService*************",url)
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getbzrListaByItem(tab, route, view, item, objId) {
    
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.BZR_BACK_URL}/bzr/${tab}/_v/${route}/?stm=${view}&item=${item}&id=${objId}&sl=${selectedLanguage}`;
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
  
 // ('obj', 'listabytxt', 'cmn_obj_tp_v', 'aa.doc', 'O');

  async getCmnListaByItem(tab, route, view, item, objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/${tab}/_v/${route}/?stm=${view}&item=${item}&id=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data.item||response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCmnListaByItem2(tab, route, view, item1, objId1, item2, objId2) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.BZR_BACK_URL}/bzr/${tab}/_v/${route}/?stm=${view}&item1=${item1}&id1=${objId1}&item2=${item2}&id2=${objId2}&sl=${selectedLanguage}`;
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

  async getBzrActs() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.BZR_BACK_URL}/bzr/act?sl=${selectedLanguage}`;
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

  async getBzrAct(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.BZR_BACK_URL}/bzr/act${objId}/?sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data.items||response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async postBzrAct(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.date.trim() === '' || newObj.npar.trim() === '' || newObj.pib === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.BZR_BACK_URL}/bzr/act?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      console.log("***response.data.items***********"  , response.data.items, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putBzrAct(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.date.trim() === '' || newObj.npar.trim() === '' || newObj.pib === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.BZR_BACK_URL}/bzr/act?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      //console.log("*#################", jsonObj, "****************")
      const response = await axios.put(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteBzrAct(newObj) {
    try {
      const url = `${env.BZR_BACK_URL}/bzr/act${newObj.id}`;
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

  async getCmnCurrs() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/curr/?sl=${selectedLanguage}`;
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

  async  getCmnPar(cmnParCode) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.CMN_URL}/?endpoint=parend&code=${cmnParCode}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };
  
    try {
      console.log(url, "***************url**************")
      const response = await axios.get(url, { headers });
      return response.data; // Očekujemo da će ovo vratiti objekat sa ključevima 'code' i 'text'
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async  getCmnParById(parId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.CMN_BACK_URL}/cmn/x/par/${parId}?sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };
  
    try {
      console.log(url, "***************url**************")
      const response = await axios.get(url, { headers });
      return response.data; 
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
}

