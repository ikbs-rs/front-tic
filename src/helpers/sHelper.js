import sModel from "../models/sModel.js";

const saltRounds = 10;

const postFunction = async (
  table,
  objName1,
  objName2,
  objId1,
  objId2,
  stm,
  begda,
  endda,
  lang,
  par1,
  par2,
  par3,
  requestBody
) => {
  try {
    console.log("*******Helper*********@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", stm);
    let result = {};
    switch (stm) {
      case "cmn_grploclink_s":
        result = await sModel.copyGrpLoclink(
          table,
          par1,
          par2,
          par3,
          begda,
          endda,
          requestBody
        );
        break;
      default:
        console.error("sHelper: Pogresan naziv za view-a - " + stm);
    }

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default {
  postFunction,
};
