import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";
import { PDFDocument } from 'pdf-lib';
import { TicStampaService } from "../../service/model/TicStampaService";
import { TicEventattsService } from "../../service/model/TicEventattsService";
import DateFunction from '../../utilities/DateFunction';

export class TicDocService {

  async getObjTpL(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/obj/_v/lista/?stm=cmn_objtpcode_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********TicDocService*************", url)
      const response = await axios.get(url, { headers });
      //console.log("**********TicDocService*************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDocPaymentS(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/_v/lista/?stm=tic_docpayments_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********TicDocService*************", url)
      const response = await axios.get(url, { headers });
      //console.log("**********TicDocService*************", response.data)
      const rezultat = response.data.item || response.data.items;
      return rezultat;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDocZbirniiznos(objId) {
    if (!objId || objId == undefined) {
      return 0;
    }
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/_v/lista/?stm=tic_doczbirniiznos_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********TicDocService*************", url)
      const response = await axios.get(url, { headers });
      //console.log("**********TicDocService*************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDocZbirniiznosP(objId) {
    if (!objId || objId == undefined) {
      return 0;
    }
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.PROD_BACK_URL}/prodaja/?stm=tic_doczbirniiznos_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********TicDocService*************", url)
      const response = await axios.get(url, { headers });
      //console.log("33333LLLLL", response.data)
      const rezultat = response.data.item || response.data.items
      return rezultat[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDocCountPrint(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/_v/lista/?stm=tic_doccountprint_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********TicDocService*************", url)
      const response = await axios.get(url, { headers });
      //console.log("**********TicDocService*************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDocCountPay(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/_v/lista/?stm=tic_doccountpay_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********getDocCountPay*************", url)
      const response = await axios.get(url, { headers });
      //console.log("**********getDocCountPay*************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/_v/lista/?stm=tic_doc_v&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //////console.log("**********TicDocService*************",url)
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTransactionLista(par1, par2, par3, par4, par5, par6) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/_v/lista/?stm=tic_transaction_v&par1=${par1}&par2=${par2}&par3=${par3}&par4=${par4}&par5=${par5}&par6=${par6}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      ////console.log("**********getTransactionLista*************",url)
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTransactionFLista(par1, par2, par3, par4, par5, par6, par7, par8, par9, par10) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/_v/lista/?stm=tic_transactionf_v&par1=${par1}&par2=${par2}&par3=${par3}&par4=${par4}&par5=${par5}&par6=${par6}&par7=${par7}&par8=${par8}&par10=${par10}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      ////console.log("**********getTransactionLista*************",url)
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTicListaByItem(tab, route, view, item, objId) {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/${tab}/_v/${route}/?stm=${view}&item=${item}&id=${objId}&sl=${selectedLanguage}`;
    //console.log(url, "HHHHH 01111111000000000000000000000000000000000000000 ******************************************************************")
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

  async getTicListaByItemId(tab, route, view, item, objId) {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/${tab}/_v/${route}/?stm=${view}&item=${item}&objid=${objId}&sl=${selectedLanguage}`;
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

  async getTicListaByItemIdP(view, item, objId) {
// console.log(view, item, objId, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.PROD_BACK_URL}/prodaja/?stm=${view}&item=${item}&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data.item //||response.data.items;
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
      return response.data.item || response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCmnListaByItem2(tab, route, view, item1, objId1, item2, objId2) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/${tab}/_v/${route}/?stm=${view}&item1=${item1}&id1=${objId1}&item2=${item2}&id2=${objId2}&sl=${selectedLanguage}`;
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

  async getTicDocs() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/?sl=${selectedLanguage}`;
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

  async getTicDoc(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/doc/${objId}/?sl=${selectedLanguage}`;
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


  async getTicDocP(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.PROD_BACK_URL}/prodaja/?stm=tic_doc&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      const rezultat = response.data.item || response.data.items
      //console.log(response.data, "getTicDocPLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
      return rezultat[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTicDocEventKupacBrojKartiP(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.PROD_BACK_URL}/prodaja/?stm=tic_doceventkupacbrojkartil_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      const rezultat = response.data.item || response.data.items
      //console.log(response.data, "getTicDocPLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
      return rezultat[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async postTicDoc(newObj) {
    try {
      ////console.log(newObj, "@ 00 @@@@ postTicDoc @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (!newObj?.provera && (newObj?.date.broj() === '')) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/doc/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      ////console.log("###################***response.data.items***********"  , response.data.items, "****************#######################")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putTicDoc(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.broj.trim() === '' || newObj?.channel === '') {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/doc/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      //console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD*555555555555555555550000#################", jsonObj, "****************")
      const response = await axios.put(url, jsonObj, { headers });
      // console.log("5555555555555555555551111**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteTicDoc(newObj) {
    try {
      const url = `${env.TIC_BACK_URL}/tic/doc/${newObj.id}`;
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

  async getCmnPar(cmnParCode) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.CMN_URL}/?endpoint=parend&code=${cmnParCode}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log(url, "***************url**************")
      const response = await axios.get(url, { headers });
      return response.data; // Očekujemo da će ovo vratiti objekat sa ključevima 'code' i 'text'
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCmnParById(parId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.CMN_BACK_URL}/cmn/x/par/${parId}?sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log(url, "***************url**************")
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCmnPaymenttps() {
    console.log( "0000-HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
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

  async getIdByItem(objName, objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/${objName}/getid/code/${objId}/?sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log(url, "***************getIdByItem*******************")
      const response = await axios.get(url, { headers });
      return response.data.items || response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getParByUserId() {
    //console.log("0$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", 0)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const userId = localStorage.getItem('userId')
    const url = `${env.CMN_BACK_URL}/cmn/x/par/_v/lista/?stm=cmn_getparbyuserid_v&objid=${userId}&sl=${selectedLanguage}`;
    //console.log("0$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", url)

    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log(url, "***************getIdByItem*******************")
      const response = await axios.get(url, { headers });
      return response.data.items || response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getParByUserIdP() {
    //console.log("0$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", 0)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const userId = localStorage.getItem('userId')
    const url = `${env.PROD2_BACK_URL}/prodaja/?stm=cmn_getparbyuserid_v&objid=${userId}&sl=${selectedLanguage}`;
    //console.log("0$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", url)

    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log(url, "***************getIdByItem*******************")
      const response = await axios.get(url, { headers });
      return response.data.item //response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async obradaProdajeRezervacija(newObj, par1) {
    try {
      //console.log("*0000000000000000000000#################", newObj, "****************00000000000000000000000000000000000000000000000")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.broj.trim() === '' || newObj?.channel === '') {
        throw new Error(
          "Items must be filled!"
        );
      }

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_prodaja_s&par1=${par1}&par2=${newObj.id}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      ////console.log("*#################", jsonObj, "****************")
      const response = await axios.post(url, jsonObj, { headers });
      ////console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async ticDocsetservice(newObj, par1) {
    try {
      //console.log("*0000000000000000000000#################", newObj, "****************00000000000000000000000000000000000000000000000")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.broj.trim() === '' || newObj?.channel === '') {
        throw new Error(
          "Items must be filled!"
        );
      }

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_docssetservice_s&par1=${par1}&par2=${newObj.id}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      ////console.log("*#################", jsonObj, "****************")
      const response = await axios.post(url, jsonObj, { headers });
      ////console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async setCancelTicDoc(newObj) {
    try {
      //console.log("*0000000000000000000000#################", newObj, "****************00000000000000000000000000000000000000000000000")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.broj.trim() === '' || newObj?.channel === '') {
        throw new Error(
          "Items must be filled!"
        );
      }

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_docsetcancel_s&objId1=${newObj.id}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };

      ////console.log("*#################", jsonObj, "****************")
      const response = await axios.post(url, {}, { headers });
      ////console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putTicDocSet(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_set_s&par1=tic_doc&par2=usr&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      // console.log("5555555555555555555551111**************", response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async postTicDocSetValue(par1, par2, objId1, objId2) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      console.log("5555555555555555555551111************** PAYMENTTP ****************", par1, par2, objId1, objId2)
      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_setvalue_s&par1=${par1}&par2=${par2}&objId1=${objId1}&objId2=${objId2}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };

      const response = await axios.post(url, {}, { headers });
      console.log("5555555555555555555551111**************", response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async postDocStorno(newObj, ticDoc, uTip) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const userId = localStorage.getItem('userId')

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_docstorno_s&par1=${uTip}&par2=${userId}&objId1=${ticDoc.id}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };

      const jsonObj = JSON.stringify(newObj)
      console.log(newObj, "5555555555555555555551111******************************", url)
      const response = await axios.post(url, jsonObj, { headers });

      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }
  async getPrinFiskal(ticDoc) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.PROD1_BACK_URL}/prodaja/fiskaldata?stm=tic_fiskaldata_v&objid=${ticDoc.id}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // poziv servera za stampu fiskala -- response.data.item
      
      const invoiceRequest = response.data.item;
      const print = false;
      const email = 'zivkovic.marko@hotmail.com';
      
      const payload = {
        print,
        email,
        invoiceRequest
    };
    console.log(payload, "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
    // const invoiceResponse = await axios.post(`${process.env.REACT_APP_REST_BACK_URL}/fiskalni-racun-esir`, payload);
      return true; //response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getPrintgrpLista(newObj, ticStampa, tpStampa) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const userObj = localStorage.getItem('user')
    const user = userObj.username
    const tm = DateFunction.currDatetime
    const ticket = newObj.map(item => ({
      nevent: item.nevent,
      nart: item.nart,
      seat: item.seat,
      row: item.row,
      potrazuje: item.potrazuje,
      user: user,
      tp: tpStampa,
      tm: tm
    }));
    const ticketJsonString = JSON.stringify(ticket);
    ticStampa.tp = tpStampa
    ticStampa.ticket = ticketJsonString
    ticStampa.tmupdate = user
    const par1 = ''
    console.log(ticket, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    /******************************************************************************* */
    const newArr = newObj.map(obj => obj.id);
    localStorage.removeItem('docsIds');
    localStorage.setItem('docsIds', JSON.stringify(newArr));
    /******************************************************************************* */
    const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_docprintlog_s&par1=${par1}&par2=${newObj.id}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    const baseUrl = `${env.DOMEN}/sal/print-tickets`;
    const urlWithToken = `${baseUrl}?token=${tokenLocal.token}`;
    // console.log(urlWithToken, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    try {
      const response = await fetch(urlWithToken);

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Pretpostavljamo da je odgovor URL
      const downloadUrl = await response.text();
      console.log("Download URL:", downloadUrl);

      // Preuzimanje stvarnog sadržaja s datog URL-a
      const contentResponse = await fetch(downloadUrl);
      if (!contentResponse.ok) {
          throw new Error(`Error fetching content from download URL: ${contentResponse.status}`);
      }

      const htmlContent = await contentResponse.text();
      // console.log(htmlContent, "88888HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      // Send a POST request with the printer name and content
      const printerName = "Microsoft Print to PDF"; // Ovo zamenite pravim imenom štampača
      const postResponse = await fetch('https://localhost:8650/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          printer: printerName,
          content: htmlContent
        })
      });

      if (!postResponse.ok) {
        throw new Error(`Error sending print job: ${postResponse.status}`);
      }

      // console.log("Print job sent successfully");
      // // window.open(urlWithToken, '_blank');

      // const ticStampaService = new TicStampaService();
      // await ticStampaService.postTicStampa(ticStampa);


      // console.log("**********TicDocService*************", url)
      // const response = await axios.get(urlWithToken, { headers });
      // console.log("Response data: ", response.data);

      // const newWindowUrl = response.data.item;
      // window.open(newWindowUrl, '_blank'); 

    } catch (error) {
      console.error("Error fetching the URL: ", error);
      if (error.response) {
        console.error("Response status: ", error.response.status);
        console.error("Response data: ", error.response.data);
      }
      throw error;
    }
  }

  async getPrintgrpLPT(newObj, ticStampa, tpStampa) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const userObj = localStorage.getItem('user')
    const user = userObj.username
    const tm = DateFunction.currDatetime
    const ticket = newObj.map(item => ({
      nevent: item.nevent,
      nart: item.nart,
      seat: item.seat,
      row: item.row,
      potrazuje: item.potrazuje,
      user: user,
      tp: tpStampa,
      tm: tm
    }));
    const ticketJsonString = JSON.stringify(ticket);
    ticStampa.tp = tpStampa
    ticStampa.ticket = ticketJsonString
    ticStampa.tmupdate = user
    const par1 = '';

    const newArr = newObj.map(obj => obj.id);
    localStorage.removeItem('docsIds');
    localStorage.setItem('docsIds', JSON.stringify(newArr));

    const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_docprintlog_s&par1=${par1}&par2=${newObj.id}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token,
    };

    const baseUrl = `${env.DOMEN}/sal/print-tickets`;
    const urlWithToken = `${baseUrl}?token=${tokenLocal.token}`;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none'; // Skrivamo iframe
    iframe.src = urlWithToken;
    fetchAndPrintPdf2(urlWithToken)

    const ticStampaService = new TicStampaService();
    await ticStampaService.postTicStampa(ticStampa);
    // document.body.appendChild(iframe);

    // iframe.onload = function() {
    //   iframe.contentWindow.print(); // Automatski pozivamo štampanje kada se učita PDF
    // };
    async function fetchAndPrintPdf(url) {
      try {
        const response = await fetch(url);
        const contentType = response.headers.get('Content-Type');
        if (!contentType || contentType !== 'application/pdf') {
          throw new Error(`Fetched content is not a valid PDF -> ${contentType}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        const pdfDoc = await PDFDocument.load(arrayBuffer);

        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl;

        document.body.appendChild(iframe);

        iframe.onload = function () {
          iframe.contentWindow.print();
        };
      } catch (error) {
        console.error('Error fetching or printing the PDF: ', error);
      }
    }
    //**********************************************************************************
    async function fetchAndPrintPdf1(url) {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const text = await response.text();

        // Pretraga URL-a PDF-a unutar HTML sadržaja
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const embedTag = doc.querySelector('embed');
        const objectTag = doc.querySelector('object');

        let pdfUrl;
        if (embedTag) {
          pdfUrl = embedTag.src;
        } else if (objectTag) {
          pdfUrl = objectTag.data;
        }

        if (pdfUrl) {
          // Otvaramo PDF URL u iframe-u za automatsko štampanje
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = pdfUrl;

          document.body.appendChild(iframe);

          iframe.onload = function () {
            iframe.contentWindow.print();
          };
        } else {
          throw new Error('PDF URL not found in HTML content.');
        }

      } catch (error) {
        console.error('Error fetching or printing the PDF: ', error);
      }
    }

    //**********************************************************************************
    async function fetchAndPrintPdf2(url) {
      try {
        console.log(url, "88888888888888888888888888888888888888888")
        const response = await fetch(url);

        // Provera da li je sadržaj validan
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        // Kreiramo Blob od odgovora
        const blob = await response.blob();

        // Kreiramo Blob URL
        const blobUrl = URL.createObjectURL(blob);

        // Kreiramo iframe i dodajemo ga u DOM
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';  // Sakrivamo iframe
        iframe.src = blobUrl;  // Postavljamo Blob URL kao src

        document.body.appendChild(iframe);

        iframe.onload = function () {
          iframe.contentWindow.print();  // Automatski pozivamo štampanje kada se učita PDF
        };

      } catch (error) {
        console.error('Error fetching or printing the PDF: ', error);
      }
    }

    try {
      //console.log("**********TicDocService*************", url);
      const response = await axios.get(url, { headers });
      //console.log("Response data: ", response.data);

      const pdfUrl = response.data.item;

    } catch (error) {
      console.error("Error fetching the URL: ", error);
      if (error.response) {
        console.error("Response status: ", error.response.status);
        console.error("Response data: ", error.response.data);
      }
      throw error;
    }
  }

  async proveraBrojaKarti(docId) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const userId = localStorage.getItem('userId')

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_doceventsl_v&objId=${docId}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };

      //console.log(docId, "01XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", url)
      const response = await axios.post(url, {}, { headers });

      const data =  response.data.item||response.data.item;
      if (Array.isArray(data)) {
        const ticEventattsService = new TicEventattsService();
        for (const item of data) {
          //console.log(item.event, "02XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", url)
          const objId = item.event; 
  
          const brojKartiLista = await ticEventattsService.getCodeValueListaP(objId, '01.06.');
          const brojKarti = brojKartiLista[0]
          const kupciBrojKarti = await this.getTicDocEventKupacBrojKartiP(objId);
          for (const row of kupciBrojKarti) {
            //console.log(row, "02XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", url)
            
          }
        }
      } else {
        console.error("Data nije niz:", data);
      }      
    } catch (error) {
      console.error(error);
      throw error;
    }

  }


  async setReservation(newDoc) {
    try {
      console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", newDoc, "JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ")
      const selectedLanguage = localStorage.getItem('sl') || 'en'

      const url = `${env.TIC_BACK_URL}/tic/doc/_s/param/?stm=tic_setreservation_s&objId1=${newDoc.id}&par1=${newDoc.endtm}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };

      const response = await axios.post(url, {}, { headers });

      return response.data.items||response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }


}

