import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicEventService {
  async getLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/event/_v/lista/?stm=tic_event_v&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };
    //console.log(url, "*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
    try {
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getListaTmp(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/event/_v/lista/?stm=tic_eventtmp_v&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };
    //console.log(url, "*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
    try {
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async postCopyEvent(objId, tmpId, begda, endda) {
    try {
      console.log("*****************postCopyEvent************************", begda)
      return -1
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (objId === null || tmpId === null) {
        throw new Error(
          "objId or tmpId must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/x/event/_s/param/?stm=tic_copyevent_s&objId1=${objId}&objId2=${tmpId}&begda=${begda}&endda=${endda}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      console.log("************postCopyEvent****************", url)
      //const jsonObj = JSON.stringify(newObj)
      console.log("****************url******************", url)
      const response = await axios.post(url, {}, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async postCopyEventSettings(objId, tmpId, begda, endda) {
    try {
      console.log("*****************postCopyEventSettings************************", begda)
      // return -1
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (objId === null || tmpId === null) {
        throw new Error(
          "objId or tmpId must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/x/event/_s/param/?stm=tic_copyeventsettings_s&objId1=${objId}&objId2=${tmpId}&begda=${begda}&endda=${endda}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      console.log("************postCopyEventSettings****************", url)
      //const jsonObj = JSON.stringify(newObj)
      console.log("****************urlSettings******************", url)
      const response = await axios.post(url, {}, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async postActivateEvent(objId) {
    try {
      console.log("*****************postActivateEvent************************")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (objId === null) {
        throw new Error(
          "objId or tmpId must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/x/event/_s/param/?stm=tic_activateevent_s&objId1=${objId}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      //const jsonObj = JSON.stringify(newObj)
      console.log("*postActivateEvent***************url******************", url)
      const response = await axios.post(url, {}, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getProdajaLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'

    const url = `${env.TIC_BACK_URL}/tic/x/event/_v/lista/?stm=tic_eventprodaja_v&sl=${selectedLanguage}`;
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
  
  async getCmnObjXVLista(obj) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/loc/_v/lista/?stm=cmn_locxv_v&sl=${selectedLanguage}`;

    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      //console.log(url, "******************getCmnObjXcsLista*********************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCmnObjXcsLista(obj) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/loc/_v/lista/?stm=cmn_xsc_v&sl=${selectedLanguage}`;

    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      //console.log(url, "******************getCmnObjXcsLista*********************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCmnObjXcsIdLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/loc/_v/lista/?stm=cmn_xscid_v&objid=${objId||'-1'}&sl=${selectedLanguage}`;

    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      //console.log(url, "******************getCmnObjXcsLista*********************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCmnObjXcsDDLista(uObj, locTtp) {
    console.log(uObj, "******************getCmnObjXcsLista*********************")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/loc/_v/lista/?stm=cmn_xscdd_v&objid=${uObj}&id=${locTtp}&sl=${selectedLanguage}`;

    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      //console.log(url, "******************getCmnObjXcsLista*********************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOrganizatorLista(objName, item, id) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/par/_v/listabytxt/?stm=cmn_par_tp_v&objName=${objName}&item=${item}&id=${id}&sl=${selectedLanguage}`;
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
    const url = `${env.CMN_BACK_URL}/cmn/x/${tab}/_v/${route}/?stm=${view}&item=${item}&id=${objId}&sl=${selectedLanguage}`;
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

  async getTicEvents() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/event/?sl=${selectedLanguage}`;
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

  async getTicEvent(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/event/${objId}/?sl=${selectedLanguage}`;
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


  async postTicEvent(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/x/event/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      console.log("**************"  , response.data, "****************WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async postTicEventCopy(newObj) {
    try {
      console.log("*00*************************postTicEventCopy***************************")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      // const url = `${env.TIC_BACK_URL}/tic/x/event/?sl=${selectedLanguage}`;
      const url = `${env.TIC_BACK_URL}/tic/x/event/_s/param/?stm=tic_eventcopy_s&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      console.log("**************"  , response.data.item.tic_event_copy, "****************")
      return response.data.item.tic_event_copy;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async postTicEventSaveDate(newObj) {
    try {
      console.log("*00*************************postTicEventCopy***************************")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      // const url = `${env.TIC_BACK_URL}/tic/x/event/?sl=${selectedLanguage}`;
      const url = `${env.TIC_BACK_URL}/tic/x/event/_s/param/?stm=tic_eventsavedate_s&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      console.log("**************"  , response.data.item, "****************")
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putTicEvent(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/x/event/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      //console.log("*#################"  , jsonObj, "****************")
      const response = await axios.put(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteTicEvent(newObj) {
    try {
      const url = `${env.TIC_BACK_URL}/tic/x/event/${newObj.id}`;
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

  async deleteAllTicEvent(newObj) {
    try {
      console.log("*00*************************postTicEventCopy***************************")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      // const url = `${env.TIC_BACK_URL}/tic/x/event/?sl=${selectedLanguage}`;
      const url = `${env.TIC_BACK_URL}/tic/x/event/_s/param/?stm=tic_eventdeleteall_s&objId1=${newObj.id}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      console.log("**************"  , response.data.item, "****************")
      return response.data.item.id;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async generateImageUrl(id, relpath, selectedLanguage) {
    try {
      // const selectedLanguage = localStorage.getItem('sl') || 'en'
      const url = `${env.IMG_BACK_URL}/public/tic/${id}.jpg/?relpath=${relpath}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Authorization': tokenLocal.token
      };

      const response = await axios.get(url, { headers });
      //console.log("**************generateImageUrl 01 ***********", response)
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getTicEventchpermissL(eventId, userId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/event/_v/lista/?stm=tic_eventchpermiss_v&objid=${eventId}&par1=${userId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // console.log(url, "******************************getTicEventchpermissL*********************************", response.data.item)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTicChpermissL(userId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/event/_v/lista/?stm=tic_chpermiss_v&par1=${userId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // console.log(url, "******************************getTicEventchpermissL*********************************", response.data.item)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTicPrintgrpL(objId, cena) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/event/_v/lista/?stm=tic_printgrp_v&objid=${objId}&par1=${cena}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      // console.log(url, "******************************getTicEventchpermissL*********************************")
      const response = await axios.get(url, { headers });
      
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}

