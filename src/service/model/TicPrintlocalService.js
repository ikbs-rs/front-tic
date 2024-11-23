import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicPrintlocalService {

  async fetchPrinters(endpoint) {
    try {
      const response = await fetch(`https://localhost:8650/${endpoint}`);

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const printers = await response.json();
      console.log( "Fetched and mapped printers:", printers);
      const updatedPrinters = printers.map(printer => ({
        ...printer,             // Copy all other properties
        printname: printer.name // Add a new printname property with the value of name
      }));

      // Now you can save the updated printers in state or context
      // console.log(`https://localhost:8650/${endpoint}`, "Fetched and mapped printers:", updatedPrinters);
      return updatedPrinters;

    } catch (error) {
      console.error("Error fetching printers:", error);
    }
  }


  async fetchPrintersL(endpoint) {
    try {
      const response = await fetch(`https://localhost:8650/${endpoint}`);

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const printers = await response.json();
      console.log( "LLLLL Fetched and mapped printers:", printers);
      const updatedPrinters = printers.map(printer => ({
        ...printer,             // Copy all other properties
        printname: printer.name // Add a new printname property with the value of name
      }));

      // Now you can save the updated printers in state or context
      // console.log(`https://localhost:8650/${endpoint}`, "Fetched and mapped printers:", updatedPrinters);
      return printers;

    } catch (error) {
      console.error("Error fetching printers:", error);
    }
  }

  async addLocalPrinterHandler(newObj, tip) {
    try {
      // console.log(newObj, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
      const selectedLanguage = localStorage.getItem('sl') || 'en';
      const url = `https://localhost:8650/addlocalprinter`;
      const tokenLocal = await Token.getTokensLS();
      
      const headers = {
        'Content-Type': 'application/json'
        // Add other headers here if necessary, like Authorization
        // 'Authorization': `Bearer ${tokenLocal}` 
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newObj)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.data;
      return data; // Adjust according to your response structure
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  async printContent(printerName, content) {
    try {
      const response = await fetch('/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          printer: printerName,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send print job');
      }

      console.log("Print job sent successfully");
    } catch (error) {
      console.error("Error sending print job:", error);
    }
  };

  async loadLocalPrinters() {
    try {
      const response = await fetch('/localprinters');
      const printers = await response.json();
      // Možete sačuvati lokalne štampače u state
    } catch (error) {
      console.error("Error loading local printers:", error);
    }
  };

  async printDefaultContent(content) {
    try {
      const printers = await this.loadLocalPrinters(); // učitaj lokalne štampače
      const defaultPrinter = printers.find(printer => printer.default === "true");

      if (defaultPrinter) {
        await this.printContent(defaultPrinter.printname, content);
      } else {
        console.error("No default printer found");
      }
    } catch (error) {
      console.error("Error printing to default printer:", error);
    }
  };

  async getTicPrintlocals() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/printlocal/?sl=${selectedLanguage}`;
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

  async getTicPrintlocal(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/printlocal/${objId}/?sl=${selectedLanguage}`;
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

  async putTicPrintlocal(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.TIC_BACK_URL}/tic/x/printlocal/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.put(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteTicPrintlocal(newObj) {
    try {
      const url = `${env.TIC_BACK_URL}/tic/x/printlocal/${newObj.id}`;
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

  async getListaLL(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/obj/_v/lista/?stm=cmn_objll_v&objid=${objId}&sl=${selectedLanguage}`;
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

}

