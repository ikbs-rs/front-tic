import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class AdmUserPermissService {

  async getAdmUserPermissRoll(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.ADM_BACK_URL}/adm/userpermiss/getallouter/usr/${objId}/?sl=${selectedLanguage}&outer=adm_roll`;
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

  async getAdmUserpermissUser(rollObjID) {
    const url = `${env.ADM_BACK_URL}/adm/userpermiss_vu/getall/roll/${rollObjID}`;
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

  async getAdmUserPermissAllByItem(userObj) {
    const url = `${env.ADM_BACK_URL}/adm/userpermiss_vr/getall/usr/${userObj.id}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };
    try {
      console.log(url)
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async postAdmUserPermiss(newObj) {
    try {
      if (newObj.roll === null || newObj.usr === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/userpermiss`;
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

  async putAdmUserPermiss(newObj) {
    try {
      if (newObj.roll === null || newObj.usr === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/userpermiss`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)

      const response = await axios.put(url, jsonObj, { headers });
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteAdmUserPermiss(newObj) {
    const url = `${env.ADM_BACK_URL}/adm/userpermiss/${newObj.id}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      'Authorization': tokenLocal.token
    };

    try {
      const response = await axios.delete(url, { headers });
      return response.data.items;
    } catch (error) {
      throw error;
    }

  }
}

