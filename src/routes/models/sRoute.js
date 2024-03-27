import express from "express";
import sController from "../../controllers/sController.js";

const router = express.Router();

router.use("/", (req, res, next) => {
  const urlParts = req.url.split("/");
  req.objName2 = urlParts[1];
  // router.get("/param", sController.getLista);
  // router.get("/param2", sController.getLista2);
  router.post("/param", sController.postFunction);
  // router.put("/param", sController.getLista);
  // router.delete("/param", sController.getLista);

  //router.get("/", sController.getLista);
  next();
});

export default router;

