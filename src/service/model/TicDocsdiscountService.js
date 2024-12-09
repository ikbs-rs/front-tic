import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicDocsdiscountService {

  async getTicDocsdiscountLista(docsId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.TIC_BACK_URL}/tic/docsdiscount/_v/lista/?stm=tic_docsdiscountl_v&objid=${docsId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    let attempt = 0;
    const maxAttempts = 3; // Definišite maksimalni broj pokušaja

    while (attempt < maxAttempts) {
      attempt++;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // Prekini nakon 1500 ms

      try {
        const response = await axios.get(url, { headers, signal: controller.signal });
        clearTimeout(timeoutId); // Obriši timeout ako je zahtev uspešan
        return response.data.items || response.data.item;
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

  async getTicDocsdiscountListaP(docsId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.PROD2_BACK_URL}/prodaja/?stm=tic_docsdiscountl_v&objid=${docsId}&sl=${selectedLanguage}`;
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
        return response.data.item //response.data.items;
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
  // async getDiscounttpListaP(objId) {
  //     const selectedLanguage = localStorage.getItem('sl') || 'en';
  //     const url = `${env.PROD_BACK_URL}/prodaja/?stm=tic_docsdiscounttp_v&objid=${objId}&sl=${selectedLanguage}`;
  //     const tokenLocal = await Token.getTokensLS();
  //     const headers = {
  //       Authorization: tokenLocal.token
  //     };

  //     try {
  //       const response = await axios.get(url, { headers, timeout: 5000 });
  //       return response.data.item;
  //     } catch (error) {
  //       console.error(error);
  //       throw error;
  //     }
  //   }
  async getDiscounttpListaP(objId) {
    try {
      // Ako već postoji aktivan AbortController, prekini prethodni zahtev
      if (this.abortController) {
        this.abortController.abort();
      }

      // Kreiraj novi AbortController za trenutni zahtev
      this.abortController = new AbortController();
      const signal = this.abortController.signal;  // Ovaj signal će se koristiti u axios pozivu

      const selectedLanguage = localStorage.getItem('sl') || 'en';
      const url = `${env.PROD_BACK_URL}/prodaja/?stm=tic_docsdiscounttp_v&objid=${objId}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        Authorization: tokenLocal.token
      };

      // Dodaj signal u axios get zahtev kako bi mogao biti prekinut
      const response = await axios.get(url, { headers, signal, timeout: 5000 });
console.log(response.data, "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
      return response.data.item ||response.data.items;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Previous request aborted');
      } else {
        console.error('Error during request:', error);
        throw error;  // Ponovo bacamo grešku ako nije prekinut zahtev
      }
    } finally {
      // Resetujemo AbortController nakon završetka zahteva
      this.abortController = null;
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

