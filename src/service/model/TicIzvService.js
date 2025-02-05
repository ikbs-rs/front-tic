import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicIzvService {

  async getOsnovni1(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/_v/lista/?stm=tic_osnovni1izvl_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********TicIzvService*************", url)
      const response = await axios.get(url, { headers });
      console.log(url, "**********TicIzvService*******************************************", response.data)
      return response.data.item || response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

