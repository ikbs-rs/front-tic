import express from 'express'
import abstruct from './models/abstructRoute.js'
import abstructX from "./models/abstructXRoute.js";
//import servicesRoute from './services/servicesRoute.js'
import { checkJwt, checkPermissions, checkPermissionsEx } from '../security/interceptors.js'

const router = express.Router();

router.use(checkJwt); // provera JWT tokena na svakom zahtevu
router.use(express.json())


router.use((req, res, next) => { 
  next();
});


router.use("/", (req, res, next) => {
  
  const urlParts = req.url.split("/");
  // Dohvatam iz URL-a, koju tabelu obradjujen i setuje --- req.objName ****** TABELU
  // .../adm/menu/... adm je modul a menu je tabela
  if (!(urlParts[2] === "services")||!(urlParts[2] === "x")) {
    req.objName = urlParts[1] + "_" + urlParts[2];
  } 
  if (urlParts[2] === "x") { // za tebele koje imaju visejezicku podrsku
    req.objName = urlParts[1] + "_" + urlParts[3];
  }
  next();
});

router.use(async (req, res, next) => {
  if (req.path.startsWith("/adm/services/sign")) {
    return next();
  }
  try {  
    await  checkJwt(req, res, next);
  } catch (error) {
    console.error("Greška prilikom izvršavanja checkJwt:", error);
    res.status(401).json({ error: "Unauthorized" });
  }  
});

// Moze da se svede na jedan ruter ali volim da vidim sta je sve implementirano!!!

router.use('/cmn/currrate', checkPermissions(), abstruct)
router.use('/cmn/link', checkPermissions(), abstruct)
router.use('/cmn/loc', checkPermissions(), abstruct)
router.use('/cmn/locatt', checkPermissions(), abstruct)
router.use('/cmn/locatts', checkPermissions(), abstruct)
router.use('/cmn/loclink', checkPermissions(), abstruct)
router.use('/cmn/loclinktp', checkPermissions(), abstruct)
router.use('/cmn/locobj', checkPermissions(), abstruct)
router.use('/cmn/loctp', checkPermissions(), abstruct)
router.use('/cmn/menu', checkPermissions(), abstruct)
router.use('/cmn/module', checkPermissions(), abstruct)

router.use('/cmn/objatt', checkPermissions(), abstruct)
router.use('/cmn/objatts',  abstruct)

router.use('/cmn/objatttp', checkPermissions(), abstruct)
router.use('/cmn/objlink', checkPermissions(), abstruct)
router.use('/cmn/objlink_arr', checkPermissions(), abstruct)

router.use('/cmn/paraccount', checkPermissions(), abstruct)

router.use('/cmn/paratts', checkPermissions(), abstruct)
router.use('/cmn/parcontact', checkPermissions(), abstruct)
router.use('/cmn/parcontacttp', checkPermissions(), abstruct)
router.use('/cmn/parlink', checkPermissions(), abstruct)

router.use('/cmn/site', checkPermissions(), abstruct)

router.use('/cmn/taxrate', checkPermissions(), abstruct)


router.use('/cmn/terratts', checkPermissions(), abstruct)
router.use('/cmn/terrlink', checkPermissions(), abstruct)
router.use('/cmn/terrloc', checkPermissions(), abstruct)

router.use('/cmn/tgptax', checkPermissions(), abstruct)
router.use('/cmn/um', checkPermissions(), abstruct)
router.use('/cmn/umparity', checkPermissions(), abstruct)

router.use('/cmn/x/ccard', checkPermissions(), abstructX)
router.use('/cmn/x/curr', checkPermissions(), abstructX)
router.use('/cmn/x/inputtp', checkPermissions(), abstructX)
router.use('/cmn/x/link', checkPermissions(), abstructX)
router.use('/cmn/x/loc', checkPermissions(), abstructX)
router.use('/cmn/x/locatt', checkPermissions(), abstructX)
router.use('/cmn/x/loctp', checkPermissions(), abstructX)
router.use('/cmn/x/obj', checkPermissions(), abstructX)
router.use('/cmn/x/objtp', checkPermissions(), abstructX)
router.use('/cmn/x/objatt', checkPermissions(), abstructX)
router.use('/cmn/x/objatttp', checkPermissions(), abstructX)
router.use('/cmn/x/par', checkPermissions(), abstructX)
router.use('/cmn/x/paratt', checkPermissions(), abstructX)
router.use('/cmn/x/partp', checkPermissions(), abstructX)
router.use('/cmn/x/paymenttp', checkPermissions(), abstructX)
router.use('/cmn/x/tax', checkPermissions(), abstructX)
router.use('/cmn/x/terr', checkPermissions(), abstructX)
router.use('/cmn/x/terratt', checkPermissions(), abstructX)
router.use('/cmn/x/terrtp', checkPermissions(), abstructX)
router.use('/cmn/x/tgp', checkPermissions(), abstructX)
router.use('/cmn/x/um', checkPermissions(), abstructX)
router.use('/cmn/x/val', checkPermissions(), abstructX)

//router.use('/adm/services', servicesRoute)

router.use("/", (req, res, next) => {
  next();
  return res.status(403).send({ error: "Forbidden!! "+req.url });

})

export default router;
