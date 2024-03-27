import sHelper from "../helpers/sHelper.js";

const postFunction = async (req, res) => {
  try {
    
    const requestBody = req.body || {};
    console.log(req.query.par1, "*********sController.postFunction**********@#@#@#@#@#@#@#@#@#@#@#@***************************", 
          req.query.table.id, req.query.table.tp, "@#@#@#@#@#@#@#@#@#@#@#@")
    const item = await sHelper.postFunction( 
        req.query.table||{}, 
        req.query.objName1||0, 
        req.query.objName2||0, 
        req.query.objId1||0, 
        req.query.objId2||0, 
        req.query.stm||0, 
        req.query.begda||0, 
        req.query.endda||0, 
        req.query.sl||'en',
        req.query.par1||null,
        req.query.par2||null,
        req.query.par3||null,
        requestBody
         );
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske postFunction sController ${req.objName}`, error: err.message });
  }
};

export default {
    postFunction,
};
