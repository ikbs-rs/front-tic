import axios from 'axios';
import env from "../../configs/env"

export class WorkerService {
  async getProdajaLista(objId, selectedLanguage, token, refreshToken) {
    // console.log( selectedLanguage, "action02.0 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    const url = `${env.TIC_BACK_URL}/tic/docsuid/_v/lista/?stm=tic_docsuidprodaja_v&objid=${objId}&sl=${selectedLanguage}`;
    const headers = {
      Authorization: token
    };
    // console.log(headers, "action02.1 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    try {
      
      const response = await axios.get(url, { headers });
      // console.log(response.data, "ssss AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
      return response.data.item||response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async getTicEventatts11L(objId, par1, selectedLanguage, token, refreshToken) {

    const url = `${env.TIC_BACK_URL}/tic/eventatts/_v/lista/?stm=tic_eventatts11l_v&objid=${objId}&par1=${par1}&sl=${selectedLanguage}`;
    // console.log(url, "url AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    const headers = {
        Authorization: token
    };

    try {
        
        const response = await axios.get(url, { headers });
        return response.data.item;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async getCmnParLista(objId, selectedLanguage, token, refreshToken) {
    const url = `${env.CMN_BACK_URL}/cmn/x/par/_v/lista/?stm=cmn_par_v&objid=${objId}&sl=${selectedLanguage}`;

    const headers = {
        Authorization: token
    };

    try {
        //   const response = await axios.get(url, { headers, timeout: 10000 });
        const response = await axios.get(url, { headers });
        //   console.log(url,"?????????????????????????????getLista??????????????????????????????????", response)
        return response.data.item;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async getTicDocsdiscountLista(docsId, selectedLanguage, token, refreshToken) {
    const url = `${env.TIC_BACK_URL}/tic/docsdiscount/_v/lista/?stm=tic_docsdiscountl_v&objid=${docsId}&sl=${selectedLanguage}`;
    const headers = {
      Authorization: token
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data.items || response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDiscounttpLista(objId, selectedLanguage, token, refreshToken) {
    const url = `${env.TIC_BACK_URL}/tic/docdiscount/_v/lista/?stm=tic_docsdiscounttp_v&objid=${objId}&sl=${selectedLanguage}`;

    const headers = {
      Authorization: token
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