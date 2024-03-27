import db from "../db/db.js";
import entities from "./entitis/entitis.js";
import { uniqueId } from "../middleware/utility.js";

const copyGrpLoclink = async (table, par1, par2, par3, begda, endda, requestBody) => {

  try {
    const tableObj = JSON.parse(table);
    
    let ok = false;
    let uId = '11111111111111111111'
    await db.query("BEGIN");
    if (par1 == 'true') {
      await db.query(
        `
      delete from cmn_loclink
      where loc2 = $1
    `, [tableObj.id]);
    }

    // Iteriramo kroz objekte u requestBody
    // Pretvorite string u niz objekata
    const parsedBody = JSON.parse(requestBody.jsonObj);
    // Provera da li parsedBody ima svojstvo koje sadrži niz objekata
    if (parsedBody && Array.isArray(parsedBody)) {

      // Iteriramo kroz objekte u parsedBody
      for (const obj of parsedBody) {
        uId = await uniqueId();
        await db.query(
          `
          INSERT INTO cmn_loclink (
            id, site, tp, loctp1, loc1, loctp2, loc2, val, begda, endda, hijerarhija, onoff, color, icon)
          VALUES 
            ($1, NULL, $2, $3, $4, $5, $6, '', $7, $8, 1, 0, $9, $10)
          `, 
          [  uId, tableObj.tp, obj.tp, obj.id, tableObj.tp, tableObj.id,  begda, endda, obj.color, obj.icon]
          );
      }
    }

    await db.query("COMMIT"); // Confirm the transaction
    ok = true;

    return ok;
  } catch (error) {
    if (db) {
      await db.query("ROLLBACK"); // Rollback the transaction in case of an error
    }
    throw error;
  }
};


export default {
  copyGrpLoclink,
};
