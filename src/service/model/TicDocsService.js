import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";
import DateFunction from "../../utilities/DateFunction"

export class TicDocsService {

  async getLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docs/_v/lista/?stm=tic_docs_v&objid=${objId}&sl=${selectedLanguage}`;
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

  async getArtikliLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docs/_v/lista/?stm=tic_docsartikli_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // console.log(response.data, "77777777777777777777777777777getArtikliLista777777777777777777777777777777777777")
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getArtikliListaP(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.PROD1_BACK_URL}/prodaja/?stm=tic_docsartikli_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // console.log(response.data, "77777777777777777777777777777getArtikliLista777777777777777777777777777777777777")
      return response.data.item //||response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getEventartcenas(objId, signal) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docs/_v/lista/?stm=tic_docseventartcena_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers, signal });
      // console.log(response.data, "77777777777777777777777777777getEventartcenas777777777777777777777777777777777777")
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getEventartcenasP(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.PROD1_BACK_URL}/prodaja/?stm=tic_docseventartcena_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };
    
    let attempt = 0;
    const maxAttempts = 3; // Definišite maksimalni broj pokušaja
    
    while (attempt < maxAttempts) {
      attempt++;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5500); // Prekini nakon 1500 ms
      
      try {
        const response = await axios.get(url, { headers, signal: controller.signal });
        clearTimeout(timeoutId); // Obriši timeout ako je zahtev uspešan
        return response.data.item //||response.data.items;
      } catch (error) {
        clearTimeout(timeoutId);
        if (axios.isCancel(error)) {
          console.warn("Zahtev je prekinut zbog timeouta, pokušavam ponovo...");
        } else {
          console.error(error);
          throw error; // Ako je neka druga greška, prekini izvršavanje
        }
      }
    }
    
    throw new Error("Zahtev nije uspeo nakon maksimalnog broja pokušaja.");
  }
  

  async getArtikliPrintLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docs/_v/lista/?stm=tic_docsartikliprint_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // console.log(response.data, "77777777777777777777777777777getArtikliLista777777777777777777777777777777777777")
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getNaknadeLista(objId) {
    if (!objId) {
      return null
    }
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docs/_v/lista/?stm=tic_docsnaknade_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // console.log(response.data, "+++++++++++++++++++++++++++++++++#################+++++++++++++++++++++++++++++++++++++")
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getNaknadeListaP(objId) {
    if (!objId) {
      return null
    }
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.PROD2_BACK_URL}/prodaja/?stm=tic_docsnaknade_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // console.log(response.data, "+++++++++++++++++++++++++++++++++#################+++++++++++++++++++++++++++++++++++++")
      return response.data.item //||response.data.items;
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

  async getTicDocss() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docs/?sl=${selectedLanguage}`;
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

  async getTicDocs(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docs/${objId}/?sl=${selectedLanguage}`;
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

  async postProdajaTicDocs(ticDoc, ticDocs,) {
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
      const url = `${env.TIC_BACK_URL}/tic/docs/?sl=${selectedLanguage}`;
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


  async postTicDocs(newObj) {
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
      const url = `${env.TIC_BACK_URL}/tic/docs/?sl=${selectedLanguage}`;
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

  async putTicDocs(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.curr === null || newObj.art === null || newObj.status === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/docs/?sl=${selectedLanguage}`;
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

  async deleteTicDocs(newObj) {
    try {
      const url = `${env.TIC_BACK_URL}/tic/docs/${newObj.id}`;
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

  async getCmnObjByTpCode(objId, id) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/obj/_v/lista/?stm=cmn_objbytpcode_v&objid=${objId}&id=${id}&sl=${selectedLanguage}`;
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

  async getCmnObjByTpCodeP(objId, id) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.PROD2_BACK_URL}/prodaja/?stm=cmn_objbytpcode_v&par1=${objId}&objid=${id}&sl=${selectedLanguage}`;
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

  async getEventattsobjcode(docId, attCode, objCode) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/_v/lista/?stm=tic_eventattsobjcodel_v&objid=${docId}&par1=${attCode}&par2=${objCode}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      console.log(url, "2323232323232323232323232323232323232323")
      // if (objCode != undefined) {
      const response = await axios.get(url, { headers });
      return response.data.items || response.data.item;
      // }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async getHaveDiscount(docsId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/docs/_v/lista/?stm=tic_docshavediscount_v&objid=${docsId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      // console.log(url, "2323232323232323232323232323232323232323")
      const response = await axios.get(url, { headers });
      // console.log(response.data, "2HHHHHHHHHHHHHHHHHHHHHHHHH323232323232323232323232323232323232323")
      return response.data.items || response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}

