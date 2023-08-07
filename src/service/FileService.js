import axios from "axios";
import env from "../configs/env";
import Token from "../utilities/Token";

class FileService {
  async uploadFile(file, fileName) {
    try {
      const selectedLanguage = localStorage.getItem("sl") || "en";
      const url = `http://ws11.ems.local:8305/public/tic/upload/?sl=${selectedLanguage}`;
      const formData = new FormData();
      formData.append("file", file, fileName);
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        Authorization: tokenLocal.token,
      };

      const response = await axios.post(url, formData, { headers });
      console.log(url, "********************", response.data.message, "------------------------------", response.status)
      return {status: response.status, message: response.data.message};
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async deleteFile(fileName) {
    try {
      const selectedLanguage = localStorage.getItem("sl") || "en";
      const url = `${env.TIC_BACK_URL}/tic/file/delete/${fileName}/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        Authorization: tokenLocal.token,
      };

      const response = await axios.delete(url, { headers });

      console.log("File deleted:", fileName);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}

export default FileService;
