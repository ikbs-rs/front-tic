import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";
import DateFunction from "../../utilities/DateFunction"

export class TicDocsuidService {
  async getProdajaLista(objId) {
  
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docsuid/_v/lista/?stm=tic_docsuidprodaja_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      
      const response = await axios.get(url, { headers });
      console.log(response.data, "1111111111111111111111111111111getProdajaLista111111111111111111111111111111111111111111")
      return response.data.item||response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docsuid/_v/lista/?stm=tic_docsuid_v&objid=${objId}&sl=${selectedLanguage}`;
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

  async getCmnListaByItem(tab, route, view, item, objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/${tab}/_v/${route}/?stm=${view}&item=${item}&id=${objId}&sl=${selectedLanguage}`;
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

  async getTicDocsuids() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docsuid/?sl=${selectedLanguage}`;
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

  async getTicDocsuid(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docsuid/${objId}/?sl=${selectedLanguage}`;
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

  async postProdajaTicDocsuid(ticDoc, ticDocs, ) {
    try {
      if (ticDoc.status == "") {
        //TO DO
        // dell /pull postojece reyervacije
        //nadji tarifnu grupu rezervacije
        // preracunaj iznos % >= limit + porez
        // push u niz
      }        
        // proveri tip karte
        // ponovi kao za rezervaciju
        
        // proveri isporuku
        // ponovi kao za rezervaciju


      let locObj = { ...ticDocs };
      locObj.begtm = DateFunction.currDatetime()
      locObj.endtm = '99991231000000'
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (ticDocs.curr === null || ticDocs.art === null || ticDocs.status === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/docsuid/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      
      const jsonObj = JSON.stringify(locObj)
      const response = await axios.post(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }


  async postTicDocsuid(newObj) {
    try {
      let locObj = { ...newObj };
      locObj.begtm = DateFunction.currDatetime()
      locObj.endtm = '99991231000000'
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.curr === null || newObj.art === null || newObj.status === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/docsuid/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      
      const jsonObj = JSON.stringify(locObj)
      const response = await axios.post(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putTicDocsuid(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.curr === null || newObj.art === null || newObj.status === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/docsuid/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      console.log(url, "*#################", jsonObj, "H-00-00-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      const response = await axios.put(url, jsonObj, { headers });
      console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteTicDocsuid(newObj) {
    try {
      const url = `${env.TIC_BACK_URL}/tic/docsuid/${newObj.id}`;
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
    
  async postTicDocsuidPosetilac(newObj, docsId) {
    try {
      console.log(newObj, '8888-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH', docsId)
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const userId = localStorage.getItem('userId')

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_docsuidposetilac_s&objId1=${docsId}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };

      const jsonObj = JSON.stringify(newObj)
      console.log(newObj, "5555555555555555555551111******************************", jsonObj)
      const response = await axios.post(url, jsonObj, { headers });

      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async postTicDocsuidPar(newObj, docsId) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const userId = localStorage.getItem('userId')

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_docsuidpar_s&objId1=${docsId}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };

      const jsonObj = JSON.stringify(newObj)
      console.log(newObj, "5555555555555555555551111******************************", jsonObj)
      const response = await axios.post(url, jsonObj, { headers });

      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async postTicDocsuidParAll(newObj, docId) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const userId = localStorage.getItem('userId')
      // console.log(newObj, "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_docsuidparall_s&objId1=${docId}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };

      const jsonObj = JSON.stringify(newObj)
      // console.log(newObj, "5555555555555555555551111******************************", jsonObj)
      const response = await axios.post(url, jsonObj, { headers });

      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }  

  async postTicDocsuidParAllNull(newObj, docId) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const userId = localStorage.getItem('userId')

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_docsuidparallnull_s&objId1=${docId}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };

      const jsonObj = JSON.stringify(newObj)
      console.log(newObj, "5555555555555555555551111******************************", jsonObj)
      const response = await axios.post(url, jsonObj, { headers });

      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  } 

  async postTicDocsuidParNull(newObj, docId) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const userId = localStorage.getItem('userId')

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_docsuidparnull_s&objId1=${docId}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };

      const jsonObj = JSON.stringify(newObj)
      console.log(newObj, "5555555555555555555551111******************************", jsonObj)
      const response = await axios.post(url, jsonObj, { headers });

      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }    
}

