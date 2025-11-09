import express from "express";
import { nearbyPharmacyRouter } from "../controllers/pharmacyControler.js";

const pharmacyRouter = express.Router();

pharmacyRouter.get("/", nearbyPharmacyRouter);

export default pharmacyRouter;