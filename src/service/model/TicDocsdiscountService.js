import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicDocsdiscountService {

  async getTicDocsdiscountLista(docsId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docsdiscount/_v/lista/?stm=tic_docsdiscountl_v&objid=${docsId}&sl=${selectedLanguage}`;
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
  async getDiscounttpLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.TIC_BACK_URL}/tic/docdiscount/_v/lista/?stm=tic_docsdiscounttp_v&objid=${objId}&sl=${selectedLanguage}`;
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

  async getTicDocsdiscounts() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docsdiscount/?sl=${selectedLanguage}`;
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

  async getTicDocsdiscount(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docsdiscount/${objId}/?sl=${selectedLanguage}`;
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


  async postTicDocsdiscount(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      // if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
      //   throw new Error(
      //     "Items must be filled!"
      //   );
      // }
      const url = `${env.TIC_BACK_URL}/tic/docsdiscount/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      // console.log("00000000000000000000000000**************", response, "****************000000000000000000000")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putTicDocsdiscount(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      // if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
      //   throw new Error(
      //     "Items must be filled!"
      //   );
      // }
      const url = `${env.TIC_BACK_URL}/tic/docsdiscount/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      // console.log(newObj, "9999999999999999999999999999999HHHHHH99999999999999999999999")
      const response = await axios.put(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteTicDocsdiscount(newObj) {
    try {
      // console.log(newObj, "9HHHHHHHHHHHHHH999999999999999999999999999999HHHHHH99999999999999999999999")
      const url = `${env.TIC_BACK_URL}/tic/docsdiscount/${newObj.id}`;
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
  async postTicDocsdiscountAll(newObj) {
    try {
      // console.log(newObj, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const url = `${env.TIC_BACK_URL}/tic/docsdiscount/_s/param/?stm=tic_docsdiscountall_s&par1=${newObj.event}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      // console.log("00000000000000000000000000**************", response, "****************000000000000000000000")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async delTicDocsdiscountEventAll(newObj) {
    try {
      // console.log(newObj, "H00HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const url = `${env.TIC_BACK_URL}/tic/docsdiscount/_s/param/?stm=tic_deldocsdiscounteventall_s&par1=${newObj.event}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      console.log("00000000000000000000000000**************", response, "****************000000000000000000000")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async delTicDocsdiscountAll(newObj) {
    try {
      // console.log(newObj, "H00HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const url = `${env.TIC_BACK_URL}/tic/docsdiscount/_s/param/?stm=tic_deldocsdiscountall_s&par1=${newObj.event}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      console.log("00000000000000000000000000**************", response, "****************000000000000000000000")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }  
}

